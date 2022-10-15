
import UserService from "../services/UserService";
import SocketIO from 'socket.io';
import { Request, Response } from "express"
import { checkPassword } from "../hash";
import { request } from "http";

export default class UserController {
    private service: UserService;
    private io: SocketIO.Server;
    constructor(service: UserService,
        io: SocketIO.Server) {
        this.service = service;
        this.io = io;
    }

    register = async (req: Request, res: Response) => {
        try {
            const username = req.body.username
            const email = req.body.email
            const password = req.body.password
            const needHash = true

            // Add a function here to disable symbols in username

            if (!username || !email || !password) {
                res.status(400).json({ message: "Invalid Input" })
                return
            }

            let checkEmail = await this.service.checkEmail(email)
            if (checkEmail) {
                res.status(400).json({
                    message: 'This email has been registered'
                })
                return
            }

            let checkName = await this.service.checkName(username)
            if (checkName) {
                res.status(400).json({
                    message: 'This username has been registered'
                })
                return
            }

            this.service.register(username, email, password, needHash)
            res.status(200).json({ message: "Successfully registered" })
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    login = async (req: Request, res: Response) => {
        try {
            const email = req.body.email
            const password = req.body.password
            // console.log(email, password)
            if (!email || !password) {
                res.status(400).json({ message: "Invalid Input" })
                return
            }

            let dbUser = await this.service.getUser(email)

            if (!dbUser) {
                res.status(400).json({
                    message: 'Invalid username or password'
                })
                return
            }

            let isMatched = await checkPassword(password, dbUser.password)

            if (!isMatched) {
                res.status(400).json({
                    message: 'Invalid username or password'
                })
                return
            }

            let {
                password: hashPassword,
                is_admin,
                created_at,
                updated_at,
                ...sessionUser
            } = dbUser

            req.session["user"] = sessionUser

            res.status(200).json({
                message: 'Success login',
                user: sessionUser
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    logout = async (req: Request, res: Response) => {
        try {
            if (!req.session || !req.session["user"]) {
                res.status(400).json({ message: 'User not found' })
                return
            }
            req.session.destroy
            res.status(200).json({ message: 'logged out' })
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: 'Internal Server Error' })

        }
    }

    getMyInfo = async (req: Request, res: Response) => {
        try {
            if (!req.session || !req.session["user"]) {
                res.status(400).json({ message: 'User not found' })
                return
            }
            let nickname = req.session["user"].nickname
            let icon = req.session["user"].icon
            let credit = req.session["user"].credit
            res.status(200).json({ "nickname": nickname, "icon": icon, "credit": credit })
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }
}