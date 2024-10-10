import axios from 'axios';
import cheerio, { load } from 'cheerio';

export interface Product {
    id: number;
    picUrl: string;
    title: string;
    productUrl: string;
    styleJson?: any,
    threedModel?: string,
    deleted?: boolean,
    timeStamp?: string
}

export async function scrapeWebsite(url: string): Promise<Product[]> {
    const products: Product[] = [];
    let currentPage = 1;
    let hasMorePages = true;
    let lastIndex : number = 0;
    let currentIndex : number = 0;
    let duplicateFound = false; // flag to stop the outer loop

    while(hasMorePages && currentPage < 50 && !duplicateFound){ //limit of 50 for scraper so no infiloops happen
        let response;
        if(currentPage > 1){
            response = await axios.get(`${url}?page=${currentPage}`);
        } 
        else{
            response = await axios.get(url);
        }
        const html = response.data;
        const $ = load(html);

        $('.grid__item').each((_idx, el) => {
            if(_idx === 0 && currentPage > 1){
                lastIndex = currentIndex;
            }
            let soldOutCheck = $(el).find('.grid-product__tag--sold-out').text(); //first check if product is sold out
            if(!soldOutCheck){
                let productInfoObject: Product = {
                    id: (currentPage > 1) ? (lastIndex + _idx + 1) : _idx, //ternary for continuing id count if there are multiple pages present
                    picUrl: "",
                    title: "",
                    productUrl: "",
                    deleted: false
                };
                (currentPage > 1) ? currentIndex = lastIndex + _idx : currentIndex = _idx; //we have to keep adding _idx to the last id of the last loop
                
                let title = $(el).find('.grid-product__title').text().trim();
                if(title){
                    productInfoObject['title'] = title;
                }
        
                let picUrl = $(el).find('img').attr('src');
                if(picUrl){
                    productInfoObject['picUrl'] = 'https:' + picUrl;
                }
        
                let productUrl = $(el).find('a').attr('href');
                if(productUrl){
                    productInfoObject['productUrl'] = 'https://fargovintage.fi' + productUrl;
                }
        
                // Check if the product is already in the array to prevent duplicates
                if (!products.some(product => product.productUrl === productInfoObject.productUrl)) {
                    products.push(productInfoObject);
                }
                else{
                    duplicateFound = true; // Set flag if duplicate found
                    return false; // Break out of the `each` loop
                }
            } 
        });

        if(!duplicateFound){        
            const hasNextPage = $('.pagination').find('.next').length > 0; //this checks if the html has button for next page. if true we scrape all the pages
            hasMorePages = hasNextPage;
            currentPage++
        }
    }
    return products;
}

