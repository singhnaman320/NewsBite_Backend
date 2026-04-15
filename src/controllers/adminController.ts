import { Request, Response } from "express";

import { AdCampaign } from "../models/AdCampaign";
import { FeedAgent } from "../models/FeedAgent";
import { getAdAnalytics } from "../services/adAnalyticsService";
import { syncAgentFeed } from "../services/feedFetcherService";
import { asyncHandler } from "../utils/asyncHandler";
import { HttpError } from "../utils/httpError";

export const listAgents = asyncHandler(async (_req: Request, res: Response) => {
  const agents = await FeedAgent.find().sort({ createdAt: -1 });
  res.json({ agents });
});

export const createAgent = asyncHandler(async (req: Request, res: Response) => {
  const agent = await FeedAgent.create(req.body);
  res.status(201).json({ agent, message: "Feed agent created successfully." });
});

export const updateAgent = asyncHandler(async (req: Request, res: Response) => {
  const agent = await FeedAgent.findByIdAndUpdate(
    String(req.params.id),
    req.body,
    { new: true },
  );
  if (!agent) {
    throw new HttpError(404, "Feed agent not found.");
  }

  res.json({ agent, message: "Feed agent updated successfully." });
});

export const deleteAgent = asyncHandler(async (req: Request, res: Response) => {
  const agent = await FeedAgent.findByIdAndDelete(String(req.params.id));
  if (!agent) {
    throw new HttpError(404, "Feed agent not found.");
  }

  res.json({ message: "Feed agent deleted successfully." });
});

export const runAgent = asyncHandler(async (req: Request, res: Response) => {
  const result = await syncAgentFeed(String(req.params.id));

  if (result.error) {
    throw new HttpError(502, result.error);
  }

  res.json(result);
});

export const listAds = asyncHandler(async (_req: Request, res: Response) => {
  const ads = await AdCampaign.find().sort({ createdAt: -1 });
  res.json({ ads });
});

export const createAd = asyncHandler(async (req: Request, res: Response) => {
  const ad = await AdCampaign.create(req.body);
  res.status(201).json({ ad, message: "Ad campaign created successfully." });
});

export const updateAd = asyncHandler(async (req: Request, res: Response) => {
  const ad = await AdCampaign.findByIdAndUpdate(
    String(req.params.id),
    req.body,
    { new: true },
  );
  if (!ad) {
    throw new HttpError(404, "Ad campaign not found.");
  }

  res.json({ ad, message: "Ad campaign updated successfully." });
});

export const deleteAd = asyncHandler(async (req: Request, res: Response) => {
  const ad = await AdCampaign.findByIdAndDelete(String(req.params.id));
  if (!ad) {
    throw new HttpError(404, "Ad campaign not found.");
  }

  res.json({ message: "Ad campaign deleted successfully." });
});

export const getAnalytics = asyncHandler(
  async (_req: Request, res: Response) => {
    const analytics = await getAdAnalytics();
    res.json({ analytics });
  },
);
