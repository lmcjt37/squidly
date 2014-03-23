/**
*
*	Ogle Bot (extension)
*		
*	Author: Luke Taylor
*	Description: Allows you to track a user from the Appcelerator Q & A Leaderboard. 
*	Version: 1.0
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

function getRow (i) {
	var row = "<div id='row" + i + "'>";
	row = row + "	<span id='user-rank-" + i + "' class='badge'></span>&nbsp;<span id='user" + i + "'></span>";
	row = row + "	<div class='progress'>";
	row = row + "		<div class='progress-bar progress" + i + "' role='progressbar'>";
	row = row + "			<span id='user-score-" + i + "'></span>";
	row = row + "		</div>"
	row = row + "	</div>"
	row = row + "</div>";
	return row;
}

function getSelectedRow (i) {
	var selectedRow = "<div id='row" + i + "'>";
	selectedRow = selectedRow + "	<div class='panel panel-primary stretch'>";
	selectedRow = selectedRow + "		<div class='panel-heading'>";
	selectedRow = selectedRow + "			<span id='user-rank-" + i + "' class='badge'></span>&nbsp;<span id='user" + i + "'></span>";
	selectedRow = selectedRow + "			<div class='progress'>";
	selectedRow = selectedRow + "				<div class='progress-bar progress" + i + "' role='progressbar'>";
	selectedRow = selectedRow + "					<span id='user-score-" + i + "'></span>";
	selectedRow = selectedRow + "				</div>";
	selectedRow = selectedRow + "			</div>";
	selectedRow = selectedRow + "		</div>";
	selectedRow = selectedRow + "	</div>";
	selectedRow = selectedRow + "</div>";
	return selectedRow;
}

function updateRank () {
	var name = localStorage["name"];
	if (name) {
		$.get('https://developer.appcelerator.com/questions/top-100-experts', function (html) {
			var arrNames = [],
				arrDevlinks = [],
				arrPoints = [],
				arrRanks = [];
			$(html).find('.top100-rank').each(function (i) {
				if (i > 0) {
					arrRanks.push($(this).text().substring(1));
				}
			});
			$(html).find('.top100-name').each(function (i) {
				if (i > 0) {
					arrNames.push($(this).text().toLowerCase());
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
				if (i >= 0 && i < 100) {
					var obj = {
						name: toTitleCase(arrNames[i]),
						devlink: arrDevlinks[i],
						rank: arrRanks[i],
						points: arrPoints[i]
					};
				}
				return JSON.stringify(obj);
			}
			
			var index = finder(name, arrNames);
			if (index >= 0) {
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

document.addEventListener('DOMContentLoaded', function () {
	updateRank();
	setInterval(function () {
		updateRank();
	}, 250);
	
	var savedInterval = 5;
		
	chrome.runtime.onInstalled.addListener(function () {
		chrome.alarms.create('refreshAlarm', { 
			periodInMinutes: savedInterval 
		});
	});
	
	chrome.alarms.onAlarm.addListener(function (alarm) {
		if (alarm.name === 'refreshAlarm') {
			updateRank();
		}
	});
});