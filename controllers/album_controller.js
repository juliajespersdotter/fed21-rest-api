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
     // get user model to check that the album belongs to them
    const user = await models.User.fetchById(req.user.user_id, { withRelated: ['albums'] });
    const userAlbums = user.related('albums');
    const album = userAlbums.find(album => album.id == req.params.albumId);

    if(!album){
        return res.status(404).send({
            status: 'fail',
            message: 'Album not found'
        });
    }
    const thisAlbum = await models.Album.fetchById(req.params.albumId, {withRelated: ['photos']});

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
    
     const user = await models.User.fetchById(req.user.user_id, { withRelated: ['albums'] });
     const userAlbums = user.related('albums');
     const userAlbum = userAlbums.find(album => album.id == req.params.albumId);


    // check so that the album exists in user list and album list
     const album = await new models.Album({ id: albumId }).fetch({ require: false });
     if (!album || !userAlbum) {
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
     validData.user_id = req.user.user_id;
 
     try {
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
 