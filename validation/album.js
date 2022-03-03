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
 
 module.exports = {
     createRules,
     updateRules
 }