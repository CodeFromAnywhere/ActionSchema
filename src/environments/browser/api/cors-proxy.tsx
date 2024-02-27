import { NextApiHandler } from "next";

/** Simple stateless proxy so API requests can be sent like normal from the browser. Works for GET Requests */
export const CorsProxy: NextApiHandler = async (req, res) => {
  const url = Array.isArray(req.query.url) ? req.query.url[0] : req.query.url;
  console.log({ url });
  if (!url) {
    res.status(301);
    return;
  }
  try {
    const resProxy = await fetch(url);
    const text = await resProxy.text();
    res.status(200).send(text);
  } catch (error: any) {
    console.log(error);
    res.status(400).send(error.toString());
  }
};

export default CorsProxy;
