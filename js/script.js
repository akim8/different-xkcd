// https://gist.github.com/jesperorb/6ca596217c8dfba237744966c2b5ab1e
// https://stackoverflow.com/questions/15005500/loading-cross-domain-endpoint-with-jquery-ajax

$.ajaxSetup({
	scriptCharset: "utf-8", //or "ISO-8859-1"
	contentType: "application/json; charset=utf-8"
});

window.onload = function (e) {
	// Initialize buttons
	document.getElementById('transcripttoggle').addEventListener('click', toggleTranscript);
	document.getElementById('firstbtn').addEventListener('click', function() {
		getXKCD(1);
	});
	document.getElementById('prevbtn').addEventListener('click', function() {
		getXKCD(parseInt(document.getElementById('xkcdnumber').placeholder) - 1);
	});
	document.getElementById('randbtn').addEventListener('click', function() {
		getXKCD(getRandomInt(1, document.getElementById('xkcdnumber').max));
	});
	document.getElementById('nextbtn').addEventListener('click', function() {
		getXKCD(parseInt(document.getElementById('xkcdnumber').placeholder) + 1);
	});
	document.getElementById('lastbtn').addEventListener('click', function() {
		getXKCD(document.getElementById('xkcdnumber').max);
	});
	document.getElementById('xkcdnumber').addEventListener('keypress', function (e) {
		var key = e.which || e.keyCode;
		if (key === 13) { // Enter key
			getXKCD(parseInt(document.getElementById('xkcdnumber').value));
		}
	});

	// Get latest comic
	getXKCD();

	// Get comic by number after hash in URL https://stackoverflow.com/questions/11662693/how-do-i-get-the-value-after-hash-from-a-url-using-jquery
	if (window.location.hash.substr(1) != "") getXKCD(window.location.hash.substr(1));
}

function getXKCD(getNum = "") {
	// Set title to loading
	document.getElementById('xkcdlink').removeAttribute('href');
	document.getElementById('xkcdtitle').innerHMTL = "Loading<span id=\"dot1\">.</span><span id=\"dot2\">.</span><span id=\"dot3\">.</span>";

	// Build URL
	if (getNum == "") {
		var url = "https://cors-anywhere.herokuapp.com/https://xkcd.com/info.0.json";
	}
	else var url = "https://cors-anywhere.herokuapp.com/https://xkcd.com/" + getNum + "/info.0.json";

	// Test if comic exists
	if (getNum == "" || (getNum <= document.getElementById('xkcdnumber').max && getNum > 0 && getNum != parseInt(document.getElementById('xkcdnumber').placeholder, 10))) {
		// Get data
		$.getJSON(url, function(data) {

			// Set max number
			if (getNum == "") {
				document.getElementById('xkcdnumbermax').innerHTML = data.num;
				document.getElementById('xkcdnumber').max = data.num;
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

			// Replace \n in transcript with break tags
			var fixedTranscript = data.transcript;
			while(fixedTranscript.search("\n") != -1) {
				fixedTranscript = fixedTranscript.replace("\n", "<br>");
			}

			// Set elements
			if (data.news != "") document.getElementById('xkcdnews').innerHTML = data.news;
			if (data.link != "") document.getElementById('xkcdlink').href = data.link;
			document.getElementById('xkcdtitle').innerHTML = data.title;
			document.getElementById('xkcddate').innerHTML = monthList[data.month - 1] + " " + data.day + "<sup>" + daySup + "</sup>, " + data.year;
			document.getElementById('xkcdimage').src = data.img;
			document.getElementById('xkcdalttext').innerHTML = data.alt;
			document.getElementById('xkcdnumber').placeholder = data.num;
			document.getElementById('xkcdtranscript').innerHTML = fixedTranscript;
			if (fixedTranscript != "") {

				toggleTranscriptDropdown(true);
			}
			else {
				toggleTranscriptDropdown(false);
			}
		});
	}
	else alert("Requested comic doesn't exists!");
	document.getElementById('xkcdnumber').value = "";
}

function toggleTranscript() {
	document.getElementById('dropdownicon').classList.toggle('rotate90');
	document.getElementById('xkcdtranscript').classList.toggle('transcriptcollapsed');
}

function toggleTranscriptDropdown(visible) {
	if (visible) {
		document.getElementById('transcripttoggle').style.display = "block";
	}
	else if (!visible) {
		document.getElementById('transcripttoggle').style.display = "none";
	}
}

function getRandomInt(min, max) { /* inclusive */
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
