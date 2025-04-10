const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");
const authMiddleware = require("../middleware/authMiddleware");

// Routes công khai - không cần đăng nhập
router.get("/", movieController.GetAll);
router.get("/:id", movieController.GetById);

// Routes cần xác thực
router.post("/", authMiddleware, movieController.Create);
router.put("/:id", authMiddleware, movieController.Update);
router.delete("/:id", authMiddleware, movieController.Delete);

module.exports = router;
