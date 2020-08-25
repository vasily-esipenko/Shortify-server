import mongoose from 'mongoose';

export interface User extends mongoose.Document {
    username: string;
    email: string;
    password: any;
    created: Date;
};

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        min: 2,
        max: 40,
        required: true
    },
    email: {
        type: String,
        min: 5,
        required: true
    },
    password: {
        type: String,
        min: 8,
        required: true
    }
});

export default mongoose.model<User>('User', userSchema);
