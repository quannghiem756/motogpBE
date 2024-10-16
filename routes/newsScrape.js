const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
router.get('/api/scrape', async (req, res) => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto('https://www.motogp.com/en/news/latest-news');
  
      // Scroll down to load more content if necessary
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          let totalHeight = 0;
          let distance = 100;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;
  
            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              resolve();
            }
          }, 75);
        });
      });
  
      // Extract data logic here
      const news = await page.evaluate(() => {
        const articles = Array.from(document.querySelectorAll('a.content-item__link'));
        return articles.map(article => {
          const image = article.querySelector('img.js-faded-image.fade-in-on-load.object-fit-cover-picture__img.is-loaded')?.src;
          const title = article.querySelector('h3.content-item__title')?.innerText;
          const dateElement = article.querySelector('time.date.content-item__publish-time');
          const date = dateElement ? dateElement.getAttribute('datetime') : '';
  
          return {
            link: article.href,
            image,
            title,
            date: new Date(date).toLocaleDateString('en-GB')
          };
        }).filter(article => article.link && article.image && article.title && article.date);
      });
  
      await browser.close();
      res.json(news);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error scraping the data');
    }
  });

  module.exports = router;