import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt, { SignOptions, Secret } from "jsonwebtoken";



export interface IUser {
    username: string,
    email: string,
    password: string,
    bio?: string,
    profileImage?: string,
    posts: mongoose.Types.ObjectId[]; 
    refreshToken?: string; 
}

export interface IUserMethods{
    isPasswordCorrect(password: string): Promise<boolean>;
   generateAccessToken(): string;
    generateRefreshToken(): string,
}

export interface IUserDocument extends Document, IUser, IUserMethods {}