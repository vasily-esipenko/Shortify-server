import mongoose from 'mongoose';
import shortid from 'shortid';

export interface Url extends mongoose.Document {
    full: string;
    created: Date;
    clicks: number;
};

const urlSchema = new mongoose.Schema({
    full: {
        type: String,
        required: true
    },
    short: {
        type: String,
        required: true,
        default: shortid.generate
    },
    clicks: {
        type: Number,
        required: true,
        default: 0
    }
});

export default mongoose.model<Url>('ShortUrl', urlSchema);
