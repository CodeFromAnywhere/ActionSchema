import { O } from "js-util";
import { generateRandomString } from "model-types";

export type ActionSchemaPrivacy = "public" | "unlisted" | "private";
export type ActionSchemaStatus = "queued" | "waiting" | "busy" | "done";
export const getIndexFromId = (key: string | undefined) => {
  const index = key?.split("_")[1]?.replace(/\D/g, "");
  return isNaN(Number(index)) ? 1 : Number(index);
};
export const addLeadingZeros = (id: number) => {
  const leadingZerosAmount = 12 - String(id).length;

  const leadingZeros = "0".repeat(
    leadingZerosAmount < 1 ? 0 : leadingZerosAmount,
  );
  const finalId = leadingZeros + String(id);
  return finalId;
};
export const generateActionSchemaId = (startIndex: number, index: number) => {
  return `id_${addLeadingZeros(startIndex + index)}_${generateRandomString(6)}`;
};
/**
 * NB: the priceCredit here has already taken the cost multiplier into account!
 */
export type GridSpending = {
  priceCredit?: number;
  calculationsAmount?: number;
  priceCreditSinceLastEdit?: number;
  calculationsAmountSinceLastEdit?: number;
};

export type PublicTable = {
  isPinned: boolean;
  createdAt: number;
  category: string | undefined;
  updatedAt: number | undefined;
  projectRelativePath: string;
  schemaDescription: string | undefined;
  pluginsAmount: number;
  itemsAmount: number;
  projectSizeBytes?: number;
  totalSpending?: GridSpending;
  columnSpending?: { [columnKey: string]: GridSpending };
};

export type JsonArray<T extends O = O> = {
  $schema: string;
  items: T[];
} & ActionSchemaDb;

/** key values for lmdb */
export interface ActionSchemaDb {
  /** Defaults to "unlisted" for new tables and "private" for imported tables */
  privacy?: ActionSchemaPrivacy;
  /** can be filled by user */
  category?: string;
  /** status indicating whether or not rows are being generated */
  rowGenerationStatus?: ActionSchemaStatus;
  /** State concerning the status of (re)calculation behavior */
  status?: JsonArrayStatus;
  lastOperationAt?: number;
  lastSizeCalculatedAt?: number;
  projectSizeBytes?: number;

  delta?: JsonStatusDelta[];

  /** to keep track of spending */
  columnSpending?: {
    [columnKey: string]: GridSpending;
  };

  totalSpending?: GridSpending;
}

export type JsonArrayStatus = {
  [rowId: string]:
    | { [key: string]: ActionSchemaStatus | undefined }
    | undefined;
};

/**
 * To be kept in the db
 *
 * To be fetched every 1 second if the user is in the file. Is reset every time it is requested, and the delta transforms cell values one by one.
 *
 * Needed in order to not require to do any refetches when things are loading, while showing loading indicators right.
 */
export type JsonStatusDelta = {
  rowId?: string;
  propertyKey?: string;
  /**
   * This indicates the newValue contains an array of items. Should be done and awaited first if this is the case.
   */
  isSourcePluginUpdate?: boolean;
  newStatus: ActionSchemaStatus;
  newValue?: any;
};
