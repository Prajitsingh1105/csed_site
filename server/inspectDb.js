import mongoose from 'mongoose';
import dotenv from 'dotenv';
import NoDuesRequest from './models/NoDuesRequest.js';

dotenv.config();

const inspect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB!");
        const count = await NoDuesRequest.countDocuments();
        console.log(`Total NoDuesRequests in database: ${count}`);
        const requests = await NoDuesRequest.find();
        console.log("Requests:", JSON.stringify(requests, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

inspect();
