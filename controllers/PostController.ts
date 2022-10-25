import SocketIO from 'socket.io';
import { Request, Response } from "express"
import PostService from '../services/PostService';
import { logger } from '../logger'
import { formParse } from '../upload';
import { deepaiImage } from '../deepai';
const download = require('image-downloader')
const fs = require('fs')
export default class PostController {
    constructor(private service: PostService, private io: SocketIO.Server) { }
    addPost = async (req: Request, res: Response) => {
        try {

            if (!req.session || !req.session["user"]) {
                res.status(400).json({ message: 'User not found' })
                return
            }

            let user = req.session['user'].id
            let credit = req.session['user'].credit
            let email = req.session['user'].email

            if (credit <= 0) {
                res.status(400).json({
                    message: 'insufficient credit'
                })
                return
            }

            // console.log('post- formidable')

            // let checkErr = await formParse(req)
            // if (checkErr === 'err') {
            //     res.status(400).json({
            //         message: "no images or caption"
            //     })
            //     return
            // }


            const { filename, fields } = await formParse(req)
            console.log("FILENAME", filename)
            if (Array.isArray(filename)) {
                for (let i = 0; i < filename.length; i++) {
                    if (filename[i].indexOf('.HEIC') > -1) {
                        try { fs.unlinkSync(`./uploads/${filename[i]}`) } catch (err) { console.error(err) }
                        res.status(400).json({
                            message: 'HEIC image not supported'
                        })
                        return
                    }
                    if (filename[i].indexOf('.HEIF') > -1) {
                        try { fs.unlinkSync(`./uploads/${filename[i]}`) } catch (err) { console.error(err) }
                        res.status(400).json({
                            message: 'HEIF image not supported'
                        })
                        return
                    }
                }
            }

            // console.log({ filename, text })
            let addPostResult: any = await this.service.addPost(fields.caption, filename, user);
            // this.io.emit('new-memo', {
            //     fromSocketId
            // })
            let dbUser = addPostResult.dbUser
            let rawId = addPostResult.rawId
            let postId = addPostResult.postId
            // console.log(addPostResult)


            let {
                password: hashPassword,
                is_admin,
                created_at,
                updated_at,
                ...sessionUser
            } = dbUser

            req.session["user"] = sessionUser


            // const paths = {
            //     url: result.output_url,
            //     dest: `/Users/user/Desktop/AI-project/uploads/${convertedImage}`,
            //     extractFilename: false,
            // }
            // download.image(options)
            // .then((convertedImage) => {
            //     console.log("Saved to", filename)
            // }).catch((err) => console.error(err))
            let results: any[] = []
            if (Array.isArray(rawId)) {
                for (let i = 0; i < rawId.length; i++) {
                    const result = await deepaiImage(filename[i])
                    let convertedImage: string = result.output_url
                    results.push(convertedImage)
                    convertedImage = (convertedImage).slice(37)
                    convertedImage = convertedImage.split("/")[0] + ".jpg"
                    await this.service.addConvertedImage(result.output_url, convertedImage, postId, rawId[i])

                }
            }

            res.status(200).json({ message: results, postId: postId })
        } catch (e) {
            console.log(e)
            res.status(400).send('Upload Fail')
            return
        }
    }
    // addConvertedImage = async (req: Request, res: Response) => {
    //     // console.log("ASDASDASDASDD", req.body)
    // }
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
            // console.log('user:', user, 'added Like to', 'post:', post,)

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
            // console.log('user:', user, 'removed Like from', 'post:', post,)

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
            // console.log('user:', user, 'update Like from', 'post:', post,)

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
        let is_admin = req.session['isAdmin']
        try {
            if (!req.session || !req.session["user"]) {
                res.status(400).json({ message: 'User not found' })
                return
            }
            let userId = req.session['user'].id

            const myPostsResult = await this.service.getMyPosts(Number(userId), is_admin);

            res.json(myPostsResult)
        }
        catch (err: any) {
            console.log(err.message)
            logger.error(err.message)

            res.status(400).send('Get my posts error: ' + err.message)
            return
        }
    }

    deleteMyPosts = async (req: Request, res: Response) => {
        try {
            const postId = req.body.postId
            let userId = req.session['user'].id
            let is_admin = req.session['isAdmin']
            if (!postId || !Number(postId)) {
                res.status(400).json({
                    message: 'index is invalid'
                })
                return
            }
            const deleteResult = await this.service.deleteMyPosts(Number(postId), Number(userId), is_admin);

            if (deleteResult.rowCount == 1) {
                res.json({
                    message: 'Delete success'
                })
            } else {
                res.json({
                    message: 'Not your post'
                })
            }
        } catch (e) {
            console.log('error : ' + e)
            res.status(500).json({
                message: 'del fail'
            })
        }
    }

    changePostStatus = async (req: Request, res: Response) => {
        try {
            let userId = req.session['user'].id
            let is_admin = req.session['isAdmin']
            const postId = req.body.postId
            const status = req.body.postStatus
            if (!postId || !Number(postId)) {
                res.status(400).json({
                    message: 'index is invalid'
                })
                return
            }
            const statusResult = await this.service.changePostStatus(Number(userId), Number(postId), status, is_admin)
            console.log(statusResult)
            if (statusResult.rowCount == 1) {
                res.json({
                    message: 'Post status updated'
                })
            } else {
                res.json({
                    message: 'Not your post'
                })
            }
        } catch (e) {
            console.log('error : ' + e)
            res.status(500).json({
                message: 'fail'
            })
        }
    }

}