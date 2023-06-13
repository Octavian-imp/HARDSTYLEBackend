const ApiError = require("../errors/ApiError");
const { Category } = require("../models/models");

class CategoryController {
  async create(req, res, next) {
    try {
      const { name } = req?.body;
      const type = await Category.create({ name });
      return res.json(type);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
  async getAll(req, res, next) {
    try {
      const categories = await Category.findAll();
      return res.json(categories);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
}

module.exports = new CategoryController();
