const ADDIT_VALS = 2;
const DISABLE_GDB = "h" // Change to anything else than "h" to break requests
const isInEditor = window.location.pathname.includes("upload");

function onGDBClick(pos) { window.open("https://gdbrowser.com/" + pos, "_blank"); }
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

const openSocLink = link => { window.open(link) }
const openProfileOnGDB = name => { window.open("https://gdbrowser.com/profile/" + name) }

async function getProfileStats(k, ind) {
	let container = k.target

	$(container).hide()
	await $(container).after("<img src='images/loading.webp' class='loading'>")
	$(".loading").css("animation-name", "loading")

	let uName = $(k.target.parentElement).siblings()[1].innerText;

	await $.get(DISABLE_GDB + "ttps://gdbrowser.com/api/profile/" + uName, user => {
		$(".loading").remove();

		$(container).after(`<img onclick="openProfileOnGDB('${user.username}')" style="transform: translateX(0.7vw);" class="stats button" src="images/add.webp">`)
		if (user.cp > 0) {
			$(container).after(`<p style="margin:0 1vw"><img class="stats" src="images/cp.webp">${user.cp} </p>`)
		}
		$(container).after(`<p style="margin:0 1vw"><img class="stats" src="images/ucoin.webp">${user.userCoins}</p>`)
		$(container).after(`<p style="margin:0 1vw"><img class="stats" src="images/demons.webp">${user.demons} </p>`)
		$(container).after(`<p style="margin:0 1vw"><img class="stats" src="images/star.webp">${user.stars} </p>`)
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
									style="width: 3.5vw;" class="button" src="images/${imgs[creators.socials[soc][0]]}.webp">`
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
				<img style="width: 3vw;margin: 0.4vw;" src="images/gdbrowser.webp" class="getProfile button" title="${jsStr["SHOW_PROFILE"][LANG]}">
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
									style="width: 3.5vw;" class="button" src="images/${imgs[creators.socials[soc][0]]}.webp">`
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
				<img style="width: 4vw;margin: 0.4vw;" src="images/emoji/${randIcon}.webp">
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
					<img class="boxIcon" alt=" " src="images/bytost.webp"></img>
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
		$(nameShower[0]).attr("src", "images/bytost.webp")
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

function boxCreator(obj, index, forceName) {
	if (typeof obj != "object" || forceName) {
		let nm
		if (typeof obj == "object") nm = obj[0][0]
		else nm = obj
		return `<p class="uploadText" id="listLevelSub" style="margin: 0;">${nm}</p>`
	}
	else {
		let names = [];
		let appended = [];
		obj[2].forEach(creator => {
			let icon = "";
			if (creator.verified) {
				icon = `<img class="boxIcon" src="images/none.webp" alt=" " style="background: ${creator.color}">`;
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

function doDiffGuessing(cardBG, bIndex) {
	$(".boards").append(`
	<div class="box" style="${cardBG}">
		<div class="boxHeader">
			<span id="listLevelName"><p style="margin: 0">${boards[bIndex]["levelName"]}</p></span>
			<div class="boxLinksContainer">
				<img src="images/skip.webp" title="${jsStr["SKIP"][LANG]}" style="width: 5vw" class="button skipBut">
			</div>
		</div>
		${boxCreator(boards[bIndex]["creator"], bIndex, true)}
		<h3 class="guessTitle" style="text-align: center; margin-bottom: 0.5vh;">${jsStr["LEVDIFF_Q"][LANG]}</h2>
		<div class="diffFaces mainGuesser" style="flex-wrap:wrap"></div>
		<div class="mainGuesser" id="rates" style="display:none;">
			<img class="button diffFace cancelGuess" title="${jsStr["BACK"][LANG]}" src="images/arrow-left.webp">
			<div class="rateContainer">
				<div class="listDiffContainer button" style="display: inline-flex">
					<img class="listDiffFace" src="images/faces/1.webp">
				</div>
				<div class="listDiffContainer button" style="display: inline-flex">
					<img class="listDiffFace" src="images/faces/1.webp">
					<img class="listDiffStar" src="images/star.webp">
				</div>
				<div class="listDiffContainer button" style="display: inline-flex">
					<img class="listDiffFace" src="images/faces/1.webp">
					<img class="listDiffRate" src="images/faces/featured.webp">
				</div>
				<div class="listDiffContainer button" style="display: inline-flex">
					<img class="listDiffFace" src="images/faces/1.webp">
					<img class="listDiffEpicRate" src="images/faces/epic.webp">
				</div>
			</div>
			<div style="width: 5%"></div>
		</div>
	</div>
	`);
	if (!boards.diffGuesser[1]) {
		$("#rates").show() // Show rat guesser
		$(".guessTitle").text("Jaký má level rating?")
		$(".mainGuesser:first()").remove() // Remove diff guesser
		$(".cancelGuess").before("<div></div>") // Empty element to keep centering
		$(".cancelGuess").remove()
		$(".rateContainer .listDiffFace").attr("src", `images/faces/${boards[bIndex].difficulty[0]}.webp`)
	}
	else {
		for (let j = 0; j < 12; j++) {
			let diff = $(`<img class="button diffFace" src="images/faces/${j}.webp">`)
			diff.click(e => guessDifficulty(e, bIndex))
			diff.appendTo($(".diffFaces:last()"))
		}
	}

	$(".cancelGuess").click(cancelDifficulty)
	$(".listDiffFace").parent().click(guessRating)
	$(".skipBut").click(() => (skipGuess([-1, -1])))
}

var LIST_NAME = null
var LIST_CREATOR = null
function generateList(boards, listData, singleLevel = -1, isResult = false) {
	// Empty list (useful in previews)
	if (Object.keys(boards).length - ADDIT_VALS == 1) {
		$(".boards").append("<h2 class='titles' style='margin-top: 4vw'><img src='images/listEmpty.svg' class='listErrors'>" + jsStr["EMPLIST"][LANG] + "</h2>")
		return false
	}

	// If going to favorites, disable guess list
	if (window.location.search.includes("goto") && boards.diffGuesser[0]) boards.diffGuesser = [0, 0, 0]

	// Todo remove ! from line below and somewhere next in the code or whatever
	if (boards.diffGuesser != undefined && boards.diffGuesser[0] && singleLevel == -1) singleLevel = 1

	let amount = singleLevel == -1 ? Object.keys(boards).length - ADDIT_VALS : singleLevel + 1
	let start = singleLevel == -1 ? 1 : singleLevel
	for (let i = start; i < amount; i++) {
		let bIndex = (i).toString()

		// Empty names
		if (boards[bIndex]["levelName"] == "") boards[bIndex]["levelName"] = jsStr["UNNAMED"][LANG]
		if (boards[bIndex]["creator"] == "") boards[bIndex]["creator"] = jsStr["UNNAMED"][LANG]

		// Setting title image
		$(".titleImage").attr("src", boards["titleImg"]);

		// Removing card buttons
		if (boards[bIndex]["levelID"] == null || boards[bIndex]["levelID"] == "") { var ID = ["", ""]; }
		else {
			var ID = [`<img src="./images/gdbrowser.webp" class="button boxLink" onclick="onGDBClick(${boards[bIndex]["levelID"]},${bIndex})" title="${jsStr["GDB_DISP"][LANG]}">`,
			`<img src="./images/copyID.webp" class="button boxLink" onclick="onIDCopyClick(${boards[bIndex]["levelID"]},${bIndex})" title="${jsStr["COPY_ID"][LANG]}">`]
		}

		if (boards[bIndex]["video"] == null || boards[bIndex]["video"] == "") { var video = ``; }
		else { var video = `<img src="./images/yticon.webp" class="button boxLink" onclick="onYTClick('${boards[bIndex]["video"]}',${bIndex})" title="${jsStr["DISP_EP"][LANG]}">`; }


		// Shit fix. Colors break sometimes
		let boardFix = fixHEX(boards[bIndex]["color"])
		if (!boardFix) boardFix = randomColor()
		let gradientLighter = HEXtoRGB(boardFix, -60)

		// Glow depending on level position
		var cardBG = `background-color: ${boardFix}; background-image: url(images/cardBg.webp), linear-gradient(39deg, ${boardFix}, rgb(${gradientLighter.join(",")}));`;
		if (i == 1) { cardBG += `;box-shadow: 2px 2px 60px ${boardFix};`; }
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
				let type
				if (data[1] == 1) type = ["listDiffStar", "star"]
				else type = [data[1] == 2 ? "listDiffRate" : "listDiffEpicRate", "faces/" + (data[1] == 2 ? "featured" : "epic")]
				glow = `<img class="${type[0]}" src='images/${type[1]}.webp'>`
			}

			diff = `<div class="listDiffContainer"><img class="listDiffFace" src="images/faces/${data[0]}.webp">${glow}</div>`
		}

		if (boards[bIndex]["tags"] == undefined) boards[bIndex]["tags"] = [] // Old list - no tags

		let hasID = ["", null].includes(boards[bIndex]["levelID"])
		let preview = window.location.search.includes("preview")

		let favoriteCheck = preview ? false : (hasID ? false : true)
		let currentlyFavedIDs = localStorage.getItem("favoriteIDs") == null ? [] : JSON.parse(localStorage.getItem("favoriteIDs"))
		let disableStar = currentlyFavedIDs.includes(boards[bIndex]["levelID"]) ? "disabled" : ""
		let starTitle = currentlyFavedIDs.includes(boards[bIndex]["levelID"]) ? jsStr["FAV_REM"][LANG] : jsStr["FAV_ADD"][LANG]
		let diffIndent = diff == "" ? "0" : "1"

		let star = `<img title="${starTitle}" src="images/star.webp" class="button favoriteStar ${disableStar}" onclick="fave($(this), ${bIndex}, ['${listData[0]}','${listData[1]}'])">`
		if (boards.diffGuesser == undefined || (!boards.diffGuesser[0] || isResult)) {
			$(".boards").append(`
				<div class="box" style="${cardBG}" id="${i == 1 ? "toplevel" : ""}">
					<div style="height:0px;">
						${favoriteCheck ? star : ""}
					</div>
					<div class="boxHeader">
						<span id="listLevelName">${diff}<p style="margin: 0; margin-left: ${diffIndent}em;">${boards[bIndex]["levelName"]}</p></span>
						<div class="boxLinksContainer">
							${video}
							${ID[0]}
							${ID[1]}
						</div>
					</div>
	
					${boxCreator(boards[bIndex]["creator"], bIndex, false)}
					<div class="${boards[bIndex]["tags"].length ? "listTagContainer" : ""}"></div>
				</div>
				`);
		}
		else {
			doDiffGuessing(cardBG, bIndex)
		}

		// Generate tags
		let gradients = ["#7a5722", "#7a2222", "#7a2222", "#7a2222", "#227a2b", "#7a2222", "#227a28", "#7a7422", "#000000", "#7a2222", "#226e7a", "#7a2222", "#22737a", "#227a28", "#7a2274", "#7a2222", "#7a5322"]
		boards[bIndex]["tags"].forEach(tag => {
			let tagName = tag[1] == -1 ? jsStr["TAGS"][LANG][tag[0]] : tag[1]
			$(".listTagContainer").append(`<div style="background: ${gradients[tag[0]]};" class="listTag"><img src="images/badges/${tag[0]}.svg">${tagName}</div>`)
		});

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
		let isGuess = boards.diffGuesser != undefined ? boards.diffGuesser[0] : 0
		parsed.push([LIST_ID, LIST_NAME, LIST_CREATOR, boards[1].color, (new Date).getTime(), isGuess])
		parsed = parsed.reverse().slice(0, 3)

		makeCookie(["recentlyViewed", JSON.stringify(parsed)])
	}

	// Box appear animation
	$(".box").css("transform", "translateX(-100vw)");
	$(".box").css("transition", "transform 0.3s cubic-bezier(0.075, 0.82, 0.165, 1)");
	
	let index = 0
	let boxAppear = setInterval(() => {
		if (index == Object.keys(boards).length - ADDIT_VALS - 2) { clearInterval(boxAppear) }
		if ($(".box")[index] != undefined) $(".box")[index].style.transform = "none"
		index++
	}, 100);

	if ($(".box")[params.goto - 1] != undefined) $(".box")[params.goto - 1].scrollIntoView()
	return true
}

function shareDiffResult() {
	let double = (boards.diffGuesser[1] && boards.diffGuesser[2]) ? 2 : 1
	let maxPoints = (Object.keys(boards).length - ADDIT_VALS - 1) * double

	text = `${LIST_NAME} ${jsStr["BY"][LANG]} ${LIST_CREATOR}\n${diffGuesses.join("")} ${points}/${maxPoints}\n${jsStr["SCORBET"][LANG]}\ngamingas.wz.cz/lofttop10/?id=${LIST_ID}`
	window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(text), "_blank")
}
function replayList() {
	$(".box").remove()
	$(".finishDiffList").remove()
	generateList(boards, [LIST_ID, LIST_CREATOR], 1, false)
	points = 0
	diffGuesses = []
}

function guessDifficulty(button, bIndex) {
	$(button.target).parent().hide()

	let faceID = button.target.attributes.src.value.match(/\d+/g)
	$(".guessTitle").text(jsStr["LEVRATE_Q"][LANG])
	$(".rateContainer .listDiffFace").attr("src", `images/faces/${faceID}.webp`)
	$(".mainGuesser:last()").show()

	if (!boards.diffGuesser[2]) skipGuess([faceID, boards[bIndex].difficulty[1]])
	if (faceID == 0) skipGuess([faceID, 0])
}

function cancelDifficulty() {
	$(".mainGuesser:last()").hide()
	$(".mainGuesser:first()").show()
	$(".guessTitle").text(jsStr["LEVDIFF_Q"][LANG])
}

function guessRating(button) {
	let faceID = $(button.currentTarget).children().eq(0).attr("src").match(/\d+/g)
	let rateID = Object.values($(".rateContainer .listDiffFace")).indexOf($(button.currentTarget).children()[0])

	skipGuess([faceID[0], rateID]) // [diff, rating]
}

//${window.location.toString()}
var points = 0;
let diffGuesses = []
function skipGuess(face) { // face = [diff, rating]
	$(".skipBut").remove()
	$(".box:last()").remove()

	let isLastLevel = $(".box").length + 1 == Object.keys(boards).length - ADDIT_VALS - 1
	generateList(boards, [LIST_ID, LIST_CREATOR], $(".box").length + 1, true)
	if (!isLastLevel) generateList(boards, [LIST_ID, LIST_CREATOR], $(".box").length + 1, false)

	$(".box").eq($(".box").length - 2 + isLastLevel).append("<div class='diffGuessResult'></div>")

	let levelDiffProp = boards[$(".box").length - 1 + isLastLevel]["difficulty"]
	let gradientFlash = flipColors => `linear-gradient(${flipColors ? "-" : ""}169deg, #36fd17 45%,#fd1a1a 55%,#fd1a1a)`
	let enabledAll = boards.diffGuesser[1] && boards.diffGuesser[2]

	// fuk code :D - both correct
	if (face[0] == levelDiffProp[0] && face[1] == levelDiffProp[1]) {
		$(".diffGuessResult:last()").css("background", "#36fd17 url(../images/check-tp.webp)")
		diffGuesses.push("🟩")
		points += enabledAll ? 2 : 1
	}
	else if (enabledAll && (face[0] == levelDiffProp[0] || face[1] == levelDiffProp[1])) {
		$(".diffGuessResult:last()").css("background", `${gradientFlash(face[0] != levelDiffProp[0])}`)
		diffGuesses.push("🟨")
		$(".diffGuessResult:last()").append('<img src="images/check-tp.webp" style="">')
		if (face[0] == levelDiffProp[0]) $(".diffGuessResult:last()").append('<img src="images/wrong-tp.webp" style="">')
		else $(".diffGuessResult:last()").prepend
			('<img src="images/wrong-tp.webp" style="">')

		points += 1
	}
	else {
		$(".diffGuessResult:last()").css("background", "#fd1a1a url(../images/wrong-tp.webp)")
		diffGuesses.push("🟥")
	}
	$(".diffGuessResult:last()").css("animation-name", "flash")


	setTimeout(() => {
		$(".box:last()")[0].scrollIntoView()
		$(".diffGuessResult:last()").remove()
	}, 800);

	$(".favoriteStar").hide() // Hide fave stars till list finished
	if (isLastLevel) {
		$(".favoriteStar").show()
		let double = (boards.diffGuesser[1] && boards.diffGuesser[2]) ? 2 : 1
		let maxPoints = (Object.keys(boards).length - ADDIT_VALS - 1) * double
		let perc = Math.round((points / (Object.keys(boards).length - ADDIT_VALS - 1)) * 100 / double)

		$(".boards").after(`
		<div class="uploadText uploadBG finishDiffList">
			<h1>${jsStr["LIST_FIN"][LANG]}</h1>
			<div class="graphContainer">
				<div class="graphLine diffRes" style="background-color: rgb(108, 240, 108); text-align: center;">${perc}%</div>
			</div>
			<h4>${jsStr["YOU_GOT"][LANG]} ${points} ${jsStr["OUTTA"][LANG]} ${maxPoints} ${jsStr["POINTS"][LANG]}!</h4>
			<div style="display: flex; gap: 5vw;">
				<button class="button niceButton replayList uploadText"><img src="images/replay.svg" style="width: 4vw;">${jsStr["PLAY_AGAIN"][LANG]}</button>
				<button class="button niceButton shareDiff uploadText"><img src="images/share.svg" style="width: 4vw;">${jsStr["TWIT_SHARE"][LANG]}</button>
			</div>
		</div>
		`)
		$(".shareDiff").click(shareDiffResult)
		$(".replayList").click(replayList)
		$(".finishDiffList")[0].scrollIntoView()
		$(".diffRes").animate({ "width": perc + "%" }, "300")

		if (LIST_ID == -8) $(".shareDiff").remove() // Remove share in list preview
	}
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

	$(".pin").empty()
	if (indToRemove[1]) {
		$(".pin").append("<img src='images/pin.svg'>")
		$(".pin").append(jsStr["PIN_LIST"][LANG])
		pinnedLists.splice(pinnedLists.indexOf(indToRemove[0]), 1)
	}
	else {
		$(".pin").append("<img src='images/unpin.svg'>")
		$(".pin").append(jsStr["UNPIN_LIST"][LANG])
		// [listID, listName, listCreator, listColor, currTime, isGuess]
		let isGuess = boards.diffGuesser != undefined ? boards.diffGuesser[0] : 0
		pinnedLists.push([LIST_ID, LIST_NAME, LIST_CREATOR, boards[1].color, (new Date).getTime(), isGuess])

		if (pinnedLists.length > 5) pinnedLists = pinnedLists.slice(1, 6)
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

function switchLoFList(hash, goto = null) {

	window.location.hash = hash
	/*
	if (window.location.hash == hash) {
		// HOW DOES THIS WORK??!! You shouldn't have to subtract 4
		if (goto != null) $(".box")[goto - 4].scrollIntoView();

	}
	else window.location.assign(goto == null ? hash : hash + `&goto=${goto}`)
	*/
}

// const MAX_ON_PAGE = 4;
function homeCards(obj, custElement = ".listContainer", previewType = 1, overwriteMax = false, custPagination = 0, reverseList = false) {
	// Do nothing if empty
	if (obj == null || obj == false) return

	if (reverseList) obj = JSON.parse(JSON.stringify(obj)).reverse()

	$(custElement).text("");

	let MAX_ON_PAGE = overwriteMax ? overwriteMax : 4

	obj.slice(MAX_ON_PAGE * custPagination, MAX_ON_PAGE * custPagination + MAX_ON_PAGE)
		.forEach((object) => {
			if ([1, 3].includes(previewType)) { // Favorite level
				let darkCol = HEXtoRGB(object[3], 40);
				let priv = object[4].toString().match(/[A-z]/) != null ? "pid" : "id"
				$(custElement).append(`
			<div class="noMobileResize" id="listPreview" href="#" style="background: rgb(${HEXtoRGB(
					object[3]
				)}); display:flex; border-color: rgb(${darkCol.join(",")});">
				<div style="width: 100%">
				<p class="uploadText" style="margin: 0;">${object[0]} - ${object[1]
					}</p>
				<p class="uploadText" style="font-size: var(--miniFont); margin: 0;">
						<a href="#${object[4]}!${object[6]}">
							<u>${object[5]}</u>
						</a> - ${jsStr["L_LEVID"][LANG]}: ${object[2]}</p>
					</div>
					<div style="${previewType == 3 ? 'display: none;' : ''}">
					<img class="button" onclick="removeFave(${object[2]});"
					style="width: 4vw" src="images/delete.webp">
					</div>
					</div>
					`);
			}
			else if ([2, 5].includes(previewType)) { // Recently viewed list / Pinned list
				let lightCol = HEXtoRGB(object[3], -60)
				let darkCol = HEXtoRGB(object[3], 40)
				let priv = object[0].toString().match(/[A-z]/) != null ? "pid" : "id"

				let dGuesserBadge = ""
				if (object[5] != undefined) {
					dGuesserBadge = object[5] ? "<img src='images/diffGuessSign.svg' class='guessBadge'>" : ""
				}
				$(custElement).append(`
				<div style="display: flex; align-items: center">
					<a style="display: flex; align-items: center; flex-grow: 1;" href="#${object[0]}">
						<div id="listPreview" class="noMobileResize")"
							style="background-image: linear-gradient(39deg, rgb(${darkCol.join(",")}), ${object[3]}, rgb(${lightCol.join(",")}));
									border-color: rgb(${darkCol.join(",")}); margin: 0.85% ${previewType == 5 ? 1 : 7}% 0.85% 7%; flex-grow: 1;">
							<div class="boxHeader" style="flex-direction: row !important;">
								<div>
								<p class="uploadText" style="margin: 0;">${dGuesserBadge}${object[1]}</p>
								<p class="uploadText" style="font-size: var(--miniFont); margin: 0;">- ${object[2]} -</p>
								</div>
								<div>
								<p class="uploadText" style="margin: 0; font-size: var(--miniFont);">${window.parent.window.chatDate(object[4] / 1000)}</p>
								</div>
							</div>
						</div>
					</a>
					${previewType == 5 ? `<img src="images/unpinList.webp" onclick="pinList('${object[0]}',$(this))" class="button" style="width: 4vw; height: fit-content; margin-right: 1.9vw;">` : ''}
				</div>
				`);
			}
			else if (previewType == 4) { // Newest lists
				let dGuesserBadge = "";
				if (object.data.diffGuesser != undefined) {
					dGuesserBadge = object.data.diffGuesser[0] ? "<img src='images/diffGuessSign.svg' class='guessBadge'>" : ""
				}

				let level1col = object["data"][1].color
				let lightCol = HEXtoRGB(level1col, -60)
				let darkCol = HEXtoRGB(level1col, 40)
				$(custElement).append(`
				<a id="listPreview" class="noMobileResize" href="#${object["id"]}"
					 style="background-image: linear-gradient(39deg, rgb(${darkCol.join(",")}), ${level1col}, rgb(${lightCol.join(",")})); border-color: rgb(${darkCol.join(",")})">
					<div style="width: 100%">
						<p class="uploadText" style="margin: 0;">${dGuesserBadge}${object["name"]}</p>
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
	homeCards(homepageData.pinned, ".pinnedLists", 5, 5, 0, true)
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
	favesData = favesData == null ? [] : favesData
	listViewerDrawer(favesData, "#favoritesContainer", 1)
}

var listData = "";
const repeatBG = [false, true, false]
var boards

var rot = 1
async function loadSite() {
	let hash = window.location.hash.slice(1)
	$(".logo").css("transform", `rotate(360deg)`)
	let spinning = setInterval(() => {rot += 1; $(".logo").css("transform", `rotate(${rot*360}deg)`)}, 1000)
	$("#app").empty()
	$("body").css("background-color","var(--siteBackground)")
	if ($(":root").css("--greenGradient") != $(":root").css("--defaultGradient")) {
		$("nav").css("animation-name","fadeBlack")
		setTimeout(() => $(":root").css("--greenGradient","var(--defaultGradient)"), 125);
		setTimeout(() => $("nav").css("animation-name","none"), 250);
	}

	if (hash == "") {
		await $.get("./parts/homepage.html", site => {
			$("#app").html(translateDoc(site, "homepage"))
		})
		$("iframe").attr("src", "packs.html?type=homepage")
	}

	switch (true) {
		case /(editor|update)/.test(hash):
			await $.get("./parts/editor.html", site => {
				$("#app").html(translateDoc(site, "editor"))
				makeEditor(hash != "editor")
				setupCollabTools()
			})
			break;

		case /saved/.test(hash):
			$("iframe").attr("src", "packs.html?type=favorites")
			break;

		case /browse/.test(hash):
			await $.get("./parts/listBrowser.html", site => {
				$("#app").html(translateDoc(site, "listBrowser"))
				makeBrowser("")
			})
			break;

		default:
			if (hash == "") break;
			await $.get("../parts/listViewer.html", data => {
				$("#app").html(translateDoc(data, "listViewer"))
				let listObject;
				if (hash.match(/[A-z]/) == null) listObject = {"type": "id", "id": hash.match(/\d+/)}
				else if (hash.match(/y\d+/)) listObject = {"type": "year", "id": hash == "y2019" ? -2 : -3}
				else if (hash == "random") listObject = {"type": "random"}
				else listObject = {"type": "pid", "id": hash}

				lists(listObject)
				setupComments()
			})
			break;
	}
	clearInterval(spinning)
	rot = 1
}

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

	window.addEventListener("hashchange", () => loadSite())
	loadSite()
})

window.addEventListener("message", async state => {
	if (state.data == "homepage" && !isInEditor) makeHP()
	else if (state.data == "favorites") {
		favesResponse()
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

$(".passInput").val("");
$(".commBut").attr("src", jsStr["COMM_IMG"][LANG]);

async function favesResponse() {
	let favesData = JSON.parse($("iframe")[0].contentDocument.querySelector(".fetcher").innerText)

	if ($("#favoritesContainer > p").length == 0) {
		await $.get("./parts/listBrowser.html", data => {
			$("#favoritesContainer").append(translateDoc(data, "listViewer"))
			$("#favoritesContainer > p").text(jsStr["FAV_LEVELS"][LANG])
		})
	}
	drawFaves(favesData)
}

async function lists(list) {
	$(".listInfo").show()
	$("#crown").show();
	$("#crown").css("opacity", 1);

	if (list.type == "preview") {
		$(".listInfo").remove();
		let previewData = sessionStorage.getItem("previewJson")
		if (previewData == null) {
			$("#crown").remove()
			$(".boards").before(`<p class="titles">${jsStr["NO_PREV_DATA"][LANG]}</p>`);
			return
		}

		let decodeData = atob(previewData).split(",");
		let decodedData = "";
		for (i = 0; i < decodeData.length; i++) {
			decodedData += String.fromCharCode(decodeData[i]);
		}
		boards = JSON.parse(decodedData);

		$(".titleImage").attr("src", boards["titleImg"]);
		$("title").html(`${jsStr["PREVIEW_L"][LANG]} | ${jsStr["GDLISTS"][LANG]}`)
		LIST_NAME = null
		LIST_CREATOR = "person"
		if (generateList(boards, [LIST_ID, LIST_NAME])) {
			$("#crown").before(`<h2 class="titles" style="margin-top: 4vw">(${jsStr["PREVIEW_L"][LANG]})</h2>`);
		}
	}
	else if (list.type == "random") {
		$.get("php/getLists.php?random=1", data => {
			data = data[0]
			boards = data["data"];
			$(".titles").prepend(`<div><p style="margin: 0; font-weight: bold;">${data["name"]}</p>
			<p style="font-size: var(--normalFont);margin: 0;">${data["creator"]}</p></div>`);
			$(".titleImage").attr("src", boards["titleImg"]);
			$("title").html(`${data["name"]} | ${jsStr["GDLISTS"][LANG]}`)

			LIST_ID = parseInt(data["id"])

			LIST_NAME = data["name"]
			LIST_CREATOR = data["creator"]

			generateList(boards, [encodeURIComponent(data["id"]), data["name"]]);

			refreshComments()
		})
	}
	else if (list.type == "id" || list.type == "year") {
		if ([-2, -3].includes(list.id)) {
			let listName = `Top ${list.id == -2 ? 10 : 15} LoF ${list.id == -2 ? 2019 : 2021}`

			$("#editBut").remove()
			$("title").html(`${listName} | ${jsStr["GDLISTS"][LANG]}`)

			LIST_NAME = listName
			LIST_CREATOR = "GamingasCZ"
			$(".titles").prepend(`<div><p style="margin: 0; font-weight: bold;">${LIST_NAME}</p>
			<p style="font-size: var(--normalFont);margin: 0;">${LIST_CREATOR}</p></div>`);

			generateList(boards, [list.id, listName]);
		}

		else {
			$.get("./php/getLists.php?id=" + list.id, function (data) {
				if ([1, 2].includes(data)) {
					$(".boards").append("<h2 class='titles'><img src='images/listError.svg' class='listErrors'>" + jsStr["EMPLIST"][LANG] + "</h2>")
					$("title").html(`${jsStr["NONEXISTENT_L"][LANG]} | ${jsStr["GDLISTS"][LANG]}`)
					$(".listInfo").remove();
				}
				else {
					boards = data["data"];
					$(".titles").prepend(`<div><p style="margin: 0; font-weight: bold;">${data["name"]}</p>
					<p style="font-size: var(--normalFont);margin: 0;">${data["creator"]}</p></div>`);
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
	else if (list.type == "pid") {
		await $.get("./php/getLists.php?pid=" + list.id, function (data) {
			if ([1, 2].includes(data)) {
				$(".boards").append("<h2 class='titles'><img src='images/listError.svg' class='listErrors'>" + jsStr["EMPLIST"][LANG] + "</h2>")
				$("title").html(`${jsStr["NONEXISTENT_L"][LANG]} | ${jsStr["GDLISTS"][LANG]}`)
				$(".listInfo").remove();
				$("#crown").remove();
			}
			else {
				boards = data["data"];
				$(".titles").prepend(`<div><p style="margin: 0; font-weight: bold;">${data["name"]}</p>
				<p style="font-size: var(--normalFont);margin: 0;">${data["creator"]}</p></div>`);
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
	$(".loadPlaceholder").remove()
	
	let getPinned = getCookie("pinnedLists")
	if (getPinned !== null & getPinned !== false) {
		JSON.parse(decodeURIComponent(getPinned)).forEach(arr => {
			if (arr[0] == LIST_ID) {
				$(".pin").empty()
				$(".pin").append("<img src='images/unpin.svg'>")
				$(".pin").append(jsStr["UNPIN_LIST"][LANG])
				$(".pin").attr("title", jsStr["UNPIN_LIST"][LANG])
			}
		});
	}
	
	// Hiding header and showing scroll to top button
	$("body").on("scroll", () => {
		if (document.body.scrollTop > 150) $(".scrollToTop").css("opacity", 1)
		else $(".scrollToTop").css("opacity", 0)
	})
}

function checkPassword() {
	sessionStorage.setItem("listProps", JSON.stringify([LIST_ID, null, window.location.search.includes("pid"), LIST_NAME, LIST_CREATOR]))
	window.location.hash = `#update`;
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

	// Draw pages
}
