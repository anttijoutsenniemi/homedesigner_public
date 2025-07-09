import express from 'express';
import { scrapeWebsite } from '../functions/webScraping';
import { combineScrapingAndAi } from '../functions/addStyleDataToScraping';
import clientPublic from './../clientPublic.json';

const scrapingRoute : express.Router = express.Router();

scrapingRoute.get("/tables", async (req : express.Request, res : express.Response) : Promise<void> => { 
    try {
        let scraping = scrapeWebsite(`${clientPublic.webStoreUrl}/en/collections/tables`)
        .then(products => combineScrapingAndAi(products, 'tables'))
        .catch(error => console.error('Error scraping website:', error));
        res.status(200).json({ "message" : "Scraping succesful" });
    } catch (e : any) {
        res.status(404).json({ "error" : `error fetching: ${e}` });
    }
});

scrapingRoute.get("/seating", async (req : express.Request, res : express.Response) : Promise<void> => { 
    try {
        let scraping = scrapeWebsite(`${clientPublic.webStoreUrl}/en/collections/seating`)
        .then(products => combineScrapingAndAi(products, 'seating'))
        .catch(error => console.error('Error scraping website:', error));
        res.status(200).json({ "message" : "Scraping succesful" });
    } catch (e : any) {
        res.status(404).json({ "error" : `error fetching: ${e}` });
    }
});


export default scrapingRoute;