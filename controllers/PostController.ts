import SocketIO from 'socket.io';
import { Request, Response } from "express"
import PostService from '../services/PostService';
import { logger } from '../logger'
import { formParse } from '../upload';

export default class PostController {
    constructor(private service: PostService, private io: SocketIO.Server) { }


    // Template controller
    // getLikeCount = async (req: Request, res: Response) => {
    //     let memoId = req.params.memoId
    //     if (!Number(memoId)) {
    //         res.status(400).json({
    //             message: 'Success',
    //             data: {
    //                 likeCount: 10
    //             }
    //         })
    //         return
    //     }
    //     let results = await this.service.getLikeCount(Number(memoId))
    //     res.json({
    //         message: 'Success',
    //         data: {
    //             users: results,
    //             likeCount: results.length
    //         }
    //     })
    // }
}