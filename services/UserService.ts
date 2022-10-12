//data

import { Knex } from "knex";
import { hashPassword } from '../hash';
import Memo from '../models/MemoModel';
import User from '../models/UserModel';
export default class UserService {
    constructor(private knex: Knex) { }


}