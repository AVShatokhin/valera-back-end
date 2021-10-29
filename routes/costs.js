var express = require("express");
let connection;
var router = express.Router();
var lib = require("../libs/valera.js");

// let fs = require("fs");
// let rawdata = JSON.stringify(
//   fs.readFileSync("./config/costs2.csv").toString().split("\r\n")
// );
// console.log(rawdata);

router.get("/drop_main", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  res.json(await COSTS_drop_main(connection, ans, req));
});

async function COSTS_drop_main(connection, ans, req) {
  return new Promise((resolve) => {
    connection.query(`delete from costs_main;`, [], (err, res) => {
      lib.proceed(ans, err, res);
      resolve(ans);
    });
  });
}

router.post("/set_main_costs", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  res.json(await COSTS_set_main_costs(connection, ans, req));
});

async function COSTS_set_main_costs(connection, ans, req) {
  let __rawdata = req.body;
  let costs = {};
  let header = [];

  let __header = __rawdata[0].split(";");
  let __offset = 7;

  for (let i = __offset; i < __header.length; i++) {
    header.push(__header[i]);
  }

  for (let i = 1; i < __rawdata.length; i++) {
    let __line = __rawdata[i].split(";");
    if (__line.length < __offset) continue;

    let __super_group_name = __line[1];
    let __group_name = __line[4];
    let __service_name = __line[5];
    let __stavka_admin = __line[2];
    let __stavka_worker = __line[3];
    let __normo_min = __line[6];

    if (costs[__super_group_name] == undefined) {
      costs[__super_group_name] = {};
    }

    if (costs[__super_group_name][__group_name] == undefined) {
      costs[__super_group_name][__group_name] = {};
    }

    if (costs[__super_group_name][__group_name][__service_name] == undefined) {
      costs[__super_group_name][__group_name][__service_name] = [];
    }

    let __sub_services = [];

    for (let i = 0; i < header.length; i++) {
      if (__line[i + __offset] != "") {
        __sub_services.push({
          name: header[i],
          cost: __line[i + __offset],
          stavka_admin: __stavka_admin,
          stavka_worker: __stavka_worker,
          normo_min: __normo_min,
        });
      }
    }

    costs[__super_group_name][__group_name][__service_name] = __sub_services;
  }

  // console.log(costs);

  return new Promise((resolve) => {
    connection.query(
      `replace costs_main (record_id, costs) values (?, ?);`,
      [1, JSON.stringify(costs)],
      (err, res) => {
        lib.proceed(ans, err, res);
        resolve(ans);
      }
    );
  });
}

router.get("/get_main_costs", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  res.json(await COSTS_get_main_costs(connection, ans));
});

async function COSTS_get_main_costs(connection, ans) {
  return new Promise((resolve) => {
    connection.query(
      `select costs from costs_main where record_id=1;`,
      [],
      (err, res) => {
        if (res.length == 0) {
          res = [{}];
        }

        if (res[0]?.costs != null) {
          res[0].costs = JSON.parse(res[0].costs);
        } else {
          res[0].costs = {};
        }

        lib.proceed(ans, err, res);
        resolve(ans);
      }
    );
  });
}

////// старое =================================================

// router.get("/drop_wheels", async function (req, res, next) {
//   let ans = {
//     status: {
//       success: false,
//     },
//     data: [],
//   };

//   res.json(await COSTS_drop_wheels(connection, ans, req));
// });

// async function COSTS_drop_wheels(connection, ans, req) {
//   return new Promise((resolve) => {
//     connection.query(`delete from costs_wheels;`, [], (err, res) => {
//       lib.proceed(ans, err, res);
//       resolve(ans);
//     });
//   });
// }

// router.get("/drop_all", async function (req, res, next) {
//   let ans = {
//     status: {
//       success: false,
//     },
//     data: [],
//   };

//   res.json(await COSTS_drop_all(connection, ans, req));
// });

// async function COSTS_drop_all(connection, ans, req) {
//   return new Promise((resolve) => {
//     connection.query(`delete from costs;`, [], (err, res) => {
//       lib.proceed(ans, err, res);
//       resolve(ans);
//     });
//   });
// }

// router.post("/set_all_wheels", async function (req, res, next) {
//   let ans = {
//     status: {
//       success: false,
//     },
//     data: [],
//   };

//   res.json(await COSTS_set_all_wheels(connection, ans, req));
// });

// async function COSTS_set_all_wheels(connection, ans, req) {
//   return new Promise((resolve) => {
//     let sql = [];

//     req.body.forEach((e) => {
//       sql.push(
//         `(${e.cost_id}, ${e.radius}, ${e.profile}, ${e.runflat}, ${e.cost})`
//       );
//     });

//     // `(${e.cost_id}, ${req.body[cost_id].radius}, ${req.body[cost_id].profile}, ${req.body[cost_id].runflat}, ${req.body[cost_id].cost})`

//     connection.query(
//       `replace costs_wheels (cost_id, radius, profile, runflat, cost) values ${sql.join(
//         ","
//       )};`,
//       [],
//       (err, res) => {
//         lib.proceed(ans, err, res);
//         resolve(ans);
//       }
//     );
//   });
// }

// router.post("/set_all", async function (req, res, next) {
//   let ans = {
//     status: {
//       success: false,
//     },
//     data: [],
//   };

//   res.json(await COSTS_set_all(connection, ans, req));
// });

// async function COSTS_set_all(connection, ans, req) {
//   return new Promise((resolve) => {
//     let sql = [];
//     for (cost_id in req.body) {
//       sql.push(
//         `(${cost_id}, "${req.body[cost_id].name}", ${req.body[cost_id].cost})`
//       );
//     }

//     connection.query(
//       `replace costs (cost_id, name, cost) values ${sql.join(",")};`,
//       [],
//       (err, res) => {
//         lib.proceed(ans, err, res);
//         resolve(ans);
//       }
//     );
//   });
// }

// router.get("/get_all_wheels", async function (req, res, next) {
//   let ans = {
//     status: {
//       success: false,
//     },
//     data: [],
//   };

//   res.json(await COSTS_get_all_wheels(connection, ans));
// });

// async function COSTS_get_all_wheels(connection, ans) {
//   return new Promise((resolve) => {
//     connection.query(
//       `select cost_id, radius, profile, runflat, cost from costs_wheels order by cost_id;`,
//       [],
//       (err, res) => {
//         lib.proceed(ans, err, res);
//         resolve(ans);
//       }
//     );
//   });
// }

// router.get("/get_all", async function (req, res, next) {
//   let ans = {
//     status: {
//       success: false,
//     },
//     data: [],
//   };

//   res.json(await COSTS_get_all(connection, ans));
// });

// async function COSTS_get_all(connection, ans) {
//   return new Promise((resolve) => {
//     connection.query(
//       `select cost_id, name, cost from costs order by cost_id;`,
//       [],
//       (err, res) => {
//         lib.proceed(ans, err, res);
//         resolve(ans);
//       }
//     );
//   });
// }

function setConnection(conn) {
  connection = conn;
}

module.exports = router;
module.exports.setConnection = setConnection;
