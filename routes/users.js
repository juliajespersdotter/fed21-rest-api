const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');
const validUser = require('../validation/user');

/* Get all resources */
router.get('/', userController.index);

/* Get a specific resource */
router.get('/:userId', userController.show);

/* Store a new resource */
router.post('/', validUser.createRules , userController.store);

/* Update a specific resource */
router.put('/:userId', validUser.updateRules, userController.update);

/* Destroy a specific resource */
router.delete('/:userId', userController.destroy);

module.exports = router;
