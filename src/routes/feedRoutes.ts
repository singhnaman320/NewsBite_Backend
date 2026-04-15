import { Router } from "express";

import { getCategories, getFeed } from "../controllers/feedController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);
router.get("/", getFeed);
router.get("/categories", getCategories);

export default router;
