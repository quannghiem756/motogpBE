const puppeteer = require('puppeteer');

const browser = await puppeteer.launch({
    headless: false
});

const page = await browser.newPage();

await page.goto('https://github.com/topics/javascript');
const buttonSelector = 'text/Load more';
await page.waitForSelector(buttonSelector);
await page.click(buttonSelector);
await page.waitForFunction(() => {
    const repoCards = document.querySelectorAll('article.border');
    return repoCards.length > 20;
});

// Extract data from the page. Selecting all 'article' elements
// will return all the repository cards we're looking for.
const repos = await page.$$eval('article.border', (repoCards) => {
    return repoCards.map(card => {
        const [user, repo] = card.querySelectorAll('h3 a');
        const stars = card.querySelector('#repo-stars-counter-star')
            .getAttribute('title');
        const description = card.querySelector('div.px-3 > p');
        const topics = card.querySelectorAll('a.topic-tag');

        const toText = (element) => element && element.innerText.trim();
        const parseNumber = (text) => Number(text.replace(/,/g, ''));

        return {
            user: toText(user),
            repo: toText(repo),
            url: repo.href,
            stars: parseNumber(stars),
            description: toText(description),
            topics: Array.from(topics).map((t) => toText(t)),
        };
    });
});


// Print the results 🚀
console.log(`We extracted ${repos.length} repositories.`);
console.dir(repos);

await new Promise(r => setTimeout(r, 10000));
await browser.close();
