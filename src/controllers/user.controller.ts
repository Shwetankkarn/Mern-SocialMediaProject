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
       .cookie("accessToken", accessToken, cookiesOptions)
       .cookie("refreshToken", refreshToken, cookiesOptions)
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

export const loginUser= async (req: Request, res: Response) =>{
  try{
      const {username, email, password } = req.body;
      if(!username && !email){
        throw new ApiError(400, "username or email is required");
      }
      const user= await User.findOne({
        $or: [{username}, {email}],
      });
      if(!user){
        throw new ApiError(404, "user not found");
      }

      const isPasswordValid =await user.isPasswordCorrect(password);

      if(!isPasswordValid){
        throw new ApiError(404, "invalid credentials");
      }

      const accessToken = user.generateAccessToken();
       const RefreshToken = user.generateRefreshToken();

       user.refreshToken= RefreshToken;
       user.save({ validateBeforeSave: false });

       const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
       );

       const cookieOptions ={
        httpOnly: true,
        secure: true,
       };

       return res.status(200)
       .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", RefreshToken, cookieOptions)
       .json
       (new ApiResponse(200,{
        user: loggedInUser,
        accessToken,
        RefreshToken,

       },
       "USER LOGGED IN SUCCESSFULLY"
      ))
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
}

export const logoutUser = async (req: Request, res: Response) => {
  try {
   const userId = req.user?._id;

if (!userId) {
  throw new ApiError(401, "Unauthorized - no user found");
}
    // user.refreshToken = undefined;
    // user.save();
    await User.findByIdAndUpdate(
      userId,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      {
        new: true,
      }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: true
    };

    return res
      .status(200)
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .json(new ApiResponse(200, null, "user logged out successfully"));
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