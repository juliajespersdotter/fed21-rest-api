/**
 * User Controller
 */

const debug = require('debug')('books:profile_controller');
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

const addBook = async (req, res) => {
	// Checking after errors before adding book
	const errors = validationResult(req);
	if(!errors.isEmpty()){
		return res.status(422).send({ status : "fail", data: errors.array() });
	}

	const validData = matchedData(req); 

	// lazy-load book relationship
	await req.user.load('books');

	// get the user's books
	const books = req.user.related('books');

	// how to check if book is already in list
	/* let already_exists = false;
	books.forEach(book => {
		if (book.id == validData.book_id){
			already_exists = true;
		}
	});
	*/

	const  existing_book = books.find(book => book.id == validData.book_id)

	// if the book exists, bail
	if (existing_book) {
		return res.send({
			status: 'fail',
			data: "Book already exists",
		});
	}

	try {
		const result = await req.user.books().attach(validData.book_id);

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


module.exports = {
	getProfile,
	updateProfile,
	getBooks,
	addBook
}
