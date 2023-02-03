import express, {Router} from 'express'
import {Server} from "socket.io";
import {createServer} from "http";
import Client from './types/client';
import * as dotenv from 'dotenv'
import {SocketController} from './socket'

const app = express();
const httpServer = createServer(app);

dotenv.config()

const route = Router();
const clientList: Client[] = [];

app.use(express.json());

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const controller = new SocketController(clientList, io);

route.post('/sendNotification', controller.handleNotification);

io.on("connection", controller.onconnect);

app.use(route)

httpServer.listen(process.env.port ?? 3000);
