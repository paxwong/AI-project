import express from 'express'
import expressSession from 'express-session'
import { initialize as initializeUserRoutes, userRoutes } from './routes/userRoute'

import Knex from "knex";
const knexConfigs = require("./knexfile");
const configMode = process.env.NODE_ENV || "development";
const knexConfig = knexConfigs[configMode];
export const knex = Knex(knexConfig);

import fs from 'fs'
import { uploadDir } from './upload'
// import { logger } from './logger'
import { initialize as initializePostRoutes, postRoutes } from './routes/postRoute'
import http from 'http'
import { Server as SocketIO } from 'socket.io'
import grant from 'grant'

declare module 'express-session' {
	interface SessionData {
		name?: string
		isloggedin?: boolean
	}
}
const app = express()

const server = new http.Server(app)
export const io = new SocketIO(server)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

let sessionMiddleware = expressSession({
	secret: 'cls company dont change something on9 la',
	resave: true,
	saveUninitialized: true
})

app.use(sessionMiddleware)
const grantExpress = grant.express({
	defaults: {
		origin: 'http://localhost:8080',
		transport: 'session',
		state: true
	},
	google: {
		key: process.env.GOOGLE_CLIENT_ID || '',
		secret: process.env.GOOGLE_CLIENT_SECRET || '',
		scope: ['profile', 'email'],
		callback: '/user/login/google'
	}
})

app.use(grantExpress as express.RequestHandler)

io.use((socket, next) => {
	let req = socket.request as express.Request
	let res = req.res!
	sessionMiddleware(req, res, next as express.NextFunction)
})

initializeUserRoutes(knex, io)
initializePostRoutes(knex, io)

app.use('/user', userRoutes)
app.use('/post', postRoutes)

app.get('/session', function (req, res) {
	let session = req.session
	res.status(200).json({ session })
})

fs.mkdirSync(uploadDir, { recursive: true })

app.use(express.static('public'))
app.use(express.static('private')) //for now
app.use('/uploads', express.static('uploads')) // auto to do next()
io.on('connection', function (socket) {
	console.log('new socket connected: ', socket.id)

	// 如果無login ， 就連socket 都無得用
	// if (!socket.request['session'].user) {
	// 	socket.disconnect()
	// }
})

app.listen(8080, () => {
	console.log('Listening on http://localhost:8080')
})