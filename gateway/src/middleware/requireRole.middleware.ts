import { Request,Response,NextFunction } from "express";

export function requireRole(allowedRoles:string[]){
    return(req:Request,res:Response,next:NextFunction)=>{
        const role=req.user?.role;
        if(!role) {
            return res.status(401).json({message:"Unauthorized"})
        }
        if (!allowedRoles.includes(role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next()
    }
}