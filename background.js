// helper function to find the given string from the given array
function finder (str, array) {
	var m = $.inArray(str.toLowerCase(), array);
	return m;
}

function toTitleCase (str) {
	var string = '';
	if (str !== '' && str !== undefined) {
		string = str.toLowerCase().replace(/\b[a-z]/g, function(letter) {
			return letter.toUpperCase();
		})
	}
	return string;
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
				if (i >= 0) {
					var obj = {
						name: toTitleCase(arrNames[i]),
						rank: arrRanks[i],
						points: arrPoints[i]
					};
				}
				return JSON.stringify(obj);
			}
			
			function setTopScore (i) {
				if (i <= 9) {
					localStorage["topscore"] = arrPoints[0];
				} else if (i >= 10 && i <= 19) {
					localStorage["topscore"] = arrPoints[9];
				} else if (i >= 20 && i <= 29) {
					localStorage["topscore"] = arrPoints[19];
				} else if (i >= 30 && i <= 39) {
					localStorage["topscore"] = arrPoints[29];
				} else if (i >= 40 && i <= 49) {
					localStorage["topscore"] = arrPoints[39];
				} else if (i >= 50 && i <= 59) {
					localStorage["topscore"] = arrPoints[49];
				} else if (i >= 60 && i <= 69) {
					localStorage["topscore"] = arrPoints[59];
				} else if (i >= 70 && i <= 79) {
					localStorage["topscore"] = arrPoints[69];
				} else if (i >= 80 && i <= 89) {
					localStorage["topscore"] = arrPoints[79];
				} else if (i >= 90 && i <= 99) {
					localStorage["topscore"] = arrPoints[89];
				}
			}
			
			var index = finder(name, arrNames);
			if (index >= 0) {
				setTopScore(index);
				
				localStorage["trackeduser"] = createUserObj(index);
				localStorage["user1"] = createUserObj(index - 2); // 2 infront
				localStorage["user2"] = createUserObj(index - 1); // 1 infront
				localStorage["user3"] = createUserObj(index + 1); // 1 behind
				localStorage["user4"] = createUserObj(index + 2); // 2 behind
			}
		});
	}
}

document.addEventListener('DOMContentLoaded', function () {
	updateRank();
	setInterval(function () {
		updateRank();
	}, 3000);
	
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