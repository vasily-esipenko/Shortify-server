import mongoose from 'mongoose';

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

export default mongoose.model('User', userSchema);
