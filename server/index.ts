import express from 'express'
// import http from 'http';
// import { bodyParser } from "body-parser";
import cors from 'cors';
import mongoose from "mongoose";
import { errorHandler } from './_middleware/error-handler';

// imprt via
const app = express();
const configset = require('./config.json');
const cookieParser = require('cookie-parser');
const documentController = require('./controllers/document.controller')
const port = configset.server.port;

app.get('/', (req, res) => {
    res.send('Hello World!')
})
// router
app.use('/doc', documentController);
// middleware
app.use(cors({
    credentials: true
}));
app.use(express.urlencoded({ extended: true }),
        express.json(),
        cookieParser(),
        errorHandler);

// dabatase
mongoose.Promise = Promise
mongoose.connect(configset.connectionString); 
mongoose.connection.on('connected', () => {
    console.log('connected to server')
})
mongoose.connection.on('disconnected', () => {
    console.log('disconnected to server')
})
mongoose.connection.on('error', () => {
    console.log('error')
})

const server = app.listen(port, () => {
    const address = server.address();
    console.log(`server listen to ${JSON.stringify(address)}`)
})
