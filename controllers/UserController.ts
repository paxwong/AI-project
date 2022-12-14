
import UserService from "../services/UserService";
import SocketIO from 'socket.io';
import { Request, Response } from "express"
import { checkPassword } from "../hash";
import { request } from "http";
import { formParse, formParsePFP } from '../upload';
import fetch from 'cross-fetch'

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
            const emailValidation = req.body.emailValidation
            const passwordValidation = req.body.passwordValidation
            const usernameValidation = req.body.usernameValidation





            // Add a function here to disable symbols in username

            if (!username || !email || !password) {
                res.status(400).json({ message: "Invalid Input" })
                return
            }

            if (usernameValidation == false) {
                res.status(400).json({ message: "Invalid Username Input" })
                return
            }

            if (emailValidation == false) {
                res.status(400).json({ message: "Invalid Email Input" })
                return
            }

            if (passwordValidation == false) {
                res.status(400).json({ message: "Invalid Password Input" })
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
            req.session["isAdmin"] = is_admin
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
            req.session.destroy(function (err) {
                if (err) {
                    console.log("err", err)
                }
            }
            )
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
            let userId = req.session["user"].id
            let isGoogle = req.session["user"].is_google
            res.status(200).json({ "nickname": nickname, "icon": icon, "credit": credit, "id": userId, "is_google": isGoogle })
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    changeGoogleSetting = async (req: Request, res: Response) => {
        try {
            if (!req.session || !req.session["user"]) {
                res.status(400).json({ message: 'Invalid Session' })
                return
            }

            const changeType = req.body.changeType
            const changeData = req.body.changeData
            const newUsername = req.body.newUsername
            const sessionEmail = req.session["user"].email
            const usernameValidation = req.body.usernameValidation

            if (changeType == 'username' && usernameValidation == false) {
                res.status(400).json({ message: "Invalid Username Input" })
                return
            }
            let checkName = await this.service.checkName(newUsername)
            if (checkName) {
                res.status(400).json({
                    message: 'This username is already in use'
                })
                return
            }

            let dbUser = await this.service.getUser(sessionEmail)

            let updatedUser = await this.service.changeSetting(dbUser.id, changeType, changeData)

            let {
                password: hashPassword,
                is_admin,
                created_at,
                updated_at,
                ...sessionUser
            } = updatedUser


            req.session["user"] = sessionUser
            res.status(200).json({ message: 'Successfully changed' })

        } catch (err) {
            console.log(err)
            res.status(500).json({ message: 'Internal Server Error' })
        }

    }


    changeSetting = async (req: Request, res: Response) => {
        try {
            if (!req.session || !req.session["user"]) {
                res.status(400).json({ message: 'Invalid Session' })
                return
            }

            const oldPassword = req.body.oldPassword
            const changeType = req.body.changeType
            const changeData = req.body.changeData
            const sessionEmail = req.session["user"].email
            const newUsername = req.body.newUsername
            const needHash = true
            const emailValidation = req.body.emailValidation
            const passwordValidation = req.body.passwordValidation
            const usernameValidation = req.body.usernameValidation


            // Add a function here to disable symbols in username

            if (changeType == 'username' && usernameValidation == false) {
                res.status(400).json({ message: "Invalid Username Input" })
                return
            }

            if (changeType == 'email' && emailValidation == false) {
                res.status(400).json({ message: "Invalid Email Input" })
                return
            }

            if (changeType == 'password' && passwordValidation == false) {
                res.status(400).json({ message: "Invalid Password Input" })
                return
            }

            let checkName = await this.service.checkName(newUsername)
            if (checkName) {
                res.status(400).json({
                    message: 'This username is already in use'
                })
                return
            }

            let dbUser = await this.service.getUser(sessionEmail)
            let isMatched = await checkPassword(oldPassword, dbUser.password)

            if (!isMatched) {
                res.status(400).json({ message: 'Invalid Password' })
                return
            }

            let updatedUser = await this.service.changeSetting(dbUser.id, changeType, changeData)

            let {
                password: hashPassword,
                is_admin,
                created_at,
                updated_at,
                ...sessionUser
            } = updatedUser


            req.session["user"] = sessionUser
            res.status(200).json({ message: 'Successfully changed' })

        } catch (err) {
            console.log(err)
            res.status(500).json({ message: 'Internal Server Error' })
        }

    }

    changeGooglePicture = async (req: Request, res: Response) => {
        try {
            if (!req.session || !req.session["user"]) {
                res.status(400).json({ message: 'Invalid Session' })
                return
            }
            const { filename } = await formParsePFP(req)



            const dbUserID = req.session["user"].id
            const updatedUser = await this.service.changePicture(filename, dbUserID);

            let {
                password: hashPassword,
                is_admin,
                created_at,
                updated_at,
                ...sessionUser
            } = updatedUser

            req.session["user"] = sessionUser
            res.status(200).json({ message: 'Successfully changed' })

        } catch (err) {
            console.log(err)
            res.status(500).json({ message: 'Internal Server Error' })
        }

    }

    changePicture = async (req: Request, res: Response) => {
        try {
            if (!req.session || !req.session["user"]) {
                res.status(400).json({ message: 'Invalid Session' })
                return
            }
            const { filename, fields } = await formParsePFP(req)
            const sessionEmail = req.session["user"].email
            let dbUser = await this.service.getUser(sessionEmail)
            let isMatched = await checkPassword(fields.oldPassword, dbUser.password)

            if (!isMatched) {
                res.status(400).json({ message: 'Invalid Password' })
                return
            }

            const dbUserID = req.session["user"].id
            const updatedUser = await this.service.changePicture(filename, dbUserID);

            let {
                password: hashPassword,
                is_admin,
                created_at,
                updated_at,
                ...sessionUser
            } = updatedUser

            req.session["user"] = sessionUser
            res.status(200).json({ message: 'Successfully changed' })

        } catch (err) {
            console.log(err)
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    loginGoogle = async (req: Request, res: Response) => {
        // ??????google in ????????????????????? ?????? access token
        // access token ???????????????google ??? user profile
        const accessToken = req.session?.['grant'].response.access_token

        // fetch google API, ??? user profile
        const fetchRes = await fetch(
            'https://www.googleapis.com/oauth2/v2/userinfo'
            ,
            {
                method: 'get',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )
        const googleProfile = await fetchRes.json()

        let email = await this.service.googleLogin(googleProfile.email)

        if (!email) {
            email = await this.service.googleAddUser(googleProfile.email, googleProfile.given_name,)
        }

        let dbUser = await this.service.getUser(googleProfile.email)
        let {
            password: hashPassword,
            is_admin,
            created_at,
            updated_at,
            ...sessionUser
        } = dbUser

        req.session["user"] = sessionUser
        res.redirect('/main.html')

    }
}