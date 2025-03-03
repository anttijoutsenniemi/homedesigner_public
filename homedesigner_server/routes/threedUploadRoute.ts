import express, { Request, Response } from 'express';
import path from 'path';
import multer, { FileFilterCallback } from 'multer';
import modelInfo from '../dbModels/modelInfoModel';
import { v4 as uuidv4 } from 'uuid';

const modelInfoModule = modelInfo();

const threedUploadRoute: express.Router = express.Router();

const capitalizeFirstCharacter = (string : string) => {
  if (!string) return ''; // Handle empty or undefined strings
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const sanitizeHtmlId = (name : string) => {
  // Remove invalid characters and replace spaces with hyphens
  let sanitized = name.replace(/[^a-zA-Z0-9\-_]/g, '').replace(/\s+/g, '-');
  // Ensure it starts with a valid letter
  if (!/^[a-zA-Z]/.test(sanitized)) {
    sanitized = `${sanitized}`;
  }
  return sanitized.toLowerCase(); // Convert to lowercase
};

// Configure Multer storage and file filter
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void): void => {
    cb(null, path.join(__dirname, '../public_threed/scripts/3d')); // local Destination folder for uploaded files
    // cb(null, '/public_threed/scripts/3d'); // cloud test Destination folder for uploaded files
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void): void => {
    let modelNameString = file.originalname;  // Use originalname instead of filename
    let simpleName = path.parse(modelNameString).name.toString();
    let sanitizedName = sanitizeHtmlId(simpleName) + path.extname(modelNameString);  // Append correct extension
    cb(null, sanitizedName); // Keep original file name
  }
  // filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void): void => {
  //   let modelNameString = file.filename;
  //   let simpleName = path.parse(modelNameString).name.toString();
  //   let sanitizedName = sanitizeHtmlId(simpleName) + file.mimetype;
  //   cb(null, sanitizedName); // Keep original file name
  // }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback | any): void => {
  const allowedMimeTypes = ['model/gltf-binary', 'application/octet-stream'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only .glb files are allowed'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Route to handle .glb file upload
threedUploadRoute.post('/upload', upload.single('model'), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded or incorrect file type' });
  }
  let modelNameString = req.file.filename;
  let simpleName = path.parse(modelNameString).name.toString();
  let sanitizedName = sanitizeHtmlId(simpleName);
  let newModelInfoObject = {  displayTitle: capitalizeFirstCharacter(simpleName), 
                              htmlIdentifier: sanitizedName,
                              id: uuidv4()
                           }
  await modelInfoModule.addData(newModelInfoObject);
  res.status(200).json({ message: 'File uploaded successfully', filename: req.file.filename });
});

threedUploadRoute.use((req : any, res, next) => {
  const authenticatedUser = req.auth.user; // The username from basic auth

  // Check if the `user` query parameter already exists
  if (authenticatedUser && req.query.user !== authenticatedUser) {
    const redirectUrl = `/threeduploadroute?user=${encodeURIComponent(authenticatedUser)}`;
    return res.redirect(redirectUrl);
  }

  next(); // Proceed to the next middleware or static file serving
});

// Serve static files from the 'public_upload' directory
// threedUploadRoute.use(express.static(path.join(__dirname, '../public_upload')));
threedUploadRoute.use(express.static('public_upload'));

// threedUploadRoute.get("/", async (req: Request, res: Response): Promise<void> => {
//   try {
//     res.sendFile('index.html', { root: path.join(__dirname, '../public_upload') });
//   } catch (e: any) {
//     res.status(404).json({ "error": `error fetching: ${e}` });
//   }
// });

export default threedUploadRoute;
