import { executeServerless } from "./executeServerless.js";
import { tryParseJson } from "../util/tryParseJson.js";
/**
 * Used for serverless API execution
 */
export const executeApi = async (req, res) => {
    const context = tryParseJson(req.body);
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
    const originUrl = req.headers.origin;
    const result = await executeServerless(context, originUrl);
    res.status(200).json(result);
};
//# sourceMappingURL=executeApi.js.map