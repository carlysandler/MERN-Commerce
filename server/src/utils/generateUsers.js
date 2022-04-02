const faker = require('faker');
const { User } = require('../models/User')

/* testing for each unique scenario: (Admin, User, provider)
	we need one Admin, and one user for each passport strategy
	- local strategy
	- jwt strategy ?
	- googleId strategy
	- facebookId strategy
	- appleId strategy
*/
const testUsers = [...Array(5).map((index, i) => {
	const user = {

	}
})]
