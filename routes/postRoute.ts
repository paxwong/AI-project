import express, { Request, Response } from "express";
import { isloggedin } from '../guard'
import { Knex } from "knex";
import { Server as SocketIO } from 'socket.io'
import PostService from '../services/PostService'
import PostController from '../controllers/PostController'
export const postRoutes = express.Router()


import { formParse } from "../upload";
import { client } from "../utils/db";

export function initialize(client: Knex, io: SocketIO) {
    const service = new PostService(client);
    const controller = new PostController(service, io);

    postRoutes.post('/formidable', controller.addPost)
    postRoutes.get('/like-count/:postId', controller.getLikeCount)
    postRoutes.post('/like/:postId', controller.addLike)
    postRoutes.get('/', controller.getPosts)
    postRoutes.post('/comment/:postId', controller.addComment)
    postRoutes.get('/comment/:postId', controller.getComment)


    // template route
    // postRoutes.get('/like-count/:memoId', controller.getLikeCount)
}


