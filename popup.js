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
function save_settings () {
	var name = $("#txtName").val();
	var interval = $("#intInterval").val();
	var tracking = $('input[name="optRadios"]:checked').val();

	localStorage["name"] = name; // name of user to track
	localStorage["interval"] = interval; // refresh interval in minutes
	localStorage["tracking"] = tracking; // check for tracking mode (single||multiple)
}

// Restores any values from localStorage.
function restore_settings () {
	var savedInterval = localStorage["interval"];
	if (!savedInterval) {
		savedInterval = 10;
	}
	$("#intInterval").val(savedInterval);

	var savedName = localStorage["name"];
	if (!savedName) {
		return '';
	}
	$("#txtName").val(savedName);
	
	var savedTracking = localStorage["tracking"];
	if (!savedTracking) {
		savedTracking = 0;
	}
	if (savedTracking > 0) {
		$("#single").prop("checked", true);
	} else {
		$("#multiple").prop("checked", true);
	}
}

function update_leaderboard () {
	var storedName = localStorage["name"];
	$('#user3').text(storedName); // tracked user
	
	// retrieve data from localstorage
	// var username1 = localStorage["user1"],
		// username2 = localStorage["user2"],
		// username3 = localStorage["user3"],
		// username4 = localStorage["user4"];
		
	// apply data to respective elements
	// $('#user1').text(username1);
	// $('#user2').text(username2);
	// $('#user4').text(username3);
	// $('#user5').text(username4);
	
	var storedTracking = localStorage["tracking"];
	if (storedTracking > 0) {
		$(".track").hide();
	} else {
		$(".track").show();
	}
}

// Initialise JS on popup
document.addEventListener('DOMContentLoaded', function () {
	// Call options restore
	restore_settings();
	update_leaderboard();
	
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
					restore_settings();
					update_leaderboard();
				}, 300);
			});
		});
	});
});