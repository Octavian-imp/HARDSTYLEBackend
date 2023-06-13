const ApiError = require("../errors/ApiError");
const { Coupon, Product } = require("../models/models");

class CouponController {
  async create(req, res, next) {
    try {
      const { text, productId, discountPercent, discountCost } = req.body;
      const isExist = await Coupon.findOne({
        where: {
          text,
        },
      });
      if (isExist) {
        return next(ApiError.badRequest("купон уже существует"));
      }
      if (Number(discountPercent) > 99 || Number(discountPercent) < 1) {
        return next(ApiError.badRequest("такой процент недопустим"));
      }
      if (Number(discountCost) < 1) {
        return next(ApiError.badRequest("такая стоимость недопустима"));
      }
      const coupon = await Coupon.create({
        text,
        productId,
        discount_percent: discountPercent,
        discount_cost: discountCost,
      });
      return res.json({ coupon });
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
  async check(req, res, next) {
    try {
      const { text } = req.query;
      const coupon = await Coupon.findOne({
        where: { text },
        include: [{ model: Product, required: true }],
      });
      if (!coupon) {
        return next(ApiError.badRequest("такого купона не существует"));
      }
      return res.json({ coupon });
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
  async getAll(req, res, next) {
    try {
      const coupons = await Coupon.findAll();
      return res.json({ coupons });
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
}
module.exports = new CouponController();
