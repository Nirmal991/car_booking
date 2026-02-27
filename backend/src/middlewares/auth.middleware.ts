import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ApiError, asyncHandler, JWT_SECRET } from '../lib';
import { Captain, ICaptainDocument, IUserDocument, User } from '../models';

export interface AuthRequest extends Request {
  user?: IUserDocument
  captain?: ICaptainDocument
}

export interface AccessTokenPayload extends JwtPayload {
    _id: string;
    // user: string;
    // email: string;
}

export const authUser = asyncHandler(async (req:AuthRequest, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            throw new ApiError(401, "unauthorized request");
        }

        const decodedToken = jwt.verify(token, JWT_SECRET) as AccessTokenPayload;

        const user = await User.findById(decodedToken._id).select('-password');

        if (!user) {
            throw new ApiError(401, "invalid access token");
        }

        console.log("USER", user);

        req.user = user;
        return next();
    } catch (error) {
        console.error("Error: ", error);

        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
                errors: error.errors,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            errors: [],
        });
    }
})

export const authCaptain = asyncHandler(async (req:AuthRequest, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if(!token){
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, JWT_SECRET) as AccessTokenPayload

        const captain = await Captain.findById(decodedToken._id)

        if(!captain){
            throw new ApiError(401, "Invalid access token");
        }

        console.log("Captain: ", captain);

        req.captain = captain;
        return next();
    } catch (error) {
        console.error("Error: ", error);

        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
                errors: error.errors,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            errors: [],
        });
    }
})