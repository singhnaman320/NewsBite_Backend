import cron from "node-cron";

import { syncDueFeeds } from "../services/feedFetcherService";

export const startFeedScheduler = () => {
  cron.schedule("* * * * *", async () => {
    await syncDueFeeds();
  });
};
