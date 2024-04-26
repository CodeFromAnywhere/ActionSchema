import { ExecuteContext, ExecuteResult } from "../types.js";
import Piscina from "piscina";

const piscina = new Piscina({
  // The URL must be a file:// URL
  filename: new URL("./executeServerWorker.js", import.meta.url).href,
});

/**
Server wrapper around `execute` that ensures every execution request is carried out in a worker

NB: This doesn't have any awareness yet of the user. databaseId can be set accordingly
*/
export const executeServer = async (
  context: ExecuteContext,
): Promise<ExecuteResult> => {
  // Execute plugin and set result
  const result = await piscina.run(context);
  return result;
};
