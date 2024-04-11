import { createUpstashRedisDatabase } from "./upstashRedis.js";
const test = async () => {
    createUpstashRedisDatabase({ upstashApiKey: "", upstashEmail: "" }).then(console.log);
};
test();
//# sourceMappingURL=upstashRedis.test.js.map