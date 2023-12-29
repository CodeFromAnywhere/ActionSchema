import { generateRandomString } from "model-types";
export const getIndexFromId = (key) => {
    const index = key?.split("_")[1]?.replace(/\D/g, "");
    return isNaN(Number(index)) ? 1 : Number(index);
};
export const addLeadingZeros = (id) => {
    const leadingZerosAmount = 12 - String(id).length;
    const leadingZeros = "0".repeat(leadingZerosAmount < 1 ? 0 : leadingZerosAmount);
    const finalId = leadingZeros + String(id);
    return finalId;
};
export const generateActionSchemaId = (startIndex, index) => {
    return `id_${addLeadingZeros(startIndex + index)}_${generateRandomString(6)}`;
};
//# sourceMappingURL=JsonArray.js.map