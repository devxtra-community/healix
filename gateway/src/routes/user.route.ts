import { Router } from "express";
import { forwardToUserService } from "../service/user.proxy.ts";
const router=Router()

router.use(async(req,res)=>{
    try{
        const response=await forwardToUserService(req)
        res.status(response.status).json(response.data)
    }
    catch(error){
        res.status(500).json({message:'User service error'})
    }
})

export default router
