import {Server, Socket} from "socket.io";
import {DisconnectReason} from "socket.io/dist/socket";
import Client from "../types/client";
import {alreadyRegisteredClient, handleAuth, isPermittedHostName} from "./helper";
import {StatusTransacaoEnum, toTransacao, Transacao} from "../types/transacao";
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
        if(this.client !== null) {
            this.client.socketId = this.socket.id;
            this.clientList.push(this.client);
            console.log(`${this.client.NomeUsuario} conectado`);
        }
        this.socket.on("disconnect", this.ondisconnect)
    }

    ondisconnect =  (reason: DisconnectReason) => {
        if(this.client !== null){
            this.clientList = this.clientList.filter(item => item.socketId !== this.client?.socketId);
            console.log(`${this.client.NomeUsuario} desconectado`);
        }
    }

    emit = (ev:string, to: string, message: string): boolean => {
        try {
            return this.server.to(to).emit(ev, message);
        } catch (e){
            return false;
        }
    }

    handleNotification = (req: Request, res: Response) => {
      //  if(!isPermittedHostName(req.hostname)) return res.sendStatus(403);
        const t: Transacao | null = toTransacao(req.body);
        let returnStatus = 200;
        let returnMessage: SocketHttpResponseMessages = SocketHttpResponseMessages.nobodyToHear;
        if(t != null ) {
            console.log(`Transação id: ${t.id} recebida, tentando comunicar o ${t.usuarioId}`)
            const toList = this.clientList.filter(item => item.UsuarioId === t.usuarioId);
            let eventName: TransactionSocketEvents = TransactionSocketEvents.statusChange;
            if(toList.length) {

                switch (t.statusTransacao) {
                    case StatusTransacaoEnum.CONFIRMADO:
                        eventName = TransactionSocketEvents.payed;
                        break;
                    case StatusTransacaoEnum.ESTORNADO:
                        eventName = TransactionSocketEvents.chargeBack;
                        break;
                }
                returnStatus = toList.map(to => this.emit(eventName, to.socketId, JSON.stringify(t))).every(item => item) ? 200 : 500;
                returnMessage = returnStatus ?
                    SocketHttpResponseMessages.somebodyHeared : SocketHttpResponseMessages.error;
            }
        } else {
            returnStatus = 422;
            returnMessage = SocketHttpResponseMessages.nullableTransaction;
        }
        return res.status(returnStatus).json({message: returnMessage});
    }
}

export  {SocketController};
