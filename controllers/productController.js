const uuid = require("uuid");
const path = require("path");
const { Product, ProductsInfo } = require("../models/models");
const ApiError = require("../errors/ApiError");

class ProductController {
  async create(req, res, next) {
    try {
      let { name, price, categoryId, info } = req.body;
      const { img } = req.files;
      let fileName = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "static", fileName));
      const product = await Product.create({
        name,
        price,
        categoryId,
        img: fileName,
      });
      if (info) {
        info = JSON.parse(info);
        info.forEach((i) => {
          ProductsInfo.create({
            title: i.title,
            description: i.description,
            productId: product.id,
          });
        });
      }

      return res.json(product);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
  async getAll(req, res) {
    let { categoryId, limit, page } = req.query;
    page = page || 1;
    limit = limit || 9;
    let offset = page * limit - limit;
    let products;
    if (!categoryId) {
      products = await Product.findAndCountAll({ limit, offset });
    } else {
      products = await Product.findAndCountAll({
        where: { categoryId },
        limit,
        offset,
      });
    }
    return res.json(products);
  }
  async getOne(req, res) {
    const { id } = req.params;
    const product = await Product.findOne({
      where: { id },
      include: [{ model: ProductsInfo, as: "info" }],
    });
    return res.json(product);
  }
}
module.exports = new ProductController();
