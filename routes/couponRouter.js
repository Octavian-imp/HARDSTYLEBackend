const Router = require("express");
const couponController = require("../controllers/couponController");
const couponRouter = new Router();
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRoleMiddleware");

couponRouter.get("/", couponController.check);
couponRouter.post("/create", checkRole("ADMIN"), couponController.create);
couponRouter.get("/list", couponController.getAll);

module.exports = couponRouter;
