const ApiError = require("../errors/ApiError");
const payment_methods = require("../global/payment_methods");
const status_order = require("../global/status_order");
const { Order } = require("../models/models");

class OrderController {
  async create(req, res, next) {
    try {
      const userId = req.user.id;
      const { address, totalCost, deliveryCost, paymentMethod } = req.body;
      let { productsId } = req.body;
      // productsId = productsId.replace(/[\][]/g, "").split(",").map(Number);
      const order = await Order.create({
        address,
        products: productsId,
        total_cost: totalCost,
        delivery_cost: deliveryCost,
        status: status_order.created,
        payment_method: paymentMethod,
        userId,
      });
      return res.json(order);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
  async getAll(req, res, next) {
    try {
      const userId = req.user.id;
      const orders = await Order.findAll({
        where: { userId },
      });
      return res.json(orders);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
}

module.exports = new OrderController();
