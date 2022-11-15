const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  username: { type: DataTypes.STRING, unique: true },
  avatar: { type: DataTypes.STRING, defaultValue: "defaultAvatar.png" },
  role: { type: DataTypes.STRING, defaultValue: "USER" },
});

const Basket = sequelize.define("basket", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const BasketProduct = sequelize.define("basket_product", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const Product = sequelize.define("product", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  price: { type: DataTypes.DOUBLE, allowNull: false },
  img: { type: DataTypes.STRING, allowNull: false },
});

const Category = sequelize.define("category", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const ProductsInfo = sequelize.define("products_info", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
});

const ProductSizes = sequelize.define("product_sizes", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  size: { type: DataTypes.STRING, allowNull: false },
  count: { type: DataTypes.INTEGER, allowNull: false },
});

User.hasOne(Basket);
Basket.belongsTo(User);

Basket.hasMany(BasketProduct);
BasketProduct.belongsTo(Basket);

BasketProduct.hasOne(Product);
Product.belongsTo(BasketProduct);

Product.hasMany(ProductsInfo, { as: "info" });
ProductsInfo.belongsTo(Product);

Product.hasMany(ProductSizes, { as: "sizes" });
ProductSizes.belongsTo(Product);

Category.hasMany(Product);
Product.belongsTo(Category);

module.exports = {
  User,
  Product,
  ProductsInfo,
  ProductSizes,
  Basket,
  BasketProduct,
  Category,
};
