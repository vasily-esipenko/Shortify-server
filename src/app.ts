import express, {Application, Request, Response, NextFunction} from 'express';
import cors from 'cors';
import config from 'config';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get('/', async (req: Request, res: Response) => {
    res.json({ message: "Server is working!" });
});

const PORT: number = config.get("PORT"); 

app.listen(PORT, () => console.log(`Server is on port ${PORT}`));
