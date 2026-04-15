import { Router } from "express";

import {
  createAd,
  createAgent,
  deleteAd,
  deleteAgent,
  getAnalytics,
  listAds,
  listAgents,
  runAgent,
  updateAd,
  updateAgent,
} from "../controllers/adminController";
import { authenticate, requireRole } from "../middleware/auth";

const router = Router();

router.use(authenticate, requireRole("admin"));

router.get("/agents", listAgents);
router.post("/agents", createAgent);
router.patch("/agents/:id", updateAgent);
router.delete("/agents/:id", deleteAgent);
router.post("/agents/:id/run", runAgent);

router.get("/ads", listAds);
router.post("/ads", createAd);
router.patch("/ads/:id", updateAd);
router.delete("/ads/:id", deleteAd);

router.get("/analytics", getAnalytics);

export default router;
