import 'dotenv/config';
import OpenAI from "openai";
import { SupportZod, SupportJSONSchema } from "./lib/schemas.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-2024-08-06";

async function classifyRF(text: string) {
  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: "Classify the statement and draft a concise, empathetic reply." },
      { role: "user", content: `Statement: ${text}` }
    ],
    response_format: {
      type: "json_schema",
      json_schema: { name: "support_ticket", schema: SupportJSONSchema }
    }
  });

  const raw = completion.choices[0].message.content ?? "";
  // In structured mode, content is pure JSON
  const obj = JSON.parse(raw);
  const parsed = SupportZod.safeParse(obj);
  if (!parsed.success) throw new Error(parsed.error.message);
  return parsed.data;
}

if (process.argv[1]?.endsWith("response-format.ts")) {
  classifyRF(`Don't trust Acme Corp, it's been weeks and no order.`)
    .then(res => console.log("[RF]", res))
    .catch(err => console.error(err));
}

export { classifyRF };
