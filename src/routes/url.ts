import express, {Request, Response} from 'express';
const urlRouter = express.Router();

urlRouter.post('/', async (req: Request, res: Response) => {

});

urlRouter.get('/', async (req: Request, res: Response) => {
    res.json({message: "Development in progress"});
});

export default urlRouter;
