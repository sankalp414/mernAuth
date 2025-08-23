import dotenv from "dotenv"
import { app } from "./app.js";
import { connectDB } from "./db/index.js";

dotenv.config({
    path:"./.env"
})

const port = process.env.PORT || 5000

connectDB()
.then(()=>{
    app.listen(port, ()=>{
        console.log(`Server is serving at port ${port}`)
    })
})
.catch((error)=>{
    console.log(`Server is not serving`)
})