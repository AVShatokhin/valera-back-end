var express = require("express");
var router = express.Router();

router.post("/create", function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  res.json(ans);
});

module.exports = router;
