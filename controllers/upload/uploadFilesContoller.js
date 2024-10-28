import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';

//  Create an S3 client instance with region and credentials from environment variables
const s3 = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
  }
});

const BUCKET = process.env.BUCKET; // Get the bucket name from environment variables

// Configure multer to use multerS3 for storing files in S3

export const upload = multer({
  storage: multerS3({
    s3: s3, // S3 client instance
    bucket: BUCKET, // S3 bucket name
    acl: 'public-read', // Set ACL to public-read
    key: function (req, file, cb) {
      // Define the key (filename) for the uploaded file
      cb(null, file.originalname);
    }
  })
});

//   Controller function to handle the upload response

export const uploadLink = async (req, res, next) => {
  try {
    // Send a success response with the file location
    res.send(`Successfully uploaded ${req.file.location} location!`);
  } catch (err) {
    // Return a server error response
    res.status(500).json({
      status: 'failure',
      message: err.message
    });
  }
};
