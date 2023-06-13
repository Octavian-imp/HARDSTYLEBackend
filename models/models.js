const sequelize = require("../db");
const { DataTypes } = require("sequelize");
const payment_methods = require("../global/payment_methods");
const status_support_ticket = require("../global/status_support_ticket");

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  avatar: { type: DataTypes.STRING, defaultValue: "defaultAvatar.jpg" },
  birth_date: { type: DataTypes.DATEONLY },
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
  gender: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.DOUBLE, allowNull: false },
  //FIXME: сделать тип данных массивом и добавить обработчики
  img: { type: DataTypes.STRING, allowNull: false },
});

const Category = sequelize.define("category", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const ProductsInfo = sequelize.define("products_info", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  //FIXME: сделать название столбца text
  description: { type: DataTypes.STRING, allowNull: false },
});

const ProductSizes = sequelize.define("product_sizes", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  size: { type: DataTypes.STRING, allowNull: false },
  count: { type: DataTypes.INTEGER, allowNull: false },
});

const Order = sequelize.define("order", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  address: { type: DataTypes.STRING, allowNull: false },
  products: { type: DataTypes.ARRAY(DataTypes.INTEGER), allowNull: false },
  total_cost: { type: DataTypes.DOUBLE, allowNull: false },
  delivery_cost: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
  },
  status: { type: DataTypes.STRING, allowNull: false },
  payment_method: {
    type: DataTypes.ENUM(payment_methods.CARD, payment_methods.CASH),
    allowNull: false,
    defaultValue: payment_methods.CARD,
  },
});

const Favorite = sequelize.define("favorites", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const Coupon = sequelize.define("coupons", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  text: { type: DataTypes.STRING, allowNull: false },
  discount_percent: { type: DataTypes.INTEGER, allowNull: false },
  discount_cost: { type: DataTypes.DOUBLE, allowNull: false },
});

const Support_ticket = sequelize.define("support_tickets", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  theme: { type: DataTypes.STRING, allowNull: false },
  status: {
    type: DataTypes.ENUM(
      status_support_ticket.pending,
      status_support_ticket.completed,
      status_support_ticket.canceled
    ),
    defaultValue: status_support_ticket.pending,
  },
});

const Support_message = sequelize.define("support_messages", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  text: { type: DataTypes.STRING, allowNull: false },
  isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
});

// dependencies Basket
User.hasOne(Basket);
Basket.belongsTo(User);

// dependencies Order
User.hasMany(Order);
Order.belongsTo(User);

// dependencies BasketProduct
Basket.hasMany(BasketProduct);
BasketProduct.belongsTo(Basket);

Product.hasMany(BasketProduct);
BasketProduct.belongsTo(Product);

// Dependencies Product
// BasketProduct.hasOne(Product);
// Product.belongsTo(BasketProduct);

Category.hasMany(Product);
Product.belongsTo(Category);

// dependencies ProductsInfo
Product.hasMany(ProductsInfo, { as: "info" });
ProductsInfo.belongsTo(Product);

// Product.hasMany(BasketProduct, { as: "productId" });
// BasketProduct.belongsTo(Product);

// dependencies ProductSizes
Product.hasMany(ProductSizes, { as: "sizes" });
ProductSizes.belongsTo(Product);

// dependencies Favorite
User.hasMany(Favorite);
Favorite.belongsTo(User);

Product.hasMany(Favorite);
Favorite.belongsTo(Product);

// dependencies Coupon
Product.hasMany(Coupon);
Coupon.belongsTo(Product);

//dependencies Support_ticket
User.hasMany(Support_ticket);
Support_ticket.belongsTo(User);

// dependencies Support_message
Support_ticket.hasMany(Support_message);
Support_message.belongsTo(Support_ticket);

User.hasMany(Support_message);
Support_message.belongsTo(User);

module.exports = {
  User,
  Product,
  ProductsInfo,
  ProductSizes,
  Basket,
  Order,
  BasketProduct,
  Category,
  Favorite,
  Coupon,
  Support_ticket,
  Support_message,
};
