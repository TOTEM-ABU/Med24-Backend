import puppeteer from "puppeteer";

export async function scrape() {
        console.log("salom");
        
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("https://med24.uz/uz/kliniki", {
    waitUntil: "networkidle2",
  });

  await page.waitForSelector(".clinic-card");

  const clinics = await page.$$eval(".clinic-card", (els) =>
    els.map((el) => {
      const title = el.querySelector(".clinic-card__title");
      const address = el.querySelector(".clinic-card__address");

      return {
        name: title ? (title as HTMLElement).innerText.trim() : null,
        address: address ? (address as HTMLElement).innerText.trim() : null,
      };
    })
  );

  console.log(clinics);

  await browser.close();
}

  