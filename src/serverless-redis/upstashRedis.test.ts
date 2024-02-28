import { createUpstashRedisDatabase } from "./upstashRedis.js";

const test = async () => {
  createUpstashRedisDatabase({ upstashApiKey: "", upstashEmail: "" }).then(
    console.log,
  );
};
test();
