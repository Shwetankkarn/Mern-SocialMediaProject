import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({
    path: "./.env",
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (localFilePath: string) => {
  try {
    console.log("Uploading file:", localFilePath);

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // delete file from local after upload
    fs.unlinkSync(localFilePath);

    return response;

  } catch (error) {
    console.log("Cloudinary Error:", error);

    // delete file even if error happens
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

export const removeFromCloudinary = async (imageUrl: string) => {
  try {
    if (!imageUrl) throw new Error("Image URL required");

    const urlArray = imageUrl.split("/");
    const imageNameWithExtension: string = urlArray[urlArray.length - 1]!;

    const imageName = imageNameWithExtension.split(".")[0];

    if (!imageName) {
      throw new Error("Invalid public_id");
    }

    await cloudinary.uploader.destroy(imageName);

  } catch (error) {
    console.log("Cloudinary Error: ", error);
  }
};