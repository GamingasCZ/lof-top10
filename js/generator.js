const ADDIT_VALS = 1;
const DISABLE_GDB = "h" // Change to anything else than "h" to break requests

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
	var boards = {"1":{"levelName":"Snowy","creator":[["MurlocGD",true,"Host"],[{"name":"Level","id":1646438090943}],[{"name":"MurlocGD","role":1646438090943,"part":[0,41],"color":"#62a0ea","socials":[[0,"https://youtube.com/channel/httpswww.youtube.comchannelUC8"]],"verified":[122,15,16,true]},{"name":"pizzagamerhu","role":1646438090943,"part":[41,100],"color":"#7d7dff","socials":[[0,"https://youtube.com/channel/UCpN7j5gNrbDIHI_K-MSnL0w"],[2,"https://twitch.tv/pizzagamerhu"]],"verified":[35,41,3,false]}]],"levelID":"39776379","video":"FBJUt0U4kUw","color":"#a3003c"},"2":{"levelName":"Garatun","creator":"TellConfig","levelID":"55787317","video":"yXo6jY_W6LM","color":"#009194"},"3":{"levelName":"Gold Ring","creator":"ShadowBurnSK","levelID":null,"video":"uT2n-35x1CA","color":"#3d2900"},"4":{"levelName":"FiFqo Calling Rebirth","creator":"GD Mini","levelID":null,"video":"WLJ0rVXIDP4","color":"#44a300"},"5":{"levelName":"Gamingas","creator":"Qrange","levelID":"59654444","video":"V1zGo03x4Po","color":"#a34100"},"6":{"levelName":"Infinity Gamingas","creator":[["jazerplay",true,"Nahrál"],[{"name":"Level","id":1646438293839}],[{"name":"jazerplay","role":1646438293839,"part":[0,50],"color":"#a30088","socials":[],"verified":[130,12,9,false]},{"name":"playergeoCZ","role":1646438293839,"part":[50,100],"color":"#a38d00","socials":[],"verified":[107,17,18,false]}]],"levelID":null,"video":null,"color":"#5c5c00"},"7":{"levelName":"Deltarune","creator":"EidamGD","levelID":null,"video":"3u3ptITvG5g","color":"#a30010"},"8":{"levelName":"GG geddon","creator":"Jakubko2005","levelID":"52409692","video":"ljaAtxqcngg","color":"#995200"},"9":{"levelName":"rainbow travel","creator":"playergeoCZ","levelID":"55029144","video":"FBJUt0U4kUw","color":"#00a396"},"10":{"levelName":"Fracture","creator":"ImSamo","levelID":null,"video":"WLJ0rVXIDP4","color":"#230057"},"titleImg":"","pageBGcolor":"#020202"}
}
else if (YEAR == "2021" || window.location.pathname.match("upload") != -1) {
	var boards = {"1":{"levelName":"Vajcia","creator":"ImSamo","levelID":"64832786","video":"-aYFb6mtrvY","color":"#a37a00"},"2":{"levelName":"Gamingas","creator":"Qrange","levelID":"59654444","video":"V1zGo03x4Po","color":"#600094"},"3":{"levelName":"TsukI","creator":"ImSamo","levelID":"58937627","video":"Ia7_kV6riOQ","color":"#a3009e"},"4":{"levelName":"level482","creator":"ImSamo","levelID":null,"video":"-bq_rvgtukM","color":"#a39e00"},"5":{"levelName":"Wibes","creator":"ShadowBurnSK","levelID":"55974905","video":"MWGR6W0cMNw","color":"#a31800"},"6":{"levelName":"Calm Blue","creator":"playergeoCZ","levelID":"70205309","video":"AuokRDWcTu4","color":"#0070a3"},"7":{"levelName":"Okurka","creator":"TellConfig","levelID":null,"video":"Ia7_kV6riOQ","color":"#023800"},"8":{"levelName":"Night Light","creator":"EidamGD","levelID":"63562152","video":"pU4kA6s0yWM","color":"#14003d"},"9":{"levelName":"Krestan Miso","creator":"Jazerplay","levelID":null,"video":"7FoxMO8u38Q","color":"#567000"},"10":{"levelName":"Paradox World","creator":"Jakubko2005","levelID":"54941993","video":"F0OM9qN8oCI","color":"#47006b"},"11":{"levelName":"Pichlace","creator":"Jakubko2005","levelID":"64609075","video":"apxi5fELZlA","color":"#2ca300"},"12":{"levelName":"Doom arrived","creator":"Jakubko2005","levelID":"55948676","video":"8RVqO6HsptU","color":"#003d1f"},"13":{"levelName":"Infinity Journey","creator":[["playergeoCZ",[107,17,18,false],"Host"],[{"name":"Level","id":1646506536018}],[{"name":"playergeoCZ","role":1646506536018,"part":["0","15"],"color":"#3d3846","socials":[],"verified":[107,17,18,false]},{"name":"Jakubko2005","role":1646506536018,"part":["15","28"],"color":"#004baf","socials":[[0,"https://youtube.com/channel/httpswww.youtube.comchannelUC"]],"verified":[116,22,17,true]},{"name":"jazerplay","role":1646506536018,"part":["28","37"],"color":"#a3a000","socials":[],"verified":[130,12,9,false]},{"name":"ShadowBurnSK","role":1646506536018,"part":["37","49"],"color":"#a34400","socials":[],"verified":[37,10,14,true]},{"name":"jablicko","role":1646506536018,"part":["54","58"],"color":"#6200a3","socials":[],"verified":[31,18,12,false]},{"name":"TellConfig","role":1646506536018,"part":["58","69"],"color":"#00a344","socials":[],"verified":[1,0,3,false]},{"name":"ekokekokos","role":1646506536018,"part":["69","81"],"color":"#00a31b","socials":[],"verified":0},{"name":"Patas Matas","role":1646506536018,"part":["49","54"],"color":"#000ba3","socials":[],"verified":0},{"name":"playergeoCZ","role":1646506536018,"part":["85","100"],"color":"#0049a3","socials":[],"verified":[107,17,18,false]}]],"levelID":"61102013","video":"paGz3CzbOVk","color":"#536600"},"14":{"levelName":"D e s e r t","creator":"playergeoCZ","levelID":"56179232","video":"OJl6WIf-qGA","color":"#a39b00"},"15":{"levelName":"Hell Note","creator":[["jazeplay",true,"Verifier"],[{"name":"Level","id":1646506461617}],[{"name":"jazerplay","role":1646506461617,"part":["0","100"],"color":"#a30800","socials":[],"verified":[130,12,9,false]}]],"levelID":"57149934","video":"vZucsa43bNs","color":"#1f0000"},"titleImg":"","pageBGcolor":"#020202"}
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

function listShare() {
	$("#popupBG").show()
	$("#popupBG").css("opacity", 1)

	$("#shareTools").fadeIn(100);

	let link = "";
	let array = window.location.href.match(/(year|id|pid)/);
	switch (array != null ? array[0] : null) {
		case null:
			link = "y=2019";
			break;
		case "pid":
			let paramGetter = new URLSearchParams(window.location.search)
			let params = Object.fromEntries(paramGetter.entries());

			link = "p=" + params["pid"];
			break;
		case "year":
			link = "y=" + (LIST_ID == -2 ? "2019" : "2021");
			break;
		case "id":
			link = "l=" + LIST_ID;
			break;
		default:
			break;
	}

	$("#shareContainer").on("mouseover", () => $("#shareContainer")[0].select())

	let cringeText = encodeURIComponent(`Mrkni se na můj Geodeš seznam - gamingas.wz.cz/?${link}`)

	let shareLinks = ["https://twitter.com/intent/tweet?text=" + cringeText, "https://www.reddit.com/submit?url=" + cringeText]

	let socButtons = $(".shareSocials").children()
	socButtons.off("click")
	
	for (let but = 0; but < socButtons.length; but++) {
		$(socButtons[but]).on("click", () => window.open(shareLinks[but]))
	}

	$("#shareContainer").val("gamingas.wz.cz/?" + link);
}

function hideShare() {
	$("#shareTools").fadeOut(100);
	$("#popupBG").css("opacity", 0)
	setTimeout(() => { $("#popupBG").hide() }, 100);
}

function showJumpTo() {
	$("#popupBG").show()
	$("#popupBG").css("opacity", 1)
	$("#jumpToTools").fadeIn(100);
	$(".jumpToContainer").text("");

	let ind = 1;
	Object.values(boards).slice(0, Object.keys(boards).length - ADDIT_VALS - 1).forEach(pos => {
		let creator = pos.creator;
		if (typeof creator == "object") creator = "(Collab)"

		$(".jumpToContainer").append(`<div class="roleBubble noMobileResize button" for="${ind}" style="background:${pos.color};" id="jumpBubble">#${ind} ${pos.levelName} - ${creator}</div>`)
		$(".jumpToContainer:last-child").on("click", (k) => {
			hideJumpTo();
			if ($(".boards").css("display") == "none") listList()
			$(".box")[$(k.target).attr("for") - 2].scrollIntoView();
		})
		ind++
	});
}
function hideJumpTo() {
	$("#jumpToTools").fadeOut(100);
	$("#popupBG").css("opacity", 0)
	setTimeout(() => { $("#popupBG").hide() }, 100);
}

function switchSite(val) {
	switch (val) {
		case "2019":
			switchLoFList('index.html?year=2019');
			break;
		case "2021":
			switchLoFList('index.html?year=2021');
			break;
		case jsStr["COMMUNITY"][LANG]:
			window.location.assign('upload.html');
			break;
		case jsStr["SAVED"][LANG]:
			if ($("iframe").css("display") == "none") showFaves();
			$(".mobilePicker").append(`<option id='closePick'>${jsStr["CLOSE"][LANG]}</option>`)
			break;
		case jsStr["CLOSE"][LANG]:
			$("#closePick").remove()
			showFaves()
		default:
			break;
	}
	if (window.location.href.includes("2021")) $($(".mobilePicker").children()[1]).attr("selected", true)
	if (window.location.href.includes("editor")) $($(".mobilePicker").children()[2]).attr("selected", true)
}

const openSocLink = link => { window.open(link) }
const openProfileOnGDB = name => { window.open("https://gdbrowser.com/profile/" + name) }

async function getProfileStats(k, ind) {
	let container = k.target

	$(container).hide()
	await $(container).after("<img src='images/loading.png' class='loading'>")
	$(".loading").css("animation-name", "loading")

	let uName = $(k.target.parentElement).siblings()[1].innerText;

	await $.get(DISABLE_GDB + "ttps://gdbrowser.com/api/profile/" + uName, user => {
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
	$("#popupBG").css("opacity", 1)
	setTimeout(() => { $("#popupBG").show() }, 100);

	let level = JSON.parse(JSON.stringify(boards[id]["creator"]))
	let names = [jsStr["YT_CHAN"][LANG], jsStr["TW_PROF"][LANG], jsStr["TW_CHAN"][LANG], jsStr["DC_SERV"][LANG], jsStr["CUST_LINK"][LANG]];
	let imgs = ["youtube", "twitter", "twitch", "discord", "cust"];

	let cardCol = $($(".box")[id - 1]).css("background-color");
	let cardGradient = $($(".box")[id - 1]).css("background-image");
	let dark = HEXtoRGB(RGBtoHEX((cardCol.match(/\d+/g)).map(x => parseInt(x))), 40)
	let extraDark = HEXtoRGB(RGBtoHEX((cardCol.match(/\d+/g)).map(x => parseInt(x))), 80)

	$(".collabTTitle").text(`- ${boards[id].levelName} -`);
	$("#collabTools").css("background-image", cardGradient);
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
		let part = (creators.part).map(x => parseInt(x))
		let uName = creators.name == "" ? "pissman69_thefreedom69connoisseur" : creators.name
		humanRoles.push([part, creators.role, creators.color, uName]);

		// When the creator doesn't have a name (die and turn into a ghost :O)
		let isGhost = false
		if (creators.name == "") {
			isGhost = true
			creators.name = jsStr["GHOST"][LANG]
		}

		if (creators.verified && appendedNames.indexOf(creators.name) == -1) {
			appendedNames.push(creators.name);

			// Social media
			let socialTags = "";
			let discordTag = "";
			for (let soc = 0; soc < creators.socials.length; soc++) {
				if (names[creators.socials[soc][0]] == jsStr["DC_SERV"][LANG] && creators.socials[soc][1].includes("#"))
					discordTag = `<p class="uploadText" style="color:#7ABFC5;margin-right: 1vw;"> - ${creators.socials[soc][1]}</p>`
				else {
					socialTags += `<img onclick="openSocLink('${creators.socials[soc][1]}')" title="${names[creators.socials[soc][0]]}"
									style="width: 3.5vw;" class="button" src="images/${imgs[creators.socials[soc][0]]}.png">`
				}
			}

			let icon = `icon=${creators.verified[0]}&col1=${creators.verified[1]}&col2=${creators.verified[2]}&glow=${creators.verified[3]}&noUser=true`
			$(".statsCreators").append(`<tr class='tableRow'>
			<td style="display: flex; justify-content: left; align-items: center">
				<img style="width: 4vw;margin: 0.4vw;" src="${DISABLE_GDB}ttps://gdbrowser.com/icon/freedom69?${icon}">
				<p class="memberName" style="margin:0 1vw 0; color: ${creators.color}">${creators.name}</p>${discordTag}
				${socialTags}
				<hr class="verticalSplitter">
				<div class="pStatsContainer">
				<img style="width: 3vw;margin: 0.4vw;" src="images/gdbrowser.png" class="getProfile button" title="${jsStr["SHOW_PROFILE"][LANG]}">
				</div>
			</td>
		</tr>`)


			$($(".getProfile")[$(".getProfile").length - 1]).on("click", k => { getProfileStats(k, $(".tableRow").length - 1) })
		}
		else if (!creators.verified && appendedNames.indexOf(creators.name) == -1) {
			appendedNames.push(creators.name);

			// Social media
			let socialTags = "";
			let discordTag = "";
			for (let soc = 0; soc < creators.socials.length; soc++) {
				if (names[creators.socials[soc][0]] == jsStr["DC_SERV"][LANG] && creators.socials[soc][1].includes("#"))
					discordTag = `<p class="uploadText" style="color:#7ABFC5;margin-right: 1vw;"> - ${creators.socials[soc][1]}</p>`
				else {
					socialTags += `<img onclick="openSocLink('${creators.socials[soc][1]}')" title="${names[creators.socials[soc][0]]}"
									style="width: 3.5vw;" class="button" src="images/${imgs[creators.socials[soc][0]]}.png">`
				}
			}
			// Give random icon / or ghost if member doesn't have a name
			let randIcon = ""
			if (!isGhost) {
				randIcon = -1
				while ([-1, 0, 1].indexOf(randIcon) != -1) {
					randIcon = parseInt(Math.random() * 17)
				}
				if (randIcon < 10) { randIcon = "0" + randIcon }
			}
			else { randIcon = "ghostCube"; }

			$(".statsCreators").append(`<tr class='tableRow'>
			<td style="display: flex; justify-content: left; align-items: center">
				<img style="width: 4vw;margin: 0.4vw;" src="images/emoji/${randIcon}.png">
				<p class="memberName" style="color: ${creators.color}; margin: 0 1vw 0;">${creators.name}</p>${discordTag}
				${socialTags}
			</td>
		</tr>`)

			if (isGhost) { // Give ghost funny name :O
				creators.name = "pissman69_thefreedom69connoisseur"
			}
		}
	});

	level[1].forEach(roles => { // Roles
		let graphBars = [];

		let firstElement = 0
		humanRoles = humanRoles.sort((a, b) => a[0][0] - b[0][0])
		humanRoles.forEach(hum => {
			if (hum[1] == roles.id) {
				let mixAmount = 0

				// Spacing elements
				if (firstElement == 0) { // First spacing element
					if (0 - humanRoles[firstElement][0][0] < 0) {
						graphBars.push(`<div class="graphLine space" style="background: none; width: ${Math.abs(0 - humanRoles[firstElement][0][0])}%; height: 100%;"></div>`)
					}
				}
				else {
					if (humanRoles[firstElement + 1] != undefined && humanRoles[firstElement][0][1] - humanRoles[firstElement + 1][0][0] < 0) { // All other elements
						let x = humanRoles[firstElement][0][1] - humanRoles[firstElement + 1][0][0]
						graphBars.push(`<div class="graphLine space" style="background: none; width: ${x - x * 2}%; height: 100%;"></div>`)
					}

				}

				if (humanRoles[firstElement + 1] == undefined && firstElement != 0) { // Last spacing element
					graphBars.push(`<div class="graphLine space" style="background: none; width: ${Math.abs(humanRoles[firstElement][0][1] - 100)}%; height: 100%;"></div>`)
				}

				// Role graph lines
				graphBars.push(`<div for="${hum[3]}" class="graphLine"
				                     style="background: ${hum[2]}; width: ${hum[0][1] - hum[0][0] - mixAmount}%; height: 100%;">
									 <div class="graphPerc" for="${hum[3]}">	
									 	<div class="graphText">|< ${hum[0][0]}%</div><div class="graphText">${hum[0][1]}% >|</div>
									 </div>
								</div>`)
				mixAmount = 0
			}
			firstElement++
		}
		);

		// Adding role graphs 
		$(".collabGraphs").append(`
		<div style="display: flex; flex-direction: column; margin: 1.5vw 1vw;background: #0000001a; padding: 1% 0%; border-radius: 1vw;">
			<div class="graph" style="display: flex; justify-content: space-between; max-width: 91%;">
				<p style="margin: 0 0 0 6vw;">${roles.name}</p>
				<div style="display: flex; align-items: center;" class="nameShower">
					<img class="boxIcon" alt=" " src="images/bytost.png"></img>
					<p style="margin: 0"></p>
				</div>
			</div>

			<div style="display: flex; justify-content: center">
				<span id="graphPercentage">0%</span>
				<div class="graphContainer">
					${graphBars.join("")}
				</div>
				<span id="graphPercentage">100%</span>
			</div>
		</div>
		`)
	});

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

	$("#popupBG").css("opacity", 0)
	setTimeout(() => { $("#popupBG").hide() }, 100);
}

function hoverBar(k) {
	// Utter bullcrap >:(
	if (k.currentTarget.classList.contains("space")) { return null } // Hovering over space element

	let nameShower = $($(k.currentTarget.parentElement.parentElement).siblings().children()[1]).children()
	let hoverName = $(`.memberName:contains(${$(k.currentTarget).attr("for")})`)
	if ($(`.memberName:contains('${jsStr["GHOST"][LANG]}')`) && hoverName[0] == undefined) { hoverName = $(`.memberName:contains('${jsStr["GHOST"][LANG]}')`) }

	isVerified = $(hoverName).siblings(".pStatsContainer")
	if (isVerified.length != 0) { isVerified = true }
	else { isVerified = false }

	$(nameShower.parent()).css("opacity", 1)

	if (isVerified) {
		$(nameShower[0]).attr("src", DISABLE_GDB + "ttps://gdbrowser.com/icon/" + hoverName.text())
	}
	else {
		$(nameShower[0]).attr("src", "images/bytost.png")
	}

	$(nameShower[1]).text(hoverName.text())

	if (k.currentTarget.clientWidth > $(".graphContainer")["0"].clientWidth * 0.15) {
		$(k.currentTarget.children).css("opacity", 1)
	}
	else {
		let from = k.currentTarget.children[0].children[0].textContent.match(/\d+%/)[0]
		let to = k.currentTarget.children[0].children[1].textContent.match(/\d+%/)[0]
		$(nameShower[1]).text(hoverName.text() + ` - ${from} ${jsStr["PART_TO"][LANG]} ${to}`)
	}

	let textColor = hoverName.css("color")

	hoverName.css("text-shadow", `${textColor} 0px 0px 15px`)
	hoverName["0"].scrollIntoView();

	$(`.memberName:not(.memberName:contains(${hoverName})`).css("opacity", `0.3`)
}
function unhoverBar(k) {
	let nameShower = $($(k.currentTarget.parentElement.parentElement).siblings().children()[1]).children()
	$(nameShower.parent()).css("opacity", 0)

	if (k.currentTarget.clientWidth > $(".graphContainer")["0"].clientWidth * 0.13) {
		$(k.currentTarget.children).css("opacity", 0)
	}

	$(`.memberName`).css("text-shadow", "")
	$(`.memberName:not(.memberName:contains(${$(k.currentTarget).attr("for")}))`).css("opacity", `1`)
}

function hoverName(k) {
	$(k.currentTarget).css("text-shadow", `${$(k.currentTarget).css("color")} 0px 0px 15px`)

	let graphColor = $(`.graphLine[for="${$(k.currentTarget).text()}"]`).css("background-color")

	let forWhat = $(k.currentTarget).text()
	if ($(k.currentTarget).text() == jsStr["GHOST"][LANG]) {
		forWhat = "pissman69_thefreedom69connoisseur"
	}

	// Show build part
	for (let i = 0; i < $(`.graphLine[for="${forWhat}"] > .graphPerc`).length; i++) {
		if ($(`.graphLine[for="${forWhat}"] > .graphPerc`)[i].clientWidth > $(".graphContainer")["0"].clientWidth * 0.13) {
			$($(`.graphLine[for="${forWhat}"] > .graphPerc`)[i]).css("opacity", 1)
			$($(`.graphLine[for="${forWhat}"] > .graphPerc`)[i]).css("transform", "scaleY(1)")
		}
	}


	$(`.graphLine[for="${forWhat}"]`).css("box-shadow", `${graphColor} 0px 0px 20px`)
	$(`.graphLine:not(.graphLine[for="${forWhat}"])`).css("opacity", 0.2)
}
function unhoverName(k) {
	$(k.currentTarget).css("text-shadow", "")

	let forWhat = $(k.currentTarget).text()
	if ($(k.currentTarget).text() == jsStr["GHOST"][LANG]) {
		forWhat = "pissman69_thefreedom69connoisseur"
	}

	// Hide build part
	$(`.graphLine[for="${forWhat}"] > .graphPerc`).css("opacity", 0)
	$(`.graphLine[for="${forWhat}"] > .graphPerc`).css("transform", "scaleY(0.8)")

	$(`.graphLine[for="${forWhat}"]`).css("box-shadow", ``)
	$(`.graphLine:not(.graphLine[for="${forWhat}"])`).css("opacity", 1)
}

function boxCreator(obj, index, bgcolor) {
	if (typeof obj != "object") {
		return `<p class="uploadText" id="listLevelSub" style="margin: 0;">${obj}</p>`
	}
	else {
		let names = [];
		let appended = [];
		obj[2].forEach(creator => {
			let icon = "";
			if (creator.verified) {
				icon = `<img class="boxIcon" alt=" " style="background: ${creator.color}">`;
			}
			if (creator.name == "") { var nm = jsStr["GHOST"][LANG] }
			else { var nm = creator.name }

			child = `<div style="color: ${creator.color};" class="collabChild">${icon}${nm}</div>`
			if (appended.indexOf(nm) == -1) { names.push(child); } // Names should only appear once
			appended.push(nm)
		});
		hostVerified = ""
		if (obj[0][1]) { hostVerified = `<img class="boxIcon" alt=" " style="margin: 0 1vw" src="${DISABLE_GDB}ttps://gdbrowser.com/icon/${obj[0][0]}">` }

		// Fix url when ready
		return `
		<div class="uploadText boxCollabHeader" id="listLevelSub">
		${obj[0][2]}: ${hostVerified}${obj[0][0]}</div>
		<div onclick="showCollabStats(${index})" id="listLevelSub" class="collabParent  button noMobileResize">` + names.join("") + "</div>"
	}
}

function clickLogo() {
	let currClickCount = getCookie("clickLogo")
	if (currClickCount === false) currClickCount = 0
	currClickCount = parseInt(currClickCount)

	makeCookie(["clickLogo",currClickCount+1])
	$(".logo").attr("title", jsStr["CLICKS"][LANG]+(currClickCount))
	if (unlockSkinsReq.indexOf(currClickCount) != -1) {
		openHelp("newSkin")
	}
	
}

function generateList(boards, listData) {
	for (let i = 1; i < Object.keys(boards).length - ADDIT_VALS; i++) {

		let bIndex = (i).toString();

		// Setting title image
		$(".titleImage").attr("src", boards["titleImg"]);

		// Removing card buttons
		if (boards[bIndex]["levelID"] == null || boards[bIndex]["levelID"] == "") { var ID = ["", ""]; }
		else {
			var ID = [`<img src="./images/gdbrowser.png" class="button boxLink" onclick="onGDBClick(${boards[bIndex]["levelID"]},${bIndex})" title="${jsStr["GDB_DISP"][LANG]}">`,
			`<img src="./images/copyID.png" class="button boxLink" onclick="onIDCopyClick(${boards[bIndex]["levelID"]},${bIndex})" title="${jsStr["COPY_ID"][LANG]}">`]
		}

		if (boards[bIndex]["video"] == null || boards[bIndex]["video"] == "") { var video = ``; }
		else { var video = `<img src="./images/yticon.png" class="button boxLink" onclick="onYTClick('${boards[bIndex]["video"]}',${bIndex})" title="${jsStr["DISP_EP"][LANG]}">`; }


		// Shit fix. Colors break sometimes
		let boardFix = fixHEX(boards[bIndex]["color"])
		if (!boardFix) boardFix = randomColor()
		let gradientLighter = HEXtoRGB(boardFix, -60)

		// Glow depending on level position
		var cardBG = `background-color: ${boardFix}; background-image: url(images/cardBg.png), linear-gradient(39deg, ${boardFix}, rgb(${gradientLighter.join(",")}));`;
		if (i == 1) { cardBG += ";box-shadow: 5px 5px 40px yellow, -5px -5px 40px green, 5px -5px 40px aqua, -5px 5px 40px red;"; }
		if (i == 2) { cardBG += `;box-shadow: 2px 2px 30px ${boardFix};`; }
		if (i == 3) { cardBG += `;box-shadow: 2px 2px 20px ${boardFix};`; }

		// Setting page BG from list
		if (Object.keys(boards).indexOf("pageBGcolor") != -1) {
			$("body").css("background-color", boards["pageBGcolor"])
		}

		let hasID = ["", null].includes(boards[bIndex]["levelID"])
		let preview = window.location.search.includes("preview")
		let isDebugList = window.location.protocol.includes("file") & window.location.search.includes("id")

		let favoriteCheck = isDebugList ? false : (preview ? false : (hasID ? false : true))
		let currentlyFavedIDs = localStorage.getItem("favoriteIDs") == null ? [] : JSON.parse(localStorage.getItem("favoriteIDs"))
		let disableStar = currentlyFavedIDs.includes(boards[bIndex]["levelID"]) ? "disabled" : ""
		let starTitle = currentlyFavedIDs.includes(boards[bIndex]["levelID"]) ? jsStr["FAV_REM"][LANG] : jsStr["FAV_ADD"][LANG]

		let star = `<img title="${starTitle}" src="images/star.png" class="button favoriteStar ${disableStar}" onclick="fave($(this), ${bIndex}, [${listData[0]},'${listData[1]}'])">`
		$(".boards").append(`
		<div class="box" style="${cardBG}">
			<div style="height:0px;">
				${favoriteCheck ? star : ""}
			</div>
			<div class="boxHeader">
				<span id="listLevelName">${boards[bIndex]["levelName"]}</span>
				<div class="boxLinksContainer">
					${video}
					${ID[0]}
					${ID[1]}
				</div>
			</div>

			${boxCreator(boards[bIndex]["creator"], bIndex, boards[bIndex]["color"])}
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
				try {
					for (let icon = 0; icon < ((k.target).children[3].children).length; icon++) {
						$((k.target).children[3].children[icon].children).css("background", "none")

						let verArr = boards[currIndex + 1]["creator"][2][icon].verified
						let cube = `icon=${verArr[0]}&col1=${verArr[1]}&col2=${verArr[2]}&glow=${verArr[3]}&noUser=true`
						$((k.target).children[3].children[icon].children).attr("src", DISABLE_GDB + "ttps://gdbrowser.com/icon/freedom69?" + cube)
					}
				}
				catch (e) {}

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

	// When clicking a level in saved, scroll to card
	let paramGetter = new URLSearchParams(window.location.search)
	let params = Object.fromEntries(paramGetter.entries());

	if ($(".box")[params.goto - 1] != undefined) $(".box")[params.goto - 1].scrollIntoView()
}

function fave(th, id, data) {
	let creator = boards[id]["creator"]
	if (typeof boards[id]["creator"] == "object") creator = boards[id]["creator"][0][0] + " <b style='color: #ffd27c'>(Collab)</b>" // Is collab?

	let currData = localStorage.getItem("favorites") == null ? [] : JSON.parse(localStorage.getItem("favorites"))
	let currIDs = localStorage.getItem("favoriteIDs") == null ? [] : JSON.parse(localStorage.getItem("favoriteIDs"))

	// Unfaving
	if (currIDs.includes(boards[id]["levelID"])) {
		let listIndex = currIDs.indexOf(boards[id]["levelID"])
		currData.splice(listIndex, 1)
		currIDs.splice(listIndex, 1)

		localStorage.setItem("favorites", JSON.stringify(currData))
		localStorage.setItem("favoriteIDs", JSON.stringify(currIDs))

		th.removeClass("disabled")
	}
	else {
		// levelName, levelCreator, levelID, cardCol, listID, listID, listPos, timeAdded
		let favoriteArray = [boards[id]["levelName"], creator, boards[id]["levelID"], boards[id]["color"], data[0], data[1], id, new Date().getTime() / 1000]
		currData.push(favoriteArray)
		currIDs.push(boards[id]["levelID"])

		localStorage.setItem("favorites", JSON.stringify(currData))
		localStorage.setItem("favoriteIDs", JSON.stringify(currIDs))

		th.addClass("disabled")
	}

	let savePage = $("iframe")[0].contentWindow
	sender = "http://gamingas.wz.cz"
	if (window.location.protocol == "file:") sender = "*" // Allow all if running locally

	savePage.postMessage([JSON.stringify(currData), JSON.stringify(currIDs)], sender)
}

async function showFaves() {
	if ($("iframe").css("display") != "none") {$(".boards").show(); $(".listOptions").show(); $(".titles").show(); $(".titleImage").show(); $("iframe").hide(); return null}

	$(".boards").hide();
	$(".comments").hide();
	$(".listOptions").hide();
	$(".titles").hide();
	$(".titleImage").hide();

	// Reloads iframe and loads new faved levels
	await $("iframe").attr("src", "packs.html?type=favorites");
	setTimeout(() => $("iframe").fadeIn(50), 100)

}

function switchLoFList(page, goto = null) {
	if (window.location.href.includes(page)) {
		// Returning from favorites page doesn't need reloading
		$(".boards").fadeIn(50);
		$(".listOptions").fadeIn(50);
		$(".comments").fadeOut(50);
		$(".titles").fadeIn(50);

		$("iframe").fadeOut(50)

		// HOW DOES THIS WORK??!! You shouldn't have to subtract 4
		if (goto != null) $(".box")[goto - 4].scrollIntoView();

	}
	else window.location.assign(goto == null ? page : page + `&goto=${goto}`)
}

function debugCards() {
	// Returns a randomly generated board
	let str = '{"titleImg": "",';
	for (let i = 1; i < Math.ceil(Math.random() * 20) + 1; i++) {
		str += `"${i}": {"levelName": "Debug #${i}","creator": "${fakeNames[Math.floor(Math.random() * fakeNames.length)]}","levelID": 128, "video": "9ywnLQywz74","color":"${randomColor()}"},`
	}
	str = str.slice(0, -2) + "}}"
	return JSON.parse(str)
}

var listData = "";
var debugPwd = 0;
const repeatBG = [false,true,false]
const unlockSkinsReq = [0,10,100,250,500,1000,2000,3000,5000,7500,10000];
$(function () {
	window.addEventListener("message", mess => {
		let intent = mess.data[0];
		if (intent == "loading") {
			switchLoFList(mess.data[1], mess.data[2]);
		}
		else if (intent == "removing") {
			localStorage.setItem("favorites", JSON.stringify(mess.data[1][0]))
			localStorage.setItem("favoriteIDs", JSON.stringify(mess.data[1][1]))

			// What a wonderful method
			if ($("title").text().includes(mess.data[1][3])) $($(".favoriteStar")[mess.data[1][2]]).removeClass("disabled")
		}
	})

	$(".passInput").val("");
	$(".commBut").attr("src", jsStr["COMM_IMG"][LANG]);
	if (location.search != "") {
		let paramGetter = new URLSearchParams(window.location.search)
		let params = Object.fromEntries(paramGetter.entries());
		let listQueries = Object.keys(params)
		var listID = listQueries.includes("id") ? params["id"] : params["pid"]

		// Password input removal
		if (!listQueries.some(e => (/id|pid/g).test(e))) {
			$(".password").remove()
		}

		if (listQueries.includes("preview") & params["preview"] == "1") {
			let decodeData = atob(sessionStorage.getItem("previewJson")).split(",");
			let decodedData = "";
			for (i = 0; i < decodeData.length; i++) {
				decodedData += String.fromCharCode(decodeData[i]);
			}
			boards = JSON.parse(decodedData);
			$(".titles").append(jsStr["PREVIEW"][LANG]);
			$(".searchTools").remove();
			$(".titleImage").attr("src", boards["titleImg"]);
			$("title").html(`${jsStr["PREVIEW_L"][LANG]} | ${jsStr["GDLISTS"][LANG]}`)
			generateList(boards, [0, 0]);
		}
		else if (listQueries.includes("id")) {
			if (window.location.protocol.includes("file")) {
				boards = debugCards();
				debugPwd = Math.ceil(Math.random() * 9999999999)
				$(".titles").append(`<p style="color: tomato; margin-bottom: 0;">Debug List</p>
				<hr class="lineSplitGeneral">
				<p style="font-size: 3vw; margin-top: 0;">- Dasher123 -</p>
				<p style="font-size: 3vw;">Pass: ${debugPwd}</p>`);
				$(".titleImage").attr("src", boards["titleImg"]);
				$("title").html(`${jsStr["DEBUG_L"][LANG]} | ${jsStr["GDLISTS"][LANG]}`)
				generateList(boards, [0, "Debug List"])
			}

			$.get("./php/getLists.php?id=" + listID, function (data) {
				if (data == 1) {
					$(".titles").append(jsStr["L_NOEXIST"][LANG]);
					$("title").html(`${jsStr["NONEXISTENT_L"][LANG]} | ${jsStr["GDLISTS"][LANG]}`)
					$(".searchTools").remove();
					$("#crown").remove();
				}
				else if (data == 2) {
					$(".titles").append(jsStr["L_INVID"][LANG]);
					$("title").html(`${jsStr["NONEXISTENT_L"][LANG]} | ${jsStr["GDLISTS"][LANG]}`)
					$(".searchTools").remove();
					$("#crown").remove();
				}
				else {
					if (data[5] == 2) {
						$(".titles").append("<p>Event seznam si jde prohlédnout jen ze stránky 2021 seznamu ;).</p>");
						$(".searchTools").remove();
						$("#crown").remove();
					}
					else {
						boards = data["data"];
						$(".titles").append(`<p style="margin-bottom: 0;">${data["name"]}</p>
						<hr class="lineSplitGeneral">
						<p style="font-size: 3vw;margin-top: 0;">- ${data["creator"]} -</p>`);
						$(".titleImage").attr("src", boards["titleImg"]);
						$("title").html(`${data["name"]} | ${jsStr["GDLISTS"][LANG]}`)
						generateList(boards, [encodeURIComponent(data["id"]), data["name"]]);
					}
				}
			}
			)
		}
		else if (listQueries.includes("pid")) {
			$.get("./php/getLists.php?pid=" + listID, function (data) {
				if (data == 1) {
					$(".titles").append(jsStr["L_NOEXIST"][LANG]);
					$(".searchTools").remove();
					$("title").html(`${jsStr["NONEXISTENT_L"][LANG]} | ${jsStr["GDLISTS"][LANG]}`)
					$("#crown").remove();
				}
				else {
					boards = data["data"];
					$(".titles").append(`<p style="margin-bottom: 0;">${data["name"]}</p>
					<hr class="lineSplitGeneral">
					<p style="font-size: 3vw;margin-top: 0;">- ${data["creator"]} -</p>`);
					$(".titleImage").attr("src", boards["titleImg"]);
					$("title").html(`${data["name"]} | ${jsStr["GDLISTS"][LANG]}`)
					generateList(boards, [encodeURIComponent(data["id"]), data["name"]]);
				}
			}
			)
		}

		else if (location.pathname.match(/(upload)/g) == null) {
			if (YEAR == undefined) {
				$(".titles").append(jsStr["L_NONUM"][LANG]);
				$(".searchTools").remove();
				$("title").html(`${jsStr["NONEXISTENT_L"][LANG]} | ${jsStr["GDLISTS"][LANG]}`)
				$("#crown").remove();
			}
			else if (YEAR != "2019" & YEAR != "2021") {
				$(".titles").append(jsStr["L_NOYEAR"][LANG]);
				$(".searchTools").remove();
				$("title").html(`${jsStr["NONEXISTENT_L"][LANG]} | ${jsStr["GDLISTS"][LANG]}`)
				$("#crown").remove();
			}
			else {
				let listName = `Top ${YEAR == 2019 ? 10 : 15} LoF ${YEAR}`

				$(".password").remove()
				$("title").html(`${listName} | ${jsStr["GDLISTS"][LANG]}`)

				generateList(boards, [LIST_ID, listName]);
			}
		}
	}
	else if (YEAR == "2019" & location.pathname.match(/(upload)/g) == null) {
		$(".password").remove()
		$("title").html(`Top 10 LoF 2019 | ${jsStr["GDLISTS"][LANG]}`)
		generateList(boards, [LIST_ID, "Top 10 LoF 2019"]);
	}

	// Hiding header and showing scroll to top button
	$("body").on("scroll", () => {
		if (document.body.scrollTop > 150) {
			$("header").css("transform", "translateY(-8vh)")
			$(".scrollToTop").css("opacity", 1)
			$(".settingsMenu").fadeOut(50)
		}
		else {
			$("header").css("transform", "none")
			$(".scrollToTop").css("opacity", 0)
		}
	})

	if ($(".titles").text() == "") { $(".titles").css("margin-top", "5vw") }
	$(".searchTools").css("opacity", 1)
	$("footer").css("opacity", 1)

	if (localStorage.getItem("anims") == null) localStorage.setItem("anims", 1)
	$("input[name='anim']").attr("checked", localStorage.getItem("anims") == true ? true : false)
	$("img[for='anim']").attr("src", localStorage.getItem("anims") == true ? "images/check-on.png" : "images/check-off.png")
	let animsEnabled = localStorage.getItem("anims") == true

	if (animsEnabled) {
		$("header").css("animation-name", "headerScroll")
	}
	else {
		$("body").css("scroll-behavior", "unset")
		$("#crown").css("opacity", 1);
	}

	// Box appear animation
	if (!window.location.pathname.includes("upload") && animsEnabled) {
		$(".box").css("transform", "translateX(-100vw)");
		$(".box").css("transition", "transform 0.3s cubic-bezier(0.075, 0.82, 0.165, 1)");

		$("#crown").css("transition", "transform 1s ease-out, opacity 1.2s ease-out");
		$("#crown").css("opacity", 1);


		let index = 0
		let boxAppear = setInterval(() => {
			if (index == Object.keys(boards).length - ADDIT_VALS - 2) { clearInterval(boxAppear) }
			$(".box")[index].style.transform = "none"
			index++
		}, 100);
	}

	$("#crown").css("transform", "translateY(5.7vw)")

	// Setting mobile picker in navbar to curr site name
	let sites = ["2019","2021",jsStr["COMMUNITY"][LANG]] // No need for saved
	if (window.location.href.includes("2021")) $($(".mobilePicker").children()[1]).attr("selected", true)
	if (window.location.href.includes("editor")) $($(".mobilePicker").children()[2]).attr("selected", true)

	// Adding skins
	// let clicks = getCookie("clickLogo")
	// let selBG = getCookie("selectedBG")
	
	// if (selBG === false) {clicks = 0; makeCookie(["selectedBG",0])}
	// if (clicks === false) clicks = 0
	// for (let s = 0; s < unlockSkinsReq.filter(x => clicks >= x).length; s++) {	
	// 	$(".skins").append(`<option class="skinOption">${jsStr["SKIN"+(s+1)][LANG]}</option>`)
	// }
	// $($(".skinOption")[selBG]).attr("selected",true)
	// $(".searchTools").css("background-image","url(images/skins/"+selBG+".png)")
	// $("body").css("background-image","url(images/skins/"+selBG+".png)")
	// $(".searchTools").css("background-repeat", repeatBG[selBG] ? "repeat-x" : "repeat")

	// $(".skins").on("change", k => {
    //     makeCookie(["selectedBG", k.target.selectedIndex])
	// 	$("body").css("background-image","url(images/skins/"+k.target.selectedIndex+".png)")
    //     $(".searchTools").css("background-image","url(images/skins/"+k.target.selectedIndex+".png)")
    //     $(".searchTools").css("background-repeat", repeatBG[k.target.selectedIndex] ? "repeat-x" : "repeat")
		
    // })
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
		if (["1", "2"].includes(data)) {
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

	if (window.location.protocol.includes("file")) {
		if (passEntered == debugPwd) {
			window.location.href = `./upload.html?edit=${listID[1]}&pass=${passEntered}`
		}
	}
}

const switchAnims = (_curr) => localStorage.setItem("anims", localStorage.getItem("anims") == true ? 0 : 1)

function checkCheckbox(changeVal, runFun = null) {
	if ($(`img[for="${changeVal}"]`).attr("src").match("off") == null) {
		$(`img[for="${changeVal}"]`).attr("src", "images/check-off.png")
		$(`input[name="${changeVal}"]`).attr("checked", false)
		runFun(false)
	}
	else {
		$(`img[for="${changeVal}"]`).attr("src", "images/check-on.png")
		$(`input[name="${changeVal}"]`).attr("checked", true)
		runFun(true)
	}
}
