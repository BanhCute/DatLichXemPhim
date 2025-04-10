const express = require("express");
const router = express.Router();
const showTimeController = require("../controllers/showTimeController");
const authMiddleware = require("../middleware/authMiddleware");

// Routes công khai
router.get("/movie/:movieId", showTimeController.GetByMovie);
router.get("/:id", showTimeController.GetById);

// Routes cần xác thực
router.post("/", authMiddleware, showTimeController.Create);
router.put("/:id", authMiddleware, showTimeController.Update);
router.delete("/:id", authMiddleware, showTimeController.Delete);
router.get("/:id/seats", authMiddleware, showTimeController.GetSeats);

module.exports = router;
