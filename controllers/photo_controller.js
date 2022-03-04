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
    // fetch user with related photos
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
    // fetch user with related photos
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
    // Checking after errors before adding photo
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).send({ status : "fail", data: errors.array() });
    }

    // get valid data
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

 /**
  * Update a specific resource
  *
  * POST /:photoId
  */
  const update = async (req, res) => {
    const photoId = req.params.photoId;

    // fetch user with related photos
    const user = await models.User.fetchById(req.user.user_id, { withRelated: ['photos'] });
    
    // find photo to update in user list
    const userPhoto = user.related('photos').find(photo => photo.id == photoId);

    // make sure photo exists
    const photo = await models.Photo.fetchById(photoId);
    if (!photo) {
        debug("Photo to update was not found. %o", { id: photoId });
        res.status(404).send({
            status: 'fail',
            data: 'Photo Not Found',
        });
        return;
    }
    if(!userPhoto) {
        debug("Photo to update does not belong to you. %o", { id: photoId });
        res.status(403).send({
            status:'fail',
            data: 'You are not authorized for this action.'
        });
    }

    // check after errors before updating photo
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).send({ status : "fail", data: errors.array() });
    }

    // get valid data
    const validData = matchedData(req); 
    validData.user_id = req.user.user_id;

    try {
        // save updated photo data in photo table
        const updatedPhoto = await photo.save(validData);
        debug("Updated photo successfully: %O", updatedPhoto);

        res.send({
            status: 'success',
            data: 
                updatedPhoto,
        });

    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown in database when updating a new photo.',
        });
        throw error;
    }
}




module.exports = {
    index,
    show,
    store,
    update
}