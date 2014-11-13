/**
*
*	Squidly (extension)
*		
*	Author: Luke Taylor
*	Description: Allows you to track a user from the Appcelerator Q & A Leaderboard. 
*	Version: 1.1.1
*
**/

// helper function to find the given string from the given array
function finder (str, array) {
	return $.inArray(str.toLowerCase(), array);
}

// helper function to titlecase string e.g. fullnames
function toTitleCase (str) {
	if (str !== '' && str !== undefined) {
		var string = str.toLowerCase().replace(/\b[a-z]/g, function(letter) {
			return letter.toUpperCase();
		})
	}
	return string;
}

// get single unselected row
function getRow (i) {
	var row = "<div id='row" + i + "' class='user'>";
	row = row + "	<span id='user-rank-" + i + "' class='badge'></span>&nbsp;<span id='user" + i + "'></span>";
	row = row + "	<div class='progress'>";
	row = row + "		<div class='progress-bar progress" + i + "' role='progressbar'>";
	row = row + "			<span id='user-score-" + i + "'></span>";
	row = row + "		</div>"
	row = row + "	</div>"
	row = row + "</div>";
	return row;
}

// get single selected row
function getSelectedRow (i) {
	var selectedRow = "<div id='row" + i + "' class='user selected'>";
	selectedRow = selectedRow + "	<div class='panel panel-primary stretch'>";
	selectedRow = selectedRow + "		<div class='panel-heading'>";
	selectedRow = selectedRow + "			<span id='user-rank-" + i + "' class='badge'></span>&nbsp;<span id='user" + i + "'></span>";
	selectedRow = selectedRow + "			<div class='progress'>";
	selectedRow = selectedRow + "				<div class='progress-bar progress" + i + "' role='progressbar'>";
	selectedRow = selectedRow + "					<span id='user-score-" + i + "'></span>";
	selectedRow = selectedRow + "				</div>";
	selectedRow = selectedRow + "			</div>";
	selectedRow = selectedRow + "			<div id='diff' class='hidden'>";
	selectedRow = selectedRow + "				<span id='milestone' class='pull-left'><i class='fa fa-flag-checkered'></i>&nbsp;<span class='stat'></span></span>";
	selectedRow = selectedRow + "				<span id='up' class='pull-left'><i class='fa fa-chevron-up'></i>&nbsp;<span class='stat'></span></span>";
	selectedRow = selectedRow + "				<span id='down' class='pull-left'><i class='fa fa-chevron-down'></i>&nbsp;<span class='stat'></span></span>";
	selectedRow = selectedRow + "			</div>";
	selectedRow = selectedRow + "		</div>";
	selectedRow = selectedRow + "	</div>";
	selectedRow = selectedRow + "</div>";
	return selectedRow;
}

// retrieves data from webpage, creates arrays, objects and html content for leaderboard
function updateRank () {
	// console.log('update rank');
	var name = localStorage["name"];
	if (name) {
		$.get('https://developer.appcelerator.com/questions/top-100-experts', function (html) {
			var arrNames = [],
				arrDevlinks = [],
				arrPoints = [],
				arrRanks = [],
				index;
			$(html).find('.top100-rank').each(function (i) {
				if (i > 0) {
					arrRanks.push($(this).text().substring(1));
				}
			});
			$(html).find('.top100-name').each(function (i) {
				if (i > 0) {
					arrNames.push($(this).text().toLowerCase());
					localStorage['arrNames'] = arrNames;
				}
			});
			$(html).find('.top100-name a').each(function (i) {
				arrDevlinks.push("https://developer.appcelerator.com" + $(this).attr('href').toLowerCase());
			});
			$(html).find('.top100-points').each(function (i) {
				if (i > 0) {
					arrPoints.push($(this).text());
				}
			});
			function createUserObj(i) {
				var obj = {};
				var nextID = i - 1;
				var prevID = i + 1;
				if (i >= 0 && i < 100) {
					if (i === index) {
						var rounded = Math.ceil(parseInt((arrPoints[i]).replace(',', ''))/10000) * 10000;
						var curVal = parseInt((arrPoints[i]).replace(',', ''));
						localStorage['milestone'] = (rounded - curVal).toLocaleString('en-GB');
						localStorage['nextrank'] = (nextID !== -1) ? (parseInt((arrPoints[nextID]).replace(',', '')) - parseInt((arrPoints[i]).replace(',', ''))).toLocaleString('en-GB') : 0;
						localStorage['prevrank'] = (prevID < 100) ? (parseInt((arrPoints[i]).replace(',', '')) - parseInt((arrPoints[prevID]).replace(',', ''))).toLocaleString('en-GB') : 0;
					}
					var obj = {
						name: toTitleCase(arrNames[i]),
						devlink: arrDevlinks[i],
						rank: arrRanks[i],
						points: arrPoints[i]
					};
				}
				return JSON.stringify(obj);
			}
			if ($.isNumeric(name)) {
				index = finder(name, arrRanks);
			} else {
				index = finder(name, arrNames);
			}
			if (index < 0) {
				localStorage["alert"] = true;
			} else {
				localStorage["alert"] = false;
				chrome.browserAction.setBadgeText({ text: arrRanks[index] });
				chrome.browserAction.setBadgeBackgroundColor({ color: '#CD1625' });
				chrome.browserAction.setTitle({ title: arrPoints[index] });
				
				var startID = 0,
					strHTML = '';
				if (index === 0) { 
					startID = index;
				} else if (index === 1) { 
					startID = index - 1; 
				} else if (index === 98) { 
					startID = index - 3;
				} else if (index === 99) { 
					startID = index - 4; 
				} else {
					startID = index - 2;
				}
				localStorage["topscore"] = arrPoints[startID];
				
				for (var a = 0; a < 5; a++) {
					var id = a + 1;
					var user = "user" + id;
					localStorage[user] = createUserObj(startID);
					if (index === startID) {
						strHTML = strHTML + getSelectedRow(id);
					} else {
						strHTML = strHTML + getRow(id);
					}
					startID++;
				}
				localStorage["content"] = strHTML;
			}
		});
	}
}

// onLoad update rank and set interval to check for changes, also Chrome Alarm API used for background updates
document.addEventListener('DOMContentLoaded', function () {
	updateRank();
	
	// var savedInterval = 20;
		
	// chrome.runtime.onInstalled.addListener(function () {
		// chrome.alarms.create('refreshAlarm', { 
			// periodInMinutes: savedInterval 
		// });
	// });
	
	// chrome.alarms.onAlarm.addListener(function (alarm) {
		// if (alarm.name === 'refreshAlarm') {
			// updateRank();
		// }
	// });
});