import express from "express";
import { client } from "../index.js";
const router = express.Router();

function generateUrl() {
  let genresult = "";
  let char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charlength = char.length;
  for (let i = 0; i < 5; i++) {
    genresult += char.charAt(Math.floor(Math.random() * charlength));
  }

  return genresult;
}

async function check() {
  let shorturl = generateUrl();
  const isshortexist = await client
    .db("urlshortner")
    .collection("url")
    .findOne({ short: shorturl });

  if (isshortexist) {
    check();
  } else {
    return shorturl;
  }
}
router.post("/createshorturl", async (req, res) => {
  const { long } = req.body;
  const isurlexist = await client
    .db("urlshortner")
    .collection("url")
    .findOne({ long: long });
  if (!isurlexist) {
    let short = await check();
    const result = await client
      .db("urlshortner")
      .collection("url")
      .insertMany([{ long: long, short: short }]);
    res.send(result);
  }
});
router.get("/geturl", async (req, res) => {
  const filter = req.body;
  const result = await client
    .db("urlshortner")
    .collection("url")
    .find(filter)
    .toArray();
  res.send(result);
});
router.get("/:shortUrl", async (req, res) => {
  const shortUrl = await client
    .db("urlshortner")
    .collection("url")
    .findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);

  res.redirect(shortUrl.long);
});

export default router;
