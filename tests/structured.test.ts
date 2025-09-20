// tests/structured.test.ts
import { describe, it, expect } from "vitest";
import { classifyRF } from "../src/response-format.js";
import { classifyTool } from "../src/tool-strict.js";

const hasKey = !!process.env.OPENAI_API_KEY;

(hasKey ? describe : describe.skip)("structured outputs", () => {
  it("response_format returns valid JSON", async () => {
    const res = await classifyRF("Order delayed for 2 weeks.");
    expect(["positive","neutral","negative"]).toContain(res.sentiment);
    expect(res.reply.length).toBeGreaterThan(5);
  });

  it("tool(strict) returns valid JSON", async () => {
    const res = await classifyTool("Product arrived damaged.");
    expect(res.department).toMatch(/(product_quality|shipping_and_delivery)/);
  });
});
