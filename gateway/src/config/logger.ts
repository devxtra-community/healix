import { level } from "winston";
import  winston from "winston";

const logger= winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    defaultMeta:{
        service: process.env.SERVICE_NAME || "api-gateway",
    },
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({stack:true}),
        winston.format.json()
    ),
    transports:[
        new winston.transports.Console(),
        new winston.transports.File({ filename: "error.log" })

    ],
})
export default logger