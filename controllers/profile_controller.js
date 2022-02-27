/**
 * User Controller
 */

const debug = require('debug')('photos:profile_controller');
const {matchedData, validationResult} = require('express-validator');
const bcrypt = require('bcrypt');

/**
 * Get authenticated user's profile
 *
 * GET /
 */
const getProfile = async (req, res) => {
	res.send({
		status: 'success',
		data: {
			user: req.user,
		}
	});
}

/**
 * Update authenticated user's profile
 *
 * PUT /
 */
const updateProfile = async (req, res) => {
	// Checking after errors before updating user
	const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).send({ status : "fail", data: errors.array() });
    }
    const validData = matchedData(req); 

	try {
		validData.password = await bcrypt.hash(validData.password, 10);
	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown when hashing new password',
		});
	}

	try {
		const updatedUser = await req.user.save(validData);
		debug("Updated user successfully: %O", updatedUser);
		res.send({
			status: 'success',
			data: {
				user: req.user,
			},
		});
	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when updating a new user.',
		});
		throw error;
	}
}
	

const getBooks = async (req, res) => {
	// get user and also eager-load the books-relation
	// const user = await new models.User({ id: req.user.id }).fetch({withRelated: ['books']});

	// "lazy load" the books-relation
	await req.user.load('books');

		res.status(200).send({
			status: 'success',
			data: {
				books: req.user.related('books'),
			}
		});
}

const addPhoto= async (req, res) => {
	// Checking after errors before adding photo
	const errors = validationResult(req);
	if(!errors.isEmpty()){
		return res.status(422).send({ status : "fail", data: errors.array() });
	}

	const validData = matchedData(req); 

	// lazy-load photo relationship
	await req.user.load('photos');

	// get the user's photos
	const photos = req.user.related('photos');

	const  existing_photo = photos.find(photo => photo.id == validData.photo_id)

	// if the book exists, bail
	if (existing_photo) {
		return res.send({
			status: 'fail',
			data: "Photo already exists",
		});
	}

	try {
		const result = await req.user.photos().attach(validData.photo_id);

		if(result === photos){
			debug("Cannot add photo already in list.")
		}
		debug("Added photo successfully: %O", res);
		res.send({
			status: 'success',
			data: {
				result: result,
			},
		});
	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: "Exception thrown when attempting to add photo",
		});
		throw error;
	}
}


module.exports = {
	getProfile,
	updateProfile,
	getBooks,
	addPhoto
}
