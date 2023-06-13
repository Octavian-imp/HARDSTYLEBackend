const ApiError = require("../errors/ApiError");
const status_support_ticket = require("../global/status_support_ticket");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");
const { Support_ticket, Support_message } = require("../models/models");

class SupportController {
  async create(req, res, next) {
    try {
      const { theme, text } = req.body;
      const user = req.user;
      const isExist = await Support_ticket.findOne({
        where: {
          userId: user.id,
          theme,
        },
      });
      const isAdmin = user.role === "ADMIN";
      if (isExist) {
        return next(ApiError.badRequest("запрос с такой темой уже существует"));
      }
      const ticket = await Support_ticket.create({
        userId: user.id,
        theme,
        status: status_support_ticket.pending,
      });
      await Support_message.create({
        supportTicketId: ticket.id,
        userId: user.id,
        text,
        isAdmin,
      });
      return res.json({ ticket });
    } catch (error) {
      next(ApiError);
    }
  }
  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const messages = await Support_message.findAll({
        where: {
          supportTicketId: id,
        },
      });
      return res.json({ messages });
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
  async getAll(req, res, next) {
    try {
      const user = req.user;
      const tickets = await Support_ticket.findAll({
        where: {
          userId: user.id,
        },
      });
      return res.json({ tickets });
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
}

module.exports = new SupportController();
