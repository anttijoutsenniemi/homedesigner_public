import express, { Request, Response } from 'express';
import path from 'path';
import multer, { FileFilterCallback } from 'multer';
import { Express } from 'express-serve-static-core';

const threedUploadRoute: express.Router = express.Router();

// Configure Multer storage and file filter
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void): void => {
    cb(null, path.join(__dirname, '../public_threed')); // Destination folder for uploaded files
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void): void => {
    cb(null, file.originalname); // Keep original file name
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback | any): void => {
  if (file.mimetype === 'model/gltf-binary') {
    cb(null, true); // Accept .glb files
  } else {
    cb(new Error('Only .glb files are allowed'), false); // Reject other files
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Route to handle .glb file upload
threedUploadRoute.post('/upload', upload.single('model'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded or incorrect file type' });
  }
  res.status(200).json({ message: 'File uploaded successfully', filename: req.file.filename });
});

export default threedUploadRoute;
