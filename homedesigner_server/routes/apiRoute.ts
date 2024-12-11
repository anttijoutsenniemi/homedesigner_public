import express from 'express';
import chairModel from '../dbModels/chairModel';
import tableModel from '../dbModels/tableModel';
import threedModels from '../dbModels/threedModels';
import modelInfo from '../dbModels/modelInfoModel';

const chairModule = chairModel();
const tableModule = tableModel();
const threedModule = threedModels();
const modelInfoModule = modelInfo();

const apiRoute : express.Router = express.Router();

apiRoute.get("/tables", async (req : express.Request, res : express.Response) : Promise<void> => { 
    try {
        let data = await tableModule.fetchData();
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

apiRoute.post("/checkUrl", async (req : express.Request, res : express.Response) : Promise<void> => { 
    try {
        let check;
        let url : string = req.body.url;
        try {
            const response = await fetch(url, { method: 'HEAD' });
            check = response.ok; // returns true if the status code is in the range 200-299
          } catch (error) {
            check = false; // returns false if the fetch request fails
          }
        res.status(200).json(check);
    } catch (e : any) {
        res.status(404).json({ "error" : `error fetching: ${e}` });
    }
});

apiRoute.get("/fetchThreedModels", async (req : express.Request, res : express.Response) : Promise<void> => { 
    try {
        let data = await threedModule.fetchData();
        res.status(200).json(data);
    } catch (e : any) {
        res.status(404).json({ "error" : `error fetching: ${e}` });
    }
});

apiRoute.post("/addmodeldata", async (req : express.Request, res : express.Response) : Promise<void> => { 
    try {
        if(req.body.newModelInfoObject){
            let data = await modelInfoModule.addData(req.body.newModelInfoObject);
            res.status(200).json({ "ok" : "success"});
        }
        else{
            res.status(404).json({ "error" : "no data or wrong data"});
        }
    } catch (e : any) {
        res.status(404).json({ "error" : `error fetching: ${e}` });
    }
});

apiRoute.post("/fetchmodeldata", async (req : express.Request, res : express.Response) : Promise<void> => { 
    try {
        let data = await modelInfoModule.fetchData();
        res.status(200).json(data);
    } catch (e : any) {
        res.status(404).json({ "error" : `error fetching: ${e}` });
    }
});

export default apiRoute;