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

	console.log('\n- - - Printing data - - -\n');

	getReturn(err, result) => {
		if (err) {
			console.log(err);
		}
	};

	//Print data

	//Structure
	var streamUsers = database.collection('users').find().stream();
	streamUsers.on("data", item => { console.log('\n[USERS]\n', item); });
	streamUsers.on("end", function() {});

	console.log('\n- - - All data printed - - -\n');
});

//- - App Body
//Server initialization
app.listen(3000, function() {
	console.log('\n- - - Server running - - -\n');
});