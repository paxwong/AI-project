import express from 'express'
import { Knex } from "knex";
import { Server as SocketIO } from 'socket.io'
import UserService from '../services/UserService'
import UserController from '../controllers/UserController'

export const userRoutes = express.Router()
export function initialize(client: Knex, io: SocketIO) {
    const userService = new UserService(client);
    const userController = new UserController(userService, io);

    userRoutes.post('/register', userController.register)
    userRoutes.post('/login', userController.login)
    userRoutes.get('/logout', userController.logout)
    userRoutes.get('/getMyInfo', userController.getMyInfo)
    userRoutes.post('/changeSetting', userController.changeSetting)
    // template route
    // userRoutes.get('/', userController.getUsers)
    // userRoutes.post('/register', userController.register)	
}

