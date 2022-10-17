import { Knex } from "knex";
// import { Client } from 'pg';
import Post from '../models/PostModel';
import Raw_image from '../models/RawModel';
import Converted_image from "../models/ConvertedModel";
import Comment from "../models/CommentModel";
import Like from "../models/LikeModel";

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
        let result = (await this.knex.raw(
            /*sql*/`
        select posts.id, posts.caption, posts.status, posts.user_id, users.nickname,users.icon, posts.created_at, posts.is_deleted, raw.image as raw_image, con.image as con_image 
        from posts 
        inner join users on users.id = posts.user_id 
        inner join raw_images raw on raw.post_id = posts.id 
        inner join converted_images con on con.raw_id = raw.id`)).rows

        return result

        //!!!!group images with the same postId!!!!

        // console.log(result[0]);
        // interface Image {
        //     raw_image: string,
        //     con_image: number
        // }

        // let groupedPosts = new Map();
        // for (let row of result) {
        //     const image: Image = {
        //         raw_image: row.raw_image,
        //         con_image: row.con_image,
        //     };
        //     if (groupedPosts.has(row.id)) {
        //         groupedPosts.get(row.id).images.push(image);
        //     } else {
        //         const post = {
        //             id: row.id,
        //             caption: row.caption,
        //             status: row.status,
        //             created_at: row.created_at,
        //             user_id: row.user_id,
        //             images: [image]
        //         };
        //         groupedPosts.set(row.id, post);
        //     }
        // }
        // const results = Array.from(groupedPosts.values());

        // return results

    }

    async addComment(content: string, user: number, post: number) {
        return (await this.knex.insert({ content, user_id: user, post_id: post }).into('comments').returning('*'))[0] as Comment;
    }
    async getComment(post: number) {
        let result: Comment[] = (await this.knex.raw(/*sql*/`
        select comments.id as comment_id, comments.content, comments.user_id, comments.post_id, comments.created_at, users.nickname,users.icon
        from comments 
        inner join users on users.id = comments.user_id 
        where comments.post_id = (?)
        `, [post])).rows

        return result
    }
    async getLikeCount(post: number) {
        let result = (await this.knex.raw(
            /*sql*/`
            select likes.user_id,users.nickname 
            from likes 
            inner join posts on likes.post_id = posts.id
            inner join users on users.id = likes.user_id 
            where likes.post_id = (?)
           
            `,
            [post]
        )).rows
        return result
    }
    async addLike(user: number, post: number) {
        return (await this.knex.insert({ user_id: user, post_id: post }).into('likes').returning('*'))[0] as Like;

    }

    async getMyPosts(userId: number) {
        let result = (await this.knex.raw(
            /*sql*/`
        select posts.id, posts.caption, posts.status, posts.user_id, users.nickname,users.icon, posts.created_at, posts.is_deleted, raw.image as raw_image, con.image as con_image 
        from posts 
        inner join users on users.id = posts.user_id 
        inner join raw_images raw on raw.post_id = posts.id 
        inner join converted_images con on con.raw_id = raw.id
        where posts.user_id = (?)
        ORDER BY created_at DESC
        `,
            [userId])).rows
        return result
    }

    async deleteMyPosts(postId: number) {

        let result = (await this.knex.raw(
            /*sql*/
            `update posts set is_deleted = true where id = (?)`, [postId]))

    }

}





    // select("*").from("comments").where({ "post_id": post })

    // raw('select * from comments where post_id = (?)', [post])


      // let post = (await this.knex.insert({ caption, user_id: user }).into('posts').returning('*'))[0] as Post;
        // console.log("post", post)
        // let raw = (await this.knex.insert({ image, post_id: post.id }).into('raw_images').returning('*'))[0] as Raw_image;
        // console.log("raw:", raw)
        // let converted = (await this.knex.insert({ image, post_id: post.id, raw_id: raw.id }).into('converted_images').returning('*'))[0] as Converted_image;
        // // return (await this.knex.insert({ image, post_id: post.id, raw_id: raw.id }).into('converted_images').returning('*'))[0] as Converted_image;
        // console.log("converted:", converted)
