import express from 'express'
import cors from 'cors';
import mongoose from "mongoose";
import { errorHandler } from './_middleware/error-handler';
const bodyParser = require("body-parser");
// imprt via
const configset = require('./config.json');
import documentRoutes from './controllers/document.controller'
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    credentials: true
}));
// router
app.use('/doc', documentRoutes);


app.use(errorHandler);

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

app.listen(configset.server.port, () => {
    console.log(`server listen to http://localhost:${configset.server.port}`)
})