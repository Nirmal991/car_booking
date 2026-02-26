import mongoose, { Document, Model } from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../lib";

interface IFullName {
  firstname: string;
  lastname?: string;
}

interface IUser {
    fullname: IFullName;
    email: string,
    password: string;
    socketId: string
}

interface IUserMethods {
    generateAuthToken(): string,
    comparePassword(password: string): Promise<boolean>,
}

interface IUserModel extends Model<IUserDocument> {
  hashPassword(password: string): Promise<string>;
}

export interface IUserDocument
  extends IUser,
    Document,
    IUserMethods {}

const userSchema = new mongoose.Schema<
    IUserDocument,
    IUserModel,
    IUserMethods
>(
    {
        fullname: {
            firstname: {
                type: String,
                required: true,
                minlength: [3, 'First name must be at least 3 characters long']
            },
            lastname: {
                type: String,
                minlength: [3, 'Last name must be at least 3 characters long']
            },
        },
        email: {
            type: String,
            required: true,
            unique: true,
            minlength: [5, 'Email must be at least 5 characters long'],
        },
        password: {
            type: String,
            required: true,
            select: false // while loging we have to do const user = await User.findOne({ email }).select("+password");
        },
        socketId: {
            type: String,
        },
    },)

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, JWT_SECRET)
    return token
}

userSchema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password)
}

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10)
}

export const User = mongoose.model<IUserDocument, IUserModel>("User", userSchema);