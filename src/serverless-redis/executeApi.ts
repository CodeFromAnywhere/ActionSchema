import type { NextApiHandler } from "next";
import { executeServerless } from "./executeServerless.js";
import { tryParseJson } from "../util/tryParseJson.js";
import { ExecuteContext, UpstashStorageDetails } from "../types/types.js";

/**
 * Used for serverless API execution
 */
export const executeApi: NextApiHandler = async (req, res) => {
  const context = tryParseJson(req.body) as
    | (ExecuteContext & UpstashStorageDetails)
    | null;

  if (!req.url) {
    res.status(200).json({ isSuccessful: false, message: "No URL" });
    return;
  }

  if (!context) {
    res
      .status(200)
      .json({ isSuccessful: false, message: "Couldn't parse json" });
    return;
  }

  const originUrl = req.headers.origin!;

  const result = await executeServerless(context, originUrl);
  res.status(200).json(result);
};
