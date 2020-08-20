import express, {Request, Response, Router} from 'express';
import User from '../models/User';
import config from 'config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const authRouter: Router = express.Router();

const jwtSign = (user: any) => {
    const payload: object = {
        username: user.username,
        email: user.email
    };
    jwt.sign(payload, config.get("JWT"), (err, token) => {
        if (err) {
            console.log(err)
            return false;
        }
        if (token) return token;
    });
};

const jwtVerify = (token: string) => {
    let result: boolean = false;
    jwt.verify(token, config.get("JWT"), (err, decoded) => {
        if (decoded) result = true;
    });

    return result;
};

const hashPassword = (password: string) => {
    bcrypt.hash(password, 10, (err, encrypted) => {
        if (err) return err;
        if (encrypted) return encrypted;
    })
}

const comparePassword = (password: string, encrypted: string) => {
    bcrypt.compare(password, encrypted, (err, result) => {
        if (result) return true;

        console.log(err);
        return false;
    });
};

authRouter.post('/signup', async (req: Request, res: Response) => {
    await User.create({
        username: req.body.username,
        email: req.body.email,
        password: hashPassword(req.body.password),
        created: new Date()
    });
});

authRouter.post('/login', async (req: Request, res: Response) => {

});

export default authRouter;
