var crypto = require('crypto');

module.exports = {
	name: 'Authenticator',
	description: 'Authenticator module',
	commands: {
		login: {
			manual: 'Login action. Correct usage: login <username>',
			action: (params, socket) => {
				if (!params || params.length != 1) {
					System.info(socket, 'Incorrect number of arguments. Correct usage is login <username>.');
					return System.waitCommand(socket);
				}

				System.info(socket, 'Password: ');
				System.waitCommand(socket, {type: 'secret'}, (userEntry) => {
					var user = params[0];

					authenticateUser(user, userEntry, function(loggedIn, user) {
						if (!loggedIn) {
							System.error(socket, 'Username or password incorrect.');
							return System.waitCommand(socket);
						}

						delete user._id;
						delete user.password;
						socket.request.session.user = user;

						System.info(socket, 'Logged as ' + user.username);
						return System.waitCommand(socket);
					});
				});
			}
		},

		logout: {
			manual: 'Logout action.',
			action: (params, socket) => {
				socket.request.session.regenerate(function() {
					socket.request.session.user = {username: 'guest', authority: 6};
					System.info(socket, 'Logged out');
					System.waitCommand(socket);
				});
			}
		}
	}
}

/**
 * Verifies if a plain text password matches a encrypted password
 *
 * @author mauricio.araldi
 * @since 26/08/2016
 *
 * @parameter String username - The username to look for in database
 * @parameter String password - The plain text password to be encrypted and verified
 * @parameter Function callback(data) - The callback function to which the data will be passed
 * as parameter
 */
function authenticateUser(username, password, callback) {
	//Searches for the account
	db.collection('users').findOne({username: username}, function(err, user) {
		//Communication error
		if (err) {
			console.error(err);
			return;
		}

		if (!user) {
			callback(false);
			return;
		}

		var passwordSha512 = user.password;

		password = encryptPassword(password);

		callback(password == passwordSha512, user);

		return;
	});
}

/**
 * Encrypts a plain text password. The steps of encription are described below:
 * 1 - Encrypt the password a hundred times (encripting the encription, itself);
 * 2 - Get the first sixteen characters as salt;
 * 3 - Concat salt and Base64 converted password;
 * 4 - Returns the result;
 *
 * @author mauricio.araldi
 * @since 25/08/2016
 *
 * @parameter String password - The plain text password to be encrypted
 */
function encryptPassword(password) {
	var encryptedPassword = password;
		
	//Encrypts 100 times
	var i = 100;
	while (i--) {	
		encryptedPassword = crypto.createHash('sha512').update(encryptedPassword).digest();
	}
	
	salt = encryptedPassword.slice(0, 16);

	//Parses the password to base64 and adds salt again
	encryptedPassword = salt + encryptedPassword.toString('base64');

	return encryptedPassword;
}