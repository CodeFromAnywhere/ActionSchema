/** Fetch the stateless function */
export const recurseExecute = (context) => {
    fetch("https://actionschema.com/api/execute", {
        method: "POST",
        body: JSON.stringify(context),
        headers: {},
    });
};
//# sourceMappingURL=recurseExecute.js.map