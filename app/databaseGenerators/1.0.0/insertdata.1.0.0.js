//Dependencies
var express = require('express'),
	MongoClient = require('mongodb').MongoClient,
	crypto = require('crypto'),
	User = require('../../objects/User.js');

//App initialization
app = express();

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/terminal", (err, database) => {
	if(err) {
		console.log('\n! ! ! Database connection error ! ! !\n');
		return;
	}

	console.log('\n- - - Database connection successful - - -\n');

	console.log('\n- - - Inserting data - - -\n');

	getReturn(err, result) => {
		if (err) {
			console.log(err);
		}
	};

	//Insert data

	//Structure
	var user1 = new User('root', encryptPassword('root'), 0);

	database.collection('users').insert(user1, {w: 1}, (e, r) => { getReturn(e, r); user1 = r.ops[0]; });

	console.log('\n- - - Test data inserted - - -\n');
});

//- - App Body
//Server initialization
app.listen(3000, function() {
	console.log('\n- - - Server running - - -\n');
});

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