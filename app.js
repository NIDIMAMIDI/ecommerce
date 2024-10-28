import express from 'express';
// dotenv is a zero-dependency module that loads environment variables from a .env file into process.env.
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

// importing database connection
import './config/db/db.js';

// getting access to the base router
import router from './routes/indexRoutes.js';
import { webHook } from './helpers/stripe/stripeHelper.js';
// creating the express()
const app = express();
dotenv.config();

// port value
const port = process.env.PORT || 3000;

app.use('/webhook', bodyParser.raw({ type: 'application/json' }));
app.post('/webhook', webHook);

// Body parser, reading data from the body into the parser
app.use(express.json());

console.log(process.env.NODE_ENV);
// Router
app.use('/api', router);

app.get('/', (req, res, next) => {
  res.send('Basic Router');
});

// //accessing global error
// app.use(globalError)
app.listen(port, () => {
  console.log(`server has benn started at ${port}`);
});

// const server = app.listen(port, ()=>{
//     console.log(`server has benn started at ${port}`);
// })

// process.on('unhandledRejection', err=>{
//     console.log(`${err.name} : ${err.message}`);
//     console.log('Unhandeled Rejection! Shutdown');
//     server.close(()=>{
//         process.exit(1)
//     })
// })
