import fs from "fs";
import puppeteer from "puppeteer";

// let link =
//   "http://www.encar.com/dc/dc_carsearchlist.do?carType=kor&searchType=model&TG.R=A#!%7B%22action%22%3A%22(And.Hidden.N._.CarType.Y.)%22%2C%22toggle%22%3A%7B%7D%2C%22layer%22%3A%22%22%2C%22sort%22%3A%22ModifiedDate%22%2C%22page%22%3A14%2C%22limit%22%3A%2250%22%7D";

let link =
  "https://api.encar.com/search/car/list/premium?count=true&q=(And.Hidden.N._.CarType.Y.)&sr=%7CModifiedDate%7C3%7C100/";

(async () => {
  let flag = true;
  let res = [];
  let counter = 1;

  try {
    let browser = await puppeteer.launch({
      headless: false,
      slowMo: 100,
      devtools: true,
    });
    let page = await browser.newPage();
    await page.setViewport({
      width: 1400,
      height: 900,
    });
    while (flag) {
      await page.goto(`${link}`);
      await page.waitForFileChooser("next");
      console.log(counter);

      let html = await page.evaluate(
        async () => {
          let page = [];

          try {
            let divs = document.querySelectorAll(`inf`);
            console.log(divs);
          } catch (e) {
            console.log(e);
          }
          return "";
        },
        { waitUntill: `next` }
      );
      counter++;
    }
  } catch (e) {
    console.log(e);
    await browser.close();
  }
})();
