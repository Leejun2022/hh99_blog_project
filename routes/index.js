const express = require('express');
const router = express.Router();

const usersRouter = require('./user.js');
const postsRouter = require('./posts.js');
const commentsRouter = require('./comments.js');
const postLikeRouter = require('./postLikes.js');


router.use('/users', [usersRouter]);
router.use('/posts', [postsRouter]);
router.use('/comments', [commentsRouter]);
router.use('/postlike', [postLikeRouter]);

module.exports = router;