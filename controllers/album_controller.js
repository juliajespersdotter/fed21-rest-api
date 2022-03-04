/**
 * Album Controller
 */

 const debug = require('debug')('photo_album:album_controller');
 const models = require('../models');
 const {matchedData, validationResult } = require('express-validator');
 
 /**
  * Get all resources
  *
  * GET /
  */
 const index = async (req, res) => {
     // fetch user with related albums
	const user = await models.User.fetchById(req.user.user_id, { withRelated: ['albums'] });

    res.status(200).send({
        status: 'success',
        data: {
            albums: user.related('albums'),
        }
    });
 }
 
 /**
  * Get a specific resource
  *
  * GET /:albumId
  */
 const show = async (req, res) => {
     const albumId = req.params.albumId

     // fetch user with related albums
    const user = await models.User.fetchById(req.user.user_id, { withRelated: ['albums'] });

    // find album in user album list
    const album = user.related('albums').find(album => album.id == albumId);

    if(!album){
        return res.status(404).send({
            status: 'fail',
            message: 'Album not found'
        });
    }
    // fetch album with related photos
    const thisAlbum = await models.Album.fetchById(albumId, { withRelated: ['photos'] });

     res.send({
         status: 'success',
         data: 
            thisAlbum,
     });
 }
 
 /**
  * Store a new resource
  *
  * POST /
  */
 const store = async (req, res) => {
    // make sure the data is validated before post
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).send({ status : "fail", data: errors.array() });
    }

    // get valid data
    const validData = matchedData(req); 

    validData.user_id = req.user.user_id;

    try {
        // save new album in album table
        const album = await new models.Album(validData).save();
        debug('Created new album successfully: %O', album);

        debug("Added album successfully: %o", res);
        res.send({
            status: 'success',
            data: 
                album,
            });
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown when attempting to add a photo.'
        });
        throw error;
    
    }
 }

 
 /**
  * Update a specific resource
  *
  * POST /:albumId
  */
 const update = async (req, res) => {
     const albumId = req.params.albumId;
    
     // fetch user with related albums
     const user = await models.User.fetchById(req.user.user_id, { withRelated: ['albums'] });

    // find album with /:albumId in user albums
     const userAlbum = user.related('albums').find(album => album.id == req.params.albumId);

     // make sure album exists
     const album = await models.Album.fetchById(req.params.albumId);

     // if album does not exist
     if (!album) {
         debug("Album to update was not found. %o", { id: albumId });
         res.status(404).send({
             status: 'fail',
             data: 'Album Not Found',
         });
         return;
     }
     // if album does not belong to user
     if(!userAlbum) {
         debug("Album to update does not belong to you. %o", { id: albumId });
         res.status(403).send({
             status:'fail',
             data: 'You are not authorized for this action.'
         });
         return;
     }
 
     // if everything is ok, check for validation errors
     const errors = validationResult(req);
     if(!errors.isEmpty()){
         return res.status(422).send({ status : "fail", data: errors.array() });
     }
 
     // get valid data
     const validData = matchedData(req); 
     validData.user_id = req.user.user_id;
 
     try {
         // save valid data from body to album table
         const updatedAlbum = await album.save(validData);
         debug("Updated album successfully: %O", updatedAlbum);
 
         res.send({
             status: 'success',
             data: 
                 updatedAlbum,
         });
 
     } catch (error) {
         res.status(500).send({
             status: 'error',
             message: 'Exception thrown in database when updating a new album.',
         });
         throw error;
     }
 }


/**
 * Add existing photo to album
 *
 * POST /albums/albumId/photos
 */
 const attachPhotos = async (req, res) => {
    const albumId = req.params.albumId;

    // Checking after errors before adding photo
	const errors = validationResult(req);
	if(!errors.isEmpty()){
		return res.status(422).send({ status : "fail", data: errors.array() });
	}
	const validData = matchedData(req); 

	// fetch user with related albums
	const user = await models.User.fetchById(req.user.user_id, { withRelated: ['albums'] });

	// get the user's albums
	const userAlbum = user.related('albums').find(album => album.id == albumId)

    // make sure album with /:albumId exists
    const album = await models.Album.fetchById(albumId, { withRelated: ['photos'] });

    // check specific album for the photo we want to add
    const existing_photo = album.related('photos').find(photo => photo.id == validData.photo_id);

    // if the album does not exist
    if (!album) {
        debug("Album to update was not found. %o", { id: albumId });
        res.status(404).send({
            status: 'fail',
            data: 'Album Not Found',
        });
        return;
    }

    // if the photo is already in the album
    if(existing_photo) {
        return res.send({
			status: 'fail',
			data: "Photo already exists",
		});
	}

    // if the album does not belong to the user
    if(!userAlbum) {
        debug("Album to update does not belong to you. %o", { id: albumId });
        res.status(403).send({
            status:'fail',
            data: 'You are not authorized for this action.'
        });
        return;
    }
    
	try {
        // attach new relation between photo and album, insert into albums_photos table
        await album.photos().attach(validData.photo_id);

        debug("Added photo successfully: %O", res);
        res.send({
            status: 'success',
            data:   
                null,
        });

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: "Exception thrown when attempting to add photo",
		});
		throw error;
	}
}

 
 /**
  * Destroy a specific resource
  *
  * DELETE /:albumId
  */
 const destroy = (req, res) => {
     res.status(405).send({
         status: 'fail',
         message: 'Method Not Allowed.',
     });
 }
 
 module.exports = {
     index,
     show,
     store,
     update,
     attachPhotos,
     destroy,
 }
 