var express = require("express");
let connection;
var router = express.Router();
var lib = require("../libs/valera.js");

router.post("/set", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  if (req.body.key != undefined) {
    await SET_KVS(connection, ans, req.body.key, req.body.value);
  } else {
    ans.status.error = "no key defined";
  }

  res.json(ans);
});

async function SET_KVS(connection, ans, key, value) {
  return new Promise((resolve) => {
    connection.query(
      "replace into kvs set link=?, value=?;",
      [key, value],
      (err, res) => {
        lib.proceed(ans, err, res);
        resolve(ans);
      }
    );
  });
}

router.get("/get", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  if (req.query.key != undefined) {
    await GET_KVS(connection, ans, req.query.key);
  } else {
    ans.status.error = "no key defined";
  }

  res.json(ans);
});

async function GET_KVS(connection, ans, key) {
  return new Promise((resolve) => {
    connection.query(
      `select value from kvs where link=?;`,
      [key],
      (err, res) => {
        lib.proceed(ans, err, res);
        resolve(ans);
      }
    );
  });
}

function setConnection(conn) {
  connection = conn;
}

module.exports = router;
module.exports.setConnection = setConnection;
