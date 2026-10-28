const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const { scrapeOptions } = require("../index");

test("extrae y normaliza las opciones Call del subyacente solicitado", () => {
  const html = fs.readFileSync(path.join(__dirname, "..", "fixtures", "opciones-demo.html"), "utf8");

  assert.deepEqual(scrapeOptions(html, "GGAL"), [
    {
      vencimiento: "2026-08-15",
      base: 4500,
      ultimo: 12.75,
      volumen: 1234.56,
    },
    {
      vencimiento: "2026-09-19",
      base: 5000,
      ultimo: 8.2,
      volumen: 987,
    },
  ]);
});
