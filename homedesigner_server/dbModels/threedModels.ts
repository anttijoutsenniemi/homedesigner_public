import { MongoClient } from 'mongodb';

export interface ThreedData {
    storeTitle: string,
    threedModel: string,
    category: string
}

const threedModels = () => {
    const url : string = process.env.MONGO_ATLAS_URI ?? "";
    const client = new MongoClient(url);
    const dbName = 'homedesignerData';
    const collection = 'threedCollection';
    const db = client.db(dbName);
    const threedCollection = db.collection(collection);

    client.connect().catch(error => {
        console.error('Failed to connect to MongoDB:', error);
    });

    //find one by id and return it as json
    const fetchOne = async (title : string) => {
        try {
            const result = await threedCollection.findOne({title : title});
            return result;
        } catch (error) {
            console.error('Connection to productInfo document failed with status code 100: ', error);
            throw error;
        } 
    }
    
    //find all data and return an array
    const fetchData = async () => {
        try {
            const result = await threedCollection.find().toArray();
            return result;
        } catch (error) {
            console.error('Connection to test db failed with status code 101');
            throw error;
        } 
    }

    //add one datacell to document
    const addData = async (scrapingData : ThreedData) => {
        try {
            const result = await threedCollection.insertOne(scrapingData);
            return result;
        } catch (error) {
            console.error('Connection to test db failed with status code 102');
            throw error;
        } 
    }

    // Define more functions as needed

    return {
        fetchOne,
        fetchData,
        addData,
        // Add more functions to export here
    };
}

export default threedModels;