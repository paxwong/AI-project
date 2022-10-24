import formidable, { Files } from 'formidable'
export const uploadDir = 'uploads'
import express from 'express'
import { forEachTrailingCommentRange } from 'typescript'

const form = formidable({
	uploadDir,
	keepExtensions: true,
	maxFiles: 3,
	multiples: true,
	maxFileSize: 52428800,
	// the default limit is 200KB
	filter: (part) => part.mimetype?.startsWith('image/') || false
})

export const formParse = (req: express.Request) => {
	return new Promise<any>((resolve, reject) => {
		// req.body => fields :36
		form.parse(req, (err, fields, files: Files) => {
			console.log({ err, fields, files })
			if (err) {
				console.log('err in form parsing', err)
				reject(err)
			}
			if (!fields.caption || !files.image) {
				reject('err')
				return
			}
			try {
				console.log('here formParse')
				// const user = req.session["user"].id
				// const text = fields.text
				// const fromSocketId = fields.fromSocketId
				let file = Array.isArray(files.image)
				// 	? files.image[0]
				// 	: files.image
				// console.log('files.image', files.image)
				let filename: any = []
				if (Array.isArray(files.image)) {
					for (let i = 0; i < files.image.length; i++) {

						filename.push(files.image[i].newFilename)
					}
				} else {
					filename.push(files.image.newFilename)

				}


				// console.log(file)
				// const filename = file ? file.newFilename : null

				// console.log({
				// 	filename,
				// 	fields
				// })
				// Get File Name
				resolve({
					filename,
					fields,
					// user
					// fromSocketId
				})
				console.log("formParse successful")
			} catch (error) {
				console.log('error in form parsing', error)
				reject(error)
			}
		})
	})
}


export const formParsePFP = (req: express.Request) => {
	return new Promise<any>((resolve, reject) => {
		form.parse(req, (err, fields, files: Files) => {
			if (err) {
				console.log('err in form parsing', err)
				reject(err)
			}
			try {
				console.log('here formParse for Profile Pic')
				// const user = req.session["user"].id
				// const text = fields.text
				// const text = fields.text
				// const fromSocketId = fields.fromSocketId
				let file = Array.isArray(files.image)
					? files.image[0]
					: files.image
				// console.log(file)
				const filename = file ? file.newFilename : null
				resolve({
					filename,
					fields,

				})
				console.log("formParse (profile pic) successful")
			} catch (error) {
				console.log('error in form parsing', error)
				reject(error)
			}
		})
	})
}