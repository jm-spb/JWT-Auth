const router = require('express').Router();
const userController = require('../controllers/user-controller.js');
const authMiddleware = require('../middlewares/auth-middleware.js');

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.fetchUsers);

module.exports = router;
