// reqiures
const express = require('express');
const routes = require('./routes');
const PORT = 3011;

// express
const app = express();
const router = express.Router();

// Swagger
const { swaggerUi, specs } = require("./swagger/swagger");


// routers
const usersRouter = require("./routes/user");
const postLikesRouter = require("./routes/postLikes");
const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");

// middlewares 첫줄 나중에 '/api 추가'
app.use(express.urlencoded({ extended: false }), router);

app.use(express.json());
app.use([usersRouter, postLikesRouter, postsRouter, commentsRouter]);
router.get("/", (req, res) => {
  res.send({});
});


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.listen(PORT, () => {
  console.log(PORT, '서버를 실행 중 입니다.');
});
