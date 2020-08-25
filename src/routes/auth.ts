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
    let jwtToken: string = "";

    const payload: object = {
        username: user.username,
        email: user.email
    };
    jwt.sign(payload, config.get("JWT"), (err, token) => {
        if (err) {
            console.log(err)
            return err;
        }
        if (token) {
            jwtToken = token;
        }
    });

    return jwtToken;
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

            await User.create({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                created: new Date(),
            }).then(createdUser => {
                try {
                    const token = jwtSign(createdUser);

                    res.json({message: "Signed up!", token: token, user: createdUser});
                } catch {
                    res.status(500);
                    res.json("Something went wrong...");
                }
            });
        }

        else res.json({message: "User already exist"});
    });
});

authRouter.post('/login', async (req: Request, res: Response) => {
    await User.findOne({email: req.body.email}).then(foundUser => {
        try {
            if (foundUser) {
                const token = jwtSign(foundUser);
                res.json({message: "Logged in!", token: token, user: foundUser});
            }
        } catch {
            res.status(500);
            res.json("Something went wrong...");
        }
    });
});


authRouter.post('/verify', async (req: Request, res: Response) => {
});

export default authRouter;
