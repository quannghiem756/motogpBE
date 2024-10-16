const puppeteer = require('puppeteer');

(async () => {
  // Launch the browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to the target URL
  await page.goto('https://www.motogp.com/en/news/latest-news');

  // Scroll all the way down to the page
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 75);
    });
  });

  // Extract the data
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
        date: new Date(date).toLocaleDateString('en-GB') // Format date to dd MMM yyyy
      };
    }).filter(article => article.link && article.image && article.title && article.date);
  });

  // Log the news array
  console.log(news);

  // Close the browser
  await browser.close();
})();
