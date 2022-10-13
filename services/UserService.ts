import { Knex } from "knex";
import { hashPassword } from '../hash';
import Post from '../models/PostModel';
import User from '../models/UserModel';
export default class UserService {
    constructor(private knex: Knex) { }

    async register(username: string, email: string, password: string, needHash: true) {
        let hashedPassword = ""
        if (needHash) {
            hashedPassword = await hashPassword(password)
        }
        return (await this.knex.insert({nickname:username, email:email, password:hashedPassword, is_admin:true}).into("users").returning("*"))[0] as User;
    }


    async getUser(email: string) {
        let dbUser: User = (await this.knex.select("*").from("users").where({ "email": email }))[0];
        return dbUser;
    }
    // Template service
    // async getUsers(): Promise<User[]> {
    //     const results: User[] = await this.knex.select("*").from("users");
    //     return results;
    // }
}