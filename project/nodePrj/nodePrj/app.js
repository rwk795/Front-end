var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

//连接mongoDB
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/water_fall"); //连接本地数据库
// 数据库地址： 'mongodb://用户名:密码@ip地址:端口号/数据库';
// mongodb : 'mongodb://cha:root@localhost:27017/test'
// 实例化连接对象
let db = mongoose.connection;
db.on("error", console.error.bind(console, "连接错误："));
db.once("open", (callback) => {
  console.log("MongoDB连接成功！！");
});
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false }));

var waterFall = require("./routes/water_fall.js");
app.use("/water_fall", waterFall);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

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

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Content-Length, Authorization, Accept,X-Requested-With"
  );
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", " 3.2.1");
  req.method == "OPTIONS" ? res.send(200) : next();
});
module.exports = app;
