import { create, update } from "fsorm-lmdb";
import { getAvailablePersonSlug } from "fsorm-util";
import { humanCase } from "convert-case";
export const signupWithoutDetailsWithContext = async (functionContext) => {
    if (functionContext.me_personSlug) {
        return { isSuccessful: true, message: "You already have an account" };
    }
    // no account yet, let's create one with authToken
    if (!functionContext.authToken) {
        return { isSuccessful: false, message: "No auth token found" };
    }
    await signupGuest(functionContext.authToken);
    return { isSuccessful: true, message: "Created" };
};
signupWithoutDetailsWithContext.config = {
    isPublic: true,
};
export const signupGuest = async (authToken) => {
    const finalSlug = getAvailablePersonSlug("Guest");
    // create a person
    await update("Device", (item) => ({
        ...item,
        currentPersonSlug: finalSlug,
        personSlugs: [finalSlug],
    }), { authToken });
    await create("Person", {
        // NB: need to assert Person because it's never giving undefined
        name: humanCase(finalSlug),
        slug: finalSlug,
        createdAt: Date.now(),
        actionSchemaHeaders: [
            {
                origin: "http://localhost:42000",
                header: "Authorization",
                value: `Bearer ${authToken}`,
            },
            {
                origin: "https://api.actionschema.com",
                header: "Authorization",
                value: `Bearer ${authToken}`,
            },
            {
                origin: `https://${finalSlug}.actionschema.com`,
                header: "Authorization",
                value: `Bearer ${authToken}`,
            },
        ],
    });
};
//# sourceMappingURL=signupWithoutDetailsWithContext.js.map