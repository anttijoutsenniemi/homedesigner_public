import { MongoClient } from 'mongodb';

export interface StyleJson {
    colorThemes: {
        dark: boolean,
        light: boolean,
        colorful: boolean,
        earthy: boolean,
        blackAndWhite: boolean
    },
    designStyles: {
        industrial: boolean,
        scandinavian: boolean,
        minimalist: boolean,
        modern: boolean,
        farmhouse: boolean
    }
}

export interface ScrapingData {
    picUrl: string;
    title: string;
    productUrl: string;
    styleJson?: StyleJson
}

const tableModel = () => {
    const url : string = process.env.MONGO_ATLAS_URI ?? "";
    const client = new MongoClient(url);
    const dbName = 'homedesignerData';
    const collection = 'tableCollection';
    const db = client.db(dbName);
    const tableCollection = db.collection(collection);

    client.connect().catch(error => {
        console.error('Failed to connect to MongoDB:', error);
    });

    //find one by title and stylejson and return it as json or false
    const fetchOneWithStyles = async (title : string) => {
        try {
            const result = await tableCollection.findOne({title : title, styleJson: { $exists: true }});
            return result;
        } catch (error) {
            console.error('Connection to productInfo document failed with status code 100: ', error);
            throw error;
        } 
    }
    
    //find all data and return an array
    const fetchData = async () => {
        try {
            const result = await tableCollection.find().toArray();
            return result;
        } catch (error) {
            console.error('Connection to test db failed with status code 101');
            throw error;
        } 
    }

    //add one datacell to document
    const addData = async (scrapingData : ScrapingData) => {
        try {
            const result = await tableCollection.insertOne(scrapingData);
            return result;
        } catch (error) {
            console.error('Connection to test db failed with status code 102');
            throw error;
        } 
    }

    //check products deleted from webshop and update deleted boolean value
    const checkDeletedAndUpdate = async (titleArray : string[]) => {
        try {
            const query = { title: { $nin: titleArray } };
            const update = { $set: { deleted: true } };
            const result = await tableCollection.updateMany(query, update);
        } catch (error) {
            console.error('Connection to test db failed with status code 102');
            throw error;
        } 
    }

    //update product deleted value back to false
    const updateDeleted = async (title : string) => {
        try {
            const query = { title: title };
            const update = { $set: { deleted: false } };
            const result = await tableCollection.updateOne(query, update);
        } catch (error) {
            console.error('Connection to test db failed with status code 102');
            throw error;
        } 
    }

    // Define more functions as needed

    return {
        fetchOneWithStyles,
        fetchData,
        addData,
        checkDeletedAndUpdate,
        updateDeleted
        // Add more functions to export here
    };
}

export default tableModel;