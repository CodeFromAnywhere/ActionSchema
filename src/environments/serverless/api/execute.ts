import { NextApiHandler } from "next";
import { executeServerless } from "../executeServerless.js";

/**
 * Used for serverless API execution
 */
export const ExecuteApi: NextApiHandler = async (req, res) => {
  const context = req.body;
  const result = await executeServerless(context);
  res.status(200).json(result);
};
