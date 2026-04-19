import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { Post } from "../models/post.model";
import { Comment } from "../models/comment.model";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse";

export const createComment = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    const rawPostId = req.params.postId;
    const postId = Array.isArray(rawPostId) ? rawPostId[0] : rawPostId;

    const { comment } = req.body;

    if (!userId) {
      throw new ApiError(404, "User id not found");
    }

    if (!postId) {
      throw new ApiError(404, "Post id not found");
    }

    if (!comment || comment.trim() === "") {
      throw new ApiError(400, "Comment is required");
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new ApiError(400, "Invalid postId");
    }

    const post = await Post.findById(postId);

    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    const createdComment = await Comment.create({
      comment,
      post: new mongoose.Types.ObjectId(postId),
      commentedBy: new mongoose.Types.ObjectId(userId),
    });

    post.comments.push(createdComment._id);
    await post.save();

    return res.status(201).json({
      success: true,
      message: "Comment created successfully",
      data: createdComment,
    });

  } catch (error: unknown) {
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
};

export const getCommentsByPostId = async(req: Request, res: Response) => {
  try{
      const { postId } = req.params;

      const comments = await Comment.find({
        post: postId,
      });

      return res.status(200).json(new ApiResponse(200, comments, "comments fetched successfully"));
  }

  catch(error: unknown){
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
}

export const deleteComment = async(req: Request, res: Response) =>{

  try {
  const userId= req.user?._id;
  const { postId, commentId }= req.params;

  if(!userId){
    throw new ApiError(404, "user id not found");
  }

  if(!commentId){
    throw new ApiError(404, "commment id not found");
  }

  const post = await Post.findById(postId);

  if(!post){
    throw new ApiError(404, "post not found");
  }

  const comment = await Comment.findById(commentId);

  if(!comment){
    throw new ApiError(404, "comment not found")
  }

  if(!comment.post.equals(post._id)) {
    throw new ApiError(400, "comment id does not belong to post");
  }

  const isPostOwner = post.owner.equals(userId);
  const isCommentOwner = comment.commentedBy.equals(userId);

  if(!isPostOwner &&  !isCommentOwner){
    throw new ApiError(401, "you are unauthorized to perform this action");
  }

  await Comment.findByIdAndDelete(commentId);

  await Post.findByIdAndUpdate(postId, {
    $pull: { comments: commentId}
  });

  return res.status(200)
  .json
  (new ApiResponse(200, null, "comment deleted successfully"));
  }
  catch(error: unknown){
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
  }