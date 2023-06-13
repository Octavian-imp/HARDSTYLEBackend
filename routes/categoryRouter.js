const Router = require("express");
const categoryRouter = new Router();
const categoryController = require("../controllers/categoryController");
const checkRole = require("../middleware/checkRoleMiddleware");

categoryRouter.post("/", checkRole("ADMIN"), categoryController.create);
categoryRouter.get("/", categoryController.getAll);
module.exports = categoryRouter;
