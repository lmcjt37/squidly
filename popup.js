/**
*
*	Gazer App (extension)
*		
*	Author: Luke Taylor
*	Description: Gazes at the Appcelerator Q&A top 100 and retrieves information related to the user you are watching.
*	Version: 1.0
*
**/

// Saves options to localStorage.
function save_settings() {
	var name = $("#txtName").val();
	var interval = $("#intInterval").val();

	localStorage["name"] = name; // name of user to track
	localStorage["interval"] = interval; // refresh interval in minutes	
}

// Restores any values from localStorage.
function restore_settings() {
	var savedInterval = localStorage["interval"];
	if (!savedInterval) {
		savedInterval = 10;
	}
	$("#intInterval").val(savedInterval);

	var savedName = localStorage["name"];
	if (!savedName) {
		return;
	}
	$("#txtName").val(savedName);
}

// Initialise JS on popup
document.addEventListener('DOMContentLoaded', function () {
	// Call options restore
	restore_settings();
	
	// Adds interaction for bootstrap tabs
	$('#myTabs a').click(function (e) {
		e.preventDefault();
		$(this).tab('show');
	});
	
	// Opens URL's for buttons
	$('.btn').click(function () {
		if ($(this).attr('href')) {
			var newUrl = $(this).attr('href');
			chrome.tabs.create({url: newUrl});
		}
	});

	// Submit form information
	$('#submit').click(function (e) {
		e.preventDefault();
		var txt = $('#submit span');
		txt.fadeOut(200, function () {
			txt.html('Saved');
			txt.fadeIn(200, function () {
				save_settings();
				setTimeout(function() {
					$('#myTabs a[href="#leaderboard"]').tab('show');
					txt.html('Submit');
				}, 300);
			});
		});
	});
});