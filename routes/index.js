const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const userValidationRules = require('../validation/user');
const authController = require('../controllers/auth_controller');

/* GET / */
router.get('/', (req, res, next) => {
	res.send({ success: true, data: { msg: 'we are up and running!' }});
});

// register a new user
router.post('/register', userValidationRules.createRules, authController.register);

// login a user and get a JWT token
router.post('/login', authController.login);

// issue a new access token

router.post('/refresh', authController.refresh);

// always use for routes underneath
router.use(auth.validateJwtToken);

router.use('/albums', require('./albums'));
router.use('/photos', require('./photos'));
// router.use('/profile', auth.validateJwtToken, require('./profile')); // not needed?


module.exports = router;
