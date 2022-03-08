/**
 * Album Validation Rules
 */

const { body } = require('express-validator');
const models = require('../models');

 const createRules = [
     body('title').exists().isLength( { min: 3}).trim(),
 ];
 
 const updateRules = [
     body('title').optional().isLength({ min: 3 }).trim(),
 ];

 const attachPhotosRules = [
    body('photo_id').exists().isArray().bail().custom(async value => {
        if(!value.every(Number.isInteger)){
            return Promise.reject(`Id must be a number.`);
        }

        // validate photo belongs to user?
        await Promise.all(value.map(async id => {
            const photo = await new models.Photo({id : id}).fetch({ require: false });
            
            if(!photo){
                return Promise.reject(`Photo with ID ${id} does not exist.`);
            }
            else{
                return Promise.resolve();
            }
          }))
    })
]
 
 module.exports = {
     createRules,
     updateRules,
     attachPhotosRules
 }
