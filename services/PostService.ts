import { Knex } from "knex";
// import { Client } from 'pg';
import { raw, Request, Response } from "express"
import Post from '../models/PostModel';
import Raw_image from '../models/RawModel';
import Converted_image from "../models/ConvertedModel";

export default class PostService {
    constructor(private knex: Knex) { }

    async addPost(caption: string, image: string, user: number) {

        const txn = await this.knex.transaction();
        console.log('txn');

        try {


            let post = (await txn.insert({ caption, user_id: user }).into('posts').returning('*'))[0] as Post;
            console.log("post", post)
            let raw = (await txn.insert({ image, post_id: post.id }).into('raw_images').returning('*'))[0] as Raw_image;
            (await txn.insert({ image, post_id: post.id, raw_id: raw.id }).into('converted_images').returning('*'))[0] as Converted_image;


            await txn.commit();
            return;
        } catch (e) {
            console.log(e);

            await txn.rollback();
            return;
        }
    }



    async getPosts() {
        return (await this.knex.raw('select posts.id, posts.caption, posts.status, posts.user_id, users.nickname, posts.created_at, raw.image as raw_image, con.image as con_image from posts inner join users on users.id = posts.user_id inner join raw_images raw on raw.post_id = posts.id inner join converted_images con on con.raw_id = raw.id')).rows
    }

    async addComment(content: string, user: number, post: number) {
        return (await this.knex.insert({ content, user_id: user, post_id: post }).into('comments').returning('*'))[0] as Comment;
    }
    async getComment(post: number) {
        let result: Comment[] = (await this.knex.raw("select comments.id as comment_id, comments.content, comments.user_id, comments.post_id, comments.created_at, users.nickname from comments inner join users on users.id = comments.user_id where comments.post_id = (?)", [post])).rows
        return result
    }
    async getLikeCount() { }
    async addLike() { }

    // select("*").from("comments").where({ "post_id": post })

    // raw('select * from comments where post_id = (?)', [post])
}

      // let post = (await this.knex.insert({ caption, user_id: user }).into('posts').returning('*'))[0] as Post;
        // console.log("post", post)
        // let raw = (await this.knex.insert({ image, post_id: post.id }).into('raw_images').returning('*'))[0] as Raw_image;
        // console.log("raw:", raw)
        // let converted = (await this.knex.insert({ image, post_id: post.id, raw_id: raw.id }).into('converted_images').returning('*'))[0] as Converted_image;
        // // return (await this.knex.insert({ image, post_id: post.id, raw_id: raw.id }).into('converted_images').returning('*'))[0] as Converted_image;
        // console.log("converted:", converted)
