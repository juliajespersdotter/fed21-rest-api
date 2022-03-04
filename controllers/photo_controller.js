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
    // get user with user id and eager-load the photos relation as second parameter
   const user = await models.User.fetchById(req.user.user_id, { withRelated: ['photos'] });

   res.status(200).send({
       status: 'success',
       data: {
           photo: user.related('photos'),
       }
   });
}

/**
  * Get a specific resource
  *
  * GET /:photoId
  */
 const show = async (req, res) => {
    // get user with user id and eager-load the photo relation as second parameter
   const user = await models.User.fetchById(req.user.user_id, { withRelated: ['photos'] });
   const photos = user.related('photos');

   // check so the photo exists in user related photos
   const photo = photos.find(photo => photo.id == req.params.photoId);

   if(!photo){
       return res.status(404).send({
           status: 'fail',
           message: 'Photo not found'
       });
   }

    res.send({
        status: 'success',
        data: {
            album: photo,
        }
    });
}

const store = async (req, res) => {
    // check for validation errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).send({ status : "fail", data: errors.array() });
    }

    // get only the valid data from the request
    const validData = matchedData(req); 

    validData.user_id = req.user.user_id;

    try {
        // save new album in album table
        const photo = await new models.Photo(validData).save();
        debug('Created new photo successfully: %O', photo);
        res.send({
            status: 'success',
            data: 
                photo,
            });
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown when attempting to add an album.'
        });
        throw error;
    
    }
 }



module.exports = {
    index,
    show,
    store
}