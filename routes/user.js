var express = require("express");
let connection;
var router = express.Router();
var lib = require("../libs/valera.js");

router.post("/create", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  await lib.USER_create(
    connection,
    ans,
    req.body.user_name,
    req.body.password,
    req.body.role
  );

  res.json(ans);
});

router.post("/update", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  await lib.USER_update(
    connection,
    ans,
    req.body.password,
    req.body.role,
    req.body.user_id
  );

  res.json(ans);
});

router.post("/login", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  await lib.USER_login(connection, ans, req.body.user_name, req.body.password);

  res.json(ans);
});

router.get("/delete", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  if (req.query.user_id != undefined) {
    await lib.USER_delete(connection, ans, req.query.user_id);
  } else {
    ans.status.error = "bad user_id";
  }

  res.json(ans);
});

function setConnection(conn) {
  connection = conn;
}

module.exports = router;
module.exports.setConnection = setConnection;
