import mongoose from 'mongoose'

//Connect to the MongoDB database

const connectDB = async () => {
    mongoose.connection.on('connected', () =>
        console.log('Db Connected'))

    await mongoose.connect(`${process.env.MONGO_URL}/LMS`)
}

export default connectDB