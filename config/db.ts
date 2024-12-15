import mongoose from "mongoose"

export const connectDb = async() => {
    try {
        const { connection } = await mongoose.connect(process.env.MONGO_URI || "", {});
        console.log(`MongoDb connected at ${connection.host}`)
    } catch (error) {
        console.log(`Error connecting to db`, error)
    }
}