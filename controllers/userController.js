const ApiError = require("../errors/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const path = require("path");
const { User, Basket } = require("../models/models");

const generateJwt = (
  id,
  email,
  role,
  username,
  avatar = "defaultAvatar.jpg",
  birthDay
) => {
  return jwt.sign(
    { id, email, role, username, avatar, birthDay },
    process.env.SECRET_KEY,
    {
      expiresIn: "24h",
    }
  );
};

class UserController {
  async registration(req, res, next) {
    try {
      const { email, password, role, username } = req?.body;
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
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
  async update(req, res, next) {
    try {
      const { id, newUsername, birthDay } = req.body;
      if (req.files.length > 0) {
        const { newAvatar } = req.files;
        const fileName = uuid.v4() + ".jpg";
        newAvatar.mv(path.resolve(__dirname, "..", "static", fileName));
        await User.update(
          {
            username: newUsername,
            avatar: fileName,
            birth_date: birthDay,
          },
          {
            where: { id },
          }
        );
      } else {
        await User.update(
          {
            username: newUsername,
            birth_date: birthDay,
          },
          {
            where: { id },
          }
        );
      }
      const user = await User.findOne({ where: { id } });
      const token = generateJwt(
        user.id,
        user.email,
        user.role,
        user.username,
        user.avatar,
        user.birth_date
      );
      return res.json({ token });
    } catch (error) {
      return next(ApiError.badRequest(error.message));
    }
  }
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return next(
          ApiError.arguments(
            "Указано недопустимое значение для email или password"
          )
        );
      }
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return next(
          ApiError.internal("Пользователя с таким email не существует")
        );
      }
      let comparePassword = bcrypt.compareSync(password, user.password);
      if (!comparePassword) {
        throw next(ApiError.internal("Указан неверный пароль"));
      }
      const token = generateJwt(
        user.id,
        user.email,
        user.role,
        user.username,
        user.avatar,
        user.birth_date
      );
      return res.json({ token });
    } catch (error) {
      return next(ApiError.badRequest(error.message));
    }
  }
  async check(req, res, next) {
    try {
      const token = generateJwt(
        req.user.id,
        req.user.email,
        req.user.role,
        req.user.username,
        req.user.avatar,
        req.user.birthDay
      );
      return res.json({ token });
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
}

module.exports = new UserController();
