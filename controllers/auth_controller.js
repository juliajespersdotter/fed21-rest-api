/**
 * Auth Controller
 */

const debug = require('debug')('photo_album:profile_controller');
const models = require('../models');
const {matchedData, validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/** 
 * Login a user
 * 
 * POST /login
 */

 const login = async (req, res) => {
    // destructure username and password from request body
    const { username, password } = req.body 

    // login the user
    const user = await models.User.login(username, password);
    if(!user) {
        return res.status(401).send({
            status: "fail",
            data: 'Authentication failed.',
        });
    }

    // construct jwt payload
    const payload = {
        sub: user.get('username'),
        user_id: user.get('id'),
        name: user.get('first_name') + '.' + user.get('last_name'),    
    }

    // sign payload and get access-token
    var access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);

    // respond with the access-token 
    return res.send({
        status: 'success',
        data: {
            // here be `access_token`
            access_token,
        }
    })

}



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
    login
}
