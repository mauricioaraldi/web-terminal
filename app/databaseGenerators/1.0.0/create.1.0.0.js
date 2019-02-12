//Dependencies
var express = require('express'),
	MongoClient = require('mongodb').MongoClient;

//App initialization
app = express();

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/terminal", (err, database) => {
	if(err) {
		console.log('\n! ! ! Database connection error ! ! !\n');
		return;
	}

	console.log('\n- - - Database connection successful - - -\n');

	getReturn(err, collection) => {
		if (err) {
			console.log(err);
		}
	};

	//Create collections
	database.createCollection('users', getReturn);

	console.log('\n- - - Database creation finished - - -\n')
});

//- - App Body
//Server initialization
app.listen(3000, function() {
	console.log('\n- - - Server running - - -\n');
});