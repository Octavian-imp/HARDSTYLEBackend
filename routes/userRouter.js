const Router = require("express");
const userController = require("../controllers/userController");
const userRouter = new Router();
const authMiddleware = require("../middleware/authMiddleware");

userRouter.post("/registration", userController.registration);
userRouter.post("/login", userController.login);
userRouter.get("/auth", authMiddleware, userController.check);
userRouter.post("/update", userController.update);
module.exports = userRouter;
