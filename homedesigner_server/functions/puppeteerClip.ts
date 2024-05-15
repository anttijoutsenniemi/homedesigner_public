import puppeteer from 'puppeteer';

interface Product {
    pictureUrl: string;
    title: string;
    url: string;
}

async function scrapeWebsite(url: string): Promise<Product[]> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const products = await page.evaluate(() => {
        const items: Product[] = [];
        const productNodes = document.querySelectorAll('.product-block');

        productNodes.forEach(node => {
            const titleElement = node.querySelector('.product-block-title');
            const imageElement = node.querySelector('img');
            const linkElement = node.querySelector('a');

            if (titleElement && imageElement && linkElement) {
                const title = titleElement.textContent?.trim() ?? '';
                const pictureUrl = imageElement.getAttribute('src') ?? '';
                const url = linkElement.getAttribute('href') ?? '';
                
                items.push({
                    pictureUrl: pictureUrl.startsWith('http') ? pictureUrl : `https://fargovintage.fi${pictureUrl}`,
                    title,
                    url: `https://fargovintage.fi${url}`
                });
            }
        });

        return items;
    });

    await browser.close();
    return products;
}

scrapeWebsite('https://fargovintage.fi/en/collections/tables')
    .then(products => console.log(products))
    .catch(error => console.error('Error scraping website:', error));
