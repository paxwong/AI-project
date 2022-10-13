import SocketIO from 'socket.io';
import { Request, Response } from "express"
import PostService from '../services/PostService';
import { logger } from '../logger'
import { formParse } from '../upload';

export default class PostController {
    constructor(private service: PostService, private io: SocketIO.Server) { }
    addPost = async (req: Request, res: Response) => {
        try {
            let user = req.session['user'].id
            console.log('post- formidable')

            const { filename, text } = await formParse(req)
            // console.log({ filename, text })
            this.service.addPost(text, filename, user);
            // this.io.emit('new-memo', {
            //     fromSocketId
            // })
            res.json({
                message: 'Upload successful'
            })
        } catch (e) {
            console.log(e)
            res.status(400).send('Upload Fail')
            return
        }
    }
    getLikeCount = async (req: Request, res: Response) => {
        // let memoId = req.params.memoId
        // if (!Number(memoId)) {
        //     res.status(400).json({
        //         message: 'Success',
        //         data: {
        //             likeCount: 10
        //         }
        //     })
        //     return
        // }
        // let results = await this.service.getLikeCount(Number(memoId))
        // res.json({
        //     message: 'Success',
        //     data: {
        //         users: results,
        //         likeCount: results.length
        //     }
        // })
    }
    addLike = async (req: Request, res: Response) => {
        // try {
        //     res.status(200).json({})
        //     return
        // } catch (err: any) {
        //     logger.error(err)
        //     res.status(400).send(err.message)
        //     return
        // }
    }
    getPosts = async (req: Request, res: Response) => {
        // const postsResult = await this.service.getPosts();
        // res.json(postsResult)
        // return
    }
}