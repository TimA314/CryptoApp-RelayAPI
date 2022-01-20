const express = require("express");
const axios = require("axios");
const router = express.Router();

const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");

const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 50,
});

const speedLimiter = slowDown({
  windowMs: 60 * 1000,
  delayAfter: 1,
  delayMs: 1000,
});

const BASE_URL = "https://bing-news-search1.p.rapidapi.com/";

let cachedNews;
let cachedTime;

router.get("/", limiter, speedLimiter, async (req, res, next) => {
  if (cachedTime && cachedTime > Date.now() - 60 * 1000) {
    return res.json(cachedNews);
  }

  try {
    const newsCategory = req.query.newsCategory;
    const count = req.query.count;

    const { data } = await axios.get(
      `${BASE_URL}/news/search?q=${newsCategory}&safeSearch=Off&textFormat=Raw&freshness=Day&count=${count}`,
      {
        headers: {
          "x-bingapis-sdk": "true",
          "x-rapidapi-host": "bing-news-search1.p.rapidapi.com",
          "x-rapidapi-key": process.env.CRYPTO_NEWS_API_KEY,
        },
      }
    );
    cachedNews = data;
    console.log(data);
    cachedTime = Date.now();
    data.cachedTime = cachedTime;
    return res.json(cachedNews);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
