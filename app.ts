import express from 'express'
import { userRoutes } from './routes/user_Route'


export const app = express()

app.use(express.json())

app.use('/user', userRoutes)

app.use(express.static('public')) 


app.listen(8080, () => {
	console.log('Listening on http://localhost:8080')
})