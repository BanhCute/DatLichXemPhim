var express = require("express");
var router = express.Router();
let bookingController = require("../controllers/bookingController");
let { CheckAuth, CheckRole } = require("../utils/check_auth");
let { CreateSuccessRes } = require("../utils/responseHandler");
require("dotenv").config();

router.get("/", [CheckAuth, CheckRole], async (req, res, next) => {
  try {
    let bookings = await bookingController.GetAll();
    CreateSuccessRes(res, bookings, 200);
  } catch (error) {
    next(error);
  }
});

router.get("/user/:userId", CheckAuth, async (req, res, next) => {
  try {
    let bookings = await bookingController.GetByUser(req);
    CreateSuccessRes(res, bookings, 200);
  } catch (error) {
    next(error);
  }
});

router.post("/", CheckAuth, async (req, res, next) => {
  try {
    let bookingWithDetails = await bookingController.Create(req); 
    CreateSuccessRes(res, bookingWithDetails, 201);
  } catch (error) {
    next(error);
  }
});

module.exports = router;