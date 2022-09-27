import express, { Request, Response } from 'express'
import { checkPassword, hashPassword } from '../utils/hash'
import { client } from '../utils/db'
export const userRoutes = express.Router()

userRoutes.post('/register', register)
async function register(req: Request, res: Response) {
    try {
        const email = req.body.email
        const username = req.body.username
        const password = req.body.password

        if (!username || !password || !email) {
            res.status(400).json({
                message: 'Invalid username or password'
            })
            return
        }

        let hashedPassword = await hashPassword(password)
        await client.query(
            `insert into users (email, username, password, is_admin) values ($1, $2, $3, false)`,
            [email, username, hashedPassword]
        )
        res.json({ message: `Account: ${username}, has been created` })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}
