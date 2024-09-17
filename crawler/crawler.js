const axios = require('axios');
const cheerio = require('cheerio');
const { URL } = require('url');
const puppeteer = require('puppeteer');
// Function to crawl all links with a specific class
async function crawlLinks(url) {
    try {

        // Fetch the HTML content of the page
        const { data } = await axios.get(url);

        // Load the HTML into cheerio
        const $ = cheerio.load(data);

        // Find all 'a' tags with the class 'content-item__link'
        const links = [];
        $('a.content-item__link').each((index, element) => {
            const link = $(element).attr('href');
            if (link) {
                const combinedLink = new URL(link, url).href;
                links.push(combinedLink)
            }
        });

        return links;
    } catch (error) {
        console.error(`Error fetching URL: ${error.message}`);
        return [];
    }
}



async function grabImageSources(url) {
    // Launch the browser
    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    try {
        // Go to the specified URL
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });

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
                }, 25);
            });
        });

        // Extract image sources using Puppeteer's page.evaluate()
        const imageSources = await page.evaluate(() => {
            const images = document.querySelectorAll('div.calendar-listing__track-sponsor-logo img');
            return Array.from(images).map(img => img.src);
        });

        // Close the browser
        await browser.close();

        return imageSources;
    } catch (error) {
        console.error(`Error fetching URL: ${error.message}`);
        await browser.close();
        return [];
    }
}

// Example usage
// const urlToCrawl = 'https://www.motogp.com/en/news/latest-news';
// crawlLinks(urlToCrawl).then(links => {
//     console.log('Found links:', links);
// });

const urlToCrawl = 'https://www.motogp.com/en/calendar';
grabImageSources(urlToCrawl).then(links => {
    console.log('Found links:', links);
});
