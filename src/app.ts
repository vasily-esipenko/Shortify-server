import express, {Application, Request, Response} from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from 'config';
import morgan from 'morgan';

// Import routes
import authRouter from './routes/auth';
import urlRouter from './routes/url';

const MONGO: string = config.get("MONGO");

// Connect to MongoDB
mongoose.connect(MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const app: Application = express();

app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());

// Use routes
app.use('/api/user', authRouter);
app.use('/api/url', urlRouter);

app.get('/', async (req: Request, res: Response) => {
    res.json({ message: "Server is working!" });
});

const PORT: number = config.get("PORT"); 

app.listen(PORT, () => console.log(`Server is on port ${PORT}`));
