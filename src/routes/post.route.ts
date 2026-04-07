import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";
import { createPost, getAllPostsforHomePage, getUserPosts } from "../controllers/post.controller";

const router = express.Router();

router.route("/create-Post")
      .post(verifyJWT, upload.single("image"), createPost);

router.route("/all-posts").get(verifyJWT, getAllPostsforHomePage)
router.route("/user-posts/:username").get(verifyJWT, getUserPosts);

export default router;