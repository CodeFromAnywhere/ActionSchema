import fs from "node:fs";

const string = fs.readFileSync("/Users/king/os/appleAppData.json", "utf8");
const json = JSON.parse(string);

const filtered = json.filter((x: any) => x.Reviews >= 100);

// fs.writeFileSync(
//   "/Users/king/os/filteredAppData.json",
//   JSON.stringify(filtered),
//   "utf8",
// );

console.log(filtered.length);
