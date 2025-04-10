const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");

// Tất cả routes booking đều cần xác thực
router.use(authMiddleware);

// Đặt route my-bookings trước các route khác
router.get("/my-bookings", bookingController.GetMyBookings);

router.get("/", bookingController.GetAll);
router.get("/:id", bookingController.GetById);
router.post("/", bookingController.Create);
router.put("/:id", bookingController.Update);
router.delete("/:id", bookingController.Delete);

module.exports = router;
