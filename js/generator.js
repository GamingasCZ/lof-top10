const ADDIT_VALS = 1;

if (window.location.search == "") {
	var yID = "2019";
}
else if ((window.location.search).match(/year=\d+/) != null) {
	var yID = (window.location.search).match(/year=\d+/)[0].split("=")[1];
}

const YEAR = yID;

// Default 2019 board
if (YEAR == "2019" || window.location.pathname.match("upload") == -1) {
	var boards = {
		"titleImg": "./images/title.png",
		"1": {
			"levelName": "Snowy",
			"creator": "MurlocGD, PizzaGamerHu",
			"levelID": "39776379",
			"video": "FBJUt0U4kUw",
			"color": "#e55b5b"
		},
		"2": {
			"levelName": "Garatun",
			"creator": "TellConfig",
			"levelID": "55787317",
			"video": "yXo6jY_W6LM",
			"color": "#71fcec"
		},
		"3": {
			"levelName": "Gold Ring",
			"creator": "ShadowBurnSK",
			"levelID": "62611697",
			"video": "uT2n-35x1CA",
			"color": "#f3fc71"
		},
		"4": {
			"levelName": "FiFqo Calling Rebirth",
			"creator": "GD Mini",
			"levelID": null,
			"video": "WLJ0rVXIDP4",
			"color": "#43a045"
		},
		"5": {
			"levelName": "Gamingas",
			"creator": "Qrange",
			"levelID": "59654444",
			"video": "V1zGo03x4Po",
			"color": "#cc3bc2"
		},
		"6": {
			"levelName": "Infinity Gamingas",
			"creator": "Jazerplay, PlayerGeoCZ",
			"levelID": null,
			"video": null,
			"color": "#b28fea"
		},
		"7": {
			"levelName": "Deltarune",
			"creator": "EidamGD",
			"levelID": null,
			"video": "3u3ptITvG5g",
			"color": "#3d0f10"
		},
		"8": {
			"levelName": "GG Gedon",
			"creator": "Jakubko2005",
			"levelID": "52409692",
			"video": "ljaAtxqcngg",
			"color": "#e8e53e"
		},
		"9": {
			"levelName": "Rainbow Travel",
			"creator": "PlayerGeoCZ",
			"levelID": "55029144",
			"video": "FBJUt0U4kUw",
			"color": "#3ee860"
		},
		"10": {
			"levelName": "Fracture",
			"creator": "ImSamo",
			"levelID": null,
			"video": "WLJ0rVXIDP4",
			"color": "#9a10ea"
		}
	};
}
else if (YEAR == "2021" || window.location.pathname.match("upload") != -1) {
	var boards = {
		"1": {
			"levelName": "Vajcia",
			"creator": "ImSamo",
			"levelID": "64832786",
			"video": "-aYFb6mtrvY",
			"color": "#cdefed"
		},
		"2": {
			"levelName": "Gamingas",
			"creator": "Qrange",
			"levelID": "59654444",
			"video": "V1zGo03x4Po",
			"color": "#ff5f16"
		},
		"3": {
			"levelName": "TsukI",
			"creator": "ImSamo",
			"levelID": "58937627",
			"video": "Ia7_kV6riOQ",
			"color": "#c83dd9"
		},
		"4": {
			"levelName": "level482",
			"creator": "ImSamo",
			"levelID": null,
			"video": "-bq_rvgtukM",
			"color": "#d7bd05"
		},
		"5": {
			"levelName": "Wibes",
			"creator": "ShadowBurnSK",
			"levelID": "55974905",
			"video": "MWGR6W0cMNw",
			"color": "#f93232"
		},
		"6": {
			"levelName": "Calm Blue",
			"creator": "playergeoCZ",
			"levelID": "70205309",
			"video": "AuokRDWcTu4",
			"color": "#5fb3c9"
		},
		"7": {
			"levelName": "Okurka",
			"creator": "TellConfig",
			"levelID": null,
			"video": "Ia7_kV6riOQ",
			"color": "#24700d"
		},
		"8": {
			"levelName": "Night Light",
			"creator": "EidamGD",
			"levelID": "63562152",
			"video": "pU4kA6s0yWM",
			"color": "#493653"
		},
		"9": {
			"levelName": "Krestan Miso",
			"creator": "Jazerplay",
			"levelID": null,
			"video": "7FoxMO8u38Q",
			"color": "#e0e0e0"
		},
		"10": {
			"levelName": "Paradox World",
			"creator": "Jakubko2005",
			"levelID": "54941993",
			"video": "F0OM9qN8oCI",
			"color": "#6a1f76"
		},
        "11": {
			"levelName": "Pichlace",
			"creator": "Jakubko2005",
			"levelID": "64609075",
			"video": "apxi5fELZlA",
			"color": "#62ec63"
		},
		"12": {
			"levelName": "Doom arrived",
			"creator": "Jakubko2005",
			"levelID": "55948676",
			"video": "8RVqO6HsptU",
			"color": "#316346"
		},
		"13": {
			"levelName": "Infinity Journey",
			"creator": "playergeoCZ a další",
			"levelID": "61102013",
			"video": "paGz3CzbOVk",
			"color": "#9abd10"
		},
		"14": {
			"levelName": "D e s e r t",
			"creator": "playergeoCZ",
			"levelID": "56179232",
			"video": "OJl6WIf-qGA",
			"color": "#d8c437"
		},
		"15": {
			"levelName": "Hell Note",
			"creator": "EidamGD a Jazerplay",
			"levelID": "57149934",
			"video": "vZucsa43bNs",
			"color": "#2a0000"
		},
		"titleImg": "",
		"pageBGcolor": "#020202"
	}
}

function onGDBClick(pos, index) {
	$(document).ready(function () {
		$(".popup").fadeTo(100, 0);
		if (pos == null) {
			$("#cpopup" + index).css("background-color", "rgba(255,128,128,0.5)");
			$("#cpopup" + index).text(jsStr["LEV_NOEXIST"][LANG]);
			$("#cpopup" + index).fadeTo(100, 1);
			$("#cpopup" + index).fadeTo(500, 0);
		}
		else {
			window.open("https://gdbrowser.com/" + pos, "_blank");
		}
	});
}

function onIDCopyClick(pos, index) {
	$(document).ready(function () {
		$(".popup").fadeTo(100, 0);
		if (pos == null || pos == "") {
			$("#cpopup" + index).css("background-color", "rgba(255,128,128,0.5)");
			$("#cpopup" + index).text(jsStr["LEV_NOEXIST"][LANG]);
			$("#cpopup" + index).fadeTo(100, 1);
			$("#cpopup" + index).fadeTo(500, 0);
		}
		else {
			$("#cpopup" + index).text("ID: " + pos);
			$("#cpopup" + index).fadeTo(100, 1);
		}
	});
}

function onYTClick(link, index) {
	$(document).ready(function () {
		$(".popup").fadeTo(100, 0);
		if (link == "null" || link == "") {
			$("#cpopup" + index).css("background-color", "rgba(255,128,128,0.5)");
			$("#cpopup" + index).text(jsStr["VID_NOEXIST"][LANG]);
			$("#cpopup" + index).fadeTo(100, 1);
			$("#cpopup" + index).fadeTo(500, 0);
		}
		else {
			window.open("https://www.youtube.com/watch?v=" + link, "_blank");
		}
	});
}

function generateList(boards) {
	for (i = 1; i < Object.keys(boards).length - ADDIT_VALS; i++) {

		let bIndex = (i).toString();

		// Disabling card buttons
		if (boards[bIndex]["levelID"] == null || boards[bIndex]["levelID"] == "") { var ID = "disabled"; }
		else { var ID = ""; }

		if (boards[bIndex]["video"] == null || boards[bIndex]["video"] == "") { var video = "disabled"; }
		else { var video = ""; }

		// Glow depending on level position
		var cardBG = `background-color: ${boards[bIndex]["color"]}`;
		if (i == 1) { cardBG += ";box-shadow: 5px 5px 40px yellow, -5px -5px 40px green, 5px -5px 40px aqua, -5px 5px 40px red;"; }
		if (i == 2) { cardBG += `;box-shadow: 2px 2px 30px ${boards[bIndex]["color"]}`; }
		if (i == 3) { cardBG += `;box-shadow: 2px 2px 20px ${boards[bIndex]["color"]}`; }

		// Setting page BG from list
		if (Object.keys(boards).indexOf("pageBGcolor") != -1) {
			$("body").css("background-color", boards["pageBGcolor"])
		}

		$(".boards").append(`
		<div class="box" style="${cardBG}"><span>${boards[bIndex]["levelName"]}</span>
		<button class="button ${video}" onclick="onYTClick('${boards[bIndex]["video"]}',${bIndex})" title="${jsStr["DISP_EP"][LANG]}">
			<img class="boxLink" src="./images/yticon.png">
		</button>
		<button class="button ${ID}" onclick="onGDBClick(${boards[bIndex]["levelID"]},${bIndex})" title="${jsStr["GDB_DISP"][LANG]}">
			<img class="boxLink" src="./images/gdbrowser.png">
		</button>
		<button class="button ${ID}" onclick="onIDCopyClick(${boards[bIndex]["levelID"]},${bIndex})" title="${jsStr["COPY_ID"][LANG]}">
			<img class="boxLink" src="./images/copyID.png">
		</button>

		<p>${jsStr["CREATOR_BY"][LANG]}${boards[bIndex]["creator"]}</p>
		<h3 class="popup" id="cpopup${bIndex}">${jsStr["ID_COPIED"]}</h3>

		</div>
	`);
	};
	// Removing stuff if list is empty
	if ($(".box").length == 0 & location.pathname.match(/(upload)/g) == null) {
		$(".titles").append(jsStr["LLOAD_FAIL"][LANG]);
		$(".password").remove();
		$("#crown").remove();
	}
}

var listData = "";
$(function () {
	$(".shade").append(`<img class="title" src="${jsStr["TIT_IMG"][LANG]}">`);
	$(".commBut").attr("src", jsStr["COMM_IMG"][LANG]);
	if (location.search != "") {
		var listID = location.search.slice(1).split("=");
		
		// Setting title image
		$(".titleImage").attr("src", boards["titleImg"]);

		// Password input removal
		if (!["id", "pid"].includes(listID[0])) {
			$(".password").remove()
		}

		if (listID[0] == "preview" & listID[1] == "1") {
			let decodeData = atob(sessionStorage.getItem("previewJson")).split(",");
			let decodedData = "";
			for (i = 0; i < decodeData.length; i++) {
				decodedData += String.fromCharCode(decodeData[i]);
			}
			let boards = JSON.parse(decodedData);
			$(".titles").append(jsStr["PREVIEW"][LANG]);
			$(".searchTools").remove();
			generateList(boards);
		}
		else if (listID[0] == "id") {
			$.get("./php/getLists.php?id=" + listID[1], function (data) {
				if (data == 1) {
					$(".titles").append(jsStr["L_NOEXIST"][LANG]);
					$(".searchTools").remove();
					$("#crown").remove();
				}
				else if (data == 2) {
					$(".titles").append(jsStr["L_INVID"][LANG]);
					$(".searchTools").remove();
					$("#crown").remove();
				}
				else {
					let listData = data.split(";-!-;");
					listData[3].replace("&quot;", "\"");

					if (listData[5] == 2) {
						$(".titles").append("<p>Event seznam si jde prohlédnout jen ze stránky 2021 seznamu ;).</p>");
						$(".searchTools").remove();
						$("#crown").remove();
					}
					else {
						let boards = JSON.parse(listData[2]);
						$(".titles").append(`<p>${listData[1]}</p>
						<hr class="lineSplitGeneral" style="margin: -2% 10%;">
						<p style="font-size: 3vw;">- ${listData[0]} -</p>`);
						$(".titleImage").attr("src", boards["titleImg"]);
						generateList(boards);
					}
				}
			}
			)
		}
		else if (listID[0] == "pid") {
			$.get("./php/getLists.php?pid=" + listID[1], function (data) {
				if (data == 1) {
					$(".titles").append(jsStr["L_NOEXIST"][LANG]);
					$(".searchTools").remove();
					$("#crown").remove();
				}
				else {
					let listData = data.split(";-!-;");
					listData[3].replace("&quot;", "\"");
					let boards = JSON.parse(listData[2]);
					$(".titles").append(`<p>${listData[1]}</p>
					<hr class="lineSplitGeneral" style="margin: -2% 10%;">
					<p style="font-size: 3vw;">- ${listData[0]} -</p>`);
					$(".titleImage").attr("src", boards["titleImg"]);
					generateList(boards);
				}
			}
			)
		}

		else if (location.pathname.match(/(upload)/g) == null) {
			if (YEAR == undefined) {
				$(".titles").append(jsStr["L_NONUM"][LANG]);
				$(".searchTools").remove();
				$("#crown").remove();
			}
			else if (YEAR != "2019" & YEAR != "2021") {
				$(".titles").append(jsStr["L_NOYEAR"][LANG]);
				$(".searchTools").remove();
				$("#crown").remove();
			}
			else {
				$(".password").remove()
				generateList(boards);
				}
		}
	}
	else if (YEAR == "2019") {
		$(".password").remove()
		generateList(boards);
	}
});

function checkPassword() {
	let listID = location.search.slice(1).split("=");
	let passEntered = $(".passInput").val();

	// POLISH THIS LATER!!!

	$(".passInput").attr("disabled", true);
	$(".passInput").val(jsStr["CHECKING"][LANG]);
	$(".passInput").css("background-color", "#82fc80")

	$(".passImg").addClass("disabled");
    
    let listType = "id";
    if (listID[0] == "pid") {
        listType = "pid";
    }
    let postReq = { "pwdEntered": passEntered, "retData": "0" };
    postReq[listType] = listID[1];
    
	$.post("./php/pwdCheckAction.php", postReq, function (data) {
		// Incorrect pwd
		if (["1","2"].includes(data)) {
			//testing
			$(".passInput").css("background-color", "#fc8093")
			$(".passInput").val(jsStr["INC_PWD"][LANG])
			setTimeout(() => {
				$(".passInput").attr("disabled", false);
				$(".passImg").removeClass("disabled");
				$(".passInput").val("")
			}, 1000)
		}
		else if (data == 3) {
            let page = listType == "id" ? "edit" : "pedit";
			window.location.href = `http://www.gamingas.wz.cz/lofttop10/upload.html?${page}=${listID[1]}&pass=${passEntered}`;
		}
	})
}
