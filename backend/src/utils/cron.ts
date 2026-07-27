import cron from "node-cron";

const SERVER_URL = process.env.SERVER_URL ?? "http://localhost:5000";

cron.schedule("*/14 * * * *", async () => {
  try {
    const res = await fetch(`${SERVER_URL}/health`);

    console.log(
      `[CRON] Ping successful (${res.status}) - ${new Date().toISOString()}`,
    );
  } catch (error) {
    console.error("[CRON] Ping failed:", error);
  }
});
