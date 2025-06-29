const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const MONGO_URL = process.env.ATLAS_URL || "mongodb://127.0.0.1:27017/wanderlust";
        
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
