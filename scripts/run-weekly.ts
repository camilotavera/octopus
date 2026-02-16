import "dotenv/config";
import { runWeekly } from "../src/orchestration/runWeekly";
import { createLogger } from "../src/utils/logger";

const logger = createLogger("scripts:run-weekly");

runWeekly()
  .then((page) => {
    logger.info("Created Notion page", { pageId: page.id });
  })
  .catch((err) => {
    logger.error("Weekly run failed", { error: err });
    process.exit(1);
  });
