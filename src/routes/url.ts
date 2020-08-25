import express, {Request, Response} from 'express';
import ShortUrl from '../models/ShortUrl';
const urlRouter = express.Router();

urlRouter.post('/', async (req: Request, res: Response) => {
    await ShortUrl.create({full: req.body.full, created: new Date(), clicks: 0}).then(insertedUrl => {
        try {
            res.json({message: 'Url was added', url: insertedUrl});
        } catch {
            res.status(500);
            res.json('Something went wrong...');
        }
    });
    
});

urlRouter.get('/', async (req: Request, res: Response) => {
    const shortUrls = await ShortUrl.find();
    res.json(shortUrls);
});

urlRouter.get('/:shortUrl', async (req: Request, res: Response) => {
    await ShortUrl.findOne({short: req.params.shortUrl}).then(foundUrl => {
        try {
            if (foundUrl !== null && foundUrl !== undefined) {
                foundUrl.clicks++;
                foundUrl.save();
                res.json({message: "Url was found", url: foundUrl});
            }

            res.status(404);
            res.json({message: "Not found"});
        } catch {
            res.json("Something went wrong");
        }
    });

});

export default urlRouter;
