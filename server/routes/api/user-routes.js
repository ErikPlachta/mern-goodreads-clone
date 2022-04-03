const router = require('express').Router();
const {
  createUser,
  getSingleUser,
  saveBook,
  deleteBook,
  login,
} = require('../../controllers/user-controller');

// import middleware
const { authMiddleware } = require('../../utils/auth');

// put authMiddleware anywhere we need to send a token for verification of user
//TODO:: 04/03/2022 #EP || Update with GraphQL Middleware
router.route('/').post(createUser).put(authMiddleware, saveBook);

router.route('/login').post(login);
//TODO:: 04/03/2022 #EP || Update with GraphQL Middleware
router.route('/me').get(authMiddleware, getSingleUser);
//TODO:: 04/03/2022 #EP || Update with GraphQL Middleware
router.route('/books/:bookId').delete(authMiddleware, deleteBook);

module.exports = router;
