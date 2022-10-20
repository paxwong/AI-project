import fs from 'fs';
import deepai from 'deepai';
import dotenv from 'dotenv';

dotenv.config()

let apiKey = process.env.DEEPAI_API_KEY;

deepai.setApiKey(apiKey);

export async function deepaiImage(filename){
    let path = './uploads/' + filename
    let res = await deepai.callStandardApi('colorizer', {
        image: fs.createReadStream(path),
    })
    // console.log(path)
    return res
}
