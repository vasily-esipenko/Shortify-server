import express, {Request, Response, Router} from 'express';
import User from '../models/User';
import config from 'config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { token } from 'morgan';
import { isValid } from 'shortid';
import { strict } from 'assert';
const authRouter: Router = express.Router();

// JWT functions
const jwtSign = (user: any) => {
    const payload: object = {
        username: user.username,
        email: user.email
    };
    jwt.sign(payload, config.get("JWT"), (err, token) => {
        if (err) {
            console.log(err)
            return err;
        }
        if (token) return token;
    });

    return token;
};

const jwtVerify = (token: string) => {
    let result: boolean = false;
    jwt.verify(token, config.get("JWT"), (err, decoded) => {
        if (decoded) result = true;
    });

    return result;
};

// Hash & compare password functions
const hashPassword = (password: string) => {
    let hashedPassword = null;
    bcrypt.hash(password, 10, (err, encrypted) => {
        if (err) return err;
        
        return hashedPassword = encrypted;
    })

    return hashedPassword;
}

const comparePassword = (password: string, encrypted: string) => {
    let isValid = false;
    bcrypt.compare(password, encrypted, (err, result) => {
        if (result) return isValid = true;

        console.log(err);
        return isValid = false;
    });

    return isValid;
};

// Routes
authRouter.post('/signup', async (req: Request, res: Response) => {
    await User.findOne({email: req.body.email}).exec(async (err, result) => {
        if (err) res.json({error: err});

        if (result == null || result == undefined) {
            const hashed = hashPassword(req.body.password);
            await User.create({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
                created: new Date(),
            });

            res.json({message: "Signed up!", token: jwtSign(req.body)});
        }

        else res.json({message: "User already exist"});
    });
});

authRouter.post('/login', async (req: Request, res: Response) => {
    await User.findOne({email: req.body.email}).exec(async (err, result: any) => {
        if (err) res.json({error: err});

        if (result != null && result != undefined) {
            if (comparePassword(req.body.password, result.password)) {
                res.json({message: "Logged in!", token: jwtSign(req.body)});
            }
            
            else res.json({message: "Passwords don't match"});
        }

        else res.json({message: "User not found"});
    });
});


authRouter.post('/verify', async (req: Request, res: Response) => {
});

export default authRouter;
