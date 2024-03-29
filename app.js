var createError = require("http-errors");
var express = require("express");
var conf = require("nconf").argv().env().file({ file: "./config/config.json" });

var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var INDEX_endPoints = require("./routes/index");
var USER_endPoints = require("./routes/user");
var COSTS_endPoints = require("./routes/costs");
var CLIENTS_endPoints = require("./routes/clients");
var WORKERS_endPoints = require("./routes/workers");
var ORDERS_endPoints = require("./routes/orders");
var STATS_endPoints = require("./routes/stats");
var KVS_endPoints = require("./routes/kvs");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use("/.well-known/acme-challenge/44k1ARb_db3h7O2dhx4GSM0Awn0_A1Kacs1eevh3qlo", express.static("./public/.well-known/acme-challenge/44k1ARb_db3h7O2dhx4GSM0Awn0_A1Kacs1eevh3qlo"));
app.use("/.well-known/acme-challenge/J5nH6mZPmdMYftng44z7uVhebJOa6HxlZiAWQs7W0UU", express.static("./public/verif"));

//app.use(express.static("/home/webmaster/valera-back-end/public/", "public"));


app.use("/", INDEX_endPoints);
app.use("/user", USER_endPoints);
app.use("/costs", COSTS_endPoints);
app.use("/clients", CLIENTS_endPoints);
app.use("/workers", WORKERS_endPoints);
app.use("/orders", ORDERS_endPoints);
app.use("/stats", STATS_endPoints);
app.use("/kvs", KVS_endPoints);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const mysql = require("mysql");

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

  connection.query("SET time_zone='+3:00';", function (err, result) {
    if (err) {
      throw err;
    } else {
      USER_endPoints.setConnection(connection);
      COSTS_endPoints.setConnection(connection);
      CLIENTS_endPoints.setConnection(connection);
      WORKERS_endPoints.setConnection(connection);
      ORDERS_endPoints.setConnection(connection);
      STATS_endPoints.setConnection(connection);
      KVS_endPoints.setConnection(connection);
      console.log("mysql connected");
    }
  });
});

module.exports = app;
