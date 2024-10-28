import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// Connect to the MongoDB database using the connection string from the environment variable
mongoose
  .connect(process.env.DATABASE)
  .then(function () {
    // If the connection is successful, log a success message
    console.log('Database has been connected successfully');
  })
  .catch((err) => {
    // If there is an error during the connection, log the error message
    console.log(err.message);
  });
