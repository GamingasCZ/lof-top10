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
		if (pos == null) {
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
		if (link == "null") {
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

var listData = "";
$(function () {

	var boards = {
		"titleImg": "images/title.png",
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

	$(".title").attr("src", boards["titleImg"]);

	if (location.search != "") {
		var listID = location.search.slice(1).split("=")[1];
		var ok = $.get("./php/getLists.php?id=" + listID, function (data) {
			boards = data;
			for (i = 1; i < Object.keys(boards).length; i++) {

				let bIndex = (i).toString();
		
				if (boards[bIndex]["levelID"] == null) { var ID = "disabled"; }
				else { var ID = ""; }
		
				if (boards[bIndex]["video"] == null) { var video = "disabled"; }
				else { var video = ""; }
		
				var cardBG = `background-color: ${boards[bIndex]["color"]}`;
		
				if (i == 1) {
					cardBG += ";box-shadow: 5px 5px 40px yellow, -5px -5px 40px green, 5px -5px 40px aqua, -5px 5px 40px red;";
				}
				if (i == 2) {
					cardBG += `;box-shadow: 2px 2px 30px ${boards[bIndex]["color"]}`;
				}
				if (i == 3) {
					cardBG += `;box-shadow: 2px 2px 20px ${boards[bIndex]["color"]}`;
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
		});
		console.log(ok);
		console.log(listData);
		var boards = listData;
	}

	for (i = 1; i < Object.keys(boards).length; i++) {

		let bIndex = (i).toString();

		if (boards[bIndex]["levelID"] == null) { var ID = "disabled"; }
		else { var ID = ""; }

		if (boards[bIndex]["video"] == null) { var video = "disabled"; }
		else { var video = ""; }

		var cardBG = `background-color: ${boards[bIndex]["color"]}`;

		if (i == 1) {
			cardBG += ";box-shadow: 5px 5px 40px yellow, -5px -5px 40px green, 5px -5px 40px aqua, -5px 5px 40px red;";
		}
		if (i == 2) {
			cardBG += `;box-shadow: 2px 2px 30px ${boards[bIndex]["color"]}`;
		}
		if (i == 3) {
			cardBG += `;box-shadow: 2px 2px 20px ${boards[bIndex]["color"]}`;
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
});
