// reqiures
const express = require('express');
const routes = require('./routes');
const PORT = 3011;

// express
const app = express();
const router = express.Router();

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output')


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


app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.listen(PORT, () => {
  console.log(PORT, '서버를 실행 중 입니다.');
});
