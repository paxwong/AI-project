import { Knex } from "knex";
// import { Client } from 'pg';
import Post from '../models/PostModel';
import User from '../models/UserModel'
import Raw_image from '../models/RawModel';
import Converted_image from "../models/ConvertedModel";
import Comment from "../models/CommentModel";
import Like from "../models/LikeModel";

export default class PostService {
    constructor(private knex: Knex) { }

    async addPost(caption: string, image: string, user: number) {

        const txn = await this.knex.transaction();
        let credit = (await this.knex.raw("select credit from users where id = (?)", [user])).rows[0].credit
        console.log(credit)
        if (credit == 0) {
            return
        }
        console.log('txn');
        console.log('caption', caption);
        let rawId:any[] = []
        let postId:number 


        try {


            let post = (await txn.insert({ caption: caption, user_id: user }).into('posts').returning('*'))[0] as Post;
            console.log("post", post)
            console.log(image[1])
            postId = post.id


            if (Array.isArray(image)) {
                for (let i = 0; i < image.length; i++) {
                    let raw = (await txn.insert({ image: image[i], post_id: post.id }).into('raw_images').returning('*'))[0] as Raw_image;
                    rawId.push(raw.id);

                    // (await txn.insert({ image: image[i], post_id: post.id, raw_id: raw.id }).into('converted_images').returning('*'))[0] as Converted_image;

                }

            }

            await txn.raw("update users set credit = credit-1 where id = (?)", [user])


            await txn.commit();
        } catch (e) {
            console.log(e);

            await txn.rollback();
            return;
        }
        let dbUser: User = (await this.knex.select("*").from("users").where({ "id": user }))[0]
        return {dbUser,postId,rawId}
    }

    async addConvertedImage(convertedImage: string, postId: number, rawId: number ){
     
     
        (await this.knex.insert({ image: convertedImage, post_id: postId, raw_id: rawId }).into('converted_images').returning('*'))[0] as Converted_image;}
    
        
    


    async getPosts() {
        let result = (await this.knex.raw(
            /*sql*/`
        select posts.id, posts.caption, posts.status, posts.user_id, users.nickname,users.icon, posts.created_at, posts.is_deleted, raw.image as raw_image, con.image as con_image 
        from posts 
        inner join users on users.id = posts.user_id 
        inner join raw_images raw on raw.post_id = posts.id 
        inner join converted_images con on con.raw_id = raw.id
        where is_deleted = false and status='public'`)).rows

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
            select likes.user_id,users.nickname,likes.is_deleted
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
    async removeLike(user: number, post: number) {
        return (await this.knex.raw(
            `update likes set is_deleted='t' where user_id=(?) and post_id=(?)`, [user, post]
        ))
    }

    async updateLike(user: number, post: number) {
        return (await this.knex.raw(
            `update likes set is_deleted='f' where user_id=(?) and post_id=(?)`, [user, post]
        ))
    }
    async getMyPosts(userId: number) {
        let result = (await this.knex.raw(
            /*sql*/`
        select posts.id, posts.caption, posts.status, posts.user_id, users.nickname,users.icon, posts.created_at, posts.is_deleted, raw.image as raw_image, con.image as con_image 
        from posts 
        inner join users on users.id = posts.user_id 
        inner join raw_images raw on raw.post_id = posts.id 
        inner join converted_images con on con.raw_id = raw.id
        where posts.user_id = (?) and is_deleted = false
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

    async changePostStatus(postId: number, status: string) {

        let result = (await this.knex.raw(
            /*sql*/
            `update posts set status = (?) where id = (?)`, [status, postId]))
        return result
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
