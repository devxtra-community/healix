import axios from "axios";
import type { Request } from "express";
const USER_SERVICE_URL=process.env.USER_SERVICE_URL as string


export async function forwardToUserService(req:Request) {
    return axios({
        method:req.method,
        url: `${USER_SERVICE_URL}${req.originalUrl}`, 
        data:req.body,
        headers:req.headers
    }
    )
}