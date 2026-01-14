const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://cuongdaoviet1605_db_user:160507@formbuilder.2p7lhya.mongodb.net/?appName=formBuilder');
        console.log('MongoDB connected successfully!');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};

module.exports = connectDB;