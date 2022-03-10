/**
 * User Validation Rules
 */

const { body } = require('express-validator');
const models = require('../models');

const createRules = [
    body('email').exists().isEmail().normalizeEmail().custom(async value => { 
        const user = await new models.User({ email : value }).fetch({ require : false});
        if (user) {
            return Promise.reject("Email is already in use.");  // duplicate emails not allowed
        }

        return Promise.resolve();
    }),
    body('password').exists().isLength({ min: 6 }).trim(),
    body('first_name').exists().isLength({ min: 3 }).trim(),
    body('last_name').exists().isLength({ min: 3 }).trim(),
];

const loginRules = [
    body('email').exists().isEmail().normalizeEmail(),
    body('password').exists().isLength({ min: 6 }).trim(),
]


const updateRules = [
    body('password').optional().isLength({ min: 6 }).trim(),
    body('first_name').optional().isLength({ min: 3 }).trim(),
    body('last_name').optional().isLength({ min: 3 }).trim(),
];

module.exports = {
    createRules,
    updateRules,
    loginRules
}