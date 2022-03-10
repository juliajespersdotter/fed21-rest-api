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
       data: 
           user.related('photos'),
   });
}

/**
  * Get a specific resource
  *
  * GET /:photoId
  */
 const show = async (req, res) => {
    const photoId = req.params.photoId;
    // fetch user with related photos
   const user = await models.User.fetchById(req.user.user_id, { withRelated: ['photos'] });

   // check so the photo exists in user related photos
   const userPhoto = user.related('photos').find(photo => photo.id == photoId);

   if (!userPhoto) {
        debug("Photo to show does not belong to user. %o", { id: photoId });
        return res.status(403).send({
            status: 'fail',
            data: 'Photo does not belong to user.',
        });
    }

    res.send({
        status: 'success',
        data: 
            userPhoto,
    });
}


/** 
 * Store a new resource
 * 
 * POST /
 */
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
        // save new photo in photo table
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
            message: 'Exception thrown when attempting to add photo.'
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

    // fetch photo model
    const photo = await models.Photo.fetchById(photoId);

    // if photo does not belong to user
    if (!userPhoto) {
        debug("Photo to update does not belong to user. %o", { id: photoId });
        return res.status(403).send({
            status: 'fail',
            data: 'Photo does not belong to user.',
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


/** 
 * Destroy a specific resource
 * 
 * DELETE /:photoId
 */

const destroy = async (req, res) => {
    const photoId = req.params.photoId;

    // fetch user with related photos
	const user = await models.User.fetchById(req.user.user_id, { withRelated: ['photos'] });

    // find the photo in user list
	const userPhoto = user.related('photos').find(photo => photo.id == photoId)

    const photo = await models.Photo.fetchById(photoId, { withRelated: ['albums'] });

    if(!userPhoto) {
        debug("Photo to delete does not belong to user. %o", { id: photoId });
        return res.status(403).send({
            status:'fail',
            data: 'Photo does not belong to user.'
        });
    }

    try {
        // destroy photo with id from request parameters
        await photo.albums().detach();
        await new models.Photo({id: photoId}).destroy();

        debug("Deleted photo successfully: %O", res);
        res.send({
            status: 'success',
            data:   
                null,
        });
    } catch (error) {
        res.status(500).send({
			status: 'error',
			message: "Exception thrown when attempting to delete photo",
		});
		throw error;
    }
 }





module.exports = {
    index,
    show,
    store,
    update,
    destroy
}