import { Router } from "express";

import { recordClick, recordView } from "../controllers/trackingController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);
router.post("/view", recordView);
router.post("/click", recordClick);

export default router;
