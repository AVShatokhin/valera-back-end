const { resolveInclude } = require("ejs");
var express = require("express");
let connection;
var router = express.Router();
var lib = require("../libs/valera.js");

router.get("/get_income_stats", async function (req, res, next) {
  let ans = {
    status: {
      success: true,
    },
    data: {},
  };

  let __smenas = await GET_smena(connection, req);
  let __orders = await GET_orders_stat(connection, req);

  if (__orders.length > 0) {
    __orders.forEach((order) => {
      if (__smenas?.[order?.smena_id] != null) {
        __smenas[order.smena_id].orders.push(order);
        if (order.order_works?.length > 0) {
          order.order_works.forEach((work) => {
            if ((work?.cost > 0) & (work?.count > 0)) {
              if (
                __smenas[order.smena_id].admins_salary[order.admin_id] ==
                undefined
              )
                __smenas[order.smena_id].admins_salary[order.admin_id] = 0;

              if (
                __smenas[order.smena_id].workers_salary[order.worker_id] ==
                undefined
              )
                __smenas[order.smena_id].workers_salary[order.worker_id] = 0;

              __smenas[order.smena_id].admins_salary[order.admin_id] +=
                Math.round((work.stavka_admin / 100) * work.cost * work.count);
              __smenas[order.smena_id].workers_salary[order.worker_id] +=
                Math.round((work.stavka_worker / 100) * work.cost * work.count);

              if (order.payed == "true")
                switch (order.pay_type) {
                  case "nal":
                    __smenas[order.smena_id].income_nal +=
                      work.cost * work.count;
                    break;
                  case "eq":
                    __smenas[order.smena_id].income_eq +=
                      work.cost * work.count;
                    break;
                  case "bonus":
                    __smenas[order.smena_id].income_bonus +=
                      work.cost * work.count;
                    break;
                  default:
                    break;
                }
            }
          });
        }
      }
    });
  }

  if (req.query.worker_id != null) {
    for (smena in __smenas) {
      if (__smenas[smena].orders.length > 0) {
        ans.data[smena] = __smenas[smena];
      }
    }
  } else {
    ans.data = __smenas;
  }

  res.json(ans);
});

async function GET_orders_stat(connection, req) {
  return new Promise((resolve) => {
    connection.query(
      "select admin_id, carName, carNum, client_id, closed, lts, order_number, order_works, payed, pay_type, smena_id, " +
        " DATE_FORMAT(ts_create, '%Y-%m-%d') as date_ts_create, TIME(ts_create) as time_ts_create," +
        " DATE_FORMAT(ts_close, '%Y-%m-%d') as date_ts_closed, TIME(ts_close) as time_ts_closed," +
        " DATE_FORMAT(ts_pay, '%Y-%m-%d') as date_ts_payed, TIME(ts_pay) as time_ts_payed, " +
        " unix_timestamp(ts_close) - unix_timestamp(ts_create) as ts_delta," +
        " worker_id, force_closed, force_comment " +
        " from orders_stat where date(ts_create) >= ? and date(ts_close) <= ? and (admin_id=? or ?) and (worker_id=? or ?);",
      [
        req.query.date_from,
        req.query.date_to,
        req.query.admin_id,
        req.query.admin_id == undefined,
        req.query.worker_id,
        req.query.worker_id == undefined,
      ],
      (err, res) => {
        // console.log(err);
        // console.log(res);
        res.forEach((work) => {
          work.order_works = JSON.parse(work.order_works);
        });
        resolve(res);
      }
    );
  });
}

async function GET_smena(connection, req) {
  let admin_id = req.query?.admin_id;

  let admin_sql = `admin_id = ?`;

  if (admin_id == null) admin_sql = `(admin_id = ? or 1)`;

  let sql = `select admin_id, open_ts, close_ts, smena_id from smena where date(open_ts) >= ? and date(close_ts) <= ? and close_ts > 0 and ${admin_sql}`;

  return new Promise((resolve) => {
    connection.query(
      sql,
      [req.query.date_from, req.query.date_to, admin_id],
      (err, res) => {
        // console.log(err);
        // console.log(res);
        let __res = {};
        res.forEach((element) => {
          __res[element.smena_id] = {
            open_ts: element.open_ts,
            close_ts: element.close_ts,
            admin_id: element.admin_id,
            orders: [],
            income_eq: 0,
            income_nal: 0,
            income_bonus: 0,
            workers_salary: {},
            admins_salary: {},
          };
        });
        resolve(__res);
      }
    );
  });
}

// async function GET_workers(connection) {
//   return new Promise((resolve) => {
//     connection.query("select worker_id, name from workers;", [], (err, res) => {
//       let __res = {};
//       res.forEach((element) => {
//         __res[element.worker_id] = element.name;
//       });
//       resolve(__res);
//     });
//   });
// }

// async function GET_admins(connection) {
//   return new Promise((resolve) => {
//     connection.query(
//       "select user_id as admin_id, user_name as name from users where role='admin';",
//       [],
//       (err, res) => {
//         let __res = {};
//         res.forEach((element) => {
//           __res[element.admin_id] = element.name;
//         });
//         resolve(__res);
//       }
//     );
//   });
// }

function setConnection(conn) {
  connection = conn;
}

module.exports = router;
module.exports.setConnection = setConnection;
