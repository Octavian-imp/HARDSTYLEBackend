const Router = require("express");
const router = new Router();
const productRouter = require("./productRouter");
const categoryRouter = require("./categoryRouter");
const userRouter = require("./userRouter");
const orderRouter = require("./orderRouter");
const favoriteRouter = require("./favoriteRouter");
const couponRouter = require("./couponRouter");
const supportRouter = require("./supportRouter");

router.use("/user", userRouter);
router.use("/category", categoryRouter);
router.use("/product", productRouter);
router.use("/order", orderRouter);
router.use("/favorite", favoriteRouter);
router.use("/coupon", couponRouter);
router.use("/support", supportRouter);

module.exports = router;
