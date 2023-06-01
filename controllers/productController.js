const uuid = require("uuid");
const path = require("path");
const { Product, ProductsInfo, ProductSizes } = require("../models/models");
const ApiError = require("../errors/ApiError");

class ProductController {
  async create(req, res, next) {
    try {
      let { name, gender, price, categoryId, sizes, info } = req.body;
      const { img } = req.files;
      let fileName = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "static", fileName));
      price = Number(price);
      categoryId = Number(categoryId);
      const product = await Product.create({
        name,
        gender,
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
      if (sizes) {
        sizes = JSON.parse(sizes);
        sizes.forEach((i) => {
          ProductSizes.create({
            size: i.size,
            count: i.count,
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
    let { gender, limit, page, sort } = req.query;
    page = page >= 1 ? page : 1;
    limit = limit;
    let offset = page * limit - limit;
    let products;
    let columnName;
    let order = "asc";
    if (sort === "ascname") {
      columnName = "name";
      order = "asc";
    } else if (sort === "novelty") {
      columnName = "createdAt";
      order = "desc";
    } else if (sort === "ascprice") {
      columnName = "price";
      order = "asc";
    } else if (sort === "descprice") {
      columnName = "price";
      order = "desc";
    }
    // получение товаров по полу. Было по 'CategoryId'
    if (!gender) {
      products = await Product.findAndCountAll({
        order: [[columnName, order]],
        limit,
        offset,
        include: [{ model: ProductSizes, as: "sizes" }],
      });
    } else {
      products = await Product.findAndCountAll({
        where: { gender },
        order: [[columnName, order]],
        limit,
        offset,
        include: [{ model: ProductSizes, as: "sizes" }],
      });
    }
    return res.json(products);
  }
  async getAllCounts(req, res) {
    let products = await Product.findAll({
      include: [{ model: ProductSizes, as: "sizes" }],
    });
    return res.json(products);
  }
  async getOne(req, res) {
    const { id } = req.params;
    const product = await Product.findOne({
      where: { id },
      include: [
        { model: ProductsInfo, as: "info" },
        { model: ProductSizes, as: "sizes" },
      ],
    });
    return res.json(product);
  }
}
module.exports = new ProductController();
