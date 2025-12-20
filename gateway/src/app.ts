import express from "express"
import user from "./routes/user.route.ts"
import product from "./routes/product.route.ts"
const app=express()
app.use(express.json())
app.get('/health',(_req,res)=>{
    res.json({status:'gateway is alive!'})
})
app.use('/api/v1/auth',user)
app.use('/api/v1/product',product)
export default app

