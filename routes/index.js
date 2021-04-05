var express = require("express");
var router = express.Router();

router.post("/", function (req, res, next) {
  res.end("Valera backend");
});

router.get("/", function (req, res, next) {
  res.end("Valera backend");
});

module.exports = router;
