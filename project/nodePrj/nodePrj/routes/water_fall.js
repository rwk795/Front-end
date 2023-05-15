const express = require("express");
const router = express.Router();
const mongoose = require("mongoose"); //导入mongoose模块
const list = require("../model/list"); //导入模型数据模块
// 获取MongoDB数据库数据
router.get(
  "/picture_list",
  function ({ query: { index = 0, count = 20 } }, res) {
    console.log("-----");
    list.find().then((list) => {
      console.log(list, "list");
      let result = list.slice(~~index, ~~index + ~~count);
      res.status(200).send(result);
    });
    // list.find((err, list) => {
    //   if (err) {
    //     console.log(err);
    //   }
    //   let result = list.slice(~~index, ~~index + ~~count);
    //   res.status(200).send(result);
    // });
  }
);
router.post("/submitList", function (req, res) {
  const postData = req.body;
  list
    .insertMany(postData)
    .then(() => {
      res.status(200).send("成功");
    })
    .catch((err) => {
      console.log(err);
    });
});
//   list.insertMany(postData, function (err, data) {
//     if (err) throw err;
//     res.status(200).send("成功");
//   });
exports = module.exports = router;
