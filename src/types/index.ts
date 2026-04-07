import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt, { SignOptions, Secret, JwtPayload } from "jsonwebtoken";
// import { AccessTokenPayload } from "../types";


export interface IUser {
    username: string,
    email: string,
    password: string,
    bio?: string,
    profileImage?: string,
    posts: mongoose.Types.ObjectId[]; 
    followers: mongoose.Types.ObjectId;
    following:  mongoose.Types.ObjectId;
    refreshToken?: string| undefined; 
}

export interface IUserMethods{
    isPasswordCorrect(password: string): Promise<boolean>;
   generateAccessToken(): string;
    generateRefreshToken(): string,
}

export interface IUserDocument extends Document, IUser, IUserMethods {}

export interface AccessTokenPayload extends JwtPayload{
    _id: string,
    user: string,
    email: string
}

export interface IPost {
    content: String,
    image?:  string,
    owner: mongoose.Types.ObjectId;
    comments: mongoose.Types.ObjectId;

}

export interface IPostDocument extends Document, IPost {}