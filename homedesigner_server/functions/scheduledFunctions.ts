import * as cron from 'node-cron';
import { scrapeWebsite } from './webScraping';
import { combineScrapingAndAi } from './addStyleDataToScraping';

const scrapeTables = () => {
    scrapeWebsite('https://fargovintage.fi/en/collections/tables')
    .then(products => combineScrapingAndAi(products, 'tables'))
    .then(() => console.log("All tables processed"))
    .catch(error => console.error('Error scraping website:', error));
};

const scrapeSeating = () => {
    scrapeWebsite('https://fargovintage.fi/en/collections/seating')
    .then(products => combineScrapingAndAi(products, 'seating'))
    .then(() => console.log("All seating processed"))
    .catch(error => console.error('Error scraping website:', error));
};

export const setupCronJobs = (): void => {
    //here first number is the starting minute and the other is hours, so this runs on the first minute of every 12 hours
    cron.schedule('0 */12 * * *', scrapeSeating, {
        scheduled: true,
        timezone: "Europe/Helsinki"
    });

    cron.schedule('20 */12 * * *', scrapeTables, {
        scheduled: true,
        timezone: "Europe/Helsinki"
    });
};
