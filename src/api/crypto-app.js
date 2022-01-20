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

const BASE_URL = "https://coinranking1.p.rapidapi.com/";

let cachedCrypto;
let cacheCryptoTime;

router.get("/", limiter, speedLimiter, async (req, res, next) => {
  if (cacheCryptoTime && cacheCryptoTime > Date.now() - 60 * 1000) {
    return res.json(cachedCrypto);
  }

  try {
    const count = req.query.count;
    console.log(count);
    const { data } = await axios.get(`${BASE_URL}/coins?limit=${count}`, {
      headers: {
        "x-rapidapi-host": "coinranking1.p.rapidapi.com",
        "x-rapidapi-key": process.env.CRYPTO_API_KEY,
      },
    });
    cachedCrypto = data;
    cacheCryptoTime = Date.now();
    data.cacheCryptoTime = cacheCryptoTime;
    return res.json(data);
  } catch (error) {
    return next(error);
  }
});

let cachedDetails;
let cacheDetailsTime;

router.get("/details", limiter, speedLimiter, async (req, res, next) => {
  if (cacheDetailsTime && cacheDetailsTime > Date.now() - 60 * 1000) {
    return res.json(cachedDetails);
  }

  try {
    const coinId = req.query.coinId;
    const { data } = await axios.get(`${BASE_URL}/coin/${coinId}`, {
      headers: {
        "x-rapidapi-host": "coinranking1.p.rapidapi.com",
        "x-rapidapi-key": process.env.CRYPTO_API_KEY,
      },
    });
    cachedDetails = data;
    cacheDetailsTime = Date.now();
    data.cacheTime = cacheDetailsTime;
    return res.json(data);
  } catch (error) {
    return next(error);
  }
});

let cachedHistory;
let cacheHistoryTime;

router.get("/history", limiter, speedLimiter, async (req, res, next) => {
  if (cacheHistoryTime && cacheHistoryTime > Date.now() - 60 * 1000) {
    return res.json(cachedHistory);
  }

  try {
    const coinId = req.query.coinId;
    const timePeriod = req.query.timePeriod;
    const { data } = await axios.get(
      `${BASE_URL}/coin/${coinId}/history?timePeriod=${timePeriod}`,
      {
        headers: {
          "x-rapidapi-host": "coinranking1.p.rapidapi.com",
          "x-rapidapi-key": process.env.CRYPTO_API_KEY,
        },
      }
    );
    cachedHistory = data;
    cacheHistoryTime = Date.now();
    data.cacheTime = cacheHistoryTime;
    return res.json(cachedHistory);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
