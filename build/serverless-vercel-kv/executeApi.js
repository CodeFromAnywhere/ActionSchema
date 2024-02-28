import { executeServerless } from "./executeServerless.js";
/**
 * Used for serverless API execution
 */
export const executeApi = async (req, res) => {
    const context = req.body;
    const result = await executeServerless(context);
    res.status(200).json(result);
};
//# sourceMappingURL=executeApi.js.map