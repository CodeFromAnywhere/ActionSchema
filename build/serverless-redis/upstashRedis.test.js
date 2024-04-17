import { listUpstashRedisDatabases } from "./upstashRedis.js";
const test = async () => {
    listUpstashRedisDatabases({
        upstashApiKey: "",
        upstashEmail: "info@codefromanywhere.com",
    }).then(console.log);
};
test();
//# sourceMappingURL=upstashRedis.test.js.map