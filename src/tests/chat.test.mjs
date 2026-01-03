import assert from "assert";
import { buildAssistantResponse, containsAdviceRequest } from "../server/chat.mjs";

const advice = containsAdviceRequest("Can I get advice on my case?");
assert.strictEqual(advice, true);

const response = buildAssistantResponse({
  message: "Can I get advice on my case?",
  citations: ["[Law Art 1]"],
});

assert.ok(response.includes("consult a licensed lawyer"));
assert.ok(response.includes("[Law Art 1]"));

console.log("chat.test.js passed");
