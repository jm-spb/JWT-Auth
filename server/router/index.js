const router = require('express').Router();
const { body } = require('express-validator');
const userController = require('../controllers/user-controller.js');

router.post(
  '/registration',
  body('email').isEmail(),
  body('password').isLength({ min: 6, max: 16 }),
  userController.registration,
);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);

module.exports = router;
