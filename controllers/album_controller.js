/**
 * Album Controller
 */

 const debug = require('debug')('books:author_controller');
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
    const album = await models.Album.fetchById(req.params.bookId, { withRelated: ['user'] });
 
     res.send({
         status: 'success',
         data: {
             album,
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
 
     try {
         const album = await new models.Album(validData).save();
         debug("Created new album successfully: %O", album);
 
         res.send({
             status: 'success',
             data: {
                 author,
             }
         });
 
     } catch (error) {
         res.status(500).send({
             status: 'error',
             message: 'Exception thrown in database when creating a new author.',
         });
         throw error;
     }
 }
 
 /**
  * Update a specific resource
  *
  * POST /:authorId
  */
 const update = async (req, res) => {
     const authorId = req.params.authorId;
 
     // make sure user exists
     const author = await new models.Author({ id: authorId }).fetch({ require: false });
     if (!author) {
         debug("Author to update was not found. %o", { id: authorId });
         res.status(404).send({
             status: 'fail',
             data: 'Author Not Found',
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
         const updatedAuthor = await author.save(validData);
         debug("Updated author successfully: %O", updatedAuthor);
 
         res.send({
             status: 'success',
             data: {
                 updatedAuthor,
             }
         });
 
     } catch (error) {
         res.status(500).send({
             status: 'error',
             message: 'Exception thrown in database when updating a new author.',
         });
         throw error;
     }
 }
 
 /**
  * Destroy a specific resource
  *
  * DELETE /:authorId
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
 