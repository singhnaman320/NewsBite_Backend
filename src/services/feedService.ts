import { FilterQuery } from "mongoose";

import { AdCampaign } from "../models/AdCampaign";
import { Article } from "../models/Article";
import { User } from "../models/User";

type FeedQuery = {
  userId: string;
  tab: string;
  page: number;
  limit: number;
};

const adStride = 4;
const fallbackTopics = ["General", "World", "Technology", "Business"];

export const getSavedArticles = async (userId: string) => {
  const user = await User.findById(userId).select("savedArticles");
  const savedIds = user?.savedArticles ?? [];

  return Article.find({ _id: { $in: savedIds } }).sort({ publishedAt: -1 });
};

export const getFeedBundle = async ({ userId, tab, page, limit }: FeedQuery) => {
  const user = await User.findById(userId);
  if (!user) {
    return {
      items: [],
      page,
      hasMore: false,
      totalItems: 0,
      totalPages: 0,
      tabs: []
    };
  }

  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, limit);
  const tabs = ["For You", ...user.preferences, "Saved"];

  if (tab === "Saved") {
    const savedIds = user.savedArticles ?? [];
    const totalItems = savedIds.length;
    const totalPages = totalItems > 0 ? Math.ceil(totalItems / safeLimit) : 1;
    const skip = (safePage - 1) * safeLimit;
    const saved = await Article.find({ _id: { $in: savedIds } })
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(safeLimit + 1);
    const hasMore = saved.length > safeLimit;
    const pageArticles = hasMore ? saved.slice(0, safeLimit) : saved;

    return {
      items: pageArticles.map((article) => ({
        kind: "article" as const,
        article
      })),
      page: safePage,
      hasMore,
      totalItems,
      totalPages,
      tabs
    };
  }

  const filter: FilterQuery<(typeof Article)["schema"]> = {};

  if (tab === "For You") {
    filter.topic = { $in: user.preferences.length > 0 ? user.preferences : fallbackTopics };
  } else if (tab) {
    filter.topic = tab;
  }

  const skip = (safePage - 1) * safeLimit;
  const totalItems = await Article.countDocuments(filter);
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / safeLimit) : 1;
  const articles = await Article.find(filter).sort({ publishedAt: -1 }).skip(skip).limit(safeLimit + 1);
  const hasMore = articles.length > safeLimit;
  const pageArticles = hasMore ? articles.slice(0, safeLimit) : articles;

  const matchingTopics = tab === "For You" ? user.preferences : tab ? [tab] : user.preferences;

  const ads = await AdCampaign.find({
    isActive: true,
    $or: [{ topics: { $size: 0 } }, { topics: { $in: matchingTopics } }]
  }).limit(Math.max(1, Math.ceil(pageArticles.length / adStride)));

  const items: Array<
    | { kind: "article"; article: unknown }
    | { kind: "ad"; ad: unknown; placementIndex: number }
  > = [];

  pageArticles.forEach((article, index) => {
    items.push({ kind: "article", article });

    const adIndex = Math.floor((index + 1) / adStride) - 1;
    const shouldInjectAd = (index + 1) % adStride === 0 && ads[adIndex];

    if (shouldInjectAd) {
      items.push({
        kind: "ad",
        ad: ads[adIndex],
        placementIndex: index + 1
      });
    }
  });

  return {
    items,
    page: safePage,
    hasMore,
    totalItems,
    totalPages,
    tabs
  };
};
