module.exports = {
	/**
	 * Emits a signal for the client to wait user entry
	 * 
	 * @param  {Socket} socket - The socket which will wait command
	 * [@param  {Object} params - An object that contains parameters to the client message
	 * [@param  {Function} callback - A callback that will intercept what the user has typped]
	 */
	waitCommand: function(socket, params, callback) {
		if (!params && !callback) {
			socket.emit('waitCommand', {username: socket.request.session.user.username});
			socket.request.session.nextAction = null;
			return;
		}

		//Prevent wrong use of function
		if ( (typeof params != 'function' && !callback)
			 || (callback && typeof callback != 'function') ) {
			System.error('Wrong arguments to System.waitCommand');
			return System.waitCommand(socket);
		}

		//Params check
		if (params && !callback) {
			callback = params;
			params = {};
		}

		socket.request.session.nextAction = callback;
		socket.emit('waitReply', params);
	},

	/**
	 * Searches for a command into all modules
	 * 
	 * @param  {String} command - The desired command
	 * @return {Object} command - The command with it's information
	 */
	getCommand: function(command) {
		for (moduleName in aptModules) {
			let module = aptModules[moduleName],
				commands = module.commands;

			for (commandName in commands) {
				//Verify if the command exists
				if (commandName == command) {
					return commands[commandName];
				}
			}
		}
	},

	/**
	 * Clear screen
	 * 
	 * @param  {Socket} socket - The socket which will be cleared
	 */
	clear: function(socket) {
		return socket.emit('clear', {username: socket.request.session.user.username});
	},

	/**
	 * Emits a info message to client
	 * 
	 * @param  {Socket} socket - The socket which will receive the message
	 * @param  {String} message - The message to be emitted to socket
	 * [@param  {String} message - Any number of arguments can be passed to this functions. All aditional
	 * arguments will be joined in a single message to be sent to the client]
	 */
	info: function(socket, message) {
		var args = Array.prototype.slice.call(arguments);
		message = args.slice(1).join(' ');
		socket.emit('message', {
			date: new Date().getTime(),
			message,
			type: 'info'
		});
	},

	/**
	 * Emits a warning message to client
	 * 
	 * @param  {Socket} socket - The socket which will receive the message
	 * @param  {String} message - The message to be emitted to socket
	 * [@param  {String} message - Any number of arguments can be passed to this functions. All aditional
	 * arguments will be joined in a single message to be sent to the client]
	 */
	warning: function(socket, message) {
		var args = Array.prototype.slice.call(arguments);
		message = args.slice(1).join(' ');
		socket.emit('message', {
			date: new Date().getTime(),
			message,
			type: 'warning'
		});
	},

	/**
	 * Emits a error message to client
	 * 
	 * @param  {Socket} socket - The socket which will receive the message
	 * @param  {String} message - The message to be emitted to socket
	 * [@param  {String} message - Any number of arguments can be passed to this functions. All aditional
	 * arguments will be joined in a single message to be sent to the client]
	 */
	error: function(socket, message) {
		var args = Array.prototype.slice.call(arguments);
		message = args.slice(1).join(' ');
		socket.emit('message', {
			date: new Date().getTime(),
			message,
			type: 'error'
		});
	}
};