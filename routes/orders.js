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

  res.json(await ORDERS_create(connection, ans, req));
});

async function ORDERS_create(connection, ans, req) {
  return new Promise((resolve) => {
    connection.query(
      "insert into orders set admin_id=?, client_id=?, worker_id=?, order_number=?, order_works=?, ts_create=now();",
      [
        req.body.admin_id,
        req.body.client_id,
        req.body.worker_id,
        req.body.order_number,
        JSON.stringify(req.body.order_works),
      ],
      (err, res) => {
        lib.proceed(ans, err, res);
        resolve(ans);
      }
    );
  });
}

router.post("/change", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  res.json(await ORDERS_change(connection, ans, req));
});

async function ORDERS_change(connection, ans, req) {
  return new Promise((resolve) => {
    connection.query(
      "update orders set admin_id=?, client_id=?, worker_id=?, order_number=?, order_works=? where order_id=?",
      [
        req.body.admin_id,
        req.body.client_id,
        req.body.worker_id,
        req.body.order_number,
        JSON.stringify(req.body.order_works),
        req.body.order_id,
      ],
      (err, res) => {
        lib.proceed(ans, err, res);
        resolve(ans);
      }
    );
  });
}

router.get("/get_by_ts", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  res.json(await ORDERS_get_by_ts(connection, ans, req.query.last_ts));
});

async function ORDERS_get_by_ts(connection, ans, lts) {
  return new Promise((resolve) => {
    connection.query(
      "select unix_timestamp(lts) as last_ts, order_id, worker_id, client_id, admin_id, order_number, summ, payed, closed, order_works," +
        " DATE_FORMAT(ts_create, '%Y-%m-%d') as date_ts_create, TIME(ts_create) as time_ts_create," +
        " DATE_FORMAT(ts_close, '%Y-%m-%d') as date_ts_closed, TIME(ts_close) as time_ts_closed," +
        " DATE_FORMAT(ts_pay, '%Y-%m-%d') as date_ts_payed, TIME(ts_pay) as time_ts_payed from orders where lts > FROM_UNIXTIME(?);",
      [lts],
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

  res.json(await ORDERS_get_all(connection, ans));
});

async function ORDERS_get_all(connection, ans) {
  return new Promise((resolve) => {
    connection.query(
      "select unix_timestamp(lts) as last_ts, order_id, worker_id, client_id, admin_id, order_number, summ, payed, closed, order_works," +
        " DATE_FORMAT(ts_create, '%Y-%m-%d') as date_ts_create, TIME(ts_create) as time_ts_create," +
        " DATE_FORMAT(ts_close, '%Y-%m-%d') as date_ts_closed, TIME(ts_close) as time_ts_closed," +
        " DATE_FORMAT(ts_pay, '%Y-%m-%d') as date_ts_payed, TIME(ts_pay) as time_ts_payed from orders;",
      [],
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

  res.json(await ORDERS_get(connection, ans, req.query.admin_id));
});

async function ORDERS_get(connection, ans, admin_id) {
  return new Promise((resolve) => {
    connection.query(
      "select unix_timestamp(lts) as last_ts, order_id, worker_id, client_id, admin_id, order_number, summ, payed, closed, order_works," +
        " DATE(ts_create) as date_ts_create, TIME(ts_create) as time_ts_create," +
        " DATE(ts_close) as date_ts_closed, TIME(ts_close) as time_ts_closed," +
        " DATE(ts_pay) as date_ts_payed, TIME(ts_pay) as time_ts_payed from orders where admin_id=?;",
      [admin_id],
      (err, res) => {
        lib.proceed(ans, err, res);
        resolve(ans);
      }
    );
  });
}

router.get("/delete", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  if (req.query.order_id != undefined) {
    await ORDERS_delete(connection, ans, req.query.order_id);
  } else {
    ans.status.error = "bad order_id";
  }
  res.json(ans);
});

async function ORDERS_delete(connection, ans, order_id) {
  return new Promise((resolve) => {
    connection.query(
      `delete from orders where order_id=? limit 1;`,
      [order_id],
      (err, res) => {
        lib.proceed(ans, err, res);
        resolve(ans);
      }
    );
  });
}

router.get("/pay", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  if (req.query.order_id != undefined) {
    await ORDERS_pay(connection, ans, req.query.order_id);
  } else {
    ans.status.error = "bad order_id";
  }
  res.json(ans);
});

async function ORDERS_pay(connection, ans, order_id) {
  return new Promise((resolve) => {
    connection.query(
      'update orders set ts_pay=now(), payed="true" where order_id=? limit 1;',
      [order_id],
      (err, res) => {
        lib.proceed(ans, err, res);
        resolve(ans);
      }
    );
  });
}

router.get("/close", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  if (req.query.order_id != undefined) {
    await ORDERS_close(connection, ans, req.query.order_id);
  } else {
    ans.status.error = "bad order_id";
  }
  res.json(ans);
});

async function ORDERS_close(connection, ans, order_id) {
  return new Promise((resolve) => {
    connection.query(
      'update orders set ts_close=now(), closed="true" where order_id=? limit 1;',
      [order_id],
      (err, res) => {
        lib.proceed(ans, err, res);
        resolve(ans);
      }
    );
  });
}

router.get("/close_smena", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  res.json(await ORDERS_close_smena(connection, ans, req.query.admin_id));
});

async function ORDERS_close_smena(connection, ans) {
  return new Promise((resolve) => {
    let smena = [];

    connection.query(
      "select client_id, admin_id, worker_id, order_number, summ, payed, closed, order_works, " +
        " UNIX_TIMESTAMP(lts) as lts, UNIX_TIMESTAMP(ts_create) as ts_create, UNIX_TIMESTAMP(ts_close) as ts_close, UNIX_TIMESTAMP(ts_pay) as ts_pay " +
        " from orders where closed='true';",
      [],
      (err, res) => {
        if (res.length == 0) {
          resolve(ans);
          return;
        }

        res.forEach((i) => {
          smena.push(
            `(${i.client_id}, ${i.admin_id}, ${i.worker_id}, ${i.order_number}, ${i.summ}, '${i.payed}', '${i.closed}', '${i.order_works}', FROM_UNIXTIME(${i.lts}), FROM_UNIXTIME(${i.ts_create}), FROM_UNIXTIME(${i.ts_close}), FROM_UNIXTIME(${i.ts_pay}))`
          );
        });

        // console.log(smena);
        connection.query(
          `insert into orders_stat (client_id, admin_id, worker_id, order_number, summ, payed, closed, order_works, lts, ts_create, ts_close, ts_pay) values ${smena.join(
            ","
          )};`,
          [],
          (err, res) => {
            lib.proceed(ans, err, res);
            connection.query(
              "delete from orders where closed='true';",
              [],
              (err, res) => {
                resolve(ans);
              }
            );
          }
        );
      }
    );
  });
}

function setConnection(conn) {
  connection = conn;
}

module.exports = router;
module.exports.setConnection = setConnection;
