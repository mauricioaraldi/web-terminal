;(function ( $, window ) {
	/**
	 * This module controls text interactions
	 *
	 * @author mauricio.araldi
	 * @since 16/03/2017
	 */
	App.Text = (function() {
		/**
		 * Default function with all event bindings related to this module
		 *
		 * @author mauricio.araldi
		 * @since 26/08/2016
		 */
		function bindEvents() {
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

		/**
		 * Adds a line waiting for a command in the terminal
		 *
		 * @author mauricio.araldi
		 * @since 16/03/2017
		 */
		function waitCommand(username) {
			var line = $('<div class="line">'),
				leftHand = $('<span class="left-hand">').text(username + ' ~ $'),
				rightHand = $('<textarea class="right-hand">');

			rightHand.on('keydown', function(ev) {
				if (ev.which == 13) {//Enter
					ev.preventDefault();
				}
			}).on('keyup', function(ev) {
				if (ev.which == 13) {//Enter
					ev.preventDefault();
					App.Socket.execute($(this).val());
				} else if (ev.which == 38) { //Arrow up
					if (App.Values.currentHistoryEntry <= 0) {
						return;
					}

					$(this).val(App.Values.history[--App.Values.currentHistoryEntry]);
					App.Utils.placeCaretAtEnd( this );
				} else if (ev.which == 40) { //Arrow down
					if (App.Values.currentHistoryEntry >= App.Values.history.length) {
						return;
					}

					$(this).val(App.Values.history[++App.Values.currentHistoryEntry]);
					App.Utils.placeCaretAtEnd( this );
				}

				$(this).height($(this).prop('scrollHeight'));
			});

			$('textarea:not([disabled])').attr('disabled', 'true');

			$('body').append(
				line.append(leftHand).append(rightHand)
			);

			rightHand.focus();
		}

		/**
		 * Adds a line waiting for a reply in the terminal
		 *
		 * @author mauricio.araldi
		 * @since 16/03/2017
		 */
		function waitReply(data) {
			var line = $('<div class="line">'),
				leftHand = $('<span class="left-hand">').text(' - '),
				rightHand = $('<input class="right-hand">');

			rightHand.on('keydown', function(ev) {
				if (ev.which == 13) {//Enter
					ev.preventDefault();
				}
			}).on('keyup', function(ev) {
				if (ev.which == 13) {//Enter
					ev.preventDefault();
					App.Socket.execute($(this).val());

					if ( $(this).attr('data-type') == 'secret' ) {
						$(this).remove();
					}
				}

				$(this).height($(this).prop('scrollHeight'));
			});

			if (data.type) {
				rightHand.attr('data-type', data.type);
			}

			$('textarea:not([disabled])').attr('disabled', 'true');

			$('body').append(
				line.append(leftHand).append(rightHand)
			);

			rightHand.focus();
		}

		/**
		 * Adds a line into the terminal
		 *
		 * @author mauricio.araldi
		 * @since 26/08/2016
		 */
		function addMessage(message) {
			var line = $('<div class="line message">');

			line.text('> ' + message);

			$('body').append(line);
		}

		/**
		 * Clears all screen
		 *
		 * @author mauricio.araldi
		 * @since 20/03/2017
		 */
		function clear(data) {
			$('body').empty();
			waitCommand(data.username);
		}

		return {
			bindEvents : bindEvents,
			init : init,
			waitCommand : waitCommand,
			addMessage : addMessage,
			waitReply : waitReply,
			clear : clear
		}
	})();

	// DOM Ready -- Initialize the module
	$(function() {
		App.Text.init();
		App.Text.bindEvents();
	});
})( jQuery, window );