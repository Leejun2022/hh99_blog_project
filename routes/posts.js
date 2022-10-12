const express = require("express");
const { Post } = require("../models");
const Joi = require("joi");
const authMiddleware = require("../middlewares/auth-middlewares");
const router = express.Router();

const postSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
});

//게시글 작성
router.post("/posts", authMiddleware, async (req, res) => {
  try {
    const { title, content } = await postSchema.validateAsync(req.body);
    const { user } = res.locals;
    let likes = 0;
    await Post.create({
      userId: user.userId,
      nickname: user.nickname,
      title,
      content,
      likes,
    });
    res.status(201).send({ message: "게시물 등록을 완료했습니다!" });
  } catch (error) {
    console.error(error)
    res.status(400).send({ errorMessage: error.message });
  }
});

// 목록조회
router.get("/posts", async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      attributes: {
        exclude: ["content"],
      },
    });

    res.json({
      data: posts,
    });
  } catch (err) {
    res.status(400).send({ errorMessage: "요청에 실패하였습니다." });
  }
});

// 상세조회
router.get("/posts/:postId", async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await Post.findOne({
      where: {
        postId,
      },
    });

    res.json({ data: post });
  } catch (err) {
    res.status(400).send({ errorMessage: "요청에 실패하였습니다." });
  }
});

// 게시물 수정
router.put("/posts/:postId", authMiddleware, async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { title, content } = await postPutSchema.validateAsync(req.body);

    const { user } = res.locals;
    const post = await Post.findOne({
      where: {
        postId,
      },
    });
    if (user.userId !== post.dataValues.userId) {
      res
        .status(400)
        .send({ errorMessage: "로그인된 사용자와 게시자가 다릅니다." });
      return;
    }
    // updatedAt초기화
    // let updatedAt = new Date(); // sql은 자동으로 업데이트 됨
    await post.update(
      { title, content },
      {
        where: { postId },
      }
    );
    res.send({
      message: "게시글을 수정하였습니다.",
    });
  } catch (err) {
    res.status(400).send({ errorMessage: "요청에 실패하였습니다." });
  }
});

//게시글 삭제
router.delete("/posts/:postId", authMiddleware, async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { user } = res.locals;
    const post = await Post.findOne({
      where: {
        postId,
      },
    });
    if (user.userId !== post.dataValues.userId) {
      res
        .status(400)
        .send({ errorMessage: "로그인된 사용자와 게시자가 다릅니다." });
      return;
    }

    await post.destroy({
      where: {
        postId,
      },
    });

    res.send({ message: "게시글을 삭제하였습니다." });
  } catch (err) {
    res.status(400).send({ errorMessage: "요청에 실패하였습니다." });
  }
});

module.exports = router;
