import { MongoClient } from 'mongodb';

export interface ThreedData {
    id: string,
    displayTitle: string,
    htmlIdentifier: string
}

const modelInfo = () => {
    const url : string = process.env.MONGO_ATLAS_URI ?? "";
    // const client = new MongoClient(url);
    const client = new MongoClient(url, { maxPoolSize: 5, maxIdleTimeMS: 10000 }); //reduce the amount of connections

    const dbName = 'homedesignerData';
    const collection = 'modelInfoCollection';
    const db = client.db(dbName);
    const threedCollection = db.collection(collection);

    client.connect().catch(error => {
        console.error('Failed to connect to MongoDB:', error);
    });

    //find one by id and return it as json
    const fetchOne = async (id : string) => {
        try {
            const result = await threedCollection.findOne({id : id});
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

    // Update a document by matching id and setting a new displayTitle
    const updateDisplayTitle = async (id : string, newDisplayTitle : string) => {
        try {
            const result = await threedCollection.updateOne(
                { id: id }, // Match the document with the specified id
                { $set: { displayTitle: newDisplayTitle } } // Update the displayTitle field
            );

            if (result.modifiedCount === 0) {
                console.warn(`No document found with id: ${id}`);
            } else {
                console.log(`Document with id: ${id} successfully updated.`);
            }

            return result;
        } catch (error) {
            console.error('Error updating document:', error);
            throw error;
        }
    };

    // Delete a document by matching id
    const deleteDocumentById = async (id : string) => {
        try {
            const result = await threedCollection.deleteOne({ id: id }); // Match and delete the document

            if (result.deletedCount === 0) {
                console.warn(`No document found with id: ${id}`);
            } else {
                console.log(`Document with id: ${id} successfully deleted.`);
            }

            return result;
        } catch (error) {
            console.error('Error deleting document:', error);
            throw error;
        }
    };


    // Define more functions as needed

    return {
        fetchOne,
        fetchData,
        addData,
        updateDisplayTitle,
        deleteDocumentById
        // Add more functions to export here
    };
}

export default modelInfo;