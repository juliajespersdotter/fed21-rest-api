/**
 * Author Validation Rules
 */

const { body } = require('express-validator');
const models = require('../models');

 const createRules = [
     body('title').exists().isLength( { min: 3}),
 ];
 
 // allow only password, first_name, last_name to be updated, only optionally
 const updateRules = [
     body('title').optional().isLength({ min: 3 }),
 ];

 const attachPhotosRules = [
    body('photo_id').exists().isInt().bail().custom(async value => {
        const photo = await new models.Photo({ id : value }).fetch({ require: false });
        if(!photo) {
            return Promise.reject(`Photo with ID ${value} does not exist.`);
        }
        return Promise.resolve();
    })
]
 
 module.exports = {
     createRules,
     updateRules,
     attachPhotosRules
 }