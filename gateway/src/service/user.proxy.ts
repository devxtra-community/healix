import axios from "axios";
import type { Request } from "express";
const USER_SERVICE_URL=process.env.USER_SERVICE_URL as string

export async function forwardToUserService(req:Request) {
    const cleanUrl = req.originalUrl.trim(); 
    return axios({
        method:req.method,
        url: `${USER_SERVICE_URL}${cleanUrl}`, 
        data:req.body,
        headers: {
      "content-type": "application/json",
      ...(req.headers.authorization && {
        authorization: req.headers.authorization,
      }),
    },
    timeout: 5000,
    }
    )
}