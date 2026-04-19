import mongoose, { Model } from "mongoose";
import { ICommentDocument } from "../types";

const commentSchema = new mongoose.Schema<ICommentDocument, Model<ICommentDocument>>(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },

    comment: {
      type: String,
      required: true,
    },

    commentedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Comment = mongoose.model<ICommentDocument>
("Comment",
 commentSchema);