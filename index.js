const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require('fs');

/* async function main() {
 const result = await request.get("https://www.allaria.com.ar/Opcion");
 const $ = cheerio.load(result);
 $("table tr.GGAL td:first-child").each((index, element) => {
   console.log($(element).text());
 });
}  */
 
async function main() {
    const result = await request.get("https://www.allaria.com.ar/Opcion");
    const $ = cheerio.load(result);
    const scrapedData = [];
    const tableHeaders = [];
    $("table#tableOpcionesAcciones > thead > tr, table#tableOpcionesAcciones > tbody > tr.GGAL").each((index, element) => {
      if (index === 0) {
        const ths = $(element).find("th:first-child, th:nth-child(3), th:nth-child(4), th:nth-child(5), th:nth-child(6)");
        $(ths).each((i, element) => {
          tableHeaders.push(
            $(element)
              .text()
              .toLowerCase()
          );
        });
        return true;
      }
      const tds = $(element).find("td:first-child, td:nth-child(3), td:nth-child(4), td:nth-child(5), td:nth-child(6)");
      const tableRow = {};
      $(tds).each((i, element) => {
        tableRow[tableHeaders[i]] = $(element).text().replace(/\s/g,'');  ;
      });
      scrapedData.push(tableRow);
    });
    //console.log(scrapedData);
    let data = JSON.stringify(scrapedData);
    fs.writeFileSync('calls-ggal.json', data);
   }

main();