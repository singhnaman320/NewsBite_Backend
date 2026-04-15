import { Router } from "express";

import { getSavedArticles, toggleSavedArticle, updatePreferences } from "../controllers/userController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);
router.patch("/preferences", updatePreferences);
router.get("/saved", getSavedArticles);
router.post("/saved/:articleId", toggleSavedArticle);

export default router;
