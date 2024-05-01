
import mongoose from "mongoose";

export const connectMongoose = async (mongoUrl: string) => {
    try {
        const conn = await mongoose.connect(mongoUrl);
        console.log('MongoDB connected!');
        return conn;
    } catch (e) {
        console.error('Error while enabling Mongo DB Connection:: ', e);
        throw e;
    }
};

export const disConnectMongoose = async () => {
    try {
        await mongoose.disconnect();
        await mongoose.connection.close();
        console.log('MongoDB disconnected!');
    } catch (e) {
        console.error('Error while disabling Mongo DB Connection:: ', e);
        throw e;
    }
};

