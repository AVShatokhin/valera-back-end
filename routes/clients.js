var express = require("express");
let connection;
var router = express.Router();
var lib = require("../libs/valera.js");

router.get("/deactive", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  if (req.query.client_id != undefined) {
    await CLIENT_deactive(connection, ans, req.query.client_id);
  } else {
    ans.status.error = "bad client_id";
  }

  res.json(ans);
});

async function CLIENT_deactive(connection, ans, client_id) {
  return new Promise((resolve) => {
    connection.query(
      "update clients set active='false' where client_id=? limit 1;",
      [client_id],
      (err, res) => {
        lib.proceed(ans, err, res);
        resolve(ans);
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

  res.json(await CLIENT_create(connection, ans, req));
});

async function CLIENT_create(connection, ans, req) {
  return new Promise((resolve) => {
    connection.query(
      `insert into clients set discount=?, cars=?, phone=?, name=?;`,
      [
        req.body.discount,
        JSON.stringify(req.body.cars),
        req.body.phone,
        req.body.name,
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

  res.json(await CLIENT_change(connection, ans, req));
});

async function CLIENT_change(connection, ans, req) {
  return new Promise((resolve) => {
    connection.query(
      `update clients set name=?, discount=?, phone=?, cars=? where client_id=?;`,
      [
        req.body.name,
        req.body.discount,
        req.body.phone,
        JSON.stringify(req.body.cars),
        req.body.client_id,
      ],
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

  if (req.query.client_id != undefined) {
    await CLIENT_delete(connection, ans, req.query.client_id);
  } else {
    ans.status.error = "bad client_id";
  }

  res.json(ans);
});

async function CLIENT_delete(connection, ans, client_id) {
  return new Promise((resolve) => {
    connection.query(
      `delete from clients where client_id=? limit 1;`,
      [client_id],
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

  res.json(await CLIENT_get_all(connection, ans));
});

async function CLIENT_get_all(connection, ans) {
  return new Promise((resolve) => {
    connection.query(
      "select client_id, cars, discount, name, phone from clients where active='true' order by client_id;",
      [],
      (err, res) => {
        if (res != undefined)
          res.forEach((element) => {
            element.cars = JSON.parse(element.cars);
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

  res.json(await CLIENT_get(connection, ans, req));
});

async function CLIENT_get(connection, ans, req) {
  let phone = "";

  if (req.query.phone != undefined) phone = req.query.phone;

  // select * from clients where JSON_EXTRACT(cars, '$.a250ps') is not null;

  if (req.query.client_id != undefined) {
    let client_id = req.query.client_id;
    return new Promise((resolve) => {
      connection.query(
        `select client_id, cars, discount, name, phone, active from clients where client_id = ?;`,
        [client_id],
        (err, res) => {
          if (res != undefined)
            res.forEach((element) => {
              element.cars = JSON.parse(element.cars);
            });
          lib.proceed(ans, err, res);
          resolve(ans);
        }
      );
    });
  }

  if (req.query.car_num != undefined) {
    let car_num = req.query.car_num;
    // console.log(car_num);
    return new Promise((resolve) => {
      connection.query(
        // `select client_id, cars, discount, name, phone, active from clients where (JSON_EXTRACT(cars, '$.${car_num}') is not null) and (phone like ?) order by client_id;`,
        // [`%${phone}%`],
        'select client_id, cars, discount, name, phone, active from clients where (cars like ?) and (phone like ?) and active="true" order by client_id;',
        [`%${car_num}%`, `%${phone}%`],
        (err, res) => {
          if (res != undefined)
            res.forEach((element) => {
              element.cars = JSON.parse(element.cars);
            });

          lib.proceed(ans, err, res);
          resolve(ans);
        }
      );
    });
  }

  return new Promise((resolve) => {
    connection.query(
      'select client_id, cars, discount, name, phone, active from clients where (phone like ?) and active="true" order by client_id;',
      [`%${phone}%`],
      (err, res) => {
        if (res != undefined)
          res.forEach((element) => {
            element.cars = JSON.parse(element.cars);
          });
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
