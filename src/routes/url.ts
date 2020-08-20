import express, {Request, Response} from 'express';
import ShortUrl from '../models/ShortUrl';
const urlRouter = express.Router();

urlRouter.post('/', async (req: Request, res: Response) => {
    await ShortUrl.create({full: req.body.fullUrl, created: new Date()});
    res.json({message: "url was added"});
});

urlRouter.get('/', async (req: Request, res: Response) => {
    const shortUrls = await ShortUrl.find();
    res.json(shortUrls);
});

urlRouter.get('/:shortUrl', async (req: Request, res: Response) => {
    const shortUrl = await ShortUrl.findOne({short: req.params.shortUrl});
    if (shortUrl == null) return res.sendStatus(404);

    //shortUrl.clicks++;
    shortUrl.save();
});

export default urlRouter;
