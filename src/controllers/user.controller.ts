import { Request } from "express";
import { Response } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { uploadToCloudinary } from "../utils/cloudinary";
import { User } from "../models/user.model.js";

export const registerUser = async(req: Request, res: Response) => {
    try{
        let profileImageLocalPath;
       let profileImageUrl;
       if(req.file?.path){
        profileImageLocalPath = req.file.path;
       const cloudinaryResult = await uploadToCloudinary(profileImageLocalPath);
       if(cloudinaryResult?.url){
         profileImageUrl = cloudinaryResult?.url;
       }
       }

       const { username, email, password} = req.body;

       if(!username || username===""){
        throw new ApiError(400, "username is required");
       }

       if(!email || email===""){
        throw new ApiError(400, "email is required");
       }

       if(!email.includes("@")){
         throw new ApiError(400, "invalid email");
       }

       if(!password || password===""){
        throw new ApiError(400, "Password is required");
       }

      let existinguser= await User.findOne({ 
        $or: [{username}, {email}],
      });

      if(existinguser){
        throw new ApiError(409, "User with email or password is already exists");
      }
      let user;
      if(profileImageUrl){
         user = await User.create({
         username,
         email,
         password,
         profileImage: profileImageUrl,
      });
      } else{
          user = await User.create({
         username,
         email,
         password,
      });
    }
    const createdUser = await User.findOne({
      $or: [{username},{email}],
    });

    if(!createdUser){
      throw new ApiError(500, "something went wrong while creating the user");
    }

    const accessToken = createdUser.generateAccessToken();
    const refreshToken= createdUser.generateRefreshToken();

    createdUser.refreshToken = refreshToken;
    await createdUser.save({validateBeforeSave: false});

    const loggedInUser= await User.findById(createdUser._id).select("-password -refreshToken");

    const cookiesOptions = {
      httpOnly: true,
      secure: true,
    };

       return res.status(201)
       .cookie("accessToken", accessToken)
       .cookie("refreshToken", refreshToken)
       .json(new ApiResponse(201, 
        {
          success: true,
          user: loggedInUser,
          accessToken,
          refreshToken

       }, 
       "user registered successfully"));
    }
    catch (error: unknown){
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
};