const router = require('express').Router();
const { body } = require('express-validator');
const {
  userRegistration,
  userActivate,
  userRefresh,
  userLogin,
  userLogout,
} = require('../controllers/user-controller.js');

router.post(
  '/registration',
  body('email').isEmail(),
  body('password').isLength({ min: 6, max: 16 }),
  userRegistration,
);
router.post('/login', userLogin);
router.post('/logout', userLogout);
router.get('/activate/:link', userActivate);
router.get('/refresh', userRefresh);

module.exports = router;
