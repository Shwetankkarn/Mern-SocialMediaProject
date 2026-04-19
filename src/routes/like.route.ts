import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { togglePostLike, getUsersWhoLikedPost } from "../controllers/likeController";

const router= express.Router();

router.route("/post/:postId/like-post").post(verifyJWT, togglePostLike);
router.route("/post/:postId").get(verifyJWT, getUsersWhoLikedPost);

export default router;