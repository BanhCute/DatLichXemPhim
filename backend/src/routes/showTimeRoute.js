var express = require("express");
var router = express.Router();
let { CheckAuth , CheckRole } = require("../utils/check_auth");
let showTimeController = require("../controllers/showTimeController");
let { CreateSuccessRes } = require("../utils/responseHandler");
const { ro } = require("date-fns/locale");
require('dotenv').config();

router.get("/", async (req, res, next) => {
  try {
    let showTimes = await showTimeController.GetAll();
    CreateSuccessRes(res, showTimes, 200);
  } catch (error) {
    next(error);
  }
});

router.get("/movie/:movieId", async (req, res, next) => {
  try {
    let showTimes = await showTimeController.GetByMovie(req);
    CreateSuccessRes(res, showTimes, 200);
  } catch (error) {
    next(error);
  }
});

router.post("/", [CheckAuth, CheckRole], async (req, res, next) => {
  try {
    let showTime = await showTimeController.Create(req);
    CreateSuccessRes(res, showTime, 201);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    let showTime = await showTimeController.GetById(req);
    CreateSuccessRes(res, showTime, 200);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", [CheckAuth, CheckRole], async (req, res, next) => {
  try {
    let showTime = await showTimeController.Update(req);
    CreateSuccessRes(res, showTime, 200);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", [CheckAuth, CheckRole], async (req, res) => {
  try {
    let showTime = await showTimeController.Delete(req);
    CreateSuccessRes(res, showTime, 200);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
