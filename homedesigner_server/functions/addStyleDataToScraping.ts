import { Product } from "./webScraping"
import chairModel from "../dbModels/chairModel";
import tableModel from "../dbModels/tableModel";
import { fetchStyleForSingleFurniture } from "./visionHandler";
import { createTimestamp } from "./timeStampFi";

const chairModule = chairModel();
const tableModule = tableModel();

export const combineScrapingAndAi =  async (scrapingData : Product[], furnitureCategory : string) => {
    try {

        let databaseModule;
        if(furnitureCategory === 'seating'){
            databaseModule = chairModule;
        }
        else if(furnitureCategory === 'tables'){
            databaseModule = tableModule;
        }

        //first we check which products are deleted from website (exist in old dbdata but does not exist in new scrapingdata, we turn those into objects with deleted flag true)
        let newProductTitles = scrapingData.map(product => product.title);
        databaseModule?.checkDeletedAndUpdate(newProductTitles);

        // Iterate over each product asynchronously and send images for ai process
        for (const product of scrapingData) {
            
            let uniqueCheck = await databaseModule?.fetchOneWithStyles(product.title);

            if(!uniqueCheck){
                //send pic to vision
                const processedResult = await fetchStyleForSingleFurniture(product.picUrl.slice(0, -1)); //slice last character so imgs with width 4000 get compressed to 400

                // If an object is returned, merge it into the original product
                if (processedResult) {
                    let assignableObject = JSON.parse(processedResult)
                    product['styleJson'] = assignableObject;
                    product['timeStamp'] = createTimestamp();
                    product['threedModel'] = "";

                    databaseModule?.addData(product); //lastly add product tp db
                }
                else{
                    console.log(`An error occured creating product info with title: ${product.title}`);
                }
                
                console.log(`Completed processing for product title: ${product.title}`);
            }
            else{
                if(uniqueCheck.deleted){
                    databaseModule?.updateDeleted(uniqueCheck.title);
                    console.log(`Product with title: ${uniqueCheck.title} bringed back to existing from deleted`);
                }
                else{
                    console.log(`Product with title: ${product.title} already created, jumping to next one`);
                }
   
            }
            
        }
    } catch (error) {
        console.log(`Error combining data: `, error);
    }
     
}