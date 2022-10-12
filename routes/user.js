// reqiures
const express = require("express");
const { User } = require("../models");
const Joi = require("joi");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
// const authMiddleware = require("../middlewares/auth-middlewares");
const router = express.Router();

const postUsersSchema = Joi.object({
  nickname: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().alphanum().min(4).max(20).required(),
  confirmPassword: Joi.string().alphanum().min(4).max(20).required(),
});

router.post("/signup", async (req, res) => {
  const { nickname, password, confirmPassword } =
    await postUsersSchema.validateAsync(req.body);

  if (password.includes(nickname) || nickname.includes(password)) {
    res.status(400).send({
      errorMessage: "회원가입에 실패하였습니다.",
    });
    return;
  }

  if (password !== confirmPassword) {
    res.status(400).send({
      errorMessage: "패스워드가 패스워드 확인란과 동일하지 않습니다.",
    });
    return;
  }

  const existUsers = await User.findAll({
    where: {
      [Op.or]: [{ nickname }],
    },
  });
  if (existUsers.length) {
    res.status(400).send({
      errorMessage: "중복된 닉네임입니다.",
    });
    return;
  }

  await User.create({ nickname, password });

  res.status(201).send({ message: "회원 가입에 성공하였습니다." });
});

const postAuthSchema = Joi.object({
  nickname: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().alphanum().min(4).max(20).required(),
});

//로그인
router.post("/login", async (req, res) => {
  try {
    const { nickname, password } = await postAuthSchema.validateAsync(req.body);

    const user = await User.findOne({ where: { nickname, password } });

    if (!user) {
      res.status(400).send({
        errorMessage: "닉네임 또는 패스워드를 확인해주세요.",
      });
      return;
    }

    const { authorization } = req.headers;

    if (authorization) {
      res.status(401).send({
        errorMessage: "이미 로그인이 되어있습니다.",
      });
      return;
    }

    const token = jwt.sign(
      { userId: user.userId, nickname: user.nickname },
      "leejun-secret-key"
    );
    res.send({
      token: token,
    });
  } catch (err) {
    console.error(err)
    res.status(400).send({message: err.message});
  }
});

module.exports = router;
