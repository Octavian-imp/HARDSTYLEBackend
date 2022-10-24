const Router = require("express");
const router = new Router();
const productRouter = require("./productRouter");
const categoryRouter = require("./categoryRouter");
const userRouter = require("./userRouter");

router.use("/user", userRouter);
router.use("/category", categoryRouter);
router.use("/product", productRouter);

module.exports = router;
