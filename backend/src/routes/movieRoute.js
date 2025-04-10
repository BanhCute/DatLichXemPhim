var express = require("express");
var router = express.Router();
let movieController = require("../controllers/movieController");
let { CheckAuth, CheckRole } = require("../utils/check_auth");
let { CreateSuccessRes } = require("../utils/responseHandler");
require('dotenv').config();

router.get("/", async (req, res, next) => {
  try {
    let movies = await movieController.GetAll();
    CreateSuccessRes(res, movies, 200);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", CheckAuth, async (req, res, next) => {
  try {
    let movie = await movieController.GetById(req);
    CreateSuccessRes(res, movie, 200);
  } catch (error) {
    next(error);
  }
});

router.post("/", [CheckAuth, CheckRole], async (req, res, next) => {
  try {
    let movie = await movieController.Create(req);
    CreateSuccessRes(res, movie, 201);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", [CheckAuth, CheckRole], async (req, res, next) => {
  try {
    let movie = await movieController.Update(req);
    CreateSuccessRes(res, movie, 200);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", [CheckAuth, CheckRole], async (req, res) => {
  try {
    let movie = await movieController.Delete(req);
    CreateSuccessRes(res, movie, 200);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
