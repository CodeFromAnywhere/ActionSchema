import { mergeObjectsArray } from "js-util";

/**
 * A fetch that always shows if there's something wrong with HTTP stuff etc
 */
export const cleanFetch = async (
  details: { apiUrl: string; headers: string; method: string },
  context: any,
): Promise<{
  isSuccessful: boolean;
  result: any;
  error?: string;
  responseText?: string;
  context?: any;
  headers?: any;
}> => {
  try {
    const abortController = new AbortController();
    const id = setTimeout(() => abortController.abort(), 300 * 1000);

    console.log({ details, context });
    const result = await fetch(details.apiUrl, {
      method: details.method,
      signal: abortController.signal,
      headers: {
        ...JSON.parse(details.headers),
        // Forced headers, we only support JSON apis
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: context ? JSON.stringify(context) : undefined,
    })
      .then(async (response) => {
        let error = "";
        if (
          !response.ok ||
          !response.headers.get("Content-Type")?.includes("json")
        ) {
          error += `"Response not ok, status: ${response.status}, statusText: ${response.statusText}`;
        }

        const responseText = await response.text();

        try {
          return { isSuccessful: true, result: JSON.parse(responseText) };
        } catch (e) {
          const headers = JSON.stringify(
            mergeObjectsArray(
              Array.from(response.headers.keys()).map((key) => ({
                [key]: response.headers.get(key),
              })),
            ),
          );

          return {
            isSuccessful: false,
            error,
            responseText,
            context,
            headers,
            result: undefined,
          };
        }
      })
      .catch((e) => {
        return {
          isSuccessful: false,

          result: undefined,
          error: `Your request could not be executed, you may be disconnected or the server may not be available. `,
          errorStatus: e.status,
          errorString: String(e),
          context,
        };
      });

    clearTimeout(id);

    return result;
  } catch (e) {
    return {
      isSuccessful: false,
      message:
        "The API didn't resolve, and the fetch crashed because of it: " +
        String(e),
    } as any;
  }
};
