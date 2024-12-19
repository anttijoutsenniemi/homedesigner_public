import express from 'express';
import modelInfo from '../dbModels/modelInfoModel';
import fs from 'fs';
import path from 'path';

const modelInfoModule = modelInfo();

const modelInfoRoute : express.Router = express.Router();

const checkUser = (user : string) => {
    if(user === process.env.HTTP_BASIC_AUTH_USERNAME2){
        return true;
    }
    else{
        return false;
    }
}

const deleteFile = async (fileName: string): Promise<void> => {
    try {
        // Construct the file path
        const filePath = path.join(__dirname, '../public_threed/scripts/3d', fileName);

        // Delete the file
        await fs.promises.unlink(filePath);
        console.log(`File ${fileName} successfully deleted.`);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            console.error(`File ${fileName} not found at path ${path.join('/public_threed/scripts/3d')}`);
        } else {
            console.error(`Error deleting file ${fileName}:`, error);
        }
        throw error;
    }
};

modelInfoRoute.get("/fetchmodeldata", async (req : express.Request, res : express.Response) : Promise<void> => { 
    try {
        let data = await modelInfoModule.fetchData();
        res.status(200).json(data);
    } catch (e : any) {
        res.status(404).json({ "error" : `error fetching: ${e}` });
    }
});

modelInfoRoute.post("/update-modeldata", async (req : express.Request, res : express.Response) : Promise<void> => { 
    try {
        let user : string = req.body.user;
        if(checkUser(user)){
            let id : string = req.body.id;
            let newTitle : string = req.body.newTitle;
            let dbProcess = await modelInfoModule.updateDisplayTitle(id, newTitle)
            if (dbProcess.modifiedCount > 0) {
                res.status(200).json({ "ok" : `Document updated with new title: ${newTitle}` });
            } else {
                res.status(404).json({ "error" : `Updating document failed` });
            }
        }
        else{
            res.status(404).json({ "error" : `Access denied` });
        }
    } catch (e : any) {
        res.status(404).json({ "error" : `error fetching: ${e}` });
    }
});

modelInfoRoute.post("/delete-modeldata", async (req : express.Request, res : express.Response) : Promise<void> => { 
    try {
        let user : string = req.body.user;
        if(checkUser(user)){
            let id : string = req.body.id;
            let modelInfo = await modelInfoModule.fetchOne(id);
            if(modelInfo && modelInfo.id === id){
                let fileName : string = `${modelInfo.htmlIdentifier}.glb`;
                await deleteFile(fileName);
                const dbProcess = await modelInfoModule.deleteDocumentById(id);
                if (dbProcess.deletedCount > 0) {
                    res.status(200).json({ "ok" : `Document deleted` });
                } else {
                    res.status(404).json({ "error" : `Deleting document failed` });
                }
            }
            else{
                res.status(404).json({ "error" : `Deleting document failed, no such document found` });
            }
        }
        else{
            res.status(404).json({ "error" : `Access denied` });
        }
    } catch (e : any) {
        res.status(404).json({ "error" : `error fetching: ${e}` });
    }
});

export default modelInfoRoute;