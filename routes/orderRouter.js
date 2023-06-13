const Router = require("express");
const orderRouter = new Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

orderRouter.post("/", authMiddleware, orderController.create);
orderRouter.get("/history", authMiddleware, orderController.getAll);
module.exports = orderRouter;
