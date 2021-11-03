const { resolveInclude } = require("ejs");
var express = require("express");
let connection;
var router = express.Router();
var lib = require("../libs/valera.js");

router.get("/open_smena", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  let smena_info = await GET_SMENA(connection, req.query.admin_id);

  if (smena_info.length == 0) {
    await OPEN_SMENA(connection, ans, req);
  } else {
    ans.status.success = false;
    ans.data = ["smena is opened"];
  }

  res.json(ans);
});

async function OPEN_SMENA(connection, ans, req) {
  return new Promise((resolve) => {
    connection.query(
      "insert into smena set admin_id = ?, open_ts=now();",
      [req.query.admin_id],
      (err, res) => {
        lib.proceed(ans, err, res);
        resolve(ans);
      }
    );
  });
}

router.get("/get_smena", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  let smena_info = await GET_SMENA(connection, req.query.admin_id);

  if (smena_info.length == 0) {
    ans.status.success = false;
    ans.data = ["smena is closed"];
  } else {
    ans.status.success = true;
    ans.data = smena_info;
  }

  res.json(ans);
});

async function GET_SMENA(connection, admin_id) {
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

router.post("/create", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  let smena_info = await GET_SMENA(connection, req.body.admin_id);

  if (smena_info.length == 0) {
    ans.status.success = false;
    ans.data = ["no smena"];
    res.json(ans);
  } else {
    req.body.smena_id = smena_info[0].smena_id;
    res.json(await ORDERS_create(connection, ans, req));
  }
});

async function ORDERS_create(connection, ans, req) {
  return new Promise((resolve) => {
    connection.query(
      "insert into orders set admin_id=?, client_id=?, worker_id=?, order_number=?, order_works=?, carName=?, carNum=?, ts_create=now(), smena_id=?;",
      [
        req.body.admin_id,
        req.body.client_id,
        req.body.worker_id,
        req.body.order_number,
        JSON.stringify(req.body.order_works),
        req.body.carName,
        req.body.carNum,
        req.body.smena_id,
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
      "update orders set admin_id=?, client_id=?, worker_id=?, order_number=?, order_works=?, carName=?, carNum=? where order_id=?",
      [
        req.body.admin_id,
        req.body.client_id,
        req.body.worker_id,
        req.body.order_number,
        JSON.stringify(req.body.order_works),
        req.body.carName,
        req.body.carNum,
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
      "select pay_type, smena_id, unix_timestamp(lts) as last_ts, order_id, worker_id, client_id, admin_id, order_number, payed, closed, order_works, carName, carNum, " +
        " DATE_FORMAT(ts_create, '%Y-%m-%d') as date_ts_create, TIME(ts_create) as time_ts_create," +
        " DATE_FORMAT(ts_close, '%Y-%m-%d') as date_ts_closed, TIME(ts_close) as time_ts_closed," +
        " force_closed, force_comment, " +
        " DATE_FORMAT(ts_pay, '%Y-%m-%d') as date_ts_payed, TIME(ts_pay) as time_ts_payed from orders where lts > FROM_UNIXTIME(?);",
      [lts],
      (err, res) => {
        if (res != undefined)
          res.forEach((element) => {
            element.order_works = JSON.parse(element.order_works);
          });

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
      "select pay_type, smena_id, unix_timestamp(lts) as last_ts, order_id, worker_id, client_id, admin_id, order_number, payed, closed, order_works, carName, carNum, " +
        " DATE_FORMAT(ts_create, '%Y-%m-%d') as date_ts_create, TIME(ts_create) as time_ts_create," +
        " DATE_FORMAT(ts_close, '%Y-%m-%d') as date_ts_closed, TIME(ts_close) as time_ts_closed," +
        " DATE_FORMAT(ts_pay, '%Y-%m-%d') as date_ts_payed, TIME(ts_pay) as time_ts_payed, " +
        " force_closed, force_comment " +
        " from orders;",
      [],
      (err, res) => {
        if (res != undefined)
          res.forEach((element) => {
            element.order_works = JSON.parse(element.order_works);
          });

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
      "select pay_type, smena_id, unix_timestamp(lts) as last_ts, order_id, worker_id, client_id, " +
        " admin_id, order_number, payed, closed, order_works, carName, carNum, " +
        " force_closed, force_comment, " +
        " DATE_FORMAT(ts_create, '%Y-%m-%d') as date_ts_create, TIME(ts_create) as time_ts_create, " +
        " DATE_FORMAT(ts_close, '%Y-%m-%d') as date_ts_closed, TIME(ts_close) as time_ts_closed, " +
        " DATE_FORMAT(ts_pay, '%Y-%m-%d') as date_ts_payed, TIME(ts_pay) as time_ts_payed " +
        " from orders where admin_id = ? ;",
      [admin_id],
      (err, res) => {
        if (res != undefined)
          res.forEach((element) => {
            element.order_works = JSON.parse(element.order_works);
          });

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
    if (req.query.pay_type == undefined) {
      req.query.pay_type = "nal";
    }
    await ORDERS_pay(connection, ans, req.query.order_id, req.query.pay_type);
  } else {
    ans.status.error = "bad order_id";
  }
  res.json(ans);
});

async function ORDERS_pay(connection, ans, order_id, pay_type) {
  return new Promise((resolve) => {
    connection.query(
      'update orders set ts_pay=now(), payed="true", pay_type=? where order_id=? limit 1;',
      [pay_type, order_id],
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
    if (req.query.force == "yes") {
      await ORDERS_close_force(
        connection,
        ans,
        req.query.force_comment,
        req.query.order_id
      );
    } else {
      await ORDERS_close(connection, ans, req.query.order_id);
    }
  } else {
    ans.status.error = "bad order_id";
  }
  res.json(ans);
});

async function ORDERS_close(connection, ans, order_id) {
  return new Promise((resolve) => {
    connection.query(
      'update orders set ts_close=now(), closed="true" where order_id=? and payed="true" limit 1;',
      [order_id],
      (err, res) => {
        lib.proceed(ans, err, res);
        resolve(ans);
      }
    );
  });
}

async function ORDERS_close_force(connection, ans, force_comment, order_id) {
  return new Promise((resolve) => {
    connection.query(
      'update orders set ts_close=now(), closed="true", force_closed="yes", force_comment=? where order_id=? limit 1;',
      [force_comment, order_id],
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

  let _check = await CHECK_SMENA(connection, req.query.admin_id);

  if (_check == 0) {
    await close_smena(connection, req.query.admin_id);
    res.json(await ORDERS_close_smena(connection, ans, req.query.admin_id));
  } else {
    ans.status.success = false;
    ans.data = ["opened orders"];
    res.json(ans);
  }
});

async function close_smena(connection, admin_id) {
  return new Promise((resolve) => {
    connection.query(
      "update smena set close_ts=now() where close_ts=0 and admin_id=?;",
      [admin_id],
      (err, res) => {
        resolve(res);
      }
    );
  });
}

async function CHECK_SMENA(connection, admin_id) {
  return new Promise((resolve) => {
    connection.query(
      'select count(*) as cnt from orders where closed="false" and admin_id=? limit 1;',
      [admin_id],
      (err, res) => {
        if (res.length == 1) {
          resolve(res[0].cnt);
        } else {
          resolve(undefined);
        }
      }
    );
  });
}

async function ORDERS_close_smena(connection, ans, admin_id) {
  return new Promise((resolve) => {
    let smena = [];

    connection.query(
      "select pay_type, smena_id, client_id, admin_id, worker_id, order_number, payed, closed, order_works, carName, carNum, " +
        " UNIX_TIMESTAMP(lts) as lts, UNIX_TIMESTAMP(ts_create) as ts_create, UNIX_TIMESTAMP(ts_close) as ts_close, UNIX_TIMESTAMP(ts_pay) as ts_pay, " +
        " force_closed, force_comment " +
        " from orders where closed='true' and admin_id=?;",
      [admin_id],
      (err, res) => {
        // console.log(err);

        if (res == undefined) {
          ans.data = ["empty response"];
          resolve(ans);
          return;
        }

        if (res.length == 0) {
          // не было ордеров в смене
          ans.data = ["orders list is empty"];
          resolve(ans);
          return;
        }

        res.forEach((i) => {
          smena.push(
            `('${i.pay_type}', ${i.smena_id}, ${i.client_id}, ${i.admin_id}, ${i.worker_id}, ${i.order_number}, '${i.payed}', '${i.closed}', '${i.order_works}', '${i.carName}', '${i.carNum}', FROM_UNIXTIME(${i.lts}), FROM_UNIXTIME(${i.ts_create}), FROM_UNIXTIME(${i.ts_close}), FROM_UNIXTIME(${i.ts_pay}), '${i.force_closed}', '${i.force_comment}')`
          );
          // console.log(i);
        });

        // console.log(smena);
        connection.query(
          `insert into orders_stat (pay_type, smena_id, client_id, admin_id, worker_id, order_number, payed, closed, order_works, carName, carNum, lts, ts_create, ts_close, ts_pay, force_closed, force_comment) values ${smena.join(
            ","
          )};`,
          [],
          (err, res) => {
            lib.proceed(ans, err, res);
            connection.query(
              "delete from orders where closed='true';",
              [],
              (err, res) => {
                ans.status.success = true;
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
