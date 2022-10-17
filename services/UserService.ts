import { Knex } from "knex";
import { hashPassword } from '../hash';
import Post from '../models/PostModel';
import User from '../models/UserModel';
export default class UserService {
    constructor(private knex: Knex) { }

    async register(username: string, email: string, password: string, needHash: boolean = true) {
        let hashedPassword = ""
        if (needHash) {
            hashedPassword = await hashPassword(password)
        }
        return (await this.knex.insert({ nickname: username, email: email, password: hashedPassword, is_admin: false }).into("users").returning("*"))[0] as User;
    }


    async getUser(email: string) {
        let dbUser: User = (await this.knex.select("*").from("users").where({ "email": email }))[0];
        return dbUser;
    }

    async checkName(username: string) {
        let checkName = (await this.knex.select("*").from("users").where({ "nickname": username }))[0];
        return checkName;
    }

    async checkEmail(email: string) {
        let checkEmail = (await this.knex.select("*").from("users").where({ "email": email }))[0];
        return checkEmail;
    }

    async changeSetting(dbUserID: number, changeType: string, changeData: string) {
        let hashedPassword = ""
        if (changeType === "password") {
            hashedPassword = await hashPassword(changeData)
            return (await this.knex.update({ 'password': hashedPassword }).into("users").where({ "id": dbUserID }).returning("*"))[0];
        }
        if (changeType === "username") {
            return (await this.knex.update({ 'nickname': changeData }).into("users").where({ "id": dbUserID }).returning("*"))[0];
        }
        if (changeType === "email") {
            return (await this.knex.update({ 'email': changeData }).into("users").where({ "id": dbUserID }).returning("*"))[0];
        }
    }

    async changePicture(filename: string, dbUserID: number) {
        return (await this.knex.update({ 'icon': filename }).into("users").where({ "id": dbUserID }).returning("*"))[0];
    }
}