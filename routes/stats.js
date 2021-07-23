const { resolveInclude } = require("ejs");
var express = require("express");
let connection;
var router = express.Router();
var lib = require("../libs/valera.js");

router.get("/get_income_stats", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  // req.query.date_from = "2021-07-21";
  // req.query.date_to = "2021-07-22";

  console.log(await GET_workers(connection));
  console.log(await GET_admins(connection));
  console.log(await GET_smena(connection, req));

  res.json(ans);
});

router.get("/get_zp_stats", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  res.json(ans);
});

router.get("/get_worker_stats", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  res.json(ans);
});

async function GET_orders_stat(connection, req) {
  return new Promise((resolve) => {
    connection.query(
      "select admin_id, open_ts, smena_id from smena where close_ts=0 and admin_id=?;",
      [admin_id],
      (err, res) => {
        resolve(res);
      }
    );
  });
}

async function GET_smena(connection, req) {
  return new Promise((resolve) => {
    connection.query(
      "select admin_id, open_ts, close_ts, smena_id from smena where date(open_ts) >= ? and date(close_ts) <= ?;",
      [req.query.date_from, req.query.date_from],
      (err, res) => {
        let __res = {};
        res.forEach((element) => {
          __res[element.smena_id] = {
            open_ts: element.open_ts,
            close_ts: element.close_ts,
            admin_id: element.admin_id,
          };
        });
        resolve(__res);
      }
    );
  });
}

async function GET_workers(connection) {
  return new Promise((resolve) => {
    connection.query("select worker_id, name from workers;", [], (err, res) => {
      let __res = {};
      res.forEach((element) => {
        __res[element.worker_id] = element.name;
      });
      resolve(__res);
    });
  });
}

async function GET_admins(connection) {
  return new Promise((resolve) => {
    connection.query(
      "select user_id as admin_id, user_name as name from users where role='admin';",
      [],
      (err, res) => {
        let __res = {};
        res.forEach((element) => {
          __res[element.admin_id] = element.name;
        });
        resolve(__res);
      }
    );
  });
}

function setConnection(conn) {
  connection = conn;
}

module.exports = router;
module.exports.setConnection = setConnection;
