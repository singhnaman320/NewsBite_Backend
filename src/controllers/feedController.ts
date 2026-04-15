import { Request, Response } from "express";

import { availableTopics } from "../constants/defaultFeeds";
import { getFeedBundle } from "../services/feedService";
import { asyncHandler } from "../utils/asyncHandler";
import { HttpError } from "../utils/httpError";

export const getFeed = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new HttpError(401, "Authentication required.");
  }

  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 8);
  const tab = String(req.query.tab ?? "For You");

  const feed = await getFeedBundle({
    userId: req.user.userId,
    tab,
    page,
    limit,
  });

  res.json(feed);
});

export const getCategories = asyncHandler(
  async (_req: Request, res: Response) => {
    res.json({ categories: availableTopics });
  },
);
