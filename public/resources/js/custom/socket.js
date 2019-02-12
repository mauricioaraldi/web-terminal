;(function ( $, window ) {

	/**
	 * This module controls socket interactions
	 *
	 * @author mauricio.araldi
	 * @since 26/08/2016
	 */
	App.Socket = (function() {
		var socket = io.connect();

		/**
		 * Default function with all event bindings related to this module
		 *
		 * @author mauricio.araldi
		 * @since 26/08/2016
		 */
		function bindEvents() {
			socket.on('message', function(data) {
				App.Text.addMessage(data.message);
			});

			socket.on('waitCommand', function(data) {
				App.Text.waitCommand(data.username);
			});

			socket.on('waitReply', function(data) {
				App.Text.waitReply(data);
			});

			socket.on('clear', function(data) {
				App.Text.clear(data);
			});

			socket.on('disconnect', function(data) {
				$('textarea:not([disabled])').attr('data-waiting', 'true').attr('disabled', 'true');
				App.Text.addMessage('Lost connection. Control will be regained upon reconnection.');
			});
		}

		/**
		 * Default function that runs as soon as the page is loaded
		 * and events are binded (see bindEvents())
		 *
		 * @author mauricio.araldi
		 * @since 26/08/2016
		 */
		function init() {
		}

		function execute(commandQuery) {
			App.Values.history.push(commandQuery);
			App.Values.currentHistoryEntry = App.Values.history.length;
			socket.emit('execute', commandQuery);
		}

		function keystroke(key) {
			socket.emit('keystroke', key);
		}

		return {
			bindEvents : bindEvents,
			init : init,
			execute : execute,
			keystroke : keystroke
		}
	})();

	// DOM Ready -- Initialize the module
	$(function() {
		App.Socket.init();
		App.Socket.bindEvents();
	});

})( jQuery, window );