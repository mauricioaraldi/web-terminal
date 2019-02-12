/**************************************************************
***************************************************************
** Terminal
**
** A project by Mauricio Araldi
**
** All rights reserved (CC). 
** Do not redistribute without authorization.
** This project is under the GNU General Public License 3.0
***************************************************************
**************************************************************/

//- - App Head

//Dependencies
var express = require('express'),
	session = require('express-session'),
	MongoClient = require('mongodb').MongoClient,
	MongoStore = require('connect-mongo')(session),
	fs = require('fs'),
	bodyParser = require('body-parser'),
	socketIo = require('socket.io');

//Global dependencies
const SECRET_KEY = 't3rm1n@l';
db = null;
ObjectId = require('mongodb').ObjectID;
System = require('./system.js');
aptModules = {};

//App initialization
app = express();

sessionStore = session({
	secret: SECRET_KEY, 
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({
		db: 'terminal',
		host: 'localhost',
		port: '27017'
	})
});

//App configs
app.use(express.static(__dirname + '/../public'));
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
app.use(bodyParser.json());
app.use(sessionStore);

//Connect to the db
MongoClient.connect("mongodb://localhost:27017/terminal", (err, database) => {
	if(err) {
		console.log('\n! ! ! Database connection error ! ! !\n');
		return;
	}

	db = database;

	console.log('\n- - - Database connection successful - - -\n');
});

//- - App Body

//Loading native modules
fs.readdir(__dirname + '/apt/native', (err, files) => {
	if (err) {
		return console.log(err);
	}

	files.forEach(file => {
		var name = file.slice(0, file.indexOf('.'));

		aptModules[name] = require('./apt/native/' + file);
	});

	console.log('\n- - - All native modules loaded - - -\n');
});

//Loading custom modules
fs.readdir(__dirname + '/apt/custom', (err, files) => {
	if (err) {
		return console.log(err);
	}

	files.forEach(file => {
		var name = file.slice(0, file.indexOf('.'));

		aptModules[name] = require('./apt/custom/' + file);
	});

	console.log('\n- - - All custom modules loaded - - -\n');
});

//Server initialization
io = socketIo.listen(
	app.listen(3000, () => {
		console.log('\n- - - Server running - - -\n');
	})
);

io.use(function(socket, next) {sessionStore(socket.request, socket.request.res, next)});

//Initialize terminal socket
require('./socket.js');