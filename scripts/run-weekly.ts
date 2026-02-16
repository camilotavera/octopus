import "dotenv/config";
import { runWeekly } from "../src/orchestration/runWeekly";

runWeekly()
  .then((page) => {
    // Notion returns a URL in some clients; otherwise just log the id.
    console.log("Created Notion page:", (page as any).id);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
