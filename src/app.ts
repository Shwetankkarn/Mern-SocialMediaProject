import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import testRoute from "./routes/testRoute";
import userRouter from "./routes/user.route";
import postRouter from "./routes/post.route";

const app= express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(cookieParser());

app.use("/api/v1/test", testRoute);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);

export default app;