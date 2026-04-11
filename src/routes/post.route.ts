import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";
import { createPost, getAllPostsforHomePage, getUserPosts, updatePostContent, deletePost } from "../controllers/post.controller";

const router = express.Router();

router.route("/create-Post")
      .post(verifyJWT, upload.single("image"), createPost);

router.route("/all-posts").get(verifyJWT, getAllPostsforHomePage)
router.route("/user-posts/:username").get(verifyJWT, getUserPosts);
router.route("/update-post-content/:postId").patch(verifyJWT, updatePostContent);
router.route("/delete-post/:postId").delete(verifyJWT, deletePost);
export default router;