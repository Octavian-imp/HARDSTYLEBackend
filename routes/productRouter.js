const Router = require("express");
const productRouter = new Router();
const productController = require("../controllers/productController");
const checkRole = require("../middleware/checkRoleMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

productRouter.post("/", checkRole("ADMIN"), productController.create);
productRouter.get("/all", checkRole("ADMIN"), productController.getAllCounts);
productRouter.get("/", productController.getAll);
productRouter.get("/:id", productController.getOne);
module.exports = productRouter;
