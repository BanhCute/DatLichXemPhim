var express = require('express');
var router = express.Router();
let paymentController = require('../controllers/paymentController');
let { CreateSuccessRes } = require('../utils/responseHandler');
const { CheckAuth, CheckRole } = require('../utils/check_auth');
require('dotenv').config();

router.get('/', CheckAuth, async function (req, res, next) {
  try {
    let payments = await paymentController.GetAll();
    CreateSuccessRes(res, payments, 200);
  } catch (error) {
    next(error);
  }
});

router.post('/', [CheckAuth, CheckRole], async function (req, res, next) {
  try {
    let body = req.body;
    let newPayment = await paymentController.Create(body);
    CreateSuccessRes(res, newPayment, 201);
  } catch (error) {
    next(error);
  }
});

module.exports = router;