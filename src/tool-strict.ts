import 'dotenv/config';
import OpenAI from "openai";
import { SupportZod, SupportJSONSchema, safeJson } from "./lib/schemas";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-2024-08-06";

async function classifyTool(text: string) {
  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: "Classify and propose a reply." },
      { role: "user", content: text }
    ],
    tools: [{
      type: "function",
      function: {
        name: "analyzeFeedback",
        description: "Classify support emails and propose a reply.",
        strict: true,
        parameters: SupportJSONSchema
      }
    }],
    tool_choice: { type: "function", function: { name: "analyzeFeedback" } }
  });

  const call = completion.choices[0].message.tool_calls?.[0];
  if (!call) throw new Error("No tool call produced");
  if (call.type !== 'function') throw new Error("Expected function tool call");
  
  const jsonResult = safeJson(call.function.arguments);
  if (!jsonResult.ok) {
    throw new Error(`Invalid JSON in tool call arguments: ${jsonResult.error}`);
  }
  
  const parsed = SupportZod.safeParse(jsonResult.data);
  if (!parsed.success) {
    throw new Error(`Schema validation failed: ${parsed.error.issues.map(i => i.message).join(', ')}`);
  }
  
  return parsed.data;
}

if (process.argv[1]?.endsWith("tool-strict.ts")) {
  classifyTool(`Package arrived damaged; need replacement ASAP.`)
    .then(res => console.log("[TOOL]", res))
    .catch(err => console.error(err));
}

export { classifyTool };
