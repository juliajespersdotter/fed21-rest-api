/**
 * Album Validation Rules
 */

const { body } = require('express-validator');
const models = require('../models');

 const createRules = [
     body('title').exists().isLength( { min: 3}),
 ];
 
 const updateRules = [
     body('title').optional().isLength({ min: 3 }),
 ];

 const attachPhotosRules = [
    body('photo_id').exists().isArray({ min: 1 }).bail().custom(async value => {
        if(!value.every(Number.isInteger)){
            return Promise.reject(`Id must be a number.`);
        }

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
