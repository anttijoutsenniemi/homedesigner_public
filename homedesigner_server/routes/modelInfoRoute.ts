import express from 'express';
import modelInfo from '../dbModels/modelInfoModel';

const modelInfoModule = modelInfo();

const modelInfoRoute : express.Router = express.Router();

modelInfoRoute.get("/fetchmodeldata", async (req : express.Request, res : express.Response) : Promise<void> => { 
    try {
        let data = await modelInfoModule.fetchData();
        res.status(200).json(data);
    } catch (e : any) {
        res.status(404).json({ "error" : `error fetching: ${e}` });
    }
});

export default modelInfoRoute;