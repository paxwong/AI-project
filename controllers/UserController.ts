
import UserService from "../services/UserService";
import SocketIO from 'socket.io';
import { Request, Response } from "express"
import { checkPassword } from "../hash";

export default class UserController {
    private service: UserService;
    private io: SocketIO.Server;
    constructor(service: UserService,
        io: SocketIO.Server) {
        this.service = service;
        this.io = io;
    }


    // Template controller
    // getUsers = async (req: Request, res: Response)=>{
    //     let results=await this.service.getUsers()
    //     res.json(results);
    // }
}