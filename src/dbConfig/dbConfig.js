import mongoose, { connection } from "mongoose";

export async function connect() {
    try {
        mongoose.connect(process.env.MONGODB_URI);
        connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('>>> DB is connected');
        });

        connection.on('error', (err) => {
            console.log('>>> DB is NOT connected: ', err);
            console.log(err);
        });

        console.log('>>> DB is connected');
    } catch (error) {
        console.log('Something went wrong!');
        console.log(error);
    }
}