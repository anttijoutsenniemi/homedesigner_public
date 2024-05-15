import express from 'express';
import path from 'path';

const threedroute : express.Router = express.Router();

// Serve static files from the 'public_threed' directory
threedroute.use(express.static('public_threed'));

threedroute.get("/", async (req : express.Request, res : express.Response) : Promise<void> => { 
    try {
       //res.status(200).json({ "message: " : "Welcome to 3dpage"});
       res.sendFile('index.html', { root: path.join(__dirname, '../public_threed') });
    } catch (e : any) {
        res.status(404).json({ "error" : `error fetching: ${e}` });
    }
});


export default threedroute;