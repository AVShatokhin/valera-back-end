var express = require("express");
let connection;
var router = express.Router();
var lib = require("../libs/valera.js");

router.post("/set_all", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  res.json(await COSTS_set_all(connection, ans, req));
});

router.get("/get_all", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  res.json(await COSTS_get_all(connection, ans));
});

function setConnection(conn) {
  connection = conn;
}

async function COSTS_set_all(connection, ans, req) {
  return new Promise((resolve) => {
    let sql = [];
    for (cost_id in req.body) {
      sql.push(
        `(${cost_id}, ${req.body[cost_id].radius}, ${req.body[cost_id].profile}, ${req.body[cost_id].runflat}, ${req.body[cost_id].cost})`
      );
    }

    connection.query(
      `replace costs (cost_id, radius, profile, runflat, cost) values ${sql.join(
        ","
      )};`,
      [],
      (err, res) => {
        lib.proceed(ans, err, res);
        resolve(ans);
      }
    );
  });
}

async function COSTS_get_all(connection, ans) {
  return new Promise((resolve) => {
    connection.query(
      `select cost_id, radius, profile, runflat, cost from costs order by cost_id;`,
      [],
      (err, res) => {
        lib.proceed(ans, err, res);
        resolve(ans);
      }
    );
  });
}

module.exports = router;
module.exports.setConnection = setConnection;
