const puppeteer = require('puppeteer');
const DefaultImages = require('../models/DefaultImages'); // assuming the model is in the same directory
require('../db/mongoose');

async function grabImageSources(url) {
  // Launch the browser
  const browser = await puppeteer.launch({
    headless: false
  });

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
        }, 75);
      });
    });

    // Extract image sources using Puppeteer's page.evaluate()
    const imageSources = await page.evaluate(() => {
      const sponsoredImages = document.querySelectorAll('div.calendar-listing__track-sponsor-logo img');
      const circuitTrackImages = document.querySelectorAll('div.calendar-listing__track-layout.js-circuit-track img');
      const eventImages = document.querySelectorAll('div.calendar-listing__track-image.js-circuit-image img');
      const riderImages = document.querySelectorAll('div.rider-image img');
      const flagImages = document.querySelectorAll('div.calendar-listing__location-flag img');

      return {
        sponsoredImages: Array.from(sponsoredImages).map(img => img.src),
        circuitTrackImages: Array.from(circuitTrackImages).map(img => img.src),
        eventImages: Array.from(eventImages).map(img => img.src),
        riderImages: Array.from(riderImages).map(img => img.src),
        flagImages: Array.from(flagImages).map(img => img.src)
      };
    });

    // Close the browser
    await browser.close();

    // Loop through each array and save each image to a new DefaultImages instance
    const saveImage = async (imageUrl, category) => {
      const imageDoc = new DefaultImages({
        category,
        imageUrl
      });
      await imageDoc.save();
    };

    // Save sponsoredImages
    for (const imageUrl of imageSources.sponsoredImages) {
      await saveImage(imageUrl, 'sponsoredImage');
    }

    // Save circuitTrackImages
    for (const imageUrl of imageSources.circuitTrackImages) {
      await saveImage(imageUrl, 'circuitTrackImage');
    }

    // Save eventImages
    for (const imageUrl of imageSources.eventImages) {
      await saveImage(imageUrl, 'eventImage');
    }

    // Save riderImages
    for (const imageUrl of imageSources.riderImages) {
      await saveImage(imageUrl, 'riderImage');
    }
    
    for (const imageUrl of imageSources.flagImages) {
      await saveImage(imageUrl, 'flagImage');
    }

    return imageSources;
  } catch (error) {
    console.error(`Error fetching URL: ${error.message}`);
    await browser.close();
    return [];
  }
}

const urlsToCrawl = [
  'https://www.motogp.com/en/calendar',
  'https://www.motogp.com/en/riders/motogp'
];

Promise.all(urlsToCrawl.map(url => grabImageSources(url)))
  .then(links => {
    console.log('Found links:', links);
  });


