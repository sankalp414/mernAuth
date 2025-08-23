import mongoose from "mongoose"

const connectDB = async () =>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${connectDB}`)
        console.log(`mongo db conected at instance ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log('mongo db not connected',error)
    }
}

export{
    connectDB
}