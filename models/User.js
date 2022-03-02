/**
 * User model
 */

module.exports = (bookshelf) => {
	return bookshelf.model('User', {
		tableName: 'user',
		albums() {
			return this.belongsToMany('Album');
		}
	}, {
		async login(username, password) {

			// check if a user with this username and password exists
			const user = await new this({ username }).fetch({ require: false });
			if(!user) {
				return false;
			}
			const hash = user.get('password');

			// hash the incoming cleartext password using the salt from the db
			// and compare if the generated hash matches the db-hash
			const result = await bcrypt.compare(password, hash);
			if (!result) {
				return false;
			}

			// all is well, return user
			return user;
		},

		/**
		 * @todo create fetchById function
		 */
		async fetchById(id, fetchOptions = {}) {
			// fetch user with parameter id
			return await new this({ id }).fetch(fetchOptions);
		},
	});
};
