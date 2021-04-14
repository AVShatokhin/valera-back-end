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
      req.body.role
    )
  );
});

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
      req.body.user_id
    )
  );
});

router.post("/login", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  res.json(
    await USER_login(connection, ans, req.body.user_name, req.body.password)
  );
});

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

function setConnection(conn) {
  connection = conn;
}

async function USER_create(connection, ans, user_name, password, role) {
  return new Promise((resolve) => {
    connection.query(
      `insert into users set user_name=?, password=?, role=?;`,
      [user_name, password, role],
      (err, res) => {
        lib.proceed(ans, err, res);
        resolve(ans);
      }
    );
  });
}

async function USER_change(connection, ans, password, role, user_id) {
  return new Promise((resolve) => {
    connection.query(
      `update users set password=?, role=? where user_id=?;`,
      [password, role, user_id],
      (err, res) => {
        lib.proceed(ans, err, res);
        resolve(ans);
      }
    );
  });
}

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

async function USER_login(connection, ans, user_name, password) {
  return new Promise((resolve) => {
    connection.query(
      `select user_name, user_id, role from users where user_name=? and password=? limit 1;`,
      [user_name, password],
      (err, res) => {
        lib.proceed(ans, err, res);
        resolve(ans);
      }
    );
  });
}

module.exports = router;
module.exports.setConnection = setConnection;
