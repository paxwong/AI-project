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


        // let post = (await this.knex.insert({ caption, user_id: user }).into('posts').returning('*'))[0] as Post;
        // console.log("post", post)
        // let raw = (await this.knex.insert({ image, post_id: post.id }).into('raw_images').returning('*'))[0] as Raw_image;
        // console.log("raw:", raw)
        // let converted = (await this.knex.insert({ image, post_id: post.id, raw_id: raw.id }).into('converted_images').returning('*'))[0] as Converted_image;
        // // return (await this.knex.insert({ image, post_id: post.id, raw_id: raw.id }).into('converted_images').returning('*'))[0] as Converted_image;
        // console.log("converted:", converted)


    }



    async getPosts() {
        return (await this.knex.raw('select posts.id, posts.caption, posts.status, posts.user_id, users.nickname, posts.created_at, raw.image as raw_image, con.image as con_image from posts inner join users on users.id = posts.user_id inner join raw_images raw on raw.post_id = posts.id inner join converted_images con on con.raw_id = raw.id')).rows
    }

    async getLikeCount() { }
    async addLike() { }



}


    // async addPost(caption: string, status: string,..) {
    //     await this.client.raw('WITH data(image, caption) as values ($1, $2)), INPUT1 AS (INSERT INTO POSTS(caption, status) values ($1, $2) returning id), in2 as (insert into raw_images(image) values ($1) returning id')
    // }


    // async addPost(req: Request, res: Response, caption: string, status: string, image: string) {
    //     let post_id = await this.client.raw('insert into posts (caption, status, user_id) values ($1, $2, $3) returning id as post_id', [
    //         caption, 'completed', req.session['user'].id
    //     ])

    //     // let post_id = this.client.raw('select post_id from posts')
    //     let raw_id = await this.client.raw('insert into raw_images (image, post_id) values ($1, $2) returning id as raw_id', [
    //         image || 'attack-on-titan-ss2-raw.jpg', post_id
    //     ])

    //     // this.client.raw('select raw_id from raw_images')
    //     await this.client.raw('insert into converted_images (image, post_id, raw_id) values ($1, $2, $3) returning id', [
    //         image || 'attack-on-titan-ss2.jpg', post_id, raw_id
    //     ])
    // }