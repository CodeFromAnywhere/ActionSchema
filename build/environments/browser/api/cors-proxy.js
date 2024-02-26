/** Simple stateless proxy so API requests can be sent like normal from the browser */
export const CorsProxy = async (req, res) => {
    const url = Array.isArray(req.query.url) ? req.query.url[0] : req.query.url;
    if (!url) {
        res.status(301);
        return;
    }
    console.log({ url });
    try {
        const resProxy = await fetch(url);
        const text = await resProxy.text();
        res.status(200).send(text);
    }
    catch (error) {
        res.status(400).send(error.toString());
    }
};
export default CorsProxy;
//# sourceMappingURL=cors-proxy.js.map