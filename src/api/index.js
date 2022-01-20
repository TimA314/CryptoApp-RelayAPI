const express = require("express");

const cryptoApp = require("./crypto-app");
const cryptoNews = require("./crypto-news");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/crypto-app", cryptoApp);
router.use("/crypto-news", cryptoNews);

module.exports = router;
