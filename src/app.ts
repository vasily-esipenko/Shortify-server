import express, {Application, Request, Response, NextFunction, Router} from 'express';
import cors from 'cors';
import config from 'config';

// Import routes
import authRouter from './routes/auth';
import urlRouter from './routes/url';

const app: Application = express();

app.use(cors());
app.use(express.json());

// Use routes
app.use('api/user', authRouter);
app.use('/api/url', urlRouter);

app.get('/', async (req: Request, res: Response) => {
    res.json({ message: "Server is working!" });
});

const PORT: number = config.get("PORT"); 

app.listen(PORT, () => console.log(`Server is on port ${PORT}`));
