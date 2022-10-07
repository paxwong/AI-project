import formidable, { Files } from 'formidable'
export const uploadDir = 'uploads'
import express from 'express'

const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFiles: 1,
    maxFileSize: 524288000,
    // the default limit is 200KB
    filter: (part) => part.mimetype?.startsWith('image/') || false
})

export const formParseBetter = (req: express.Request) => {
    return new Promise<any>((resolve, reject) => {

        form.parse(req, (err, fields, files: Files) => {

            if (err) {
                console.log('err in form parsing', err)
                reject(err)
            }
            try {
                let file = Array.isArray(files.image)
                    ? files.image[0]
                    : files.image
                const filename = file ? file.newFilename : null
                console.log(file)
                console.log(fields)
                // Get File Name
                resolve({
                    fields,
                    filename
                })
            } catch (error) {
                console.log('error in form parsing', error)
                console.log('err in form parsing', err)
                reject(error)
            }
        })
    })
}

export const formParse = (req: express.Request) => {
    return new Promise<any>((resolve, reject) => {
        // req.body => fields :36
        form.parse(req, (err, fields, files: Files) => {
            if (err) {
                console.log('err in form parsing', err)
                reject(err)
            }
            try {
                // const fromSocketId = fields.fromSocketId
                // console.log("file", files)
                // console.log('files.image', files.itemImage)
                let file = Array.isArray(files.image)
                    ? files.image[0]
                    : files.image
                // console.log('file upload', file)
                const filename = file ? file.newFilename : null

                console.log({
                    filename,
                    fields
                })
                // Get File Name

                resolve({
                    filename,
                    fields,
                    // fromSocketId
                })
            } catch (error) {
                console.log('error in form parsing', error)
                reject(error)
            }
        })
    })
}