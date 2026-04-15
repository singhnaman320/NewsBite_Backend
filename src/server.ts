import { app } from "./app";
import { connectDatabase } from "./config/db";
import { env } from "./config/env";
import { startFeedScheduler } from "./jobs/feedScheduler";

const bootstrap = async () => {
  await connectDatabase();
  startFeedScheduler();

  app.listen(env.port, () => {
    console.log(`NewsBite server is running on http://localhost:${env.port}`);
  });
};

bootstrap().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
