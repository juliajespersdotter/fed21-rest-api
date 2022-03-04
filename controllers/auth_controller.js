/**
 * Auth Controller
 */

const debug = require('debug')('photo_album:profile_controller');
const models = require('../models');
const {matchedData, validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/** 
 * Login user
 * 
 * POST /login
 */

 const login = async (req, res) => {
    // destructure username and password from request body
    const { email, password } = req.body;

    // login user
    const user = await models.User.login(email, password);
    if(!user) {
        return res.status(401).send({
            status: "fail",
            data: 'Authentication failed.',
        });
    }

    // jwt payload
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

    return res.send({
        status: 'success',
        data: {
            access_token,
            refresh_token,
        }
    })

}



/**
 * Register a new user
 * 
 * POST /
 */

const register = async (req, res) => {
    // before creating new user, validate data
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).send({ status : "fail", data: errors.array() });
    }

    // get valid data
    const validData = matchedData(req); 

    // hash password
    try {
        validData.password = await bcrypt.hash(validData.password, 10);
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown when hashing the password.',
        });
    }

    try {
        // save valid data 
        const user = await new models.User(validData).save();
        debug("Created new user successfully: %O", user);

        // return only data that can be possible, not password
        res.send({
            status: 'success',
            data: {
                email: validData.email,
                first_name: validData.first_name,
                last_name: validData.last_name
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
    try {
        // verify token using the refresh token secret
        const payload = jwt.verify(req.body.token, process.env.REFRESH_TOKEN_SECRET);

        delete payload.iat;
        delete payload.exp;

        // sign and get access token
        const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { 
            expiresIn: process.env.ACCESS_TOKEN_LIFETIME || '1h',
        });

        // sign and get refresh token
        const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: process.env.REFRESH_TOKEN_LIFETIME || '1w',
        });

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
