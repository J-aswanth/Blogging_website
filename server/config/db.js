import mongoose from 'mongoose';


const connectDB = async () =>{

    try {

        mongoose.set('strictQuery',false);
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`Database connected: ${conn.connection.host}`);
        
    }catch (error){
        console.log(error);
    }
}

export default connectDB;
