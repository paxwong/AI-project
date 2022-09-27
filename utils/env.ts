import dotenv from 'dotenv'

dotenv.config()

export let env = {
	SERVER_PORT: process.env.SERVER_PORT,
	DB_NAME: process.env.DB_NAME || 'bad_project',
	DB_USERNAME: process.env.DB_USERNAME || "postgres",
	DB_PASSWORD: process.env.DB_PASSWORD || "postgres",
	SESSION_SECRET: process.env.SESSION_SECRET || 'default secret',
	// GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
	// GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || ''
}
