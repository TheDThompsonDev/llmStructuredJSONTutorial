import { classifyRF } from "./response-format.js";
import { classifyTool } from "./tool-strict.js";

async function run() {
  const rf = await classifyRF("It's been weeks and no order.");
  const tool = await classifyTool("Great service this time, thanks!");
  console.log({ rf, tool });
}
run().catch(console.error);
