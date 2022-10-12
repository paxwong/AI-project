import { Knex } from "knex";
import { Client } from 'pg';
import Post from '../models/PostModel';

export default class PostService {
    constructor(private client: Knex) { }


    // Template service
    // async updateMemo(content:string, memoId:number){
    //     await this.knex.raw(`update memos set content = $1 where id = $2`, [
    //         content,
    //         Number(memoId)
    //     ])
    //     this.client.del(KEY_NAME)
    // }
}