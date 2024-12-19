import express, { Express, Request, Response, Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import helmet from "helmet";
import expressBasicAuth from "express-basic-auth";
import threedroute from "./routes/threedroute";
import aiRoute from "./routes/aiRoute";
import apiRoute from "./routes/apiRoute";
import threedUploadRoute from "./routes/threedUploadRoute";
import modelInfoRoute from "./routes/modelInfoRoute";
import scrapingRoute from "./routes/scrapingRoute";
import { setupCronJobs } from "./functions/scheduledFunctions";
import path from 'path';

const app : Application = express();

//http basic auth
const authenticate =
  expressBasicAuth({
    users: {
      [process.env.HTTP_BASIC_AUTH_USERNAME!]: process.env.HTTP_BASIC_AUTH_PASSWORD!
    },
    unauthorizedResponse: getUnauthorizedResponse,
    challenge: true
});

//http basic auth admin
const authenticateAdmin =
  expressBasicAuth({
    users: {
      [process.env.HTTP_BASIC_AUTH_USERNAME2!]: process.env.HTTP_BASIC_AUTH_PASSWORD2!
    },
    unauthorizedResponse: getUnauthorizedResponse,
    challenge: true
});

function getUnauthorizedResponse(req:any) {
    return req.auth
        ? 'Credentials rejected'
        : 'No credentials provided';
}

//content security policy config to accept scripts from self source, jquery from google and import map
const cspConfig = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "https://ajax.googleapis.com",
      "'sha256-zUmoJ0KpX3OdX9NzxeqDMx8bMlJ20C+luSCKq8owGgs='", //hash for importmap in index.html
      "'sha256-2dpk+j/4G2wyfCiZtXdMB0Yr1Zc6OIKPsOc6hvj+buc='", //hash for 3d file upload
      "'sha256-YEXsgeXDy4boWeCnnhdPTHFdyE3G8DB7kictJ+BGoOI='", //hash for script fetching modelinfo
      "'sha256-kF6PqBm+NqLwDrRh4RUctoaQjqmKV3NOrU6R3PG/lMY='" //hash for scripts on 3d model maintenance
    ],
    connectSrc: ["'self'", "blob:", "https://fargovintage.fi"],
    imgSrc: ["'self'", "https://fargovintage.fi", "data:"]
  },
};

//secure server headers
app.use(helmet({
  contentSecurityPolicy: cspConfig
}));

const port = process.env.PORT || 8000;

/* Cors setup */
app.use(cors());

setupCronJobs(); //start scheduled functions

app.use(express.json({limit: '50mb'})); //receive req.body

app.use(express.static('public_chat'));

app.use("/threedroute/", threedroute);
app.use("/airoute/", authenticate, aiRoute);
app.use("/apiroute", authenticate, apiRoute);
app.use("/threeduploadroute", authenticateAdmin, threedUploadRoute);
app.use("/modelinforoute", modelInfoRoute);
// app.use("/scrapingroute/", scrapingRoute);

app.get("/", (req: Request, res: Response) => {
  try {
    res.status(200).json({ Message: "Welcome to the homepage" });
    //res.sendFile('index.html', { root: path.join(__dirname, '../public_chat') });
  } catch (e: any) {
    res.status(404).json({ error: `error fetching: ${e}` });
  }
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});