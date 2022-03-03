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
     // get user with user id and eager-load the albums relation as second parameter
	const user = await models.User.fetchById(req.user.user_id, { withRelated: ['albums'] });

    res.status(200).send({
        status: 'success',
        data: {
            album: user.related('albums'),
        }
    });
 }
 
 /**
  * Get a specific resource
  *
  * GET /:albumId
  */
 const show = async (req, res) => {
     // get album with album id and eager-load the user relation as second parameter
    const user = await models.User.fetchById(req.user.user_id, { withRelated: ['albums'] });
    const albums = user.related('albums');
    // const album = await models.Album.fetchById(req.params.albumId, {withRelated: ['photos', 'user']});
    // const userAlbum = user.related('albums');cd ..
    // const photos = album.related('photos');
    // const albums = user.related('albums');
    const album = albums.find(album => album.id == req.params.albumId);

    if(!album){
        return res.status(404).send({
            status: 'fail',
            message: 'Album not found'
        });
    }
    // const result = album.load(['photos']);
    // const photosalbum = userAlbum.related('photos').fetchAll();

     res.send({
         status: 'success',
         data: {
             album: album,
         }
     });
 }
 
 /**
  * Store a new resource
  *
  * POST /
  */
 const store = async (req, res) => {
    // check for validation errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).send({ status : "fail", data: errors.array() });
    }

    // get only the valid data from the request
    const validData = matchedData(req); 

    // before attaching relation to user, check so it does not already exist
    const user = await models.User.fetchById(req.user.user_id, { withRelated: ['albums']});
    
    try {    

        // attach relation between new album and user
        const result = await user.albums().attach(validData.album_id);

        debug("Added album successfully: %o", res);
        res.send({
            status: 'success',
            data: {
                result,
            },
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
 
     // make sure user exists
     const album = await new models.Album({ id: albumId }).fetch({ require: false });
     if (!album) {
         debug("Album to update was not found. %o", { id: albumId });
         res.status(404).send({
             status: 'fail',
             data: 'Album Not Found',
         });
         return;
     }
 
     // check for validation errors
     const errors = validationResult(req);
     if(!errors.isEmpty()){
         return res.status(422).send({ status : "fail", data: errors.array() });
     }
 
     // get only the valid data from the request
     const validData = matchedData(req); 
 
     try {
         const updatedAlbum = await album.save(validData);
         debug("Updated author successfully: %O", updatedAlbum);
 
         res.send({
             status: 'success',
             data: {
                 updatedAlbum,
             }
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
     destroy,
 }
 