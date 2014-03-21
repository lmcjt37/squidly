// helper function to find the given string from the given array
function finder (str, array) {
	var m = $.inArray(str.toLowerCase(), array);
	return m;
}

// helper function to titlecase string e.g. fullnames
function toTitleCase (str) {
	var string = '';
	if (str !== '' && str !== undefined) {
		string = str.toLowerCase().replace(/\b[a-z]/g, function(letter) {
			return letter.toUpperCase();
		})
	}
	return string;
}

function getRow (i) {
	var row = "<div id='hide" + i + "'>";
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
	var selectedRow = "<div id='hide" + i + "'>";
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
				arrPoints = [],
				arrRanks = [];
			// Loop through DOM for matching classes and push to respective arrays
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
						rank: arrRanks[i],
						points: arrPoints[i]
					};
				}
				return JSON.stringify(obj);
			}
			
			var index = finder(name, arrNames);
			if (index >= 0) {
				localStorage["topscore"] = arrPoints[index];
				// localStorage["trackeduser"] = createUserObj(index);
				// localStorage["user1"] = createUserObj(index - 2); // 2 infront
				// localStorage["user2"] = createUserObj(index - 1); // 1 infront
				// localStorage["user3"] = createUserObj(index + 1); // 1 behind
				// localStorage["user4"] = createUserObj(index + 2); // 2 behind
				
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
				
				for (var a = 0; a < 5; a++) {
					var user = "user" + (a + 1);
					localStorage[user] = createUserObj(startID);
					if (index === startID) {
						strHTML = strHTML + getSelectedRow(a + 1);
					} else {
						strHTML = strHTML + getRow(a + 1);
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
	
	var savedInterval = localStorage["interval"];
	if (!savedInterval) {
		savedInterval = 10;
	} else {
		savedInterval = parseInt(savedInterval);
	}
	
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