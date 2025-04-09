var express = require('express');
var router = express.Router();
let genreController = require('../controllers/genreController');
let { CreateSuccessRes } = require('../utils/responseHandler');
const { CheckAuth, CheckRole } = require('../utils/check_auth');

router.get('/', async function (req, res, next) {
  try {
    let genres = await genreController.GetAll();
    CreateSuccessRes(res, genres, 200);
  } catch (error) {
    next(error);
  }
});

router.post('/', [CheckAuth, CheckRole], async function (req, res, next) {
  try {
    let body = req.body;
    let newGenre = await genreController.Create(body);
    CreateSuccessRes(res, newGenre, 201);
  } catch (error) {
    next(error);
  }
});

module.exports = router;