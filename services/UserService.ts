import { Knex } from "knex";
import { hashPassword } from '../hash';
import Post from '../models/PostModel';
import User from '../models/UserModel';
export default class UserService {
    constructor(private knex: Knex) { }

    // Template service
    // async getUsers(): Promise<User[]> {
    //     const results: User[] = await this.knex.select("*").from("users");
    //     return results;
    // }
}