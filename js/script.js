// https://gist.github.com/jesperorb/6ca596217c8dfba237744966c2b5ab1e
// https://stackoverflow.com/questions/15005500/loading-cross-domain-endpoint-with-jquery-ajax

$.ajaxSetup({
	scriptCharset: "utf-8", //or "ISO-8859-1"
	contentType: "application/json; charset=utf-8"
});

window.onload = function (e) {
	getXKCD();
}

function getXKCD(xkcdNum = "") {
	// Reset all elements except for image and max number
	document.getElementById('xkcdnews').innerHTML = "XKCD updates every Monday, Wednesday, and Friday.";
	document.getElementById('xkcdlink').removeAttribute('href');
	document.getElementById('xkcdtitle').innerHMTL = "Loading<span id=\"dot1\">.</span><span id=\"dot2\">.</span><span id=\"dot3\">.</span>";
	document.getElementById('xkcddate').innerHTML = "N/A";
	document.getElementById('xkcdalttext').innerHTML = "";
	document.getElementById('xkcdtranscript').innerHTML = "N/A";

	// Build URL
	if (xkcdNum == "") {
		var url = "https://cors-anywhere.herokuapp.com/https://xkcd.com/info.0.json";
	}
	else var url = "https://cors-anywhere.herokuapp.com/https://xkcd.com/" + xkcdNum + "/info.0.json";

	// Get data
	$.getJSON(url, function(data) {

		// Set max number
		if (xkcdNum == "") {
			document.getElementById('xkcdnumbermax').innerHTML = data.num;
		}

		// Create month list
		var monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

		// Create day superscript
		switch (data.day) {
			case 1:
			var daySup = "st"
			break;
			case 2:
			var daySup = "nd"
			break;
			case 3:
			var daySup = "rd"
			break;
			default:
			var daySup = "th"
		}

		// Set elements
		if (data.news != "") document.getElementById('xkcdnews').innerHTML = data.news;
		if (data.link != "") document.getElementById('xkcdlink').href = data.link;
		document.getElementById('xkcdtitle').innerHTML = data.title;
		document.getElementById('xkcddate').innerHTML = monthList[data.month - 1] + " " + data.day + "<sup>" + daySup + "</sup>, " + data.year;
		document.getElementById('xkcdimage').src = data.img;
		document.getElementById('xkcdalttext').innerHTML = data.alt;
		document.getElementById('xkcdnumber').innerHTML = data.num;
		if (data.transcript != "") document.getElementById('xkcdtranscript').innerHTML = data.transcript;
	});
}
