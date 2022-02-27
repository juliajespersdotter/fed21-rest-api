/**
 * Register Controller
 */

const debug = require('debug')('books:profile_controller');
const models = require('../models');
const {matchedData, validationResult} = require('express-validator');
const bcrypt = require('bcrypt');

/**
 * Register a new user
 * 
 * POST /
 */

const register = async (req, res) => {
    // check for validation errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).send({ status : "fail", data: errors.array() });
    }

    // get only the valid data from the request
    const validData = matchedData(req); 

    // Replace the password with a hashed password
    try {
        validData.password = await bcrypt.hash(validData.password, 10);
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown when hashing the password.',
        });
    }

    try {
        const user = await new models.User(validData).save();
        debug("Created new user successfully: %O", user);

        res.send({
            status: 'success',
            data: {
                user,
            },
        });

    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown in database when creating a new user.',
        });
        throw error;
    }
}

module.exports = {
    register,
}
