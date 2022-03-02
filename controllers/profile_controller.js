/**
 * User Controller
 */

const debug = require('debug')('photo_album:profile_controller');
const { User } = require('../models');
const {matchedData, validationResult} = require('express-validator');
const bcrypt = require('bcrypt');

/**
 * Get authenticated user's profile
 *
 * GET /
 */
const getProfile = async (req, res) => {
	 try {
		 // create function fetchById()
		 const user = await User.fetchById(req.user.user_id);
		 res.send({
			status: 'success',
			data: {
				user: user,
			}
		});
	 } catch (error) {
		return res.status(404).send;
	 }
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
		validData.password = await bcrypt.hash(validData.password, User.hashSaltRounds);
	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown when hashing new password',
		});
	}


	try {
		const user = await User.fetchById(req.user.user_id);

		const updatedUser = await user.save(validData);
		debug("Updated user successfully: %O", updatedUser);
		res.send({
			status: 'success',
			data: {
				user: updatedUser,
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
	
/** 
 * Get profile's photos
 * 
 * GET /profile/photos
 * 
 */
const getPhotos = async (req, res) => {
	// get user with user id and eager-load the photos relation as second parameter
	const user = await User.fetchById(req.user.user_id, { withRelated: ['photos'] });

		res.status(200).send({
			status: 'success',
			data: {
				books: user.related('photos'),
			}
		});
}

/** 
 * Add book to profile
 * 
 * POST /profile/photos
 * 
*/
const addBook = async (req, res) => {
	// Checking after errors before adding book
	const errors = validationResult(req);
	if(!errors.isEmpty()){
		return res.status(422).send({ status : "fail", data: errors.array() });
	}

	const validData = matchedData(req); 

	// get the user's book by id 
	const user = await User.fetchById(req.user.user_id, { withRelated: ['books'] });

	// get the user's books
	const books = user.related('books');

	const  existing_book = books.find(book => book.id == validData.book_id)

	// if the book exists, bail
	if (existing_book) {
		return res.send({
			status: 'fail',
			data: "Book already exists",
		});
	}

	try {
		const result = await user.books().attach(validData.book_id);

		if(result === books){
			debug("Cannot add book already in list.")
		}
		debug("Added book successfully: %O", res);
		res.send({
			status: 'success',
			data: {
				result: result,
			},
		});
	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: "Exception thrown when attempting to add book",
		});
		throw error;
	}
}

// Validatefunction


module.exports = {
	getProfile,
	updateProfile,
	getBooks,
	addBook
}
