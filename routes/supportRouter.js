const Router = require("express");
const supportRouter = new Router();
const checkRole = require("../middleware/checkRoleMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const supportController = require("../controllers/supportController");

supportRouter.post("/create", authMiddleware, supportController.create);
supportRouter.get(
  "/message/get",
  authMiddleware,
  supportController.getTicketMessages
);
supportRouter.post(
  "/message/send",
  authMiddleware,
  supportController.addNewMessage
);
supportRouter.get("/history", authMiddleware, supportController.getAll);

module.exports = supportRouter;
