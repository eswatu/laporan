import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    credentials: true
}));

app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(4000, () => {
    console.log('server listen to port http://localhost:4000')
})