const ADDIT_VALS = 1;

// These are not real people :<'
const fakeNames = ["Voiprin", "Sarprong", "ZentricSigma", "Darwing", "ExpoD", "J0hnram", "Jayuff", "AligaThePeter", "Divpan", "Acidity", "Doorami", "DanZBro", "FunnyBone"]

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
		"titleImg": "",
		"1": {
			"levelName": "Snowy",
			"creator": [["MurlocGD", 0, "Nahrál"], [{ "name": "Level", "hasPer": false, "color": "#fab789", "HTMLobject": {}, "id": 1640454770131 }], [{ "name": "MurlocGD", "role": 1640454770131, "part": ["41", "100"], "color": "#00f9f9", "socials": [[0, "https://youtube.com/channel/httpswww.youtube.comchannelUC8"]], "verified": true }, { "name": "PizzaGamerHu", "role": 1640454770131, "part": ["0", "41"], "color": "#7d7dff", "socials": [[0, "https://youtube.com/channel/UCpN7j5gNrbDIHI_K-MSnL0w"], [2, "https://twitch.tv/pizzagamerhu"]], "verified": true }]],
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
			"creator": [["jazerplay", true, "Nahrál"], [{ "name": "Level", "hasPer": false, "color": "#8c4f00", "id": 1640786121833 }], [{ "name": "Jazerplay", "role": 1640786121833, "part": ["0", "50"], "color": "#ed333b", "socials": [], "verified": true }, { "name": "PlayerGeoCZ", "role": 1640786121833, "part": ["50", "100"], "color": "#f8e45c", "socials": [], "verified": true }]],
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
			window.open("https://gdrowser.com/" + pos, "_blank");
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

const openSocLink = link => { window.open(link) }
const openProfileOnGDB = name => { window.open("https://gdrowser.com/profile/" + name) }

async function getProfileStats(k, ind) {
	let container = k.target

	$(container).hide()
	await $(container).after("<img src='images/loading.png' class='loading'>")
	$(".loading").css("animation-name", "loading")

	let uName = $(k.target.parentElement).siblings()[1].innerText;

	await $.get("https://gdrowser.com/api/profile/" + uName, user => {
		$(".loading").remove();

		$(container).after(`<img onclick="openProfileOnGDB('${user.username}')" style="transform: translateX(0.7vw);" class="stats button" src="images/add.png">`)
		if (user.cp > 0) {
			$(container).after(`<p style="margin:0 1vw"><img class="stats" src="images/cp.png">${user.cp} </p>`)
		}
		$(container).after(`<p style="margin:0 1vw"><img class="stats" src="images/ucoin.png">${user.userCoins}</p>`)
		$(container).after(`<p style="margin:0 1vw"><img class="stats" src="images/demons.png">${user.demons} </p>`)
		$(container).after(`<p style="margin:0 1vw"><img class="stats" src="images/star.png">${user.stars} </p>`)
	})

	await k.target.remove()
}

function showCollabStats(id) {
	let level = boards[id]["creator"]
	let names = [jsStr["YT_CHAN"][LANG], jsStr["TW_PROF"][LANG], jsStr["TW_CHAN"][LANG], jsStr["DC_SERV"][LANG], jsStr["CUST_LINK"][LANG]];
	let imgs = ["youtube", "twitter", "twitch", "discord", "cust"];

	let cardCol = $($(".box")[id - 1]).css("background-color");
	let dark = HEXtoRGB(RGBtoHEX((cardCol.match(/\d+/g)).map(x => parseInt(x))), 40)
	let extraDark = HEXtoRGB(RGBtoHEX((cardCol.match(/\d+/g)).map(x => parseInt(x))), 80)

	$(".collabTTitle").text(`- ${boards[id].levelName} -`);
	$("#collabTools").css("background-color", cardCol);
	$(".editorHeader").css("background-color", `rgb(${dark.join(",")})`)
	$("#collabTools").css("border-color", `rgb(${dark.join(",")})`)
	$(".collabHeader").css("background-color", `hsl(${getHueFromHEX(RGBtoHEX((cardCol.match(/\d+/g)).map(x => parseInt(x))))},40.7%,54%)`)
	$(".collabDIV").css("background-color", `hsl(${getHueFromHEX(RGBtoHEX((cardCol.match(/\d+/g)).map(x => parseInt(x))))},40.7%,34%)`)

	$("#collabTools").fadeIn(50);
	$("#collabTools").css("transform", "scaleY(1)");

	$(".statsCreators").text("") // Reset table
	$(".collabGraphs").text("") // Reset table

	let humanRoles = [];

	let appendedNames = []; // One name shouldn't have more table rows
	level[2].forEach(creators => { // Creators
		humanRoles.push([creators.part, creators.role, creators.color, creators.name]);

		// When the creator doesn't have a name (die and turn into a ghost :O)
		let isGhost = false
		if (creators.name == "") {
			isGhost = true
			creators.name = "Duch dashera"
		}

		if (creators.verified && appendedNames.indexOf(creators.name) == -1) {
			appendedNames.push(creators.name);

			// Social media
			let socialTags = "";
			for (let soc = 0; soc < creators.socials.length; soc++) {
				socialTags += `<img onclick="openSocLink('${creators.socials[soc][1]}')" title="${names[creators.socials[soc][0]]}"
				                    style="width: 3.5vw;" class="button" src="images/${imgs[creators.socials[soc][0]]}.png">`

			}

			$(".statsCreators").append(`<tr class='tableRow'>
			<td style="display: flex; justify-content: left; align-items: center">
				<img style="width: 4vw;margin: 0.4vw;" src="https://gdrowser.com/icon/${creators.name}">
				<p class="memberName" style="margin:0 1vw 0; color: ${creators.color}">${creators.name}</p>
				${socialTags}
				<hr class="verticalSplitter">
				<div class="pStatsContainer">
				<img style="width: 3vw;margin: 0.4vw;" src="images/gdrowser.png" class="getProfile button" title="Zobrazit profil">
				</div>
			</td>
		</tr>`)
			

			$($(".getProfile")[$(".getProfile").length - 1]).on("click", k => { getProfileStats(k, $(".tableRow").length - 1) })
		}
		else if (!creators.verified && appendedNames.indexOf(creators.name) == -1) {
			appendedNames.push(creators.name);

			// Social media
			let socialTags = "";
			for (let soc = 0; soc < creators.socials.length; soc++) {
				socialTags += `<img onclick="openSocLink('${creators.socials[soc][1]}')" title="${names[creators.socials[soc][0]]}"
				                    style="width: 3.5vw;" class="button" src="images/${imgs[creators.socials[soc][0]]}.png">`
			}

			// Give
			let randIcon = ""
			if (!isGhost) {
				randIcon = -1
				while ([-1, 0, 1].indexOf(randIcon) != -1) {
					randIcon = parseInt(Math.random() * 17)
				}
				if (randIcon < 10) { randIcon = "0" + randIcon }
			}
			else {randIcon = "ghostCube"}

			$(".statsCreators").append(`<tr class='tableRow'>
			<td style="display: flex; justify-content: left; align-items: center">
				<img style="width: 4vw;margin: 0.4vw;" src="images/emoji/${randIcon}.png">
				<p class="memberName" style="color: #72f970; margin: 0 1vw 0;">${creators.name}</p>
				${socialTags}
			</td>
		</tr>`)
		}
	});

	level[1].forEach(roles => { // Roles
		let graphBars = [];
		let sort = [];

		let ind = 0
		humanRoles.forEach(hum => {
			if (hum[1] == roles.id) {
				sort.push([parseInt(hum[0][0]), ind-1])
				graphBars.push(`<div for="${hum[3]}" class="graphLine"
				                     style="background: ${hum[2]}; width: ${hum[0][1] - hum[0][0]}%; height: 100%;">
									 <div class="graphPerc" for="${hum[3]}">	
									 	<div class="graphText">|< ${hum[0][0]}%</div><div class="graphText">${hum[0][1]}% >|</div>
									 </div>
								</div>`)
			}
			ind++
		});
		console.log(sort.sort())

		$(".collabGraphs").append(`
		<div style="display: flex; flex-direction: column; margin: 1.5vw 1vw;">
			<div style="display: flex; justify-content: space-between; max-width: 91%;">
				<p style="margin: 0 0 0 6vw;">${roles.name}</p>
				<div style="display: flex; align-items: center;" class="nameShower">
					<img class="boxIcon" alt=" " src="images/bytost.png"></img>
					<p style="margin: 0"></p>
				</div>
			</div>

			<div style="display: flex; justify-content: center">
				<span id="graphPercentage">0%</span>
				<div class="graphContainer">
					${graphBars.sort((a,b) => {-1+((b[0]<a[0])*2)}).join("")}
				</div>
				<span id="graphPercentage">100%</span>
			</div>
		</div>
		`)
	})
	// Hovering over graph parts
	$(".graphLine").on("mouseover", hoverBar)
	$(".graphLine").on("mouseout", unhoverBar)

	// Hovering over names
	$(".memberName").on("mouseover", hoverName)
	$(".memberName").on("mouseout", unhoverName)

	$(".verticalSplitter").css("background-color", `rgb(${extraDark.join(",")})`);
}

function hideCollabStats() {
	$("#collabTools").fadeOut(50);
	$("#collabTools").css("transform", "scaleY(0.7)");
}

function hoverBar(k) {
	// Utter bullcrap >:(
	let nameShower = $($(k.currentTarget.parentElement.parentElement).siblings().children()[1]).children()
	let hoverName = $(`.memberName:contains(${$(k.currentTarget).attr("for")})`)

	$(nameShower.parent()).css("opacity", 1)

	$(nameShower[0]).attr("src", "https://gdrowser.com/icon/"+hoverName.text())
	$(nameShower[1]).text(hoverName.text())

	if (k.currentTarget.clientWidth > $(".graphContainer")["0"].clientWidth*0.13) {
		$(k.currentTarget.children).css("opacity", 1)
	}
	else {
		let from = k.currentTarget.children[0].children[0].textContent.slice(3)
		let to = k.currentTarget.children[0].children[1].textContent.slice(0,2)
		$(nameShower[1]).text(hoverName.text()+` - ${from} až ${to}`)
	}

	let textColor = hoverName.css("color")

	hoverName.css("text-shadow", `${textColor} 0px 0px 15px`)
	hoverName["0"].scrollIntoView();

	$(`.memberName:not(.memberName:contains(${$(k.currentTarget).attr("for")}))`).css("opacity", `0.3`)
}
function unhoverBar(k) {
	let nameShower = $($(k.currentTarget.parentElement.parentElement).siblings().children()[1]).children()
	$(nameShower.parent()).css("opacity", 0)

	if (k.currentTarget.clientWidth > $(".graphContainer")["0"].clientWidth*0.13) {
		$(k.currentTarget.children).css("opacity", 0)
	}

	$(`.memberName:contains(${$(k.currentTarget).attr("for")})`).css("text-shadow", "")
	$(`.memberName:not(.memberName:contains(${$(k.currentTarget).attr("for")}))`).css("opacity", `1`)
}

function hoverName(k) {
	$(k.currentTarget).css("text-shadow", `${$(k.currentTarget).css("color")} 0px 0px 15px`)

	let graphColor = $(`.graphLine[for=${$(k.currentTarget).text()}]`).css("background-color")

	// Show build part
	$(`.graphLine[for='${$(k.currentTarget).text()}'] > .graphPerc`).css("opacity", 1)
	$(`.graphLine[for='${$(k.currentTarget).text()}'] > .graphPerc`).css("transform", "scaleY(1)")

	$(`.graphLine[for='${$(k.currentTarget).text()}']`).css("box-shadow", `${graphColor} 0px 0px 20px`)
	$(`.graphLine:not(.graphLine[for='${$(k.currentTarget).text()}'])`).css("opacity", 0.2)
}
function unhoverName(k) {
	$(k.currentTarget).css("text-shadow", "")

	// Hide build part
	$(`.graphLine[for='${$(k.currentTarget).text()}'] > .graphPerc`).css("opacity", 0)
	$(`.graphLine[for='${$(k.currentTarget).text()}'] > .graphPerc`).css("transform", "scaleY(0.8)")

	$(`.graphLine[for='${$(k.currentTarget).text()}']`).css("box-shadow", ``)
	$(`.graphLine:not(.graphLine[for='${$(k.currentTarget).text()}'])`).css("opacity", 1)
}

function boxCreator(obj, index) {
	if (typeof obj != "object") {
		return jsStr["CREATOR_BY"][LANG] + obj
	}
	else {
		let names = [];
		obj[2].forEach(creator => {
			let icon = "";
			if (creator.verified) {
				icon = `<img class="boxIcon" alt=" " style="background: ${creator.color}">`;
			}
			if (creator.name == "") { var nm = "DuchDashera" }
			else { var nm = creator.name }

			child = `<div style="color: ${creator.color};" class="collabChild">${icon}${nm}</div>`
			if (names.indexOf(child) == -1) { names.push(child); } // Names should only appear once
		});
		// Fix url when ready
		return `
		<div class="uploadText boxCollabHeader">
		${obj[0][2]}: 
			<img class="boxIcon" alt=" " style="margin: 0 1vw" src="https://gdrowser.com/icon/${obj[0][0]}">${obj[0][0]}
		</div>

		<div onclick="showCollabStats(${index})" class="collabParent button">` + names.join("") + "</div>"
	}
}

function generateList(boards) {
	for (i = 1; i < Object.keys(boards).length - ADDIT_VALS; i++) {

		let bIndex = (i).toString();

		// Removing card buttons
		if (boards[bIndex]["levelID"] == null || boards[bIndex]["levelID"] == "") { var ID = ["", ""]; }
		else {
			var ID = [`<img src="./images/gdrowser.png" class="button boxLink" onclick="onGDBClick(${boards[bIndex]["levelID"]},${bIndex})" title="${jsStr["GDB_DISP"][LANG]}">`,
			`<img src="./images/copyID.png" class="button boxLink" onclick="onIDCopyClick(${boards[bIndex]["levelID"]},${bIndex})" title="${jsStr["COPY_ID"][LANG]}">`]
		}

		if (boards[bIndex]["video"] == null || boards[bIndex]["video"] == "") { var video = ``; }
		else { var video = `<img src="./images/yticon.png" class="button boxLink" onclick="onYTClick('${boards[bIndex]["video"]}',${bIndex})" title="${jsStr["DISP_EP"][LANG]}">`; }

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
		<div class="box" style="${cardBG}">
			<div class="boxHeader">
				<span>${boards[bIndex]["levelName"]}</span>
				<div style="display:flex">
					${video}
					${ID[0]}
					${ID[1]}
				</div>
			</div>

			${boxCreator(boards[bIndex]["creator"], bIndex)}
		</div>
	`);
		// Only display icons on hover
		if (typeof boards[bIndex]["creator"] == "object") {
			$($(".box")[$(".box").length - 1]).on("mouseover", (k) => {
				// Player icons
				let currIndex = "";
				let boxElements = Object.values($(".box"))
				for (let box = 0; box < $(".box").length; box++) {
					if (boxElements[box].isEqualNode(k.target)) {
						currIndex = box;
					}
				}
				// Fix url when ready
				for (let icon = 0; icon < ((k.target).children[2].children).length; icon++) {
					$((k.target).children[2].children[icon].children).css("background", "none")
					$((k.target).children[2].children[icon].children).attr("src", "https://gdrowser.com/icon/" + boards[currIndex + 1]["creator"][2][icon].name)
				}

				$(k.target).off("mouseover")
			})
		}

	};
	// Removing stuff if list is empty
	if ($(".box").length == 0 & location.pathname.match(/(upload)/g) == null) {
		$(".titles").append(jsStr["LLOAD_FAIL"][LANG]);
		$(".password").remove();
		$("#crown").remove();
	}
}

function debugCards() {
	// Returns a randomly generated board
	let str = '{"titleImg": "",';
	for (let i = 1; i < Math.ceil(Math.random() * 20) + 1; i++) {
		str += `"${i}": {"levelName": "Debug #${i}","creator": "${fakeNames[Math.floor(Math.random() * fakeNames.length)]}","levelID": 128, "video": "9ywnLQywz74","color":"${RGBtoHEX(randomColor())}"},`
	}
	str = str.slice(0, -2) + "}}"
	return JSON.parse(str)
}

var listData = "";
var debugPwd = 0;
$(function () {
	$(".passInput").val("");
	$(".shade").append(`<img class="title" src="${jsStr["TIT_IMG"][LANG]}">`);
	$(".commBut").attr("src", jsStr["COMM_IMG"][LANG]);
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
			boards = JSON.parse(decodedData);
			$(".titles").append(jsStr["PREVIEW"][LANG]);
			$(".titleImage").attr("src", boards["titleImg"]);
			$(".searchTools").remove();
			generateList(boards);
		}
		else if (listID[0] == "id") {
			if (window.location.protocol.includes("file")) {
				debugPwd = Math.ceil(Math.random() * 9999999999)
				$(".titles").append(`<p style="color: tomato">Debug List</p>
				<hr class="lineSplitGeneral" style="margin: -2% 10%;">
				<p style="font-size: 3vw;">- Dasher123 -</p>
				<p style="font-size: 3vw;">Pass: ${debugPwd}</p>`);
				$(".titleImage").attr("src", boards["titleImg"]);
				generateList(debugCards())
			}

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
	$.post("./php/pwdCheckAction.php", { "id": listID[1], "pwdEntered": passEntered, "retData": "0" }, function (data) {
		// Incorrect pwd
		if (data == 2) {
			//testing
			$(".passInput").css("background-color", "#fc8093")
			$(".passInput").val(jsStr["INC_PWD"][LANG])
			setTimeout(() => {
				$(".passInput").attr("disabled", false);
				$(".passImg").removeClass("disabled");
				$(".passInput").val("")
			}, 1000)
		}
		else if (data == 3 || data == 1) {
			window.location.href = `http://www.gamingas.wz.cz/lofttop10/upload.html?edit=${listID[1]}&pass=${passEntered}`;
		}
	})

	if (window.location.protocol.includes("file")) {
		if (passEntered == debugPwd) {
			window.location.href = `./upload.html?edit=${listID[1]}&pass=${passEntered}`
		}
	}
}
