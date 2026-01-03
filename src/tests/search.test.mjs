import assert from "assert";
import { normalizeSearchQuery, buildSnippet } from "../server/search-utils.mjs";

const normalized = normalizeSearchQuery("  law   article  1 ");
assert.strictEqual(normalized, "law article 1");

const snippet = buildSnippet("A".repeat(200), 180);
assert.ok(snippet.endsWith("..."));
assert.strictEqual(snippet.length, 183);

console.log("search.test.js passed");
