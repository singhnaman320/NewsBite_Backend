import { connectDatabase } from "../config/db";
import { defaultFeeds } from "../constants/defaultFeeds";
import { AdCampaign } from "../models/AdCampaign";
import { FeedAgent } from "../models/FeedAgent";

const sampleAds = [
  {
    title: "Build faster with Atlas",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
    targetLink: "https://www.mongodb.com/products/platform/atlas-database",
    description: "Managed MongoDB for modern product teams.",
    ctaLabel: "Explore Atlas",
    topics: ["Technology", "Business"],
    isActive: true,
  },
  {
    title: "Morning Brew for business leaders",
    imageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    targetLink: "https://www.morningbrew.com/",
    description: "Daily business updates in a five-minute read.",
    ctaLabel: "Read now",
    topics: ["Business", "General"],
    isActive: true,
  },
];

const runSeed = async () => {
  await connectDatabase();

  for (const feed of defaultFeeds) {
    await FeedAgent.findOneAndUpdate(
      { rssUrl: feed.rssUrl },
      {
        $set: feed,
      },
      { upsert: true },
    );
  }

  for (const ad of sampleAds) {
    await AdCampaign.findOneAndUpdate(
      { title: ad.title },
      {
        $set: ad,
      },
      { upsert: true },
    );
  }

  console.log("Seed complete.");
  process.exit(0);
};

runSeed().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});
