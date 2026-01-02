import assert from "assert";
import { formatMappingTitle } from "../server/mappings.mjs";

const title = formatMappingTitle({
  instrumentTitle: "Executive Regulation",
  number: "12",
  label: "Clause",
});

assert.strictEqual(title, "Executive Regulation Clause 12");
console.log("mappings.test.js passed");
