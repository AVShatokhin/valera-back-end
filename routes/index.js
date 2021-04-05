var express = require("express");
var router = express.Router();
var conf = require("nconf").argv().env().file({ file: "./config/config.json" });
const mysql = require("mysql");

/* Задачи */

// 1. Найти чувака по телефону
// 2. Найти чувака по номеру тачки
// 3. Добавить чувака и тачку

router.post("/", function (req, res, next) {
  res.end("Valera backend");
});

router.get("/", function (req, res, next) {
  res.end("Valera backend");
});

router.get("/get_current", function (req, res, next) {
  let out = [
    {
      orderNumber: 1,
      infoCar: "Jeep",
      infoCarNumber: "а256мр",
      infoClientName: "Алексей",
      infoClientPhone: "+79068895654",
      summ: 100,
      status: true,
    },
    {
      orderNumber: 2,
      infoCar: "KIA CEED",
      infoCarNumber: "а345мр",
      infoClientName: "Владимир",
      infoClientPhone: "+79062223333",
      summ: 500,
      status: false,
    },
  ];

  res.json(out);
});

const connection = mysql.createConnection({
  host: conf.get("db_host"),
  user: conf.get("db_user"),
  database: conf.get("db_name"),
  password: conf.get("db_password"),
});

connection.connect((err) => {
  if (err) {
    console.log(err);
    throw err;
  }
  console.log("mysql connected");
});

module.exports = router;
