const ApiError = require("../errors/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Basket } = require("../models/models");

const generateJwt = (id, email, role, username) => {
  return jwt.sign({ id, email, role, username }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

class UserController {
  async registration(req, res, next) {
    const { email, password, role, username } = req.body;
    if (!email || !password) {
      return next(ApiError.badRequest("Некорректный email или пароль"));
    }
    const candidateEmail = await User.findOne({ where: { email } });
    const candidateUsername = await User.findOne({ where: { username } });
    if (candidateEmail || candidateUsername) {
      return next(
        ApiError.badRequest(
          "Пользователь с таким email или username уже существует"
        )
      );
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const user = await User.create({
      email,
      role,
      password: hashPassword,
      username,
    });
    const basket = await Basket.create({ userId: user.id });
    const token = generateJwt(user.id, user.email, user.role, user.username);
    return res.json({ token });
  }
  async login(req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(
        ApiError.internal("Пользователя с таким email не существует")
      );
    }
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.internal("Указан неверный пароль"));
    }
    const token = generateJwt(user.id, user.email, user.role, user.username);
    return res.json({ token });
  }
  async check(req, res, next) {
    const token = generateJwt(
      req.user.id,
      req.user.email,
      req.user.role,
      req.user.username
    );
    res.json({ token });
  }
}

module.exports = new UserController();
