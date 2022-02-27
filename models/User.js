/**
 * User model
 */

module.exports = (bookshelf) => {
	return bookshelf.model('User', {
		tableName: 'user',
		albums() {
			return this.belongsToMany('Album');
		}
	});
};
