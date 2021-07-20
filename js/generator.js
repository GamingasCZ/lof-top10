const ADDIT_VALS = 1;

// Default 2019 board
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

function onGDBClick(pos, index) {
	$(document).ready(function () {
		$(".popup").fadeTo(100, 0);
		if (pos == null) {
			$("#cpopup" + index).css("background-color", "rgba(255,128,128,0.5)");
			$("#cpopup" + index).text("Level neexistuje!");
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
			$("#cpopup" + index).text("Level neexistuje!");
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
			$("#cpopup" + index).text("Video neexistuje!");
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
		<button class="button ${video}" onclick="onYTClick('${boards[bIndex]["video"]}',${bIndex})" title="Zobrazit epizodu">
			<img class="boxLink" src="./images/yticon.png">
		</button>
		<button class="button ${ID}" onclick="onGDBClick(${boards[bIndex]["levelID"]},${bIndex})" title="Zobrazit v GDBrowseru">
			<img class="boxLink" src="./images/gdbrowser.png">
		</button>
		<button class="button ${ID}" onclick="onIDCopyClick(${boards[bIndex]["levelID"]},${bIndex})" title="Zkopírovat ID levelu">
			<img class="boxLink" src="./images/copyID.png">
		</button>

		<p>Od: ${boards[bIndex]["creator"]}</p>
		<h3 class="popup" id="cpopup${bIndex}">ID zkopírováno</h3>

		</div>
	`);
	};
	// Removing stuff if list is empty
	if ($(".box").length == 0 & location.pathname.match(/(upload)/g) == null) {
		$(".titles").append("<p>Nepodarilo se nacíst seznam!</p>");
		$(".password").remove();
		$("#crown").remove();
	}
}

var listData = "";
$(function () {
	if (location.search != "") {
		var listID = location.search.slice(1).split("=");

		// Password input removal
		if (listID[0] != "id") {
			$(".password").remove()
		}

		if (listID[0] == "preview" & listID[1] == "1") {
			let decodeData = atob(sessionStorage.getItem("previewJson")).split(",");
			let decodedData = "";
			for (i = 0; i < decodeData.length; i++) {
				decodedData += String.fromCharCode(decodeData[i]);
			}
			let boards = JSON.parse(decodedData);
			$(".titles").append("<p>(Náhled)</p>");
			$(".titleImage").attr("src", boards["titleImg"]);
			generateList(boards);
		}
		else if (listID[0] == "id") {
			$.get("./php/getLists.php?id=" + listID[1], function (data) {
				if (data == 1) {
					$(".titles").append("<p>Seznam neexistuje :/!</p>");
					$(".password").remove();
					$("#crown").remove();
				}
				else if (data == 2) {
					$(".titles").append("<p>Jakej génius hodil slovo namísto IDcka :D</p>");
					$(".password").remove();
					$("#crown").remove();
				}
				else {
					let listData = data.split(";");
					listData[3].replace("&quot;", "\"");
					let boards = JSON.parse(listData[2]);
					$(".titles").append("<p>Seznam: " + listData[1] + "</p><p>Od: " + listData[0] + "</p>");
					$(".titleImage").attr("src", boards["titleImg"]);
					generateList(boards);
				}
			}
			)
		}
		else {
			generateList(boards);
		}
	}
	else {
		$(".password").remove()
		generateList(boards);
	}
});

function checkPassword() {
	let listID = location.search.slice(1).split("=");
	let passEntered = $(".passInput").val();
	$(".passImg").addClass("disabled");
	$(".passText").css("color","#82fc80")
	$(".passText").text("Kontrolování hesla...")
	$.post("./php/pwdCheckAction.php", { "id": listID[1], "pwdEntered": $(".passInput").val(),"retData": "0"}, function (data) {
		// Incorrect pwd
		if (data == 2) {
			//testing
			$(".passImg").removeClass("disabled");
			$(".passText").css("color","#fc8093")
			$(".passText").text("Heslo je nesprávné!")
		}
		if (data == 3) {
			window.location.href = `http://www.gamingas.wz.cz/lofttop10/upload.html?edit=${listID[1]}&pass=${$(".passInput").val()}`;
		}
	})
}