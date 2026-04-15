import { Request, Response } from "express";

import { Article } from "../models/Article";
import { User } from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";
import { HttpError } from "../utils/httpError";

export const updatePreferences = asyncHandler(async (req: Request, res: Response) => {
  const { preferences } = req.body as { preferences?: string[] };

  if (!req.user) {
    throw new HttpError(401, "Authentication required.");
  }

  if (!Array.isArray(preferences)) {
    throw new HttpError(400, "Preferences must be an array.");
  }

  const user = await User.findByIdAndUpdate(
    req.user.userId,
    {
      preferences,
      onboardingCompleted: true
    },
    { new: true }
  ).select("-passwordHash");

  res.json({ user, message: "Your preferences were saved successfully." });
});

export const toggleSavedArticle = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new HttpError(401, "Authentication required.");
  }

  const { articleId } = req.params;
  const article = await Article.findById(articleId);
  if (!article) {
    throw new HttpError(404, "Article not found.");
  }

  const user = await User.findById(req.user.userId);
  if (!user) {
    throw new HttpError(404, "User not found.");
  }

  const alreadySaved = user.savedArticles.some((savedId) => savedId.toString() === articleId);
  user.savedArticles = alreadySaved
    ? user.savedArticles.filter((savedId) => savedId.toString() !== articleId)
    : [...user.savedArticles, article._id];
  await user.save();

  res.json({
    saved: !alreadySaved,
    savedArticles: user.savedArticles,
    message: alreadySaved ? "Article removed from your saved list." : "Article saved successfully."
  });
});

export const getSavedArticles = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new HttpError(401, "Authentication required.");
  }

  const user = await User.findById(req.user.userId).populate({
    path: "savedArticles",
    options: { sort: { publishedAt: -1 } }
  });

  res.json({ savedArticles: user?.savedArticles ?? [] });
});
