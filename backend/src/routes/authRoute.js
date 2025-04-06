var express = require('express');
var router = express.Router();
var jwt = require("jsonwebtoken");
let { CreateSuccessRes } = require('../utils/responseHandler');
let authController = require('../controllers/authController');
require('dotenv').config();

router.post('/register', async function (req, res, next) {
  try {
    let body = req.body;
    let newUser = await authController.CreateAnUser(
      body.email, body.password, body.name, body.role
    );
    CreateSuccessRes(res, jwt.sign({
       id: newUser.id, email: newUser.email,
       expire: (new Date(Date.now() + 60 * 60 * 1000)).getTime()
      }, process.env.JWT_SECRET), 200);
  } catch (error) {
    next(error);
  }
});

router.post('/login', async function (req, res, next) {
  try {
    let body = req.body;
    let user = await userController.CheckLogin(body.username, body.password);
    CreateSuccessRes(res, jwt.sign({ 
      id: user.id, email: user.email,
      expire: (new Date(Date.now() + 60 * 60 * 1000)).getTime()
    }, process.env.JWT_SECRET), 200);
  } catch (error) {
    next(error);
  }
});

module.exports = router;