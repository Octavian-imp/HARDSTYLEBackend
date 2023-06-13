const Router = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const favoriteController = require("../controllers/favoriteController");
const favoriteRouter = new Router();

favoriteRouter.post("/add", authMiddleware, favoriteController.create);
favoriteRouter.delete("/delete", authMiddleware, favoriteController.delete);
favoriteRouter.get("/list", authMiddleware, favoriteController.getAll);

module.exports = favoriteRouter;
