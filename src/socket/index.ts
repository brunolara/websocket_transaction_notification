import {Server, Socket} from "socket.io";
import {DisconnectReason} from "socket.io/dist/socket";
import Client from "../types/client";
import {alreadyRegisteredClient, handleAuth, isPermittedHostName} from "./helper";
import {StatusTransacaoEnum, Transacao} from "../types/transacao";
import {Request, Response} from "express";
import {TransactionSocketEvents} from "../types/transaction_socket_events";
import {SocketHttpResponseMessages} from "../types/socket_http_response_messages";

class SocketController{
    clientList: Client[];
    server: Server;
    client: Client | null = null;
    socket: Socket | null = null;

    constructor(clientList: Client[], server: Server) {
        this.clientList = clientList;
        this.server = server;
    }

    onconnect = (socket: Socket) => {
        this.socket = socket;
        const token: string = (this.socket.handshake.query?.token ?? "").toString();
        this.client = handleAuth(token);

        if(this.client !== null && !alreadyRegisteredClient(this.client, this.clientList)) {
            this.client.socketId = this.socket.id;
            this.clientList.push(this.client);
        }
        this.socket.on("disconnect", this.ondisconnect)
    }

    ondisconnect =  (reason: DisconnectReason) => {
        if(this.client !== null && alreadyRegisteredClient(this.client, this.clientList)){
            this.clientList = this.clientList.filter(item => item.socketId !== this.client?.socketId);
        }
    }

    emit = (ev:string, to: string, message: string): boolean => {
        try{
            return this.server.to(to).emit(ev, message);
        } catch (e){
            return false;
        }
    }

    handleNotification = (req: Request, res: Response) => {
        if(!isPermittedHostName(req.hostname)) return res.sendStatus(403);
        const t: Transacao | null = req.body?.transacao;
        let returnStatus = 200;
        let returnMessage: SocketHttpResponseMessages = SocketHttpResponseMessages.nobodyToHear;
        if(t != null ) {
            const to = this.clientList.find(item => item.UsuarioId === t.usuarioId);
            let eventName: TransactionSocketEvents = TransactionSocketEvents.statusChange;
            if(to) {
                switch (t.statusTransacao) {
                    case StatusTransacaoEnum.CONFIRMADO:
                        eventName = TransactionSocketEvents.payed;
                        break;
                    case StatusTransacaoEnum.ESTORNADO:
                        eventName = TransactionSocketEvents.chargeBack;
                        break;
                }
                returnStatus = this.emit(eventName, to.socketId, JSON.stringify(t)) ? 200 : 500;
                returnMessage = returnStatus == 200 ?
                    SocketHttpResponseMessages.somebodyHeared : SocketHttpResponseMessages.error;
            }
        }
        return res.status(returnStatus).json({message: returnMessage});
    }
}

export  {SocketController};