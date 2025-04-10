var express = require('express');
var router = express.Router();
let reviewController = require('../controllers/reviewController');
let { CreateSuccessRes } = require('../utils/responseHandler');
const { CheckAuth } = require('../utils/check_auth');
require('dotenv').config();

router.get('/', CheckAuth, async function (req, res, next) {
  try {
    let reviews = await reviewController.GetAll();
    CreateSuccessRes(res, reviews, 200);
  } catch (error) {
    next(error);
  }
});

router.post('/', CheckAuth, async function (req, res, next) {
  try {
    let body = req.body;
    let newReview = await reviewController.Create(body);
    CreateSuccessRes(res, newReview, 201);
  } catch (error) {
    next(error);
  }
});

module.exports = router;