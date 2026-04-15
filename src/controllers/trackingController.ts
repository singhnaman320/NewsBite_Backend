import { Request, Response } from "express";

import { AdCampaign } from "../models/AdCampaign";
import { AdEvent } from "../models/AdEvent";
import { asyncHandler } from "../utils/asyncHandler";
import { HttpError } from "../utils/httpError";

const validateAd = async (adId?: string) => {
  if (!adId) {
    throw new HttpError(400, "adId is required.");
  }

  const ad = await AdCampaign.findById(adId);
  if (!ad) {
    throw new HttpError(404, "Ad campaign not found.");
  }

  return ad;
};

export const recordView = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new HttpError(401, "Authentication required.");
  }

  const { adId, articleId } = req.body as { adId?: string; articleId?: string };
  await validateAd(adId);

  const existingView = await AdEvent.findOne({
    adId,
    userId: req.user.userId,
    eventType: "view"
  });

  if (!existingView) {
    await AdEvent.create({
      adId,
      articleId,
      userId: req.user.userId,
      eventType: "view"
    });
  }

  res.status(201).json({ tracked: true });
});

export const recordClick = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new HttpError(401, "Authentication required.");
  }

  const { adId, articleId } = req.body as { adId?: string; articleId?: string };
  await validateAd(adId);

  await AdEvent.create({
    adId,
    articleId,
    userId: req.user.userId,
    eventType: "click"
  });

  res.status(201).json({ tracked: true });
});
