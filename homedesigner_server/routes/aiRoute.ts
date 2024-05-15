import express from 'express';
import path from 'path';
import { fetchDesignInterpretation, fetchInterPretationWithReference, fetchInterpretationWithBothImg, fetchStyleForSingleFurniture } from '../functions/visionHandler';

const aiRoute : express.Router = express.Router();

aiRoute.post("/room", async (req : express.Request, res : express.Response) : Promise<void> => { 
    try {
        if(
            req.body &&
            typeof(req.body.roomPic64) === 'string' &&
            Object.keys(req.body).length === 1
        ) {
            let roomPic : string = req.body.roomPic64;
            let aiJson = await fetchDesignInterpretation(roomPic);
            res.status(200).json(aiJson);
        }
        else {
            res.status(404).json({ "error" : `access denied` });
        }
    } catch (e : any) {
        res.status(404).json({ "error" : `error fetching: ${e}` });
    }
});

aiRoute.post("/ref", async (req : express.Request, res : express.Response) : Promise<void> => { 
    try {
        if(
            req.body &&
            typeof(req.body.refPic64) === 'string' &&
            Object.keys(req.body).length === 1
        ) {
            let refPic : string = req.body.refPic64;
            let aiJson = await fetchInterPretationWithReference(refPic);
            res.status(200).json(aiJson);
        }
        else {
            res.status(404).json({ "error" : `access denied` });
        }
    } catch (e : any) {
        res.status(404).json({ "error" : `error fetching: ${e}` });
    }
});

aiRoute.post("/both", async (req : express.Request, res : express.Response) : Promise<void> => { 
    try {
        if(
            req.body &&
            typeof(req.body.roomPic64) === 'string' &&
            typeof(req.body.refPic64) === 'string' &&
            Object.keys(req.body).length === 2
        ) {
            let roomPic : string = req.body.roomPic64;
            let refPic : string = req.body.refPic64;
            let aiJson = await fetchInterpretationWithBothImg(roomPic, refPic);
            res.status(200).json(aiJson);
        }
        else {
            res.status(404).json({ "error" : `access denied` });
        }
    } catch (e : any) {
        res.status(404).json({ "error" : `error fetching: ${e}` });
    }
});

// aiRoute.post("/test", async (req : express.Request, res : express.Response) : Promise<void> => { 
//     try {
//         if(
//             req.body &&
//             typeof(req.body.furniturePicUrl) === 'string' &&
//             Object.keys(req.body).length === 1
//         ) {
//             let furniturePic : string = req.body.furniturePicUrl.slice(0, -1); //slice last character so images with 4000 width change to 400
//             let aiJson = await fetchStyleForSingleFurniture(furniturePic);
//             res.status(200).json(aiJson);
//         }
//         else {
//             res.status(404).json({ "error" : `access denied` });
//         };
//     } catch (e : any) {
//         res.status(404).json({ "error" : `error fetching: ${e}` });
//     }
// });


export default aiRoute;