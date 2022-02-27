const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const userValidationRules = require('../validation/user');
const registerController = require('../controllers/register_controller');

/* GET / */
router.get('/', (req, res, next) => {
	res.send({ success: true, data: { msg: 'oh, hi' }});
});

router.use('/authors', require('./authors'));
router.use('/books', require('./books'));
router.use('/profile', auth.basic , require('./profile'));
// router.use('/users', require('./users'));

// register a new user
router.post('/register', userValidationRules.createRules, registerController.register);

module.exports = router;
