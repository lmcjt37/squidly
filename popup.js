/**
*
*	Gazer App (extension)
*		
*	Author: Luke Taylor
*	Description: Allows you to track a user from the Appcelerator Q & A Leaderboard.
*	Version: 1.0
*
**/

// Saves options to localStorage.
function save_settings () {
	var name = $("#txtName").val();
	var tracking = $('input[name="optRadios"]:checked').val();

	localStorage["name"] = name || ""; // name of user to track
	localStorage["tracking"] = tracking || 0; // check for tracking mode (single||multiple)
}

// Restores any values from localStorage.
function restore_settings () {
	var savedName = localStorage["name"];
	if (!savedName) {
		savedName = '';
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

// calculate % for progress bars
function percent (s) {
	var ts = localStorage["topscore"];
	var t = ts.replace(',', '');
		t = parseInt(t) + 2500;
	var n = s.replace(',', '');
	var a = (n / t) * 100;
	if (a > 100) {a = 100;}
	return a;
}

function update_leaderboard () {
	// retrieve data from localstorage for surrounding users
	var content = localStorage["content"];
	$('.main .panel-body').html(content);
	
	$('.help-txt').hide();
	$("#hide1").show();
	$("#hide2").show();
	$("#hide3").show();
	$("#hide4").show();
	$("#hide5").show();
	
	var storedTracking = localStorage["tracking"] || 0;
	if (storedTracking > 0) {
		$("#hide1").hide();
		$("#hide2").hide();
		$("#hide4").hide();
		$("#hide5").hide();
	} else {
		$("#hide1").show();
		$("#hide2").show();
		$("#hide4").show();
		$("#hide5").show();
	}
	
	var user1 = localStorage["user1"] || {};
	if (!$.isEmptyObject(user1)) {
		var parsed1 = JSON.parse(user1) || {};
		if (!$.isEmptyObject(parsed1)) {
			$('#user1').html("<a class='devlink' href='" + parsed1.devlink + "'>" + parsed1.name + "</a>");
			$('#user-rank-1').text(parsed1.rank);
			$('#user-score-1').text(parsed1.points);
			$('#user-score-1').parent().width(percent(parsed1.points) + '%');
		}
	} else {
		$("#hide1").hide();
	}
	
	var user2 = localStorage["user2"] || {};
	if (!$.isEmptyObject(user2)) {
		var parsed2 = JSON.parse(user2) || {};
		if (!$.isEmptyObject(parsed2)) {
			$('#user2').html("<a class='devlink' href='" + parsed2.devlink + "'>" + parsed2.name + "</a>");
			$('#user-rank-2').text(parsed2.rank);
			$('#user-score-2').text(parsed2.points);
			$('#user-score-2').parent().width(percent(parsed2.points) + '%');
		}
	} else {
		$("#hide2").hide();
	}
	
	var user3 = localStorage["user3"] || {};
	if (!$.isEmptyObject(user3)) {
		var parsed3 = JSON.parse(user3) || {};
		if (!$.isEmptyObject(parsed3)) {
			$('#user3').html("<a class='devlink' href='" + parsed3.devlink + "'>" + parsed3.name + "</a>");
			$('#user-rank-3').text(parsed3.rank);
			$('#user-score-3').text(parsed3.points);
			$('#user-score-3').parent().width(percent(parsed3.points) + '%');
		} 
	} else {
		$("#hide3").hide();
	}
	
	var user4 = localStorage["user4"] || {};
	if (!$.isEmptyObject(user4)) {
		var parsed4 = JSON.parse(user4) || {};
		if (!$.isEmptyObject(parsed4)) {
			$('#user4').html("<a class='devlink' href='" + parsed4.devlink + "'>" + parsed4.name + "</a>");
			$('#user-rank-4').text(parsed4.rank);
			$('#user-score-4').text(parsed4.points);
			$('#user-score-4').parent().width(percent(parsed4.points) + '%');
		}
	} else {
		$("#hide4").hide();
	}
	
	var user5 = localStorage["user5"] || {};
	if (!$.isEmptyObject(user5)) {
		var parsed5 = JSON.parse(user5) || {};
		if (!$.isEmptyObject(parsed5)) {
			$('#user5').html("<a class='devlink' href='" + parsed5.devlink + "'>" + parsed5.name + "</a>");
			$('#user-rank-5').text(parsed5.rank);
			$('#user-score-5').text(parsed5.points);
			$('#user-score-5').parent().width(percent(parsed5.points) + '%');
		}
	} else {
		$("#hide5").hide();
	}	
}

// Initialise JS on popup
document.addEventListener('DOMContentLoaded', function () {
	restore_settings();
	var name = localStorage["name"];
	if (name) {
		update_leaderboard();
	} else {
		$('#hide1').hide();
		$('#hide2').hide();
		$('#hide3').hide();
		$('#hide4').hide();
		$('#hide5').hide();
		$('.help-txt').html('<p>This is Your first time, please use options to set up who you want to track.</p>');
	}
			
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
	
	// Opens URL's for devlinks
	$('.devlink').click(function () {
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
			save_settings();
			txt.fadeIn(200, function () {
				setTimeout(function() {
					txt.html('Submit');
					update_leaderboard();
				}, 800);
				// $('#myTabs a[href="#leaderboard"]').tab('show');
			});
		});
	});
	
	$('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
		update_leaderboard();
	});
});