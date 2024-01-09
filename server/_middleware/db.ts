import mongoose from "mongoose";
import { connectionString } from "../config.json";
import { Document as doc } from "../model/document";

mongoose.connect(connectionString);
mongoose.Promise = global.Promise;

module.exports = {
    Docs : doc
}