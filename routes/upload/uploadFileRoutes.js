import { Router } from 'express';
import { upload, uploadLink } from '../../controllers/upload/uploadFilesContoller.js';

const uploadRouter = Router(); // Create a new router instance

// Define a POST route for file upload
uploadRouter.post('/uploadFile', upload.single('file'), uploadLink);

export default uploadRouter; // Export the router instance as the default export
