document.addEventListener('DOMContentLoaded', function () {
	// function updateRank(rank) {
	function updateRank () {
		var name = localStorage["name"];
		var nameArray = [];
		if (name) {
			$.get('http://developer.appcelerator.com/questions/top-100-experts', function (html) {
				var arrNames = [],
					arrPoints = [],
					arrRanks = [];

				// adds 'html' to the DOM
				$('body').html(html);

				// Loop through DOM for matching classes and push to respective arrays
				$('.top100-rank').each(function () {
					arrRanks.push($(this).text());
				});
				$('.top100-name').each(function () {
					arrNames.push($(this).text());
				});
				$('.top100-points').each(function () {
					arrPoints.push($(this).text());
				});

				// TEST
				console.log(arrRanks);
				console.log(arrNames);
				console.log(arrPoints);
			});
		}
	}
	
	var savedInterval = localStorage["interval"];
	if (!savedInterval) {
		savedInterval = 10;
	} else {
		savedInterval = parseInt(savedInterval);
	}
	
	// chrome.alarms.create('refreshinterval', { periodInMinutes: savedInterval });
	// chrome.alarms.onAlarm.addListener('refreshinterval', function () {
		updateRank();
		setInterval(updateRank, (savedInterval*60000));
	// });
});