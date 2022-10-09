import express, { Request, Response } from "express";
import { formParse } from "../utils/upload";
import { client } from "../utils/db";

export const postRoutes = express.Route()

postRoutes.post("/formidable", uploadPost);

async function uploadPost(req: Request, res: Response) {
    try {
        const { filename: image, fields } = await formParse(req);
        let { caption } = fields;



