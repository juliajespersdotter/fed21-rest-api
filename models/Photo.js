/**
 * Photo model
 */

const { Photo } = require(".");

module.exports = (bookshelf) => {
	return bookshelf.model.extend('Photo', {
		tableName: 'photos',
		albums() {
			return this.belongsToMany('Album');
		},
		user() {
			return this.belongsTo('User');
		}
	}, {
		async fetchById(id, fetchOptions = {}) {
			// fetch user with parameter id
			return await new this({ id }).fetch(fetchOptions);
		},
	});
}
