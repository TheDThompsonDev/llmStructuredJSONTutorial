// src/contrast.ts
import 'dotenv/config';
import OpenAI from "openai";
import chalk from "chalk";
import boxen from "boxen";
import { z } from "zod";

// ---------- schema ----------
const SupportZod = z.object({
  sentiment: z.enum(["positive","neutral","negative"]),
  department: z.enum([
    "customer_support","online_ordering","product_quality",
    "shipping_and_delivery","other_off_topic"
  ]),
  reply: z.string()
});
type Support = z.infer<typeof SupportZod>;

// ---------- setup ----------
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-2024-08-06";
const SAMPLE = process.argv.slice(2).join(" ") || `Don't trust Acme Corp, it's been weeks and no order.`;

const h1 = (t:string)=>console.log("\n"+boxen(chalk.bold(t),{padding:1,borderColor:"cyan"}));
const ok = (t:string)=>console.log(chalk.green("✔ ")+t);
const bad = (t:string)=>console.log(chalk.red("✖ ")+t);
const info = (t:string)=>console.log(chalk.cyan("• ")+t);
const dim = (t:string)=>console.log(chalk.gray(t));

// Yank a ```json block or any fenced block, fallback to first balanced {..}/[..]
function extractJsonCandidate(s: string): string | null {
  // fenced ```json ... ```
  let m = /```json\s*([\s\S]*?)```/i.exec(s);
  if (m) return m[1].trim();
  // any fenced ```
  m = /```[\w-]*\s*([\s\S]*?)```/i.exec(s);
  if (m) return m[1].trim();
  // balanced braces/brackets (simple scanner)
  const startIdx = (() => {
    for (let i=0;i<s.length;i++){
      const c=s[i];
      if (c==='{'||c==='[') return i;
    }
    return -1;
  })();
  if (startIdx === -1) return null;
  let depth = 0, inStr=false, esc=false, start = -1;
  for (let i=startIdx;i<s.length;i++){
    const c = s[i];
    if (inStr){
      if (!esc && c === '"') inStr = false;
      esc = !esc && c === '\\';
      continue;
    }
    if (c === '"'){ inStr = true; continue; }
    if (c === '{' || c === '['){ if (depth===0) start=i; depth++; }
    if (c === '}' || c === ']'){ depth--; if (depth===0 && start!==-1) return s.slice(start, i+1).trim(); }
  }
  return null;
}

// ---------- Scene 1: Freeform (no constraints) ----------
async function freeformNatural(input: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: "Be helpful and concise. You may explain reasoning. If you include JSON, do it naturally; no need to be strict." },
      { role: "user", content: `Analyze this complaint and suggest fields {sentiment, department, reply}:\n${input}` }
    ]
  });
  return completion.choices[0].message.content ?? "";
}

// ---------- Scene 2: Structured (response_format) ----------
async function structuredResponseFormat(input: string): Promise<Support> {
  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: "Classify and draft a concise reply. Output must match the schema exactly." },
      { role: "user", content: `Statement: ${input}` }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
         strict: true,
        name: "support_ticket",
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            sentiment: { type: "string", enum: ["positive","neutral","negative"] },
            department: { type: "string", enum: ["customer_support","online_ordering","product_quality","shipping_and_delivery","other_off_topic"] },
            reply: { type: "string" }
          },
          required: ["sentiment","department","reply"]
        }
      }
    }
  });

  const content = completion.choices[0].message.content ?? "{}";
  const obj = JSON.parse(content);
  const parsed = SupportZod.safeParse(obj);
  if (!parsed.success) throw new Error(parsed.error.message);
  return parsed.data;
}

// ---------- Run ----------
(async () => {
  h1("Scene 1: Freeform Output (No Constraints)");
  const free = await freeformNatural(SAMPLE);
  dim("\n[Raw model response]");
  console.log(free);

  const candidate = extractJsonCandidate(free);
  if (!candidate) {
    info("No JSON-looking block found. This is common with freeform replies.");
    try {
      JSON.parse(free.trim());
      ok("Whole message happened to be valid JSON (rare in freeform).");
    } catch {
      bad("Cannot parse as JSON. Parser has nothing reliable to consume.");
    }
  } else {
    dim("\n[Best-effort JSON candidate]");
    console.log(candidate);
    try {
      const parsed = JSON.parse(candidate);
      ok("Parsed candidate JSON.");
      // Even if it parses, show fragility: keys/types may drift
      const check = SupportZod.safeParse(parsed);
      if (check.success) {
        ok("Also matches expected schema (got lucky).");
      } else {
        bad("Schema mismatch (drift). " + check.error.issues[0]?.message);
      }
    } catch(e:any) {
      bad("JSON.parse failed on candidate: " + e.message);
    }
  }

  h1("Scene 2: Structured Output (response_format: json_schema)");
  const enforced = await structuredResponseFormat(SAMPLE);
  ok("Strict JSON returned.");
  console.log(enforced);

  h1("Scene 3: Validation & Routing");
  const validated = SupportZod.safeParse(enforced);
  if (validated.success) {
    ok(`Valid: sentiment=${validated.data.sentiment}, department=${validated.data.department}`);
    ok("Routing ticket → queue: " + validated.data.department);
  } else {
    bad("Validation failed (unexpected with strict schema).");
  }

  console.log("\n" + chalk.bold("Takeaway: ") + "Freeform is variable. Structured output is consistent and immediately consumable.");
})();
