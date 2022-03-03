/**
 * Author Validation Rules
 */

 const { body } = require('express-validator');

 const createRules = [
     body('title').exists().isLength( { min: 3 }),
     body('url').exists().isLength({ min: 2 }),
     body('comment').exists().isLength({ min: 3 }),
 ];
 
 const updateRules = [
     body('title').optional().isLength({ min: 2 }),
     body('url').optional().isLength({ min: 2 }),
     body('comment').optional().isLength({ min: 3}),
 ];
 
 module.exports = {
     createRules,
     updateRules
 }