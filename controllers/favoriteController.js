const ApiError = require("../errors/ApiError");
const { Favorite, Product } = require("../models/models");

class FavoriteController {
  async create(req, res, next) {
    try {
      const userId = req.user.id;
      const { productId } = req.query;
      const isExist = await Favorite.findOne({ where: { userId, productId } });
      if (isExist) {
        return next(ApiError.manyRequests("товар уже в избранном"));
      }
      const favorite = await Favorite.create({
        productId,
        userId,
      });
      return res.json(favorite);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
  async delete(req, res, next) {
    try {
      const userId = req.user.id;
      const { productId } = req.query;
      const favorite = await Favorite.destroy({
        where: { productId, userId },
      });
      return res.json(favorite);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
  async getAll(req, res, next) {
    try {
      const userId = req.user.id;
      const favorites = await Favorite.findAll({
        where: { userId },
        include: [{ model: Product, right: true }],
      });
      return res.json(favorites);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
}

module.exports = new FavoriteController();
