const express = require("express");

const cryptoApp = require("./crypto-app");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/crypto-app", cryptoApp);

module.exports = router;
