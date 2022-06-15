const ADDIT_VALS = 1;
const DISABLE_GDB = "h" // Change to anything else than "h" to break requests
const isInEditor = window.location.pathname.includes("upload");

// These are not real people :<'
const fakeNames = ["Voiprin", "Sarprong", "ZentricSigma", "Darwing", "ExpoD", "J0hnram", "Jayuff", "AligaThePeter", "Divpan", "Acidity", "Doorami", "DanZBro", "FunnyBone"]

function onGDBClick(pos) { window.open("https://gdbrowser.com/" + pos, "_blank"); }

function onIDCopyClick(pos, index) {
	$("#cpopup" + index).text("ID: " + pos);
	$("#cpopup" + index).fadeTo(100, 1);
}

function onYTClick(link) { window.open("https://www.youtube.com/watch?v=" + link, "_blank") };

function listShare() {
	$("#popupBG").show()
	$("#popupBG").css("opacity", 1)

	$("#shareTools").fadeIn(100);

	let link = "";
	let array = window.location.href.match(/(id|pid)/);
	switch (array != null ? array[0] : null) {
		case null:
			link = "y=2019";
			break;
		case "pid":
			let paramGetter = new URLSearchParams(window.location.search)
			let params = Object.fromEntries(paramGetter.entries());

			link = "p=" + params["pid"];
			break;
		case "id":
			link = "l=" + LIST_ID;
			break;
		default:
			break;
	}

	$("#shareContainer").on("mouseover", () => $("#shareContainer")[0].select())

	let cringeText = encodeURIComponent(`${jsStr['CHECKOUT']} - gamingas.wz.cz/?${link}`)

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
			switchLoFList('index.html?id=-2');
			break;
		case "2021":
			switchLoFList('index.html?id=-3');
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

var LIST_NAME = null
var LIST_CREATOR = null
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
			if (boards["pageBGcolor"] != "#020202") {
				let hue = getHueFromHEX(boards["pageBGcolor"])
				$(":root").css("--greenGradient", `linear-gradient(9deg, hsl(${hue},23.1%,10.2%), hsl(${hue},90.6%,16.7%))`)
				$("[name='theme-color']").attr("content", HSLtoHEX(hue, "91%", "13%"))
			}
		}

		// Setting difficulty face
		let diff = ""
		if (boards[bIndex]["difficulty"] != undefined) {
			let data = boards[bIndex]["difficulty"]
			let glow = "";
			if (data[1] != 0) {
				glow = `<img class="${data[1] == 1 ? "listDiffRate" : "listDiffEpicRate"}" src='images/faces/${data[1] == 1 ? "featured" : "epic"}.png'>`
			}

			diff = `<div class="listDiffContainer"><img class="listDiffFace" src="images/faces/${data[0]}.png">${glow}</div>`
		}


		let hasID = ["", null].includes(boards[bIndex]["levelID"])
		let preview = window.location.search.includes("preview")
		let isDebugList = window.location.protocol.includes("file") & window.location.search.includes("id")

		let favoriteCheck = isDebugList ? false : (preview ? false : (hasID ? false : true))
		let currentlyFavedIDs = localStorage.getItem("favoriteIDs") == null ? [] : JSON.parse(localStorage.getItem("favoriteIDs"))
		let disableStar = currentlyFavedIDs.includes(boards[bIndex]["levelID"]) ? "disabled" : ""
		let starTitle = currentlyFavedIDs.includes(boards[bIndex]["levelID"]) ? jsStr["FAV_REM"][LANG] : jsStr["FAV_ADD"][LANG]

		let star = `<img title="${starTitle}" src="images/star.png" class="button favoriteStar ${disableStar}" onclick="fave($(this), ${bIndex}, ['${listData[0]}','${listData[1]}'])">`
		$(".boards").append(`
		<div class="box" style="${cardBG}">
			<div style="height:0px;">
				${favoriteCheck ? star : ""}
			</div>
			<div class="boxHeader">
				<span id="listLevelName">${diff}<p style="margin: 0; margin-left: 2vw;">${boards[bIndex]["levelName"]}</p></span>
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
				catch (e) { }

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

	// Saving viewed list
	let viewed = getCookie("recentlyViewed");
	if (!viewed) { viewed = "[]" }

	let parsed = JSON.parse(decodeURIComponent(viewed));
	// id, listName, listCreator, level1color, time

	let isInRecents = false
	parsed.forEach(val => {
		if (val[0] == LIST_ID) isInRecents = true
	})
	if (!isInRecents && LIST_NAME != null) {
		parsed.push([LIST_ID, LIST_NAME, LIST_CREATOR, boards[1].color, (new Date).getTime()])
		parsed = parsed.reverse().slice(0, 3)

		makeCookie(["recentlyViewed", JSON.stringify(parsed)])
	}

	if ($(".box")[params.goto - 1] != undefined) $(".box")[params.goto - 1].scrollIntoView()
}

function pinList(rem = null, isOnHomepage = false) {
	let getPinned = getCookie("pinnedLists")
	let pinnedLists = [null, false].includes(getPinned) ? [] : JSON.parse(decodeURIComponent(getPinned))

	rem = rem == null ? LIST_ID : rem

	let indToRemove = [0, false]
	pinnedLists.forEach(arr => {
		if (arr[0] == rem) indToRemove[1] = true
		if (!indToRemove[1]) indToRemove[0]++
	});
	if (indToRemove[1]) {
		$("#pinBut").attr("src", "images/pinList.png")
		$("#pinBut").attr("title", jsStr["PIN_LIST"][LANG])
		pinnedLists.splice(pinnedLists.indexOf(indToRemove[0]), 1)
	}
	else {
		$("#pinBut").attr("src", "images/unpinList.png")
		$("#pinBut").attr("title", jsStr["UNPIN_LIST"][LANG])
		pinnedLists.push([LIST_ID, LIST_NAME, LIST_CREATOR, boards[1].color, (new Date).getTime()])
		pinnedLists = pinnedLists.slice(1, 6)
	}

	makeCookie(["pinnedLists", JSON.stringify(pinnedLists)])

	if (isOnHomepage !== false) {
		isOnHomepage.parent().remove()
		if ($(".pinnedLists > div").length == 0) {
			$(".pinnedLists").html(`<div class="uploadText" style="color: #f9e582; margin-left: 5vw;">${jsStr["NOPINNED"][LANG]}</div>`)
		}
	}
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
		// levelName, levelCreator, levelID, cardCol, listID, levelName, listPos, timeAdded
		let favoriteArray = [boards[id]["levelName"], creator, boards[id]["levelID"], boards[id]["color"], data[0], data[1], id, new Date().getTime() / 1000]
		currData.push(favoriteArray)
		currIDs.push(boards[id]["levelID"])

		localStorage.setItem("favorites", JSON.stringify(currData))
		localStorage.setItem("favoriteIDs", JSON.stringify(currIDs))

		th.addClass("disabled")
	}

	let savePage = $("iframe")[0].contentWindow
	sender = "http://gamingas.wz.cz"
	if (window.location.port != "") sender = "*" // Allow all if running locally

	savePage.postMessage([JSON.stringify(currData), JSON.stringify(currIDs)], sender)
}

let currListIDs = []
function removeFave(remID) {
	if (typeof boards != "undefined" && currListIDs.length == 0) Object.values(boards).forEach(x => currListIDs.push(x.levelID))

	let savePage = $("iframe")[0].contentWindow
	sender = "http://gamingas.wz.cz"
	if (window.location.port != "") sender = "*" // Allow all if running locally

	let i = 0
	currentListData["#favoritesContainer"].forEach(x => {
		if (parseInt(x[2]) == remID) {
			currentListData["#favoritesContainer"].splice(i, 1)
		}
		i++
	});

	savePage.postMessage(["remove", remID], sender)
	if (currListIDs.includes(remID.toString())) {
		$(`div.box:nth-child(${2 + currListIDs.indexOf(remID.toString())}) > div:nth-child(1) > img:nth-child(1)`).removeClass("disabled")
	}
}

let viewingFaves = false
async function showFaves() {
	$("iframe").attr("src", "packs.html?type=favorites")
}

function switchLoFList(site, goto = null) {
	if (window.location.href.includes(site)) {
		// Going back from faves in upload.html
		if (window.location.pathname.includes("upload")) {
			if ($("#favoritesContainer").css("display") != "none") showFaves()
			return
		}

		// Returning from favorites page doesn't need reloading
		$(".boards").fadeIn(50);
		$(".listOptions").fadeIn(50);
		$(".comments").fadeOut(50);
		$(".titles").fadeIn(50);

		showFaves()

		// HOW DOES THIS WORK??!! You shouldn't have to subtract 4
		if (goto != null) $(".box")[goto - 4].scrollIntoView();

	}
	else window.location.assign(goto == null ? site : site + `&goto=${goto}`)
}

function debugCards() {
	// Returns a randomly generated board
	let str = { "titleImg": "https://i.cdn.turner.com/v5cache/CARTOON/site/Images/i88/johnnytest_180x180.png", "pageBGcolor": "#53a3aa" };
	for (let i = 1; i < Math.ceil(Math.random() * 20) + 1; i++) {
		str[i] = { "levelName": "Debug #" + i, "creator": fakeNames[Math.floor(Math.random() * fakeNames.length)], "levelID": 128, "video": "9ywnLQywz74", "color": randomColor() }
	}
	return str
}

// const MAX_ON_PAGE = 4;
function homeCards(obj, custElement = ".listContainer", previewType = 1, overwriteMax = false, custPagination = 0) {
	// Do nothing if empty
	if (obj == null || obj == false) return

	$(custElement).text("");

	let MAX_ON_PAGE = overwriteMax ? overwriteMax : 4

	obj.slice(MAX_ON_PAGE * custPagination, MAX_ON_PAGE * custPagination + MAX_ON_PAGE)
		.forEach((object) => {
			if ([1, 3].includes(previewType)) { // Favorite level
				let darkCol = HEXtoRGB(object[3], 40);
				let priv = object[4].match(/[A-z]/) != null ? "pid" : "id"
				$(custElement).append(`
				<div class="noMobileResize" id="listPreview" href="#" style="background: rgb(${HEXtoRGB(
					object[3]
				)}); display:flex; border-color: rgb(${darkCol.join(",")});">
					<div style="width: 100%">
						<p class="uploadText" style="margin: 0;">${object[0]} - ${object[1]
					}</p>
						<p class="uploadText" style="font-size: var(--miniFont); margin: 0;">
						<a href="./index.html?${priv}=${object[4]}&goto=${object[6]}">
							<u>${object[5]}</u>
						</a> - ${jsStr["L_LEVID"][LANG]}: ${object[2]}</p>
					</div>
					<div style="${previewType == 3 ? 'display: none;' : ''}">
						<img class="button" onclick="removeFave(${object[2]});"
						     style="width: 4vw" src="images/delete.png">
					</div>
				</div>
				`);
			}
			else if ([2, 5].includes(previewType)) { // Recently viewed list / Pinned list
				let lightCol = HEXtoRGB(object[3], -60)
				let darkCol = HEXtoRGB(object[3], 40)
				let priv = object[0].toString().match(/[A-z]/) != null ? "pid" : "id"
				$(custElement).append(`
				<div style="display: flex; align-items: center">
					<a style="display: flex; align-items: center; flex-grow: 1;" href="./index.html?${priv}=${object[0]}">
						<div id="listPreview" class="noMobileResize")"
							style="background-image: linear-gradient(39deg, rgb(${darkCol.join(",")}), ${object[3]}, rgb(${lightCol.join(",")}));
									border-color: rgb(${darkCol.join(",")}); margin: 0.85% ${previewType == 5 ? 1 : 7}% 0.85% 7%; flex-grow: 1;">
							<div class="boxHeader" style="flex-direction: row !important;">
								<div>
								<p class="uploadText" style="margin: 0;">${object[1]}</p>
								<p class="uploadText" style="font-size: var(--miniFont); margin: 0;">- ${object[2]} -</p>
								</div>
								<div>
								<p class="uploadText" style="margin: 0; font-size: var(--miniFont);">${window.parent.window.chatDate(object[4] / 1000)}</p>
								</div>
							</div>
						</div>
					</a>
					${previewType == 5 ? `<img src="images/unpinList.png" onclick="pinList('${object[0]}',$(this))" class="button" style="width: 4vw; height: fit-content; margin-right: 1.9vw;">` : ''}
				</div>
				`);
			}
			else if (previewType == 4) { // Newest lists
				let level1col = object["data"][1].color
				let lightCol = HEXtoRGB(level1col, -60)
				let darkCol = HEXtoRGB(level1col, 40)
				$(custElement).append(`
				<a id="listPreview" class="noMobileResize" href="./index.html?id=${object["id"]}"
					 style="background-image: linear-gradient(39deg, rgb(${darkCol.join(",")}), ${level1col}, rgb(${lightCol.join(",")})); border-color: rgb(${darkCol.join(",")})">
					<div style="width: 100%">
						<p class="uploadText" style="margin: 0;">${object["name"]}</p>
						<p class="uploadText" style="font-size: var(--miniFont); margin: 0;">- ${object["creator"]} -</p>
					</div>
				</div>
				`);
			}

		});
}

function makeHP() {
	let homepageData = JSON.parse($("iframe")[0].contentDocument.querySelector(".fetcher").innerText)
	homeCards(homepageData.recViewed, ".recentlyViewed", 2)
	homeCards(homepageData.pinned.reverse(), ".pinnedLists", 5, 5)
	homeCards(homepageData.favPicks, ".savedLists", 3)
	homeCards(homepageData.newest, ".newestLists", 4)
}

function clearViewed() {
	if ($(".recentlyViewed").length == 0) return
	$(".recentlyViewed").empty()
	makeCookie(["recentlyViewed", "[]"])
	$(".recentlyViewed").html(`<div class="uploadText" style="color: #f9e582; margin-left: 5vw;">${jsStr["NOVIEWED"][LANG]}</div>`)
}

function drawFaves(favesData) {
	// Generate list
	listViewerDrawer(favesData, "#favoritesContainer", 1)
}

var listData = "";
var debugPwd = 0;
const repeatBG = [false, true, false]
const unlockSkinsReq = [0, 10, 100, 250, 500, 1000, 2000, 3000, 5000, 7500, 10000];
var boards
$(async function () {
	// Default 2019 board
	if (!isInEditor) {
		if (LIST_ID == -2 || window.location.pathname.match("upload") == -1) {
			await $.get("./assets/2019.json", json => boards = json)
		}
		else if (LIST_ID == -3 || window.location.pathname.match("upload") != -1) {
			await $.get("./assets/2021.json", json => boards = json)
		}
	}

	$('img').on('dragstart', function (event) { event.preventDefault(); });

	window.addEventListener("message", async state => {
		if (state.data == "homepage" && !isInEditor) makeHP()
		else if (state.data == "favorites") {
			if (viewingFaves) {
				$(".mobilePicker > div").eq(2).css("filter", "none")
				$(".mobilePicker > div > h6").eq(2).text(jsStr["SAVED"][LANG])
				$(".mobilePicker > div > img").eq(2).attr("src", "images/savedMobHeader.svg")

				$($(".menuPicker > button > img")[2]).attr("src", "images/savedMobHeader.svg")
				$($(".menuPicker > button > h4")[2]).text(jsStr["SAVED"][LANG])
				$("button.yearButtonImg:nth-child(3) > *").css("filter", "none")

				$("body > *:not(nav,footer)").hide();

				if (!isInEditor) {
					if (LIST_ID == -9) $("#homepageContainer").show()

					$(".listMaster").show()
				}
				else {
					if (window.location.search.includes("editor")) $(".uploader").show()
					else $(".browser").show()
				}
				viewingFaves = false
			}
			else {
				$(".mobilePicker > div").eq(2).css("filter", "var(--redHighlight)")
				$(".mobilePicker > div > h6").eq(2).text(jsStr["CLOSE"][LANG])
				$(".mobilePicker > div > img").eq(2).attr("src", "images/close.svg")

				$($(".menuPicker > button > img")[2]).attr("src", "images/close.svg")
				$($(".menuPicker > button > h4")[2]).text(jsStr["CLOSE"][LANG])
				$("button.yearButtonImg:nth-child(3) > *").css("filter", "var(--redHighlight)")

				$("body > *:not(nav,footer)").hide();
				$("#favoritesContainer").show();
				let favesData = JSON.parse($("iframe")[0].contentDocument.querySelector(".fetcher").innerText)

				if ($("#favoritesContainer > p").length == 0) {
					await $.get("./parts/listViewer.html", data => {
						$("#favoritesContainer").append(translateDoc(data, "listViewer"))
						$("#favoritesContainer > p").text(jsStr["FAV_LEVELS"][LANG])
					})
				}
				drawFaves(favesData)

				viewingFaves = true
			}
		}
		else if (state.data == "refreshList") {
			let favesData = JSON.parse($("iframe")[0].contentDocument.querySelector(".fetcher").innerText)
			drawFaves(favesData)
		}
		else if (state.data[0] == "removed") {
			originalListData["#favoritesContainer"] = state.data[1]

			drawFaves(currentListData["#favoritesContainer"])
		}
	})

	$.get("./parts/navbar.html", navbar => {
		$("nav").html(translateDoc(navbar, "navbar"))

		// Setting mobile picker in navbar to curr site name
		if (window.location.href.includes("browse")) $(".mobilePicker > div")[1].style.filter = "var(--lightHighlight)"
		if (window.location.href.includes("editor")) $(".mobilePicker > div")[0].style.filter = "var(--lightHighlight)"

		$($(".settingsDropdown > option")[LANG]).attr("selected", true)

		$(".settingsDropdown").on("change", () => {
			let switchLang = $(".settingsDropdown").val() == jsStr["CZECH"][LANG] ? 0 : 1
			makeCookie(["lang", switchLang])
			window.location.reload();
		})

	})

	if (localStorage.getItem("anims") == null) localStorage.setItem("anims", 1)
	$("input[name='anim']").attr("checked", localStorage.getItem("anims") == true ? true : false)
	$("img[for='anim']").attr("src", localStorage.getItem("anims") == true ? "images/check-on.png" : "images/check-off.png")
	let animsEnabled = localStorage.getItem("anims") == true

	if (!animsEnabled) $("body").css("scroll-behavior", "unset")

	if (isInEditor) return

	$(".passInput").val("");
	$(".commBut").attr("src", jsStr["COMM_IMG"][LANG]);

	// GENERATING HOMEPAGE!
	if (LIST_ID == -9) {
		$(".searchTools").remove();
		$("#crown").remove();

		$.get("./parts/homepage.html", site => {
			$("#homepageContainer").html(translateDoc(site, "homepage"))
		})

		$("iframe").attr("src", "packs.html?type=homepage")
	}
	else {
		let paramGetter = new URLSearchParams(window.location.search)
		let params = Object.fromEntries(paramGetter.entries());
		let listQueries = Object.keys(params)
		var listID = listQueries.includes("id") ? params["id"] : params["pid"]

		$("#crown").show();
		$("#crown").css("opacity", 1);
		$(".searchTools").css("opacity", 1);

		// Password input removal
		if (!listQueries.some(e => (/id|pid/g).test(e)) && LIST_ID != -11) {
			$(".password").remove()
		}

		if (listQueries.includes("preview") & params["preview"] == "1") {
			$(".searchTools").remove();
			let previewData = sessionStorage.getItem("previewJson")
			if (previewData == null) {
				$("#crown").remove()
				$(".titles").append(jsStr["NO_PREV_DATA"][LANG]);
				return
			}

			let decodeData = atob(previewData).split(",");
			let decodedData = "";
			for (i = 0; i < decodeData.length; i++) {
				decodedData += String.fromCharCode(decodeData[i]);
			}
			boards = JSON.parse(decodedData);
			$(".titles").append(jsStr["PREVIEW"][LANG]);

			$(".titleImage").attr("src", boards["titleImg"]);
			$("title").html(`${jsStr["PREVIEW_L"][LANG]} | ${jsStr["GDLISTS"][LANG]}`)
			LIST_NAME = null
			LIST_CREATOR = "person"
			generateList(boards, [LIST_ID, LIST_NAME]);
		}
		else if (listQueries.includes("random")) {
			$.get("php/getLists.php?random=1", data => {
				data = data[0]
				boards = data["data"];
				$(".titles").append(`<p style="margin: 0;">${data["name"]}</p>
				<hr class="lineSplitGeneral">
				<p style="font-size: 3vw;margin: 0;">- ${data["creator"]} -</p>`);
				$(".titleImage").attr("src", boards["titleImg"]);
				$("title").html(`${data["name"]} | ${jsStr["GDLISTS"][LANG]}`)

				LIST_ID = parseInt(data["id"])

				LIST_NAME = data["name"]
				LIST_CREATOR = data["creator"]

				generateList(boards, [encodeURIComponent(data["id"]), data["name"]]);

				refreshComments()
			})
		}
		else if (listQueries.includes("id")) {
			if (["-2", "-3"].includes(LIST_ID)) {
				let listName = `Top ${LIST_ID == -2 ? 10 : 15} LoF ${LIST_ID == -2 ? 2019 : 2021}`

				$(".password").remove()
				$("title").html(`${listName} | ${jsStr["GDLISTS"][LANG]}`)

				LIST_NAME = listName
				LIST_CREATOR = "GamingasCZ"

				generateList(boards, [LIST_ID, listName]);
			}

			else if (window.location.protocol.includes("file") || window.location.port != "") {
				boards = debugCards();
				debugPwd = Math.ceil(Math.random() * 9999999999)
				$(".titles").append(`<p style="color: tomato; margin: 0;">Debug List</p>
				<hr class="lineSplitGeneral">
				<p style="font-size: 3vw; margin: 0;">- Dasher123 -</p>
				<p style="font-size: 3vw;">Pass: ${debugPwd}</p>`);
				$(".titleImage").attr("src", boards["titleImg"]);
				$("title").html(`${jsStr["DEBUG_L"][LANG]} | ${jsStr["GDLISTS"][LANG]}`)
				generateList(boards, [0, "Debug List"])
			}

			else {
				$.get("./php/getLists.php?id=" + listID, function (data) {
					if ([1, 2].includes(data)) {
						$(".titles").append(jsStr["L_NOEXIST"][LANG]);
						$("title").html(`${jsStr["NONEXISTENT_L"][LANG]} | ${jsStr["GDLISTS"][LANG]}`)
						$(".searchTools").remove();
						$("#crown").remove();
					}
					else {
						boards = data["data"];
						$(".titles").append(`<p style="margin: 0;">${data["name"]}</p>
					<hr class="lineSplitGeneral">
					<p style="font-size: 3vw;margin: 0;">- ${data["creator"]} -</p>`);
						$(".titleImage").attr("src", boards["titleImg"]);
						$("title").html(`${data["name"]} | ${jsStr["GDLISTS"][LANG]}`)

						LIST_NAME = data["name"]
						LIST_CREATOR = data["creator"]

						generateList(boards, [encodeURIComponent(data["id"]), data["name"]]);
					}
				}
				)
			}

		}
		else if (listQueries.includes("pid")) {
			await $.get("./php/getLists.php?pid=" + listID, function (data) {
				if (data == 1) {
					$(".titles").append(jsStr["L_NOEXIST"][LANG]);
					$(".searchTools").remove();
					$("title").html(`${jsStr["NONEXISTENT_L"][LANG]} | ${jsStr["GDLISTS"][LANG]}`)
					$("#crown").remove();
				}
				else {
					boards = data["data"];
					$(".titles").append(`<p style="margin: 0;">${data["name"]}</p>
					<hr class="lineSplitGeneral">
					<p style="font-size: 3vw;margin: 0;">- ${data["creator"]} -</p>`);
					$(".titleImage").attr("src", boards["titleImg"]);
					$("title").html(`${data["name"]} | ${jsStr["GDLISTS"][LANG]}`)

					LIST_ID = data["hidden"]
					LIST_NAME = data["name"]
					LIST_CREATOR = data["creator"]

					generateList(boards, [encodeURIComponent(data["hidden"]), data["name"]]);
				}
			}
			)
		}
	}

	let getPinned = getCookie("pinnedLists")
	if (getPinned !== null & getPinned !== false) {
		JSON.parse(decodeURIComponent(getPinned)).forEach(arr => {
			if (arr[0] == LIST_ID) {
				$("#pinBut").attr("src", "images/unpinList.png")
				$("#pinBut").attr("title", jsStr["UNPIN_LIST"][LANG])
			}
		});
	}

	// Hiding header and showing scroll to top button
	$("body").on("scroll", () => {
		if (document.body.scrollTop > 150) $(".scrollToTop").css("opacity", 1)
		else $(".scrollToTop").css("opacity", 0)
	})

	$(".searchTools").css("opacity", 1)
	$("footer").css("opacity", 1)

	// Box appear animation
	if (animsEnabled) {
		$(".box").css("transform", "translateX(-100vw)");
		$(".box").css("transition", "transform 0.3s cubic-bezier(0.075, 0.82, 0.165, 1)");

		$("#crown").css("transition", "transform 1s ease-out, opacity 1.2s ease-out");
		$("#crown").css("opacity", 1);


		let index = 0
		let boxAppear = setInterval(() => {
			if (index == Object.keys(boards).length - ADDIT_VALS - 2) { clearInterval(boxAppear) }
			if ($(".box")[index] != undefined) $(".box")[index].style.transform = "none"
			index++
		}, 100);
	}

	$("#crown").css("transform", "translateY(5.7vw)")
});

function checkPassword() {
	let passEntered = $(".passInput").val();

	// POLISH THIS LATER!!!
	$(".passInput").attr("disabled", true);
	$(".passInput").val(jsStr["CHECKING"][LANG]);
	$(".passInput").css("background-color", "#82fc80")

	$(".passImg").addClass("disabled");

	let postReq = { "pwdEntered": passEntered, "retData": "0" };
	let isPrivate = window.location.search.includes("pid") ? "pid" : "id"
	postReq[isPrivate] = LIST_ID;

	$.post("./php/pwdCheckAction.php", postReq, function (data) {
		// Incorrect pwd
		if (data != 3) {
			//testing
			$(".passInput").css("background-color", "#fc8093")
			$(".passInput").val(jsStr["INC_PWD"][LANG])
			setTimeout(() => {
				$(".passInput").attr("disabled", false);
				$(".passImg").removeClass("disabled");
				$(".passInput").val("")
			}, 1000)
		}
		else {
			sessionStorage.setItem("listProps", JSON.stringify([LIST_ID, passEntered, isPrivate]))
			window.location.href = `./upload.html?editing`;
		}
	})

	if (window.location.port != "") {
		if (passEntered == debugPwd) {
			sessionStorage.setItem("listProps", JSON.stringify([LIST_ID, passEntered, isPrivate]))
			window.location.href = `./upload.html?editing`
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

let page = {} // [page, maxPage]
function pageSwitch(num, data, parent, ctype) {
	if (page[parent][0] + num < 0) {
		page[parent][0] = 0
	}
	else if (page[parent][0] + num > page[parent][1] - 1) {
		page[parent][0] = page[parent][1] - 1;
	}
	else {
		page[parent][0] += num;
		$(`${parent} #pageSwitcher`).val(page[parent][0] + 1);
		listViewerDrawer(data, parent, ctype)
	}
}

function search(data, parent, ctype) {
	let query = $(`${parent} #searchBar`).val();
	if (query == "") {
		// Reset stuff
		page[parent][0] = 0;
		$(`${parent} #pageSwitcher`).val("1");
		currentListData[parent] = originalListData[parent]
		listViewerDrawer(currentListData[parent], parent, ctype)
	}
	else {
		let regex = new RegExp(".*(" + query + ").*", "ig"); // Matches all strings that contain "query"
		let filteredData = data.filter(val => JSON.stringify(val).match(regex));
		if (filteredData.length == 0) {
			$(`${parent} .customLists`).empty()
			page[parent][0] = 0;
			$(`${parent} #pageSwitcher`).val("1");
			$(`${parent} #maxPage`).text("/1")
			$(`${parent} .customLists`).append(`<p align=center>${jsStr['NO_RES'][LANG]}</p>`);
			currentListData[parent] = []
		}
		else {
			page[parent][0] = 0;
			$(`${parent} #pageSwitcher`).val("1");
			currentListData[parent] = filteredData
			listViewerDrawer(currentListData[parent], parent, ctype)
		}
	}

}

let sorting = {}
function sortingList(data, parent, ctype) {
	listViewerDrawer(data.reverse(), parent, ctype)
	if (sorting[parent]) {
		$(`${parent} #sortBut`).css("transform", "scaleY(1)");
		$(`${parent} #sortBut`).attr("title", jsStr["NEWEST"][LANG])
	}
	else {
		$(`${parent} #sortBut`).css("transform", "scaleY(-1)");
		$(`${parent} #sortBut`).attr("title", jsStr["OLDEST"][LANG])
	}
	sorting[parent] = !sorting[parent]
}

let originalListData = {}
let currentListData = {}
function listViewerDrawer(data, parent, cardType) {
	// Store original list data
	if (originalListData[parent] == undefined) {
		originalListData[parent] = data; currentListData[parent] = data; originalListData[parent].init = true
	}
	if (sorting[parent] == undefined) sorting[parent] = false
	if (page[parent] == undefined) page[parent] = [0, 0]

	// Clear old cards
	$(`${parent} .customLists`).empty();

	// We want to sort from newest to oldest by default
	let reversed = JSON.parse(JSON.stringify(data)).reverse();

	// Set max page text
	let listAmount = Object.keys(reversed).length;
	page[parent][1] = Math.ceil(listAmount / 10);
	$(`${parent} #maxPage`).text("/" + page[parent][1]);

	if (originalListData[parent].init) {
		// List sorting click action
		$(`${parent} #sortBut`).click(() => {
			sortingList(currentListData[parent], parent, cardType)
		})

		// List search button action
		$(`${parent} .doSearch`).click(() => {
			search(originalListData[parent], parent, cardType)
		})

		// Typing in a page (TODO: Add object as page)
		$(`${parent} #pageSwitcher`).on("change", function () {
			if (!isNaN(parseInt($(this).val()))) {
				pageSwitch(parseInt($(this).val()) - page[parent][0] - 1, currentListData[parent], parent, cardType)
			}
		})

		// Page -1 (left) action
		$(`${parent} .pageBut`).eq(0).click(() => {
			pageSwitch(-1, currentListData[parent], parent, cardType)
		})
		// Page +1 (right) action
		$(`${parent} .pageBut`).eq(1).click(() => {
			pageSwitch(1, currentListData[parent], parent, cardType)
		})

		delete originalListData[parent].init
	}

	// Draw Cards
	if (Object.keys(data).length > 0) {
		homeCards(data, `${parent} .customLists`, cardType, 10, page[parent][0])
	}
	else {
		$(`${parent} #maxPage`).text("/1");
		// No favorites
		if (cardType == 1) $(`${parent} .customLists`).append(`<p class="uploadText" style="text-align: center; color: #f9e582">${jsStr["NOFAVED"][LANG]}</p>`);
		// Object is empty
		else if (cardType == 4 || currentListData[parent] != originalListData[parent]) $(`${parent} .customLists`).append(`<p align=center>${jsStr['NO_RES'][LANG]}</p>`);
	}
}