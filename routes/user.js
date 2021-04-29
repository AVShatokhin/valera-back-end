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

  res.json(
    await USER_create(
      connection,
      ans,
      req.body.user_name,
      req.body.password,
      req.body.role,
      req.body.login
    )
  );
});

async function USER_create(connection, ans, user_name, password, role, login) {
  return new Promise((resolve) => {
    connection.query(
      `insert into users set user_name=?, password=?, role=?, login=?;`,
      [user_name, password, role, login],
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

  res.json(
    await USER_change(
      connection,
      ans,
      req.body.password,
      req.body.role,
      req.body.user_name,
      req.body.user_id
    )
  );
});

async function USER_change(
  connection,
  ans,
  password,
  role,
  user_name,
  user_id
) {
  return new Promise((resolve) => {
    connection.query(
      `update users set password=?, role=?, user_name=? where user_id=?;`,
      [password, role, user_name, user_id],
      (err, res) => {
        lib.proceed(ans, err, res);
        resolve(ans);
      }
    );
  });
}

router.post("/change_super_admin", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  res.json(await USER_change_super_admin(connection, ans, req.body.password));
});

async function USER_change_super_admin(connection, ans, password) {
  return new Promise((resolve) => {
    connection.query(
      `update users set password=?  where login=?;`,
      [password, "superadmin"],
      (err, res) => {
        // console.log(res);
        if (res.affectedRows == 0) {
          // console.log("insert");
          connection.query(
            `insert into users (password, role, user_name, login) values (?, ?, ?, ?)`,
            [password, "superadmin", "Суперадминистратор", "superadmin"],
            (err, res) => {
              lib.proceed(ans, err, res);
              resolve(ans);
            }
          );
        } else {
          lib.proceed(ans, err, res);
          resolve(ans);
        }
      }
    );
  });
}

router.post("/login", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  res.json(
    await USER_login(connection, ans, req.body.login, req.body.password)
  );
});

async function USER_login(connection, ans, login, password) {
  return new Promise((resolve) => {
    connection.query(
      `select user_name, user_id, role from users where login=? and password=? limit 1;`,
      [login, password],
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

  if (req.query.user_id != undefined) {
    await USER_delete(connection, ans, req.query.user_id);
  } else {
    ans.status.error = "bad user_id";
  }

  res.json(ans);
});

async function USER_delete(connection, ans, user_id) {
  return new Promise((resolve) => {
    connection.query(
      `delete from users where user_id=? limit 1;`,
      [user_id],
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

  res.json(await USER_get_all(connection, ans));
});

async function USER_get_all(connection, ans) {
  return new Promise((resolve) => {
    connection.query(
      `select user_id, user_name, login, password, role from users order by user_id;`,
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
