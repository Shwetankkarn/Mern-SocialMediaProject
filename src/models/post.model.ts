import mongoose from "mongoose";
import { timeStamp } from "node:console";

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
            }
        
    },
    {
    timestamps: true
    }
);

export const Post= mongoose.model("Post" , PostSchema);