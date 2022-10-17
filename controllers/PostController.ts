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
        let post = req.params.postId
        if (!Number(post)) {
            res.status(400).json({
                message: 'Success',
                data: {
                    likeCount: 10
                }
            })
            return
        }
        let results = await this.service.getLikeCount(Number(post))
        // console.log(results)
        res.json({
            message: 'Success',
            data: {
                results
            }
        })
    }
    addLike = async (req: Request, res: Response) => {
        try {
            let post = req.params.postId
            let user = req.session['user'].id
            console.log('user:', user, 'added Like to', 'post:', post,)

            await this.service.addLike(user, Number(post));
            res.status(200).json({
                message: "add like successful"
            })
            return
        } catch (err: any) {
            logger.error(err)
            res.status(400).send(err.message)
            return
        }
    }
    removeLike = async (req: Request, res: Response) => {
        try {
            let post = req.params.postId
            let user = req.session['user'].id
            console.log('user:', user, 'removed Like from', 'post:', post,)

            await this.service.removeLike(user, Number(post));
            res.status(200).json({
                message: "remove like successful"
            })
            return
        } catch (err: any) {
            logger.error(err)
            res.status(400).send(err.message)
            return
        }
    }
    updateLike = async (req: Request, res: Response) => {
        try {
            let post = req.params.postId
            let user = req.session['user'].id
            console.log('user:', user, 'update Like from', 'post:', post,)

            await this.service.updateLike(user, Number(post));
            res.status(200).json({
                message: "remove like successful"
            })
            return
        } catch (err: any) {
            logger.error(err)
            res.status(400).send(err.message)
            return
        }
    }
    getPosts = async (req: Request, res: Response) => {
        const postsResult = await this.service.getPosts();
        res.json(postsResult)
        return
    }

    addComment = async (req: Request, res: Response) => {
        try {
            let user = req.session['user'].id
            let content = req.body.comment
            let post = req.params.postId
            // console.log("user: " + user)
            // console.log("post: " + post)
            // console.log("content: " + content)

            // console.log('add comment')

            // console.log({ filename, text })
            await this.service.addComment(content, user, Number(post));
            // this.io.emit('new-memo', {
            //     fromSocketId
            // })
            res.status(200).json({
                message: 'Upload successful'
            })
        } catch (e) {
            console.log(e)
            res.status(400).send('Upload Fail')
            return
        }
    }
    getComment = async (req: Request, res: Response) => {
        let post = req.params.postId
        const commentsResult = await this.service.getComment(parseInt(post));
        res.json({
            message: 'Success',
            data: {
                comment: commentsResult
            }
        })

        return
    }

    getMyPosts = async (req: Request, res: Response) => {
        try {
            let userId = req.session['user'].id
            console.log('userId' + userId)

            const myPostsResult = await this.service.getMyPosts(Number(userId));

            res.json(myPostsResult)
        }
        catch (err: any) {
            console.log(err.message)
            logger.error(err.message)

            res.status(400).send('Get my posts error: ' + err.message)
            return
        }

    }
}