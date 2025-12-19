import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken"

export interface AuthRequest extends Request{
    user?: any;
}
export function verifyToken(
    req:AuthRequest,
    res:Response,
    next:NextFunction
)
{
    const authHeader=req.headers.authorization
    if(!authHeader){
        return res.status(401).json({message:"Authorized header missing!"})
    }
    const token=authHeader.split(" ")[1];
    try{
        const decode=jwt.verify(token,process.env.JWT_SECRET as string)
        req.user=decode
        next()
    }
    catch{
        return res.status(401).json({message:'Invalid or expired token!'})
    }
}