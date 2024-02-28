// connect_bd.js
import mongoose from 'mongoose';

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};


const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.URLMONGO, options);
        console.log('Successfully connected to the database');
    } catch (error) {
        console.log('Error connected to the database', error);
    }
};

export default connectToDatabase;
