/**
 * Photo Controller
 */

 const debug = require('debug')('photo_album:photo_controller');
 const models = require('../models');
 const {matchedData, validationResult } = require('express-validator');
 

 /**
  * Get all resources
  *
  * GET /
  */
  const index = async (req, res) => {
    // get user with user id and eager-load the albums relation as second parameter
   const user = await models.User.fetchById(req.user.user_id, { withRelated: ['photos'] });

   res.status(200).send({
       status: 'success',
       data: {
           photo: user.related('photos'),
       }
   });
}

module.exports = {
    index,
}