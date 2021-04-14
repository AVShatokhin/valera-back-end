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
    await ORDERS_create(
      connection,
      ans,
      req.body.order_number,
      req.body.client_id,
      req.body.admin_id,
      req.body.order_works,
      req.body.summ
    )
  );
});

router.post("/update", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  res.json(
    await ORDERS_update(
      connection,
      ans,
      req.body.order_number,
      req.body.client_id,
      req.body.order_works,
      req.body.summ,
      req.body.order_id
    )
  );
});

router.get("/pay", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  if (req.query.order_id != undefined) {
    await ORDERS_pay(connection, ans, req.body.order_id);
  } else {
    ans.status.error = "bad order_id";
  }
  res.json(ans);
});

router.get("/close", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  if (req.query.order_id != undefined) {
    await ORDERS_close(connection, ans, req.body.order_id);
  } else {
    ans.status.error = "bad order_id";
  }
  res.json(ans);
});

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

router.get("/close_smena", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  if (req.query.admin_id != undefined) {
    await ORDERS_close_smena(connection, ans, req.query.admin_id);
  } else {
    ans.status.error = "bad admin_id";
  }
  res.json(ans);
});

router.get("/get", async function (req, res, next) {
  let ans = {
    status: {
      success: false,
    },
    data: [],
  };

  res.json(await ORDERS_close_smena(connection, ans, req.query.admin_id));
});

function setConnection(conn) {
  connection = conn;
}

async function ORDERS_create(connection, ans, user_name, password, role) {
  return new Promise((resolve) => {
    connection.query(
      `select from costs order by cost_id;`,
      [user_name, password, role],
      (err, res) => {
        proceed(ans, err, res);
        resolve(ans);
      }
    );
  });
}

async function ORDERS_delete(connection, ans, user_id) {
  return new Promise((resolve) => {
    connection.query(
      `delete from users where user_id=? limit 1;`,
      [user_id],
      (err, res) => {
        proceed(ans, err, res);
        resolve(ans);
      }
    );
  });
}

async function ORDERS_close(connection, ans, user_id) {
  return new Promise((resolve) => {
    connection.query(
      `delete from users where user_id=? limit 1;`,
      [user_id],
      (err, res) => {
        proceed(ans, err, res);
        resolve(ans);
      }
    );
  });
}

async function ORDERS_pay(connection, ans, user_id) {
  return new Promise((resolve) => {
    connection.query(
      `delete from users where user_id=? limit 1;`,
      [user_id],
      (err, res) => {
        proceed(ans, err, res);
        resolve(ans);
      }
    );
  });
}

module.exports = router;
module.exports.setConnection = setConnection;
