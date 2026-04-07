import mongoose, { Model } from "mongoose";
import { timeStamp } from "node:console";
import { IPostDocument } from "../types";

const PostSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        }, 
        
            image: {
                type: String,
            },
            owner: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            comments: [
                {
                     type: mongoose.Schema.Types.ObjectId,
                     ref: "Comment",
                }
            ],
    },
    {
    timestamps: true
    }
);

export const Post= mongoose.model<IPostDocument>("Post" , PostSchema);