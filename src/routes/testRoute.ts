import express from "express";
import { TestController } from "../controllers/test.controller";

const router = express.Router();

router.route("/test-api").get(TestController); 

export default router;