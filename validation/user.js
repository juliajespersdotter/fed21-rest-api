/**
 * User Validation Rules
 */

const { body } = require('express-validator');
const models = require('../models');

const createRules = [
    body('email').exists().isLength( { min: 3 }).custom(async value => { // custom rule
        const user = await new models.User({ email : value }).fetch({ require : false});
        if (user) {
            return Promise.reject("Email already exists.");  // duplicate usernames not allowed
        }

        return Promise.resolve();
    }),
    body('password').exists().isLength({ min: 4 }),
    body('first_name').exists().isLength({ min: 2 }),
    body('last_name').exists().isLength({ min: 2 }),
];

// allow only password, first_name, last_name to be updated, only optionally
// we dont want usernames to be changeable
const updateRules = [
    body('password').optional().isLength({ min: 4 }),
    body('first_name').optional().isLength({ min: 2 }),
    body('last_name').optional().isLength({ min: 2 }),
];

module.exports = {
    createRules,
    updateRules
}