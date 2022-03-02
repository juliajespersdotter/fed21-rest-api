const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const userValidationRules = require('../validation/user');
const authController = require('../controllers/auth_controller');

/* GET / */
router.get('/', (req, res, next) => {
	res.send({ success: true, data: { msg: 'oh, hi' }});
});

/**
 * Add jwt token validate
 * 
 */

// register a new user
router.post('/register', userValidationRules.createRules, authController.register);

// login a user and get a JWT token
router.post('/login', authController.login);

// always use for routes underneath
router.use(auth.validateJwtToken);

router.use('/albums', require('./albums'));
router.use('/photos', require('./photos'));
router.use('/profile', auth.validateJwtToken, require('./profile'));
// router.use('/users', require('./users'));



module.exports = router;
