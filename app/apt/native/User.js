var crypto = require('crypto');

module.exports = {
	name: 'User',
	description: 'User module',
	commands: {
		user: {
			manual: 'Interact with user informations. The currently possible option is "info".',
			action: (params, socket) => {
				if (!params) {
					System.info(socket, 'Incorrect number of arguments. Use manual for help.');
					return System.waitCommand(socket);
				}

				switch (params[0]) {
					case 'info':
						System.info(socket, 'Username:', socket.request.session.user.username);
						System.info(socket, 'Authority:', socket.request.session.user.authority);
						System.waitCommand(socket);
					break;

					default:
						System.error(socket, 'Unrecognized command. See manual for help.');
						return System.waitCommand(socket);
					break;
				}
			}
		},
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