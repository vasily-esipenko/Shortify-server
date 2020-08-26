import express, {Request, Response, Router} from 'express';
import User from '../models/User';
import config from 'config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { token } from 'morgan';
import { isValid } from 'shortid';
import { strict } from 'assert';
import { Mongoose } from 'mongoose';
const authRouter: Router = express.Router();

// JWT functions
const jwtSign = (user: any, res: Response) => {
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

            bcrypt.hash(req.body.password, 10, async (err, hashed) => {

                if (err) {
                    res.status(422);
                    res.json(err);
                } else {
                    await User.create({
                        username: req.body.username,
                        email: req.body.email,
                        password: hashed,
                        created: new Date(),
                    }).then(createdUser => {
                        try {
                            const payload: object = {
                                username: createdUser.username,
                                email: createdUser.email,
                                created: createdUser.created
                            };
                        
                            jwt.sign(payload, config.get("JWT"), {
                                expiresIn: '1d'
                            }, (err, token) => {
                                if (err) {
                                    res.status(422);
                                    res.json(err);
                                } else {
                                    res.json({message: "Signed up!", token: token, user: payload},);
                                }
                            });
                        } catch {
                            res.status(500);
                            res.json("Something went wrong...");
                        }
                    });
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
                bcrypt.compare(req.body.password, foundUser.password, async (err, result) => {
                    if (result) {
                        const payload: object = {
                            username: foundUser.username,
                            email: foundUser.email,
                            created: foundUser.created
                        };
                    
                        jwt.sign(payload, config.get("JWT"), {
                            expiresIn: '1d'
                        }, (err, token) => {
                            if (err) {
                                res.status(422);
                                res.json(err);
                            } else {
                                res.json({message: "Logged in!", token: token, user: payload});
                            }
                        });
                    } else {
                        res.status(422);
                        res.json({error: err, result: result});
                    }
                });
            } else {
                res.status(404);
                res.json("User not found");
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
