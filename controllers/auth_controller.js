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
    const { email, password } = req.body;

    // login the user
    const user = await models.User.login(email, password);
    if(!user) {
        return res.status(401).send({
            status: "fail",
            data: 'Authentication failed.',
        });
    }

    // construct jwt payload
    const payload = {
        sub: user.get('email'),
        user_id: user.get('id'),
        name: user.get('first_name') + '.' + user.get('last_name'),    
    }

     // sign payload and get access token
    const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { 
        expiresIn: process.env.ACCESS_TOKEN_LIFETIME || '1h',
    });

    // sign payload and get refresh token
    const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_LIFETIME || '1w',
    });


    // respond with the access-token 
    return res.send({
        status: 'success',
        data: {
            access_token,
            refresh_token,
            user: user // user logged in info
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

/** 
 * Validate refresh token and issue a new access token
 * 
 * POST /refresh
 *
 */

 const refresh = (req, res) => {
    // validate the refresh token (check signature and expiry date)
    try {
        // verify token using the refresh token secret
        const payload = jwt.verify(req.body.token, process.env.REFRESH_TOKEN_SECRET);

        // construct payload
        // remove `iat` and `exp` from refresh token payload
        delete payload.iat;
        delete payload.exp;

        // sign payload and get access token
        const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { 
            expiresIn: process.env.ACCESS_TOKEN_LIFETIME || '1h',
        });

        // sign payload and get refresh token
        const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: process.env.REFRESH_TOKEN_LIFETIME || '1w',
        });

        // send the access token to the client
        return res.send ({
            status: 'success',
            data: {
                access_token,
                refresh_token
            }
        });

    } catch (error) {
        return res.status(401).send({
            status: 'fail',
            data: 'Invalid token'
        });
    }
}

module.exports = {
    register,
    login,
    refresh
}
