import express, { Request, Response } from "express";
import { isloggedin } from '../guard'
import { Knex } from "knex";
import { Server as SocketIO } from 'socket.io'
import PostService from '../services/PostService'
import PostController from '../controllers/PostController'
export const postRoutes = express.Router()


import { formParse } from "../utils/upload";
import { client } from "../utils/db";

export function initialize(client: Knex, io: SocketIO) {
    const service = new PostService(client);
    const controller = new PostController(service, io);

    // template route
    // postRoutes.get('/like-count/:memoId', controller.getLikeCount)
}


