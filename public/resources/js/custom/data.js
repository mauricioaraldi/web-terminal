$(function() {
	var focuser = setInterval(function() {
		App.Utils.placeCaretAtEnd( $('textarea:not([disabled])')[0] );
	}, 1000);

	$(document).on('keydown', function(ev) {
		if (ev.which == 17) { //CTRL 
			App.Values.holdingCtrl = true;
		} else if (App.Values.holdingCtrl) {
			ev.preventDefault();
			App.Socket.keystroke(ev.which);
		}
	}).on('keyup', function(ev) {
		if (ev.which == 17) { //CTRL 
			App.Values.holdingCtrl = false;
		}
	});
});