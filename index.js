const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const URL_TO_SCRAPE = "https://www.allaria.com.ar/Opcion";
const FIXTURE_PATH = path.join(__dirname, "fixtures", "opciones-demo.html");

function parseSpanishNumber(value) {
  return Number.parseFloat(value.replace(/\s/g, "").replace(/\./g, "").replace(",", "."));
}
 
function scrapeOptions(html, underlying = "GGAL") {
    const $ = cheerio.load(html);
    const scrapedData = [];
    const tableHeaders = [];

    $(`table#tableOpcionesAcciones > thead > tr, table#tableOpcionesAcciones > tbody > tr.${underlying}.accion-Call`).each((index, element) => {
      if (index === 0) {
        const ths = $(element).find("th:nth-child(4), th:nth-child(5), th:nth-child(6), th:nth-child(13)");
        $(ths).each((i, element) => {
          tableHeaders.push(
            $(element)
              .text()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
              .replace(/\s/g,'')
              .replace(/[^a-zA-Z ]/g, "")
          );
        });
        return true;
      }

      const tds = $(element).find("td:nth-child(4), td:nth-child(5), td:nth-child(6), td:nth-child(13)"); // Get desired grid fields
      const tableRow = {};
      $(tds).each((i, element) => {
        //tableRow[tableHeaders[i]] = $(element).text().replace(/\s/g,'');
        const cellValue = $(element).text();
        if (i === 0) {
          const arrayFecha = cellValue.replace(/\s/g,'').split("/", 3);
          tableRow[tableHeaders[i]] = arrayFecha[2] + '-' + arrayFecha[1] + '-' + arrayFecha[0];
        } else {
          tableRow[tableHeaders[i]] = parseSpanishNumber(cellValue);
        }
      });
      scrapedData.push(tableRow);
    });
    return scrapedData;
}

async function getPageHtml(useFixture = false) {
  if (useFixture) {
    return fs.readFileSync(FIXTURE_PATH, "utf8");
  }

  const response = await fetch(URL_TO_SCRAPE, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; bcba-options/1.0)",
      Accept: "text/html,application/xhtml+xml",
    },
  });
  if (!response.ok) {
    throw new Error(`No se pudo obtener ${URL_TO_SCRAPE}: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

async function main(underlying = "GGAL", useFixture = false, outputPath = "calls-ggal.json") {
    const scrapedData = scrapeOptions(await getPageHtml(useFixture), underlying);
    fs.writeFileSync(outputPath, JSON.stringify(scrapedData));

    let date_ob = new Date();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();

    console.log('\x1b[33m%s\x1b[0m', hours + ":" + minutes);
    console.log('\x1b[36m%s\x1b[0m', 'Archivo JSON generado');
    console.log("Esperando próxima ejecucion");
}

if (require.main === module) {
  const useFixture = process.argv.includes("--fixture");
  const runOnce = process.argv.includes("--once");
  const outputPath = useFixture ? "calls-ggal.sample.json" : "calls-ggal.json";

  main("GGAL", useFixture, outputPath).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

  if (!runOnce) {
    setInterval(() => { // Redo every five minutes
      main("GGAL", useFixture, outputPath).catch((error) => console.error(error));
    }, 300000);
  }
}

module.exports = { getPageHtml, main, scrapeOptions };
