import { Router } from "express";
import user from "./user.route.ts"
import profileRoute from "./profile.route.ts"
import product from "./product.route.ts"
import checkout from "./product.route.ts"

const route=Router()
route.use('/auth',user)
route.use('/profile',profileRoute)

export default route
