const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

const url =
  "https://weather.com/en-IN/weather/today/l/";

const scrapeData = async (slug = "2d408aa1ffeaecb648de1d0ea0f633496fccc5d85b54e51aad215599a806c53e") => {
 
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`${url}+${slug}`);
    await page.waitForSelector("body");

    //Selecting Whole Widget
    const return_data = await page.evaluate(() => {
      return ([current_temp, location, day_temp, night_temp, weather_type] = [
        document.querySelector(".CurrentConditions--tempValue--MHmYY")
          .innerText,
        document.querySelector(".CurrentConditions--location--1YWj_").innerText,
        document.querySelectorAll("[data-testid='TemperatureValue']")[0]
          .innerText,
        document.querySelectorAll("[data-testid='TemperatureValue']")[1]
          .innerText,
        document.querySelector("[data-testid='wxPhrase'").innerText,
      ]);
    });

    return return_data;
  } catch (error) {
    console.error(`Something Went Wrong:::${error}`);
    return error;
  }
};

app.get("/test", (req, res) => {
  res.send('JIZZ');
})

app.get("/get_weather/:id", async (req, res) => {

  console.log(req.params.id);

  const return_data = await scrapeData(req.params.id);
  res.send(return_data);
});

app.listen(app.get('port'), () => {
  console.log(`Running at: ${app.get('port')}`);
});
