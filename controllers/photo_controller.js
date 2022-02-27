/**
 * Photo Controller
 */

const debug = require('debug')('photos:photo_controller');
const models = require('../models');
const {matchedData, validationResult } = require('express-validator');

/**
 * Get all resources
 *
 * GET /
 */
const index = async (req, res) => {
	const all_photos = await models.Photo.fetchAll();

	res.send({
		status: 'success',
		data: {
			photos: all_photos
		}
	});
}

/**
 * Get a specific resource
 *
 * GET /:photoId
 */
const show = async (req, res) => {
	const photo = await new models.Photo({ id: req.params.photoId })
		.fetch();

	res.send({
		status: 'success',
		data: {
			photo,
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
		const photo = await new models.Photo(validData).save();
		debug("Created new photo successfully: %O", photo);

		res.send({
			status: 'success',
			data: {
				photo,
			}
		});

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when creating a new photo.',
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

	// make sure user exists
	const photo = await new models.Photo({ id: photoId }).fetch({ require: false });
	if (!photo) {
		debug("Photo to update was not found. %o", { id: photoId });
		res.status(404).send({
			status: 'fail',
			data: 'Photo Not Found',
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
		const updatedPhoto = await photo.save(validData);
		debug("Updated photo successfully: %O", updatedPhoto);

		res.send({
			status: 'success',
			data: {
				updatedPhoto,
			}
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
 * @todo create controller for deleting specific photo
 * 
 * DELETE /:photoId
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
