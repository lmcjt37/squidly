// function updateRank(rank) {
function updateRank () {
	var name = localStorage["name"];
	if (name) {
		$.get('https://developer.appcelerator.com/questions/top-100-experts', function (html) {
			var arrNames = [],
				arrPoints = [],
				arrRanks = [];

			// Loop through DOM for matching classes and push to respective arrays
			$(html).find('.top100-rank').each(function () {
				arrRanks.push($(this).text().substring(1));
			});
			$(html).find('.top100-name').each(function () {
				arrNames.push($(this).text());
			});
			$(html).find('.top100-points').each(function () {
				arrPoints.push($(this).text());
			});
		});
	}
}

document.addEventListener('DOMContentLoaded', function () {
	updateRank();
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