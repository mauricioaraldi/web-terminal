module.exports = (() => {
	var socket = io.on('connection', socket => {
		///////////////////////////
		// Socket initialization //
		///////////////////////////
		if (!socket.request.session.user) {
			socket.request.session.user = {username: 'guest', authority: 6};
		}

		System.info(socket, 'Session opened at', new Date(), 'by', socket.request.headers.host);
		System.info(socket, '- - - Welcome to Terminal. Type "help" to get started. - - -');
		System.waitCommand(socket);



		///////////////
		// Listeners //
		///////////////
		socket.on('execute', commandQuery => {
			commandQuery = commandQuery.trim();

			if (socket.request.session.nextAction) {
				socket.request.session.nextAction(commandQuery);
				socket.request.session.nextAction = null;
				return;
			}

			var querySplit = commandQuery.split(' '),
				command = System.getCommand(querySplit[0]),
				params = querySplit.slice(1),
				userAuthority, commandAuthority;

			if (!command) {
				System.warning(socket, 'Command not recognized.');
				return System.waitCommand(socket);
			}

			userAuthority = socket.request.session && socket.request.session.user && socket.request.session.user.authority ? socket.request.session.user.authority : 6;
			commandAuthority = command.authority ? command.authority : 6;

			//Verify if the user has enough authority to run this command
			if (userAuthority <= commandAuthority) {
				return command.action(params, socket);
			} else {
				System.warning(socket, 'User doesn\'t have enough authority to execute this action.');
				return System.waitCommand(socket);
			}
		});

		socket.on('keystroke', key => {
			switch (key) {
				case 67: //C -- Abort
					socket.request.session.nextAction = null;
					return System.waitCommand(socket);
				break;

				case 116: //F5 -- Clear
					if (!socket.request.session.nextAction) {
						return System.clear(socket);
					}
				break;

				default:
					console.log('Not recognized keystroke: ' + key);
				break;
			}
		});

		socket.on('error', err => {
			console.log('\n- - - Error at', new Date(),  '- - -\n');
			console.error(err);
			console.log('\n- - - - - - - - - - - - - - - - - - - - -\n');
			System.error(socket, 'Internal error.');
			System.waitCommand(socket);
		});



		///////////////
		// Functions //
		///////////////
	});
})();