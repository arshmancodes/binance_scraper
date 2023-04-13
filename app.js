const puppeteer = require('puppeteer');
const express = require('express');

const app = express();
app.use(express.json());
const url = 'https://www.binance.com/en/futures-activity/leaderboard';


app.listen(3000, () => {
    console.log("App running at 3000 port")
});

app.get('/' , async(req, res) => {
    
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto(url);
    
    await page.waitForSelector('.TraderCard');
    
    const classData = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('.TraderCard'));
      return elements.map(element => {
        const items = element.innerText.split('\n');
        const data = {
            id: items[0],
            name: items[1],
            followers: items[2],
            followStatus: items[3],
            weeklyROI: items[4],
            weeklyPNL: items[5],
            notSharing: items[6]
          };
        return data;
      } );
      
    });
    const jsonData = JSON.stringify(classData);
    res.send(classData);
    
    
    
    await browser.close();
})





