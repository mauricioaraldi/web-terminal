module.exports = {
	name: 'System',
	description: 'Native system functions.',
	commands: {
		help: {
			manual: 'The help command for those who doesn\'t know what to do.',
			action: (params, socket) => {
				System.info(socket, 'Welcome to Terminal, an online terminal command that aims to help users');
				System.info(socket, 'execute tasks more eficciently. Terminal is made in a way that users can');
				System.info(socket, 'create modules with new features, increasing the utility of this tool.');
				System.info(socket, 'To see a list of the current modules installed, type "apt-modules list".');
				System.info(socket, 'To see a list of the current available commands (from all modules), type "apt-modules list-actions".');
				System.info(socket, 'To see informations about your user, type "user info".');
				System.waitCommand(socket);
			}
		},

		manual: {
			manual: 'Displays the manual of the action. The correct usage is "manual <action>".',
			action: (params, socket) => {
				if (!params[0]) {
					System.info(socket, 'The correct usage is "manual <action>".');
					return System.waitCommand(socket);
				}

				var command = System.getCommand(params[0]);

				System.info(socket, command.manual);
				System.waitCommand(socket);
			}
		},

		'apt-modules': {
			manual: 'Informations and management of application modules. Type "apt-modules list" to see a list of all' +
					'installed modules or "apt-modules list-actions" to see a list of all available actions (from all modules)',
			action: (params, socket) => {
				switch (params[0]) {
					case 'list':
						for (moduleName in aptModules) {
							System.info(socket, moduleName);
						}
					break;

					case 'list-actions':
						for (moduleName in aptModules) {
							System.info(socket, moduleName);

							for (action in aptModules[moduleName].commands) {
								System.info(socket, '> ', action);
							}
						}
					break;

					default:
						System.warning(socket, 'Incorrect usage. Type manual apt-modules to see help.');
					break;
				}

				System.waitCommand(socket);
			}
		}
	}
}