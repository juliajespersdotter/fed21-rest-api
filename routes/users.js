const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');
const registerController = require('../controllers/register_controller');
const validUser = require('../validation/user');

/* Get all resources */
router.get('/', userController.index);

router.post('/register', registerController.register);

/** 
* @todo Create login and refresh controller paths
* 
router.post('/login', ) // log in a user

router.post('/refresh', ) // get a new access token
*/

module.exports = router;
