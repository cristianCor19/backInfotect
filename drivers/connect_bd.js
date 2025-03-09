import mongoose from 'mongoose';

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const MAX_RETRIES = 5;
const INITIAL_DELAY = 1000;

const connectToDatabase = async (retries = MAX_RETRIES, delay = INITIAL_DELAY) => {
    try {
        await mongoose.connect(process.env.URLMONGO, options);
        console.log('Successfully connected to the database');
    } catch (error) {
        console.log('Error connected to the database', error.message);

        if (retries > 0) {
            const nextDelay = delay * 2;
            console.log(`Retrying in ${nextDelay / 1000} seconds... (${retries} retries left)`);
            setTimeout(() => connectToDatabase(retries - 1, nextDelay), nextDelay);
        }else{
            console.error('All retries exhausted. Database connection failed.');
        }
    }
};

export default connectToDatabase;
