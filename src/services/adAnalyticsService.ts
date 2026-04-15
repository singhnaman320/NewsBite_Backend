import { Types } from "mongoose";

import { AdCampaign } from "../models/AdCampaign";
import { AdEvent } from "../models/AdEvent";

export const getAdAnalytics = async () => {
  const ads = await AdCampaign.find().sort({ createdAt: -1 });

  const viewAggregation = await AdEvent.aggregate<{
    _id: Types.ObjectId;
    uniqueViews: number;
  }>([
    { $match: { eventType: "view" } },
    { $group: { _id: { adId: "$adId", userId: "$userId" } } },
    { $group: { _id: "$_id.adId", uniqueViews: { $sum: 1 } } }
  ]);

  const clickAggregation = await AdEvent.aggregate<{
    _id: Types.ObjectId;
    totalClicks: number;
  }>([
    { $match: { eventType: "click" } },
    { $group: { _id: "$adId", totalClicks: { $sum: 1 } } }
  ]);

  const viewMap = new Map(viewAggregation.map((item) => [String(item._id), item.uniqueViews]));
  const clickMap = new Map(clickAggregation.map((item) => [String(item._id), item.totalClicks]));

  return ads.map((ad) => {
    const uniqueViews = viewMap.get(ad.id) ?? 0;
    const totalClicks = clickMap.get(ad.id) ?? 0;

    return {
      _id: ad.id,
      title: ad.title,
      topics: ad.topics,
      isActive: ad.isActive,
      uniqueViews,
      totalClicks,
      ctr: uniqueViews === 0 ? 0 : Number(((totalClicks / uniqueViews) * 100).toFixed(2))
    };
  });
};
