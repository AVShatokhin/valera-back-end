var express = require("express");
let connection;
var router = express.Router();
var lib = require("../libs/valera.js");

router.get("/drop_wheels", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  res.json(await COSTS_drop_wheels(connection, ans, req));
});

async function COSTS_drop_wheels(connection, ans, req) {
  return new Promise((resolve) => {
    connection.query(`delete from costs_wheels;`, [], (err, res) => {
      lib.proceed(ans, err, res);
      resolve(ans);
    });
  });
}

router.get("/drop_all", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  res.json(await COSTS_drop_all(connection, ans, req));
});

async function COSTS_drop_all(connection, ans, req) {
  return new Promise((resolve) => {
    connection.query(`delete from costs;`, [], (err, res) => {
      lib.proceed(ans, err, res);
      resolve(ans);
    });
  });
}

router.post("/set_all_wheels", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  res.json(await COSTS_set_all_wheels(connection, ans, req));
});

async function COSTS_set_all_wheels(connection, ans, req) {
  return new Promise((resolve) => {
    let sql = [];

    req.body.forEach((e) => {
      sql.push(
        `(${e.cost_id}, ${e.radius}, ${e.profile}, ${e.runflat}, ${e.cost})`
      );
    });

    // `(${e.cost_id}, ${req.body[cost_id].radius}, ${req.body[cost_id].profile}, ${req.body[cost_id].runflat}, ${req.body[cost_id].cost})`

    connection.query(
      `replace costs_wheels (cost_id, radius, profile, runflat, cost) values ${sql.join(
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

router.post("/set_all", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  res.json(await COSTS_set_all(connection, ans, req));
});

async function COSTS_set_all(connection, ans, req) {
  return new Promise((resolve) => {
    let sql = [];
    for (cost_id in req.body) {
      sql.push(
        `(${cost_id}, "${req.body[cost_id].name}", ${req.body[cost_id].cost})`
      );
    }

    connection.query(
      `replace costs (cost_id, name, cost) values ${sql.join(",")};`,
      [],
      (err, res) => {
        lib.proceed(ans, err, res);
        resolve(ans);
      }
    );
  });
}

router.get("/get_all_wheels", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  res.json(await COSTS_get_all_wheels(connection, ans));
});

async function COSTS_get_all_wheels(connection, ans) {
  return new Promise((resolve) => {
    connection.query(
      `select cost_id, radius, profile, runflat, cost from costs_wheels order by cost_id;`,
      [],
      (err, res) => {
        lib.proceed(ans, err, res);
        resolve(ans);
      }
    );
  });
}

router.get("/get_all", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  res.json(await COSTS_get_all(connection, ans));
});

async function COSTS_get_all(connection, ans) {
  return new Promise((resolve) => {
    connection.query(
      `select cost_id, name, cost from costs order by cost_id;`,
      [],
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
