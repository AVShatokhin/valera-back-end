async function USER_create(connection, ans, user_name, password, role) {
  return new Promise((resolve) => {
    connection.query(
      `insert into users set user_name=?, password=?, role=?;`,
      [user_name, password, role],
      (err, res) => {
        proceed(ans, err, res);
        resolve(ans);
      }
    );
  });
}

async function USER_update(connection, ans, password, role, user_id) {
  return new Promise((resolve) => {
    connection.query(
      `update users set password=?, role=? where user_id=?;`,
      [password, role, user_id],
      (err, res) => {
        proceed(ans, err, res);
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
        proceed(ans, err, res);
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
        proceed(ans, err, res);
        resolve(ans);
      }
    );
  });
}

function proceed(ans, err, res) {
  if (err != undefined) {
    console.log(err);
    ans.status.error = err;
    ans.status.success = false;
  } else {
    ans.status.success = true;
  }

  if (res != undefined) {
    ans.data = res;
  }
}

module.exports.USER_login = USER_login;
module.exports.USER_delete = USER_delete;
module.exports.USER_create = USER_create;
module.exports.USER_update = USER_update;
