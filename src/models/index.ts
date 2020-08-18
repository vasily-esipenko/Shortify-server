import * as mongoose from 'mongoose';
import config from 'config'

const MONGO: string = config.get("MONGO");

// Connect to MongoDB
mongoose.connect(MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

export * from './shortUrl';
export * from './user';
