import Parser from "rss-parser";

import { Article } from "../models/Article";
import { FeedAgent } from "../models/FeedAgent";
import { hashValue } from "../utils/hash";

type ParsedItem = {
  title?: string;
  link?: string;
  pubDate?: string;
  isoDate?: string;
  contentSnippet?: string;
  content?: string;
  creator?: string;
  author?: string;
  guid?: string;
  enclosure?: {
    url?: string;
  };
};

const parser = new Parser<Record<string, never>, ParsedItem>();

const extractImageUrl = (item: ParsedItem) => item.enclosure?.url;

const formatFeedErrorMessage = (sourceName: string, error: unknown) => {
  const rawMessage = error instanceof Error ? error.message : "Unknown feed fetch error.";

  if (/status code\s*503/i.test(rawMessage)) {
    return `${sourceName} is temporarily unavailable right now. Please try again in a few minutes.`;
  }

  if (/status code\s*404/i.test(rawMessage)) {
    return `${sourceName} feed could not be found. Please verify the RSS URL.`;
  }

  if (/timeout|timed out/i.test(rawMessage)) {
    return `${sourceName} took too long to respond. Please try again shortly.`;
  }

  return `Unable to fetch the ${sourceName} feed right now. Please try again later.`;
};

export const syncAgentFeed = async (agentId: string) => {
  const agent = await FeedAgent.findById(agentId);
  if (!agent || !agent.isActive) {
    return { imported: 0, skipped: true };
  }

  try {
    const feed = await parser.parseURL(agent.rssUrl);
    let imported = 0;

    for (const item of feed.items ?? []) {
      if (!item.link && !item.guid && !item.title) {
        continue;
      }

      const sourceKey = item.link ?? item.guid ?? `${agent.sourceName}:${item.title}`;
      const link = item.link ?? sourceKey;

      await Article.findOneAndUpdate(
        { linkHash: hashValue(sourceKey) },
        {
          $setOnInsert: {
            title: item.title ?? "Untitled article",
            description: item.contentSnippet ?? item.content ?? "",
            contentSnippet: item.contentSnippet ?? "",
            link,
            linkHash: hashValue(sourceKey),
            publishedAt: new Date(item.isoDate ?? item.pubDate ?? Date.now()),
            sourceName: agent.sourceName,
            topic: agent.topic,
            category: agent.category,
            imageUrl: extractImageUrl(item),
            author: item.creator ?? item.author,
            agentId: agent._id
          }
        },
        { upsert: true }
      );

      imported += 1;
    }

    agent.lastFetchedAt = new Date();
    agent.lastErrorAt = undefined;
    agent.lastErrorMessage = undefined;
    await agent.save();

    return {
      imported,
      skipped: false,
      message: `Feed sync completed for ${agent.sourceName}. Imported ${imported} article records.`
    };
  } catch (error) {
    const formattedErrorMessage = formatFeedErrorMessage(agent.sourceName, error);
    agent.lastErrorAt = new Date();
    agent.lastErrorMessage = formattedErrorMessage;
    await agent.save();
    return { imported: 0, skipped: false, error: formattedErrorMessage };
  }
};

export const syncDueFeeds = async () => {
  const agents = await FeedAgent.find({ isActive: true });
  const now = Date.now();
  const dueAgents = agents.filter((agent) => {
    if (!agent.lastFetchedAt) {
      return true;
    }

    const nextRunAt = agent.lastFetchedAt.getTime() + agent.fetchIntervalMinutes * 60000;
    return nextRunAt <= now;
  });

  const results = [];
  for (const agent of dueAgents) {
    results.push(await syncAgentFeed(agent.id));
  }

  return results;
};
