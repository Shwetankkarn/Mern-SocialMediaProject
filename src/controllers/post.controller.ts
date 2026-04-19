import { ApiError } from "../utils/ApiError";
import { Request } from "express";
import { Response } from "express";
import { uploadToCloudinary } from "../utils/cloudinary";
import { User } from "../models/user.model";
import { Post } from "../models/post.model";
import { ApiResponse } from "../utils/ApiResponse";
import mongoose from "mongoose";

export const createPost = async(req: Request, res: Response) => {
try{

    let imageLocalPath;
    let image;
    let post;
    if(req.file?.path){
        imageLocalPath= req.file?.path;
        image = await uploadToCloudinary(imageLocalPath);
    }
    const { content }= req.body;
    const userId = req.user?._id;

    const user = await User.findById(userId);
    if(!user){
        throw new ApiError(404, "user not found");
    }

    if(!image ){
     post = await Post.create({
        content,
        owner: userId,
    });
}     else{
        post = await Post.create({
        content,
        image: image.url,
        owner: userId,
        })
    }
    return res
.status(201)
.json(new ApiResponse(200, post, "post created successfully"));
}



catch(error: unknown) {
    console.error("Error"+ error);

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

export const getAllPostsforHomePage = async (req:Request, res:Response) =>{
    try{
        const posts = await Post.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },
      {
        $unwind: {
          path: "$owner",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          "owner.password": 0,
          "owner.refreshToken": 0,
          "owner.__v": 0,
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "comments",
          foreignField: "_id",
          as: "comments",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "comments.commentedBy",
          foreignField: "_id",
          as: "commentUsers",
        },
      },
      {
        $addFields: {
          comments: {
            $map: {
              input: "$comments",
              as: "comment",
              in: {
                _id: "$$comment._id",
                comment: "$$comment.comment",
                createdAt: "$$comment.createdAt",
                commentedBy: {
                  $let: {
                    vars: {
                      user: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$commentUsers",
                              as: "user",
                              cond: {
                                $eq: ["$$user._id", "$$comment.commentedBy"],
                              },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: {
                      _id: "$$user._id",
                      username: "$$user.username",
                      profileImage: "$$user.profileImage",
                    },
                  },
                },
              },
            },
          },
        },
      },

      //ONLY NEW PART (LIKES)
     {
  $addFields: {
    commentsCount: { $size: { $ifNull: ["$comments", []] } },
    likes: { $ifNull: ["$likes", []] }, // ensure exists
  },
},
{
  $addFields: {
    likeCount: { $size: "$likes" },
  },
},

      {
        $project: {
          commentUsers: 0,
          __v: 0,
          // keep likes if frontend needs it
          // remove this line if you want full likes array
          // likes: 1
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    // console.log(posts);

        return res.status(200).json(new ApiResponse(200, posts, "posts fetched successfully"))
    }

    catch(error: unknown) {
  console.error("Error"+ error);

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

export const getUserPosts = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    if (!username) {
      throw new ApiError(404, "username not found");
    }

    // const cacheKey = `user:posts:${username}`;

    // const cachedData = await redisClient.get(cacheKey);

    // if (cachedData) {
    //   return res
    //     .status(200)
    //     .json(
    //       new ApiResponse(
    //         200,
    //         JSON.parse(cachedData),
    //         "user posts fetched from cache"
    //       )
    //     );
    // }

 const posts = await Post.aggregate([
      //Join owner
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },
      { $unwind: "$owner" },

      //Match by username
      {
        $match: {
          "owner.username": username,
        },
      },

      //Join comments
      {
        $lookup: {
          from: "comments",
          localField: "comments",
          foreignField: "_id",
          as: "comments",
        },
      },

      //Join comment users
      {
        $lookup: {
          from: "users",
          localField: "comments.commentedBy",
          foreignField: "_id",
          as: "commentUsers",
        },
      },

      // Shape comments
      {
        $addFields: {
          comments: {
            $map: {
              input: "$comments",
              as: "comment",
              in: {
                _id: "$$comment._id",
                comment: "$$comment.comment",
                createdAt: "$$comment.createdAt",
                commentedBy: {
                  $let: {
                    vars: {
                      user: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$commentUsers",
                              as: "user",
                              cond: {
                                $eq: ["$$user._id", "$$comment.commentedBy"],
                              },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: {
                      _id: "$$user._id",
                      username: "$$user.username",
                      profileImage: "$$user.profileImage",
                    },
                  },
                },
              },
            },
          },
        },
      },

      // ensure likes always exists + counts
      {
        $addFields: {
          likes: { $ifNull: ["$likes", []] },
        },
      },
      {
        $addFields: {
          commentCount: { $size: "$comments" },
          likeCount: { $size: "$likes" },
        },
      },

      // Final projection
      {
        $project: {
          content: 1,
          image: 1,
          video: 1,
          createdAt: 1,
          commentCount: 1,
          likeCount: 1,
          likes: 1,
          comments: 1,
          owner: {
            _id: "$owner._id",
            username: "$owner.username",
            profileImage: "$owner.profileImage",
          },
        },
      },

      { $sort: { createdAt: -1 } },
    ]);

    // await redisClient.set(cacheKey, JSON.stringify(posts), {
    //   EX: 60,
    // });

    return res
      .status(200)
      .json(new ApiResponse(200, posts, "user posts fetched successfully"));
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

export const updatePostContent = async (req: Request ,res: Response) =>{
  try{

    const userId= req.user?._id;
     const { postId }= req.params;
     const { content }= req.body;

     if(!content || content === ""){
       throw new ApiError(400, "content is required and it cannot be empty");
     }

     if(!userId){
      throw new ApiError(404, "User not found");
     }

     if(!postId){
       throw new ApiError(404, "postid not found");
     
     }

     const post= await Post.findById(postId);

     if(!post){
      throw new ApiError(404, "post not found");
     }

     if(!post.owner.equals(userId)){
      throw new ApiError(401, "you are unauthorized to perform the action");
     }

     post.content = content;
     post.save ({validateBeforeSave: false})

  return res.status (200).json(new ApiResponse(200, postId, "post updated successfully"));
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

export const deletePost = async (req:Request, res:Response) =>{
  try{
      const { postId } = req.params;
      const userId= req.user?._id;

      if(!postId){
        throw new ApiError(404, "post id not found");
      }

      if(!userId){
         throw new ApiError(404, "user id not found");
      }

      const deletedPost = await Post.findByIdAndDelete({
        _id: postId,
        owner: userId,
  });
  

     if(!deletedPost){
      throw new ApiError(401, "you are unauthorized to perform the action");
    }

     return res.status(203).json(new ApiResponse(203, null, "post Deleted successfully"));
  }
  catch (error: unknown) {
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