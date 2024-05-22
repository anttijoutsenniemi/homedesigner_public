import express from 'express';
import chairModel from '../dbModels/chairModel';
import tableModel from '../dbModels/tableModel';

const chairModule = chairModel();
const tableModule = tableModel();

const apiRoute : express.Router = express.Router();

apiRoute.get("/tables", async (req : express.Request, res : express.Response) : Promise<void> => { 
    try {
        let data = await tableModule.fetchData();
        console.log(data[0], data[1]);
        res.status(200).json(data);
    } catch (e : any) {
        res.status(404).json({ "error" : `error fetching: ${e}` });
    }
});

apiRoute.get("/seating", async (req : express.Request, res : express.Response) : Promise<void> => { 
    try {
        let data = await chairModule.fetchData();
        res.status(200).json(data);
    } catch (e : any) {
        res.status(404).json({ "error" : `error fetching: ${e}` });
    }
});


export default apiRoute;