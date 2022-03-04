/**
 * Photo Validation Rules
 */

 const { body } = require('express-validator');

 /**
  * @todo 
  * 1. Make rule to validate url is valid url
  */

 const createRules = [
     body('title').exists().isLength( { min: 3 }).trim(),
     body('url').exists().isURL().isLength({ min: 2 }).trim(),
     body('comment').exists().isLength({ min: 3 }).trim(),
 ];
 
 const updateRules = [
     body('title').optional().isLength({ min: 2 }).trim(),
     body('url').optional().isLength({ min: 2 }).trim(),
     body('comment').optional().isLength({ min: 3}).trim(),
 ];
 
 module.exports = {
     createRules,
     updateRules
 }