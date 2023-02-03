import Client from "../types/client";
import {JwtPayload} from "jsonwebtoken";
import * as jwt from "jsonwebtoken";
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

dotenv.config()

function handleAuth(token: string | null): Client | null {
    const key: string = process.env.jwt_token?.toString() ?? '';
    if (token !== null){
        try{
            const decoded: JwtPayload | string = jwt.verify(token, key);
            if(typeof decoded === 'string') return null;
            return JSON.parse(decoded['actort']) as Client;
        } catch (e){
            return null;
        }
    }
    return null;
}

function alreadyRegisteredClient(c: Client, clientList: Client[]){
    return clientList.some(item => item.UsuarioId === c.UsuarioId);
}

function isPermittedHostName(hostname: String){
    const permittedHostsList = process.env.hostnames?.split(',').map(item => item.trim()) ?? [];
    return permittedHostsList.length > 0 ? permittedHostsList.some(item => item === hostname) : true;
}

export  {handleAuth, alreadyRegisteredClient, isPermittedHostName}
