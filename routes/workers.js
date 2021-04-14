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

  res.json(await WORKER_create(connection, ans, req));
});

router.post("/change", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  res.json(await WORKER_change(connection, ans, req));
});

router.get("/delete", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  if (req.query.worker_id != undefined) {
    await WORKER_delete(connection, ans, req.query.worker_id);
  } else {
    ans.status.error = "bad worker_id";
  }

  res.json(ans);
});

function setConnection(conn) {
  connection = conn;
}

router.get("/get_all", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  res.json(await WORKER_get_all(connection, ans));
});

router.get("/get", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  res.json(await WORKER_get(connection, ans, req));
});

async function WORKER_create(connection, ans, req) {
  return new Promise((resolve) => {
    connection.query(
      `insert into workers set name=?;`,
      [req.body.name],
      (err, res) => {
        lib.proceed(ans, err, res);
        resolve(ans);
      }
    );
  });
}

async function WORKER_change(connection, ans, req) {
  return new Promise((resolve) => {
    connection.query(
      `update workers set name=? where worker_id=?;`,
      [req.body.name, req.body.worker_id],
      (err, res) => {
        lib.proceed(ans, err, res);
        resolve(ans);
      }
    );
  });
}

async function WORKER_delete(connection, ans, worker_id) {
  return new Promise((resolve) => {
    connection.query(
      `delete from workers where worker_id=? limit 1;`,
      [worker_id],
      (err, res) => {
        lib.proceed(ans, err, res);
        resolve(ans);
      }
    );
  });
}

async function WORKER_get_all(connection, ans) {
  return new Promise((resolve) => {
    connection.query(
      `select worker_id, name from workers order by worker_id;`,
      [],
      (err, res) => {
        lib.proceed(ans, err, res);
        resolve(ans);
      }
    );
  });
}

async function WORKER_get(connection, ans, req) {
  return new Promise((resolve) => {
    connection.query(
      "select worker_id, name from workers where worker_id = ?;",
      [req.query.worker_id],
      (err, res) => {
        lib.proceed(ans, err, res);
        resolve(ans);
      }
    );
  });
}

module.exports = router;
module.exports.setConnection = setConnection;
