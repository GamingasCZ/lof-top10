const getListLen = b => Object.keys(b).filter(x => x.match(/\d+/)).length
const DISABLE_GDB = "h" // Change to anything else than "h" to break requests
var settings = Array(2)


function onGDBClick(pos) { window.open("https://gdbrowser.com/" + pos, "_blank"); }
function onYTClick(link) { window.open("https://youtu.be/" + link, "_blank") };
function onIDCopyClick(id, pos) {
	$(".box").eq(pos - 1).append(`<div class="uploadText copyPopup"><h2>${jsStr["ID_COPIED"][LANG]}</h2><h4>- ${id} -</h4></div>`)
	setTimeout(() => {
		$(".copyPopup").fadeOut(() => $(".copyPopup").remove())
	}, 500);
	clipboardCopy(id)

}
const clipboardCopy = id => navigator.clipboard.writeText(id)

function hasLocalStorage() {
	try {
		localStorage.setItem("gay", 1)
		localStorage.removeItem("gay")
		return true
	} catch (error) {
		return false
	}
}

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

	let cringeText = encodeURIComponent(`${jsStr['CHECKOUT'][LANG]} - gamingas.wz.cz/?${link}`)

	let shareLinks = ["https://twitter.com/intent/tweet?text=" + cringeText, "https://www.reddit.com/submit?url=" + cringeText]

	let socButtons = $(".shareSocials").children()
	socButtons.off("click")

	for (let but = 0; but < socButtons.length; but++) {
		$(socButtons[but]).on("click", () => window.open(shareLinks[but]))
	}

	$("#shareContainer").val("gamingas.wz.cz/?" + link);
}

function showFinishUpload(isUpdating) {
	$(".finishUpload").fadeIn(50);
	$("#popupBG").css("opacity", 1)
	$("#popupBG").show();

	$(".clipboardCopy").off()
	$(".clipboardCopy").click(() => clipboardCopy(window.location.toString()))

	if (isUpdating) $(".finishUpload h1").text(jsStr["LIST_UPDATED"][LANG])

	$(".listLink").val(window.location.toString().split("//")[1])
	sessionStorage.removeItem("listUpload")
}

function hideFinishUpload() {
	$(".dragonUpload").css("top", "-50em")
	$(".finishUpload").fadeOut(100);
	$("#popupBG").css("opacity", 0)
	setTimeout(() => { $("#popupBG").hide() }, 100);
}

function hideShare() {
	$("#shareTools").fadeOut(100);
	$("#popupBG").css("opacity", 0)
	setTimeout(() => { $("#popupBG").hide() }, 100);
}

function showJumpTo() {
	$("#popupBG").show()
	$("#popupBG").css("opacity", 1)
	$(".jumpDialog").fadeIn(100);
	$(".levelPickerContainer").empty();

	// Show nothing if on an unfinished guessing list
	if (boards.diffGuesser != undefined && boards.diffGuesser[0] && $(".box").length != getListLen(boards)) {
		$(".levelPickerContainer").append(`
		<div class="noSaves">
			<img src="./images/guessSkip.svg">
			<p class="uploadText">${jsStr["MAKEGUESSES"][LANG]}</p>
		</div>
		`)
		return
	}

	let ind = 1;
	Object.values(boards).slice(0, getListLen(boards)).forEach(pos => {
		let creator = pos.creator;
		if (typeof creator == "object") creator = "(Collab)"

		$(".levelPickerContainer").append(`<div class="roleBubble button" for="${ind}" style="background:${pos.color};" id="favBubble">#${ind} ${pos.levelName} - ${creator}</div>`)
		$(".levelPickerContainer:last-child").on("click", (k) => {
			hideJumpTo();
			if ($(".boards").css("display") == "none") listList()
			$(".box")[$(k.target).attr("for") - 2].scrollIntoView();
		})
		ind++
	});
}
function hideJumpTo() {
	$(".jumpDialog").fadeOut(100);
	$("#popupBG").css("opacity", 0)
	setTimeout(() => { $("#popupBG").hide() }, 100);
}

function descriptionShowAll() {
	if ($("#listDescription").attr("data-open") == "0") {
		$("#listDescription").css("--gradEnabled", "none")
		$("#listDescription").css("height", $("#listDescription")[0].scrollHeight+10+"px")
		$("#showMore > img").css("transform", "scaleY(-1)")
		$("#listDescription").attr("data-open", "1")
	}
	else {		
		$("#listDescription").css("--gradEnabled", "")
		$("#listDescription").css("height", "")
		$("#showMore > img").css("transform", "scaleY(1)")
		$("#listDescription").attr("data-open", "0")
	}
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
		$(container).after(`<p style="margin:0 1vw"><img class="stats" src="images/faces/8.webp">${user.demons} </p>`)
		$(container).after(`<p style="margin:0 1vw"><img class="stats" src="images/star.webp">${user.stars} </p>`)
	})

	await k.target.remove()
}

function showCollabStats(id) {
	if (window.location.hash == "#editor") boards = levelList
	$("#popupBG").css("background", "#00000087")
	$("#popupBG").css("opacity", 1)
	setTimeout(() => { $("#popupBG").show() }, 100);

	let level = JSON.parse(JSON.stringify(boards[id]["creator"]))
	let names = [jsStr["YT_CHAN"][LANG], jsStr["TW_PROF"][LANG], jsStr["TW_CHAN"][LANG], jsStr["DC_SERV"][LANG], jsStr["CUST_LINK"][LANG]];
	let imgs = ["youtube", "twitter", "twitch", "discord", "cust"];

	let cardCol = boards[id]["color"];
	let cardGradient = $(".box").eq(id - 1).css("background-image");
	let dark = HEXtoRGB(cardCol, 40)
	let extraDark = HEXtoRGB(cardCol, 80)

	$(".collabViewer .collabTTitle").text(`- ${boards[id].levelName} -`);
	$(".collabViewer").css("background-image", cardGradient);
	$(".collabViewer .collabHead").css("background-color", `rgb(${dark.join(",")})`)
	$(".collabViewer").css("border-color", `rgb(${dark.join(",")})`)
	$(".collabViewer .collabHead").css("background-color", `hsl(${getHueFromHEX(cardCol)},40.7%,54%)`)
	$(".collabViewer .collabDIV").css("background-color", `hsl(${getHueFromHEX(cardCol)},40.7%,34%)`)

	$(".collabViewer").fadeIn(50);

	$(".statsCreators").html("<tr style='visibility: collapse;'><th style='width: 35%'></th><th style='width: 20%'></th><th></th></tr>") // Reset table
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
					discordTag = `<p class="uploadText" style="color:#7ABFC5;margin:0 0.7em; font-size: var(--miniFont)">${creators.socials[soc][1]}</p>`
				else {
					socialTags += `<img onclick="openSocLink('${creators.socials[soc][1]}')" title="${names[creators.socials[soc][0]]}"
									style="width: 2em;" class="button" src="images/${imgs[creators.socials[soc][0]]}.webp">`
				}
			}

			let icon = `icon=${creators.verified[0]}&col1=${creators.verified[1]}&col2=${creators.verified[2]}&glow=${creators.verified[3]}&noUser=true`
			$(".statsCreators").append(`<tr class='tableRow' style="background: #0000002e;">
			<td style="display: flex; justify-content: left; align-items: center">
				<img style="width: 2.5em;margin: 0.2em;" src="${DISABLE_GDB}ttps://gdbrowser.com/icon/freedom69?${icon}">
				<div style="text-align:left">
					<p class="memberName" style="margin:0 0.5em; color: ${creators.color}">${creators.name}</p>
					${discordTag}
				</div>
				
			</td>
			<td>${socialTags}</td>
			<td>
				<div class="pStatsContainer">
					<img style="width: 2em;margin: 0.4vw;" src="images/gdbrowser.webp" class="getProfile button" title="${jsStr["SHOW_PROFILE"][LANG]}">
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
					discordTag = `<p class="uploadText" style="color:#7ABFC5;margin-right: 0.2em;"> - ${creators.socials[soc][1]}</p>`
				else {
					socialTags += `<img onclick="openSocLink('${creators.socials[soc][1]}')" title="${names[creators.socials[soc][0]]}"
									style="width: 2em;" class="button" src="images/${imgs[creators.socials[soc][0]]}.webp">`
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

			$(".statsCreators").append(`<tr class='tableRow' style="background: #0000002e;">
			<td colspan="3" style="text-align: left;">
				<img style="width: 2.5em;margin: 0.2em;" src="images/emoji/${randIcon}.webp">
				<p class="memberName" style="color: ${creators.color}; margin: 0 0.5em; display: inline;">${creators.name}</p>${discordTag}
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
	$(".collabViewer").fadeOut(50);

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
			<span class="listLNContainer"><p id="listLevelName">${boards[bIndex]["levelName"]}</p></span>
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
				<div class="listDiffContainer button noMobileResize" style="display: inline-flex">
					<img class="listDiffFace" src="images/faces/1.webp">
				</div>
				<div class="listDiffContainer button noMobileResize" style="display: inline-flex">
					<img class="listDiffFace" src="images/faces/1.webp">
					<img class="listDiffStar" src="images/star.webp">
				</div>
				<div class="listDiffContainer button noMobileResize" style="display: inline-flex">
					<img class="listDiffFace" src="images/faces/1.webp">
					<img class="listDiffRate" src="images/faces/featured.webp">
				</div>
				<div class="listDiffContainer button noMobileResize" style="display: inline-flex">
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
	if (boards[1] == undefined) {
		$(".boards").append("<h2 class='titles' style='margin-top: 4vw'><img src='images/listEmpty.svg' class='listErrors'>" + jsStr["EMPLIST"][LANG] + "</h2>")
		return false
	}

	// If going to favorites, disable guess list
	if (window.location.search.includes("goto") && boards.diffGuesser[0]) boards.diffGuesser = [0, 0, 0]

	// Todo remove ! from line below and somewhere next in the code or whatever
	if (boards.diffGuesser != undefined && boards.diffGuesser[0] && singleLevel == -1) singleLevel = 1

	let amount = singleLevel == -1 ? getListLen(boards) + 1 : singleLevel + 1
	let start = singleLevel == -1 ? 1 : singleLevel

	// Setting page BG from list
	if (Object.keys(boards).indexOf("pageBGcolor") != -1) {
		if (boards["pageBGcolor"] != "#020202") {
			let hue = getHueFromHEX(boards["pageBGcolor"])
			$(":root").css("--normalColor", `hsl(${hue},90.6%,16.7%)`)
			$(":root").css("--siteBackground", boards["pageBGcolor"])
			$(":root").css("--greenGradient", `linear-gradient(9deg, hsl(${hue},23.1%,10.2%), hsl(${hue},90.6%,16.7%))`)
			$("[name='theme-color']").attr("content", HSLtoHEX(hue, "91%", "13%"))
		}
	}
	// Setting title image
	$(":root").css("--listBGgradient", "linear-gradient(0deg, var(--siteBackground), transparent)")
	if (typeof boards["titleImg"] == "string" && boards["titleImg"] != "") $(".titleImage").css("background-image", `url("${boards["titleImg"]}")`);
	else {
		if (!boards["titleImg"][4]) $(":root").css("--listBGgradient", "transparent")
		$(".titleImage").css("background-image", `url("${boards["titleImg"][0]}")`);
		$(".titleImage").css("background-position-y", `${boards["titleImg"][1]}%`);
		$(".titleImage").css("background-position-x", `${["left", "center", "right"][boards["titleImg"][3]]}`);
		$(".titleImage").css("height", `${boards["titleImg"][2]}%`);
	}

	if (!hasLocalStorage()) $(".pin, .edit").remove()
	for (let i = start; i < amount; i++) {
		let bIndex = (i).toString()

		// Empty names
		if (boards[bIndex]["levelName"] == "") boards[bIndex]["levelName"] = jsStr["UNNAMED"][LANG]
		if (boards[bIndex]["creator"] == "") boards[bIndex]["creator"] = jsStr["UNNAMED"][LANG]

		// Removing card buttons
		if (boards[bIndex]["levelID"] == null || !boards[bIndex]["levelID"].match(/^\d+$/g)) { var ID = ["", ""]; }
		else {
			var ID = [`<img src="./images/modGDB.svg" class="button boxLink" onclick="onGDBClick(${boards[bIndex]["levelID"]},${bIndex})" title="${jsStr["GDB_DISP"][LANG]}">`,
			`<img src="./images/modID.svg" class="button boxLink" onclick="onIDCopyClick(${boards[bIndex]["levelID"]},${bIndex})" title="${jsStr["COPY_ID"][LANG]}">`]
		}

		if (boards[bIndex]["video"] == null || boards[bIndex]["video"] == "") { var video = ``; }
		else { var video = `<img src="./images/modYT.svg" class="button boxLink" onclick="onYTClick('${boards[bIndex]["video"]}',${bIndex})" title="${jsStr["DISP_EP"][LANG]}">`; }

		// Shit fix. Colors break sometimes
		let boardFix = fixHEX(boards[bIndex]["color"])
		if (!boardFix) boardFix = randomColor()
		let gradientLighter = HEXtoRGB(boardFix, -60)

		let translucent
		if (boards["translucent"] != undefined && boards["translucent"]) {
			translucent = ["66", ",0.4"]
		}
		else translucent = ["", ""]

		// Glow depending on level position
		var cardBG = `background: linear-gradient(39deg, ${boardFix}${translucent[0]}, rgb(${gradientLighter.join(",")}${translucent[1]}));`;
		if (i == 1) { cardBG += `;box-shadow: 2px 2px 60px ${boardFix};`; }
		if (i == 2) { cardBG += `;box-shadow: 2px 2px 30px ${boardFix};`; }
		if (i == 3) { cardBG += `;box-shadow: 2px 2px 20px ${boardFix};`; }

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

		let hasID = boards[bIndex]["levelID"] == null || boards[bIndex]["levelID"].match(/^\d+$/g) == null
		let preview = LIST_ID == -8 || !hasLocalStorage()

		let favoriteCheck = preview ? false : (hasID ? false : true)
		let currentlyFavedIDs = []

		if (hasLocalStorage()) {
			currentlyFavedIDs = localStorage.getItem("favoriteIDs") == null ? [] : JSON.parse(localStorage.getItem("favoriteIDs"))
		}

		let disableStar = currentlyFavedIDs.includes(boards[bIndex]["levelID"]) ? "disabled" : ""
		let starTitle = currentlyFavedIDs.includes(boards[bIndex]["levelID"]) ? jsStr["FAV_REM"][LANG] : jsStr["FAV_ADD"][LANG]
		let diffIndent = diff == "" ? "0" : "0.5"

		let star = `<img title="${starTitle}" src="images/star.webp" class="button favoriteStar ${disableStar}" onclick="fave($(this), ${bIndex}, ['${listData[0]}','${listData[1]}'])">`
		if (boards.diffGuesser == undefined || (!boards.diffGuesser[0] || isResult)) {
			$(".boards").append(`
				<div class="box" style="${cardBG}" id="${i == 1 ? "toplevel" : ""}">
					<div style="height:0px;">
						${favoriteCheck ? star : ""}
					</div>
					<div class="boxHeader">
						<span class="listLNContainer">${diff}<p id="listLevelName" style="margin-left: ${diffIndent}em;">${boards[bIndex]["levelName"]}</p></span>
						<div class="boxLinksContainer">
							${video}
							${ID[0]}
							${ID[1]}
						</div>
					</div>
	
					${boxCreator(boards[bIndex]["creator"], bIndex, false)}
					<div class="listTagContainer"></div>
				</div>
				`);
		}
		else {
			doDiffGuessing(cardBG, bIndex)
		}

		// Generate tags
		boards[bIndex]["tags"].forEach(tag => {
			let tagName = tag[1] == -1 ? jsStr["TAGS"][LANG][tag[0]] : tag[1]
			tagName = tag[2] == "" ? tagName : `<a class="gamLink" target="_blank" href="${tag[2]}">${tagName}</a>`
			$(".listTagContainer").eq(bIndex - 1).append(`<div class="listTag"><img src="images/badges/${tag[0]}.svg">${tagName}</div>`)
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
	if (LIST_NAME != null) sessionStorage.setItem("listProps", JSON.stringify([LIST_ID, null, listData[2] == "pid", LIST_NAME, LIST_CREATOR]))

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

	$(".box").css("backdrop-filter", "blur(8px)")

	// When clicking a level in saved, scroll to card
	if (window.location.hash.match(/!\d+/g) != null) {
		let gotoHash = parseInt(window.location.hash.slice(1).split("!")[1])
		if ($(".box")[gotoHash - 1] != undefined) $(".box")[gotoHash - 1].scrollIntoView()
	}

	// sadly disable editing old lists :/
	if ($(".listPFP").length > 0) {
		if ($(".listPFP").attr("src").includes("oldPFP")) $(".edit").click(() => openHelp("oldList"))
		else $(".edit").click(() => goToPWD())
	}

	return true
}

function shareDiffResult() {
	let double = (boards.diffGuesser[1] && boards.diffGuesser[2]) ? 2 : 1
	let maxPoints = getListLen(boards) * double

	text = `${LIST_NAME} ${jsStr["BY"][LANG]} ${LIST_CREATOR}\n${diffGuesses.join("")} ${points}/${maxPoints}\n${jsStr["SCORBET"][LANG]}\ngamingas.wz.cz/lofttop10/#${LIST_ID}`
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

	let isLastLevel = $(".box").length + 1 == getListLen(boards)
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
		let maxPoints = getListLen(boards) * double
		let perc = Math.round((points / getListLen(boards)) * 100 / double)

		$(".boards").after(`
		<div class="uploadText uploadBG finishDiffList">
			<h1>${jsStr["LIST_FIN"][LANG]}</h1>
			<div class="graphContainer">
				<div class="graphLine diffRes" style="background-color: rgb(108, 240, 108); text-align: center;">${perc}%</div>
			</div>
			<h4>${jsStr["YOU_GOT"][LANG]} ${points} ${jsStr["OUTTA"][LANG]} ${maxPoints} ${jsStr["POINTS"][LANG]}!</h4>
			<div style="display: flex; gap: 1em;">
				<button class="button niceButton replayList uploadText"><img src="images/replay.svg" style="width: 3em;">${jsStr["PLAY_AGAIN"][LANG]}</button>
				<button class="button niceButton shareDiff uploadText"><img src="images/share.svg" style="width: 3em;">${jsStr["TWIT_SHARE"][LANG]}</button>
			</div>
		</div>
		`)
		$(".shareDiff").click(shareDiffResult)
		$(".replayList").click(replayList)
		$(".finishDiffList")[0].scrollIntoView()
		$(".diffRes").animate({ "width": perc + "%" }, "300")
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

	if (indToRemove[1]) {
		$(".pin > img").attr("src", "images/pin.svg")
		$("#pinBut").text(jsStr["PIN_LIST"][LANG])
		pinnedLists.splice(pinnedLists.indexOf(indToRemove[0]), 1)
	}
	else {
		$(".pin > img").attr("src", "images/unpin.svg")
		$("#pinBut").text(jsStr["UNPIN_LIST"][LANG])
		// [listID, listName, listCreator, listColor, currTime, isGuess]
		let isGuess = boards.diffGuesser != undefined ? boards.diffGuesser[0] : 0
		pinnedLists.push([LIST_ID, LIST_NAME, LIST_CREATOR, boards[1].color, (new Date).getTime(), isGuess])

		if (pinnedLists.length > 5) pinnedLists = pinnedLists.slice(1, 6)
	}

	makeCookie(["pinnedLists", JSON.stringify(pinnedLists)])

	if (isOnHomepage !== false) {
		$("#unpinCard").parents().eq(2).attr("href", "#")
		isOnHomepage.parents().eq(2).remove()
		if ($(".pinnedLists > div").length == 0) {
			$(".pinnedLists").html(`<div class="uploadText" style="color: #f9e582">${jsStr["NOPINNED"][LANG]}</div>`)
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

		th.removeClass("disabled")
	}
	else {
		// levelName, levelCreator, levelID, cardCol, listID, levelName, listPos, timeAdded
		let favoriteArray = [boards[id]["levelName"], creator, boards[id]["levelID"], boards[id]["color"], data[0], data[1], id, new Date().getTime() / 1000]
		currData.push(favoriteArray)
		currIDs.push(boards[id]["levelID"])

		th.addClass("disabled")
	}
	localStorage.setItem("favorites", JSON.stringify(currData))
	localStorage.setItem("favoriteIDs", JSON.stringify(currIDs))
}

let currListIDs = []
function removeFave(remID) {
	if (typeof boards != "undefined" && currListIDs.length == 0) Object.values(boards).forEach(x => currListIDs.push(x.levelID))

	let i = 0
	currentListData["#favoritesContainer"].forEach(x => {
		if (parseInt(x[2]) == remID) {
			currentListData["#favoritesContainer"].splice(i, 1)
		}
		i++
	});

	let faves = JSON.parse(localStorage.getItem("favorites"))
	let faveIDs = JSON.parse(localStorage.getItem("favoriteIDs"))
	let levelIndex = faveIDs.indexOf(remID.toString())

	faves.splice(levelIndex, 1)
	faveIDs.splice(levelIndex, 1)

	localStorage.setItem("favorites", JSON.stringify(faves));
	localStorage.setItem("favoriteIDs", JSON.stringify(faveIDs));

	if (currListIDs.includes(remID.toString())) {
		$(`div.box:nth-child(${2 + currListIDs.indexOf(remID.toString())}) > div:nth-child(1) > img:nth-child(1)`).removeClass("disabled")
	}

	listViewerDrawer(currentListData["#favoritesContainer"], "#favoritesContainer", 1, [0, 0], jsStr["SAVEDLONG"][LANG])
}

const switchLoFList = hash => window.location.hash = hash

// const MAX_ON_PAGE = 4;
async function homeCards(obj, custElement = ".listContainer", previewType = 1, overwriteMax = false, custPagination = 0, reverseList = false) {
	// Do nothing if empty
	if (obj == null || obj == false) return

	if (reverseList) obj = JSON.parse(JSON.stringify(obj)).reverse()

	if ($(`${custElement} > #listPreview,#comBoxHeader`).length == 0 || !SCROLLTYPE) $(custElement).empty();
	if (SCROLLTYPE) $(".page").hide()

	let MAX_ON_PAGE = overwriteMax ? overwriteMax : 4

	obj.slice(MAX_ON_PAGE * custPagination, MAX_ON_PAGE * custPagination + MAX_ON_PAGE)
		.forEach(async object => {
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
					<div style="display: flex; align-items: center; ${previewType == 3 ? 'display: none;' : ''}">
					<img class="button" onclick="removeFave(${object[2]});" id="remFaveBut" src="images/close.svg">
					</div>
					</div>
					`);
			}
			else if ([2, 5].includes(previewType)) { // Recently viewed list / Pinned list
				let lightCol = HEXtoRGB(object[3], -60)
				let darkCol = HEXtoRGB(object[3], 40)

				let dGuesserBadge = ""
				if (object[5] != undefined) {
					dGuesserBadge = object[5] ? "<img src='images/diffGuessSign.svg' class='guessBadge'>" : ""
				}

				let uploadDate = new Date(object[4])
				let preciseTime = `title="${uploadDate.toLocaleDateString()} ${uploadDate.toLocaleTimeString()}"`
				$(custElement).append(`
					<a id="listPreview" class="noMobileResize" href="#${object[0]}" 
						style="background-image: linear-gradient(39deg, rgb(${darkCol.join(",")}), ${object[3]}, rgb(${lightCol.join(",")}));
								border-color: rgb(${darkCol.join(",")}); flex-grow: 1;">
						<div class="listHeader">
						<div class="cInfoContainer">
							<div ${preciseTime} class="viewContainer timeContainer"><img src="images/time.svg"><div>${parseElapsed(Date.now() / 1000 - object[4] / 1000)}</div></div>
						</div>
							<div style="flex-grow: 1;">
								<p class="uploadText" style="margin: 0;">${dGuesserBadge}${object[1]}</p>
								<p class="uploadText" style="font-size: var(--miniFont); margin: 0;">- ${object[2]} -</p>
							</div>
							<div id="pinContainer">
								${previewType == 5 ? `<img src="images/unpin.svg" onclick="pinList('${object[0]}',$(this))" class="button" id="unpinCard">` : ''}
							</div>
						</div>
					</a>
				`);
			}
			else if (previewType == 4) { // Newest lists
				let dGuesserBadge = "";
				if (object.diffGuesser != 0) {
					dGuesserBadge = "<img src='images/diffGuessSign.svg' class='guessBadge'>"
				}

				let level1col = colorFromText(object["name"], [0, 0], [360, 42])
				let lightCol = HEXtoRGB(level1col, -60)
				let darkCol = HEXtoRGB(level1col, 40)

				let uploadDate = new Date(object["timestamp"] * 1000)
				let preciseTime = `title="${uploadDate.toLocaleDateString()} ${uploadDate.toLocaleTimeString()}"`
				let privateBorder = object["hidden"] == 0 ? "" : "border-color: rgba(255, 255, 255, 0.25); border-style: dotted;"
				let link = object["hidden"] == 0 ? object["id"] : object["hidden"]
				let disliked = object["rate_ratio"] < 0 ? ["flex-direction: column-reverse;", "transform: rotate(180deg);"] : ["", ""]
				$(custElement).append(`
				<a id="listPreview" class="noMobileResize" href="#${link}"
					 style="background-image: linear-gradient(39deg, rgb(${darkCol.join(",")}), ${level1col}, rgb(${lightCol.join(",")})); border-color: rgb(${darkCol.join(",")});${privateBorder}">
					<div style="display: flex;gap: 0.7em;">
						<div class="inListRating" style="${disliked[0]}">
							<img src="images/genericRate.svg" style="${disliked[1]}">
							<p class="uploadText" style="margin:-0.1em">${object["rate_ratio"]}</p>
						</div>
						<div class="cInfoContainer">
							<div class="viewContainer"><img src="images/view.svg"><div>${object["views"]}</div></div>
							<div ${preciseTime} class="viewContainer timeContainer"><img src="images/time.svg"><div>${parseElapsed(Date.now() / 1000 - object["timestamp"])}</div></div>
						</div>
						<div>
							<p class="uploadText" style="margin: 0;">${dGuesserBadge}${object["name"]}</p>
							<p class="uploadText" style="font-size: var(--miniFont); margin: 0;">- ${object["creator"]} -</p>
						</div>
					</div>
				</div>
				`);
			}
			else if (previewType == 6) { // Comment
				await getProfilePicture(object.avatar).then(link => object.avatar = link)
				comBox(object, custElement)
			}

		});
}

function getProfilePicture(link) {
	return new Promise(loaded => {
		let loadPFP = new Image()
		loadPFP.src = link
		loadPFP.addEventListener("error", () => loaded(`images/defaultPFP.webp`))
		loadPFP.addEventListener("load", () => loaded(link))
	})
}

async function makeHP() {
	// cookies are disabled
	if (!navigator.cookieEnabled) {
		$(".homeLoginInfo > img").attr("src", "images/disCookies.svg")
		$(".homeLoginInfo > label").text(jsStr["NO_COCK"][LANG])
		$(".homeLoginInfo > div").remove()
		$(".homepageBigButton").eq(0).remove()
		$(".pinnedLists + li, .uploadedLists + li, .recentlyViewed + li, .savedLists + li").remove()
		$(".pinnedLists, .uploadedLists, .recentlyViewed, .savedLists").remove()
		$(".loginBut").remove()
	}


	let hpData = { "recViewed": null, "pinned": null, "favPicks": null, "newest": null };

	let recentlyViewed = JSON.parse(decodeURIComponent(getCookie("recentlyViewed")))
	if (recentlyViewed !== null) hpData.recViewed = recentlyViewed

	let pinned = JSON.parse(decodeURIComponent(getCookie("pinnedLists")))
	if (pinned !== null && pinned.length > 0) hpData.pinned = pinned


	let savedLists = null
	if (hasLocalStorage()) {
		savedLists = JSON.parse(decodeURIComponent(localStorage.getItem("favorites")))
		if (localStorage.getItem("userInfo") != null) $(".homeLoginInfo").remove()
	}

	if (savedLists != null && savedLists !== false && savedLists.length > 0) {
		let randomized = []
		let randIndexes = []
		let savedAm = savedLists.length > 4 ? 5 : savedLists.length

		while (randomized.length < savedAm) {
			let randNum = parseInt(Math.random() * savedLists.length)

			if (!randIndexes.includes(randNum)) {
				randomized.push(savedLists[randNum]);
				randIndexes.push(randNum)
			}
		}

		hpData.favPicks = randomized
	}

	homeCards(hpData.recViewed, ".recentlyViewed", 2)
	homeCards(hpData.pinned, ".pinnedLists", 5, 5, 0, true)
	homeCards(hpData.favPicks, ".savedLists", 3)

	$.get("./php/getLists.php?homepage=1", data => {
		changeUsernames(data, 4)
		homeCards(data[0], ".newestLists", 4)
	})
	$.get("./php/getLists.php?homeUser", data => {
		changeUsernames(data, 4)
		homeCards(data[0], ".uploadedLists", 4)
	})

	$(".hpSearchButton").click(e => {
		switchLoFList('#browse!' + $("#homepageSearch").val())
	})
}

function parseElapsed(secs) {
	if (secs < 60) return Math.round(secs) + jsStr["SHORTTIME"][LANG][0]; //s - seconds
	else if (secs < 3600) return Math.round(secs / 60) + jsStr["SHORTTIME"][LANG][1]; //m - minutes
	else if (secs < 86400) return Math.round(secs / 3600) + jsStr["SHORTTIME"][LANG][2]; //h - hours
	else if (secs < 604800) return Math.round(secs / 86400) + jsStr["SHORTTIME"][LANG][3]; //d - days
	else if (secs < 1892160000) return Math.round(secs / 604800) + jsStr["SHORTTIME"][LANG][4]; //w - weeks
	else return Math.round(secs / 1892160000) + jsStr["SHORTTIME"][LANG][5]; //y - years
}

function clearViewed() {
	if ($(".recentlyViewed").length == 0) return
	$(".recentlyViewed").empty()
	makeCookie(["recentlyViewed", "[]"])
	$(".recentlyViewed").html(`<div class="uploadText" style="color: #f9e582">${jsStr["NOVIEWED"][LANG]}</div>`)
}

var listData = "";
const repeatBG = [false, true, false]
var boards

var rot = 1
async function loadSite() {
	let hash = window.location.hash.slice(1)

	LIST_CREATOR = null
	LIST_NAME = null
	LIST_ID = null
	originalListData = []
	currentListData = []
	page = {}
	levelList = JSON.parse(JSON.stringify(DEFAULT_LEVELLIST))
	$("window").off("beforeunload")
	loadingLists = false

	$(".logo").css("transform", `rotate(360deg)`)
	let spinning = setInterval(() => { rot += 1; $(".logo").css("transform", `rotate(${rot * 360}deg)`) }, 1000)
	$("#app").empty()

	$(":root").css("--normalColor", "var(--defaultColor)")
	$(":root").css("--siteBackground", "var(--defaultBackground)")
	if ($(":root").css("--greenGradient") != $(":root").css("--defaultGradient")) {
		$("nav").css("animation-name", "fadeBlack")
		$("[name='theme-color']").attr("content", $(":root").css("--normalColor"))
		setTimeout(() => $(":root").css("--greenGradient", "var(--defaultGradient)"), 125);
		setTimeout(() => $("nav").css("animation-name", "none"), 250);
	}

	if (hash == "") {
		$("title").text(`${jsStr["GDLISTS"][LANG]}`)
		await $.get("./parts/homepage.html", site => {
			$("#app").html(translateDoc(site, "homepage"))
		})
	}

	switch (true) {
		case /(editor|update)/.test(hash):
			$("title").text(`Editor | ${jsStr["GDLISTS"][LANG]}`)
			await $.get("./parts/editor.html", site => {
				$("#app").html(translateDoc(site, "editor"))
				makeEditor(hash != "editor")
				setupCollabTools()
			})
			break;

		case /saved/.test(hash):
			$("title").text(`${jsStr["SAVED"][LANG]} | ${jsStr["GDLISTS"][LANG]}`)
			$("#app").append("<div id='favoritesContainer'></div>")

			await $.get("./parts/listBrowser.html", data => {
				$("#favoritesContainer").append(translateDoc(data, "listBrowser"))
			})
			let favesData = null
			if (hasLocalStorage()) favesData = JSON.parse(localStorage.getItem("favorites"))

			if (favesData == null) favesData = []
			listViewerDrawer(favesData, "#favoritesContainer", 1, [0, 0], jsStr["SAVEDLONG"][LANG])

			break;

		case /browse|uploads/.test(hash):
			$("title").text(`${jsStr["COMMUNITY"][LANG]} | ${jsStr["GDLISTS"][LANG]}`)
			await $.get("./parts/listBrowser.html", site => {
				$("#app").append("<div id='communityContainer'></div>")
				$("#communityContainer").html(translateDoc(site, "listBrowser"))
				makeBrowser()
			})
			break;
		case /login/.test(hash):
			login(2)
			$("title").text(`${jsStr["GDLISTS"][LANG]}`)
			await $.get("./parts/homepage.html", site => {
				$("#app").append(translateDoc(site, "homepage"))
				makeHP();
				makeCookie(["logindata", ""], 1)
			})
			break;

		default:
			if (hash == "") { makeHP(); break };
			await $.get("./parts/listViewer.html", data => {
				$("#app").html(translateDoc(data, "listViewer"))
				let listObject;
				if (hash.match(/[A-z]/) == null) listObject = { "type": "id", "id": hash.match(/\d+/)[0] }
				else if (hash == "random") listObject = { "type": "random", "id": 1 }
				else listObject = { "type": "pid", "id": hash }

				LIST_ID = listObject.id
				lists(listObject)
			})
			break;
	}
	clearInterval(spinning)
	rot = 1
	$("#app").fadeIn(100)
}

$(async function () {
	$.get("./parts/navbar.html", navbar => {
		$("nav").html(translateDoc(navbar, "navbar"))

		try {
			let userInfo = null
			if (hasLocalStorage()) userInfo = JSON.parse(localStorage.getItem("userInfo"))
			else {
				$(".loginBut").remove()
				$(".menuPicker").children().eq(0).remove()
				$(".menuPicker").children().eq(1).remove()
				$(".mobilePicker").children().eq(0).remove()
				$(".mobilePicker").children().eq(1).remove()
			}

			if (userInfo != null) {
				setPFP(userInfo)
			}
			else {
				$(".pfpPlaceholder").remove()
				$(".userIcon").attr("src", "images/user.svg") // smazat placeholder, dat kliknuti
				$(".userIcon").addClass("button")
				$(".userIcon").click(openSettings)
			}
		} catch (error) {
			localStorage.removeItem("userInfo")
			$(".userIcon").addClass("button")
			$(".userIcon").attr("src", "images/user.svg")
		}

		// Setting mobile picker in navbar to curr site name
		if (window.location.href.includes("browse")) $(".mobilePicker > a")[1].style.filter = "var(--lightHighlight)"
		if (window.location.href.includes("editor")) $(".mobilePicker > a")[0].style.filter = "var(--lightHighlight)"

		
		$(".settingsDropdown:eq(0)").on("change", () => {
			let scrollType = $(".settingsDropdown:eq(0)")[0].selectedIndex ? 1 : 0
			makeCookie(["scrolling", scrollType])
			window.location.reload();
		})
		if (!getCookie("scrolling")) makeCookie(["scrolling", 0])
		$($(".settingsDropdown:eq(0) > option")[parseInt(getCookie("scrolling"))]).attr("selected", true)
		
		$(".settingsDropdown:eq(1)").on("change", () => {
			let switchLang = $(".settingsDropdown:eq(1)").val() == jsStr["CZECH"][LANG] ? 0 : 1
			makeCookie(["lang", switchLang])
			window.location.reload();
		})
		var currLang = getCookie("lang");
		if (!currLang) {
			let getLang = navigator.language;
			if (["cs", "sk"].includes(getLang)) { currLang = 0; }
			else { currLang = 1; }
			
			makeCookie(["lang", currLang])
		}
		$($(".settingsDropdown:eq(1) > option")[LANG]).attr("selected", true)
		
		$("footer").css("opacity", 1)
	})
	
	SCROLLTYPE = parseInt(getCookie("scrolling"))
	LANG = parseInt(getCookie("lang"));
	$('img').on('dragstart', function (event) { event.preventDefault(); });

	window.addEventListener("hashchange", loadSite)
	checkAccount()
	loadSite()


	// Hiding header and showing scroll to top button
	$("body").on("scroll", () => {
		if (document.body.scrollTop > 150) $(".scrollToTop").css("opacity", 1)
		else $(".scrollToTop").css("opacity", 0)

		if ($("body").scrollTop()/($("body")[0].scrollHeight - $("body").outerHeight()) > 0.9 && !loadingLists && SCROLLTYPE) {
			let pages = page[`#${$(".customLists").parent().attr("id")}`]
			if (pages[1] - 1 > pages[0]) $(".pageBut").eq(1).click()
			else {
				loadingLists = true
			}
		}
	})
})


function checkAccount() {
	$.get("./php/accounts.php?check", loginValid => {
		if (loginValid != -1 && !loginValid) {
			logout()
		}
	})
}
let loadingLists = false
function logout() {
	localStorage.removeItem("userInfo")
	window.location.reload()
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

		$("title").html(`${jsStr["PREVIEW_L"][LANG]} | ${jsStr["GDLISTS"][LANG]}`)
		LIST_NAME = null
		LIST_CREATOR = "person"
		if (generateList(boards, [LIST_ID, LIST_NAME])) {
			$("#crown").before(`<h2 class="titles" style="margin-top: 4vw">(${jsStr["PREVIEW_L"][LANG]})</h2>`);
		}
		return
	}
	else {
		$.get(`./php/getLists.php?${list.type}=${list.id}`, async data => {
			if ([1, 2].includes(data)) {
				$(".boards").append("<h2 class='titles'><img src='images/listError.svg' class='listErrors'>" + jsStr["DEADLIST"][LANG] + "</h2>")
				$("title").html(`${jsStr["NONEXISTENT_L"][LANG]} | ${jsStr["GDLISTS"][LANG]}`)
				$(".listInfo").remove();
				return
			}
			else {
				LIST_NAME = data[0]["name"]
				LIST_CREATOR = data[0]["creator"].length == 0 ? data[1][0]["username"] : data[0]["creator"]

				boards = data[0]["data"];
				let listCreator = data[0]["uid"] == -1 ? data[0]["creator"] : data[1][0]["username"]
				let profilePic = "images/oldPFP.png"
				if (data[1].length > 0) { // Old user, no user data
					let pfpLink = `https://cdn.discordapp.com/avatars/${data[1][0].discord_id}/${data[1][0].avatar_hash}.png`
					await getProfilePicture(pfpLink).then(link => profilePic = link)
				}

				$("#listName").text(data[0]["name"])
				$("#listCreator").text(listCreator)
				$(".listPFP").attr("src", profilePic)

				$("title").html(`${data[0]["name"]} | ${jsStr["GDLISTS"][LANG]}`)

				let isHidden = data[0]["hidden"] != 0
				LIST_ID = !isHidden ? parseInt(data[0]["id"]) : data[0]["hidden"]
				$("#listViews").text(data[0]["views"])
				let nT = new Date(data[0]["timestamp"] * 1000);
				$("#listDate").text(`${nT.toLocaleDateString()}`)
				
				$("#commAmount").text(data[0]["commAmount"])
				$("#listDescription").html(parseFormatting(boards.description ?? `<div id="noDesc">Seznam nemá popisek</div>`))
				$("#listDescription a").click(redirectWarn)
				if ($("#listDescription")[0].clientHeight == $("#listDescription")[0].scrollHeight) { // No scroll
					$("#listDescription").css("--gradEnabled", "none")
					$("#showMore").hide()
				}

				$("#rateRatio").on("mouseover", () => $(".rateButton > div").css("opacity", "0.7"))
				$("#rateRatio").on("mouseout", () => $(".rateButton > div").css("opacity", "0"))

				generateList(boards, [LIST_ID, data[0]["name"], isHidden ? "pid" : "id"]);
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
				$(".listOptionsContainer .pin div").text(jsStr["UNPIN_LIST"][LANG])
				$(".pin").attr("title", jsStr["UNPIN_LIST"][LANG])
			}
		});
	}

	// Box appear animation
	$(".box").css("transform", "translateX(-100vw)");
	$(".box").css("transition", "transform 0.3s cubic-bezier(0.075, 0.82, 0.165, 1)");

	if (boards != undefined) {
		let index = 0
		let boxAppear = setInterval(() => {
			if (index == getListLen(boards)) { clearInterval(boxAppear) }
			if ($(".box")[index] != undefined) $(".box")[index].style.transform = "none"
			index++
		}, 100);
	}

	// Show upload finish dialog
	let uploadFinish = sessionStorage.getItem("listUpload")
	if (uploadFinish != null) {
		showFinishUpload(JSON.parse(uploadFinish)[1])
	}

	// Load ratings
	$.get("php/rateAction.php", { "id": LIST_ID }, rates => {
		// 0 - likes, 1 - dislikes

		$("#rateRatio").removeClass("unloadedRate")
		$("#rateRatio").text(rates[0]-rates[1])
		$("#likes").text(rates[0])
		$("#dislikes").text(rates[1])

		$("#likeBut").click(rateList)
		$("#dislikeBut").click(rateList)

		if (rates[2] == -2) { // Not logged in
			return $(".rateButton").remove()
		}

		discolorRatings(rates[0], rates[1])
		if (rates[2] >= 0) colorRatings(rates[2]) // colorize if has rated
	})
}

function goToPWD() { hideFinishUpload(); window.location.hash = `#update` }

let page = {} // [page, maxPage]
function pageSwitch(num, data, parent, ctype) {
	page[parent][0] = clamp(num, 0, page[parent][1] - 1)

	// Without redrawing, only page scrollbar is set
	listViewerDrawer(data, parent, ctype)

	if (page[parent][0] < 3) { // Sets first 4 page numbers
		for (let i = 0; i < 5; i++) {
			$(".pageYes").eq(i).text(clamp(i + 1, 0, page[parent][1]))
		}
	}
	else if (page[parent][0] + 4 > page[parent][1]) { // Sets final pages
		for (let i = 0; i < 6; i++) {
			$(".pageYes").eq(5 - i).text(clamp(page[parent][1] - i, 0, page[parent][1]))
		}
	}
	else if (page[parent][0]) {
		for (let i = 0; i < 5; i++) {
			$(".pageYes").eq(i).text(clamp(num - 1 + i, 0, page[parent][1]))
		}
	}
	$(".pageYes").off("click")
	Object.values($(".pageYes")).slice(0, -2).forEach(el => {
		$(el).click(() => pageSwitch($(el).text() - 1, currentListData[parent], parent, ctype, 1))
	})


	$(".pageYes").attr("id", "")
	Object.values($(".pageYes")).slice(0, -2).forEach(x => {
		if ($(x).text() == page[parent][0] + 1) $(x).attr("id", "pgSelected")
	})
	loadingLists = false
}

async function onlinePageSwitch(num, online, parent, ctype) {
	loadingLists = true
	online.page = clamp(num, 0, page[parent][1] - 1)

	// Without redrawing, only page scrollbar is set
	await listOnlineViewerDrawer(online, parent, ctype)

	if (page[parent][0] < 3) { // Sets first 4 page numbers
		for (let i = 0; i < 5; i++) {
			$(".pageYes").eq(i).text(clamp(i + 1, 0, page[parent][1]))
		}
	}
	else if (page[parent][0] + 4 > page[parent][1]) { // Sets final pages
		for (let i = 0; i < 6; i++) {
			$(".pageYes").eq(5 - i).text(clamp(page[parent][1] - i, 0, page[parent][1]))
		}
	}
	else if (page[parent][0]) {
		for (let i = 0; i < 5; i++) {
			$(".pageYes").eq(i).text(clamp(num - 1 + i, 0, page[parent][1]))
		}
	}
	$(".pageYes").off("click")
	Object.values($(".pageYes")).slice(0, -2).forEach(el => {
		$(el).click(() => onlinePageSwitch($(el).text() - 1, online, parent, ctype))
	})


	$(".pageYes").attr("id", "")
	Object.values($(".pageYes")).slice(0, -2).forEach(x => {
		if ($(x).text() == page[parent][0] + 1) $(x).attr("id", "pgSelected")
	})
	loadingLists = false
}

function search(data, parent, ctype) {
	loadingLists = false
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

let originalListData = {}
let currentListData = {}
function listViewerDrawer(data, parent, cardType, disableControls = [0, 0], title = "", addElements = []) {
	let LIST_ONPAGE = 10

	// Store original list data
	if (originalListData[parent] == undefined) {
		originalListData[parent] = data; currentListData[parent] = data; originalListData[parent].init = true
		page[parent] = [0, 0]
	}

	// Clear old cards
	if (!SCROLLTYPE) $(`${parent} .customLists`).empty();

	// We want to sort from newest to oldest by default
	let reversed = JSON.parse(JSON.stringify(data)).reverse();

	// Set max page text
	let revLen = Object.keys(reversed).length
	let listAmount = revLen == 0 ? 1 : revLen
	page[parent][1] = Math.ceil(listAmount / LIST_ONPAGE);

	if (originalListData[parent].init) {
		// List search button action
		$(`${parent} .doSearch`).click(() => {
			search(originalListData[parent], parent, cardType)
		})

		// Typing in a page (TODO: Add object as page)
		$(`${parent} #pageSwitcher`).on("change", function () {
			if (!isNaN(parseInt($(this).val()))) {
				pageSwitch(parseInt($(this).val()) - page[parent][0] - 1, currentListData[parent], parent, cardType, 1)
			}
		})

		if (originalListData[parent].length == 0) {
			$(`${parent} .page`).hide()
			$(`${parent} .search`).hide()
		}
		else {
			// Page -1 (left) action
			$(`${parent} .pageBut`).eq(0).click(() => {
				pageSwitch(page[parent][0] - 1, currentListData[parent], parent, cardType, 1)
			})
			// Page +1 (right) action
			$(`${parent} .pageBut`).eq(1).click(() => {
				pageSwitch(page[parent][0] + 1, currentListData[parent], parent, cardType, 1)
			})
		}

		// Remove disabled controls
		for (let i = 0; i < disableControls.length; i++) { if (disableControls[i]) $(`${parent} .browserTools`).children().eq(i).remove() }

		// Sets title for browser
		if (title == "") $(`${parent} .titles`).remove()
		else $(`${parent} .titles`).text(title)

		// Adds additional elements
		addElements.forEach(el => {
			$(`${parent} .titleTools`).append(el)
		});

		delete originalListData[parent].init
	}

	// Draw pages
	if (Object.keys(data).length > 0) {
		$(`${parent} .page`).show()
		$(`${parent} .search`).show()
		$(".page > *:not(.pageBut)").remove()
		let keepSize = (page[parent][0] < 3 || page[parent][1] - page[parent][0] < 4) ? 6 : 5
		for (let i = 0; i < clamp(page[parent][1], 0, keepSize); i++) {
			$(".pageYes:last()").click(() => pageSwitch(i - 1, currentListData[parent], parent, cardType, 1))
			$(".pageBut").eq(1).before(`<div class="uploadText pageYes button">${i + 1}</div>`)
		}
		$(".pageYes:last()").click(() => pageSwitch(page[parent][1] - 1, currentListData[parent], parent, cardType, 1))

		// Add jump to last page
		if (page[parent][1] > 6 && page[parent][0] + 3 < page[parent][1]) {
			$(".pageBut").eq(1).before(`<hr class="verticalSplitter">`)
			$(".pageBut").eq(1).before(`<div class="uploadText pageYes button">${page[parent][1]}</div>`)
			$(".pageYes:last()").click(() => pageSwitch(page[parent][1] - 1, currentListData[parent], parent, cardType, 1))
		}

		// Add jump to first page
		if (page[parent][0] > 2 && page[parent][1] > 6) {
			$(".pageBut").eq(0).after(`<div class="uploadText pageFirst button">1</div>`)
			$(".pageFirst").after(`<hr class="verticalSplitter">`)
			$(".pageFirst").click(() => pageSwitch(0, currentListData[parent], parent, cardType, 1))
		}
		$(`.pageYes:contains(${page[parent][0] + 1})`).attr("id", "pgSelected")
	}

	// Draw Cards
	if (Object.keys(data).length > 0) {
		homeCards(data, `${parent} .customLists`, cardType, LIST_ONPAGE, page[parent][0])
	}
	else {
		// No favorites
		if (cardType == 1) $(`${parent} .customLists`).append(`<p class="uploadText" style="text-align: center; color: #f9e582">${jsStr["NOFAVED"][LANG]}</p>`);
		// No comments
		else if (cardType == 6) $(`${parent} .customLists`).append(`<p class="uploadText" style="text-align: center;">${jsStr["NOCOMM"][LANG]}</p>`);
		// Object is empty
		else $(`${parent} .customLists`).append(`<p align=center>${jsStr['NO_RES'][LANG]}</p>`);
	}
}

async function listOnlineViewerDrawer(online, parent, cardType, disableControls = [0, 0], title = "", addElements = []) {
	let data = [];
	let init = 0;
	await $.get("php/" + online["path"].match(/[A-z]*\.php/), online, response => {
		if (response == 3) response = [[], [], online]
		originalListData[parent] = response; currentListData[parent] = response;
		page[parent] = [parseInt(response[2].page), response[2].maxPage]
		data = response
		if (online.startID == 999999) { init = 1; online.startID = response[2].startID }
	})

	// List search button action
	$(`${parent} .doSearch`).off("click")
	$(`${parent} .doSearch`).one("click", () => {
		online.searchQuery = $(`${parent} #searchBar`).val() // TODO: FIX SEARCHING!!!!!!!!
		online.startID = 999998
		online.page = 0
		$(`${parent} > .customLists`).empty()
		listOnlineViewerDrawer(online, parent, cardType, disableControls, title, addElements)
	})

	$(`${parent} .pageBut`).off("click")
	$(`${parent} .pageBut`).eq(0).one("click", () => onlinePageSwitch(online.page - 1, online, parent, cardType)) // Page -1 (left) action
	$(`${parent} .pageBut`).eq(1).one("click", () => onlinePageSwitch(online.page + 1, online, parent, cardType)) // Page +1 (right) action

	if (init) {
		if (data[0].length == 0) {
			$(`${parent} .page`).hide()
			$(`${parent} .search`).hide()
		}

		// Remove disabled controls
		for (let i = 0; i < disableControls.length; i++) { if (disableControls[i]) $(`${parent} .browserTools`).children().eq(i).remove() }

		// Sets title for browser
		if (title == "") $(`${parent} .titles`).remove()
		else $(`${parent} .titles`).text(title)

		// Adds additional elements
		addElements.forEach(el => {
			$(`${parent} .titleTools`).append(el)
		});
	}

	// Draw pages
	if (data[0].length > 0) {
		$(`${parent} .page`).show()
		$(`${parent} .search`).show()
		$(".page > *:not(.pageBut)").remove()
		let keepSize = (page[parent][0] < 3 || page[parent][1] - page[parent][0] < 4) ? 6 : 5
		for (let i = 0; i < clamp(page[parent][1], 0, keepSize); i++) {
			$(".pageYes:last()").click(() => onlinePageSwitch(i - 1, online, parent, cardType))
			$(".pageBut").eq(1).before(`<div class="uploadText pageYes button">${i + 1}</div>`)
		}
		$(".pageYes:last()").click(() => onlinePageSwitch(page[parent][1] - 1, online, parent, cardType))

		// Add jump to last page
		if (page[parent][1] > 6 && page[parent][0] + 3 < page[parent][1]) {
			$(".pageBut").eq(1).before(`<hr class="verticalSplitter">`)
			$(".pageBut").eq(1).before(`<div class="uploadText pageYes button">${page[parent][1]}</div>`)
			$(".pageYes:last()").click(() => onlinePageSwitch(page[parent][1] - 1, online, parent, cardType))
		}

		// Add jump to first page
		if (page[parent][0] > 2 && page[parent][1] > 6) {
			$(".pageBut").eq(0).after(`<div class="uploadText pageFirst button">1</div>`)
			$(".pageFirst").after(`<hr class="verticalSplitter">`)
			$(".pageFirst").click(() => onlinePageSwitch(0, online, parent, cardType))
		}
		$(`.pageYes:contains(${page[parent][0] + 1})`).attr("id", "pgSelected")
	}

	// Draw Cards
	if (data[0].length > 0) {
		changeUsernames(data, cardType)
		homeCards(data[0], `${parent} .customLists`, cardType, online.fetchAmount)
	}
	else {
		// No favorites
		if (cardType == 1) $(`${parent} .customLists`).append(`<p class="uploadText" style="text-align: center; color: #f9e582">${jsStr["NOFAVED"][LANG]}</p>`);
		// No comments
		else if (cardType == 6) $(`${parent} .customLists`).append(`<p class="uploadText" style="text-align: center;">${jsStr["NOCOMM"][LANG]}</p>`);
		// Object is empty
		else $(`${parent} .customLists`).append(`<p align=center>${jsStr['NO_RES'][LANG]}</p>`);
	}
	return online
	// Draw pages
}

function doSearch(e) {
	e.preventDefault()
}

async function login(part) {
	if (part == 1) { // Discord popup
		window.location.replace(`https://discord.com/api/oauth2/authorize?client_id=989511463360139264&redirect_uri=${encodeURIComponent(window.location.origin + window.location.pathname + "php/accounts.php")}&response_type=code&scope=identify`)
	}
	else if (part == 2) {
		let loginData = getCookie("logindata")
		if (loginData) {
			$("#popupBG").show()
			$("#popupBG").css("opacity", 1)

			loginData = JSON.parse(decodeURIComponent(loginData))
			setPFP(loginData)
			$("#app").prepend(`
		<div class="uploadBG uploadText" id="loginPopup">
			<img id="loginPFP">
			<h2>${jsStr["WELCOME1"][LANG]}<cy>${loginData[0]}</cy>!</h2>
			<h4>${jsStr["WELCOME2"][LANG]}</h4>
			<button class="button eventButton uploadText" onclick="hideLoginPopup()">Ok!</button>
		</div>
			`)

			await getProfilePicture(`https://cdn.discordapp.com/avatars/${loginData[1]}/${loginData[2]}.png`).then(link => $("#loginPFP").attr("src", link))
			localStorage.setItem("userInfo", JSON.stringify(loginData))
		}
	}
}

function hideLoginPopup() {
	$("#popupBG").css("opacity", 0)
	setTimeout(() => { $("#popupBG").hide() }, 100);
	$("#loginPopup").fadeOut(100, () => $("#loginPopup").remove())
}

let setOpened = false
function openSettings() {
	$('.settingsMenu').fadeToggle(100)
	if (!setOpened) {
		let sPos = $(".settingsMenu").position()
		let sWidth = $(".settingsMenu").width()
		$("#userLoggedIn").css("top", `calc(${sPos.top}px - 1em)`)
		$("#userLoggedIn").css("right", `calc(${sWidth / 2}px + 0.75em - 1em)`)
		$("#userLoggedIn").css("transform", "scale(2)")
		$("#userLoggedIn").css("border", "var(--siteBackground) 2px solid")
	}
	else {
		$("#userLoggedIn").css("top", `0`)
		$("#userLoggedIn").css("right", `0`)
		$("#userLoggedIn").css("transform", "scale(1)")
		$("#userLoggedIn").css("border", "")
	}
	// $("#userLoggedIn").toggleClass("button")
	setOpened = !setOpened
}

async function setPFP(userInfo) {
	$(".loginBut").remove()
	$(".logContainer").show()
	$(".setLoginText").text(userInfo[0])
	$(".setLoginText").after(`
	<div onclick="logout()" class="button eventButton uploadText settingsButton noMobileResize"><img src="images/logout.svg">${jsStr["LOGOUT"][LANG]}</div>
	`)

	$(".userIcon").attr("id", "userLoggedIn")
	await getProfilePicture(`https://cdn.discordapp.com/avatars/${userInfo[1]}/${userInfo[2]}.png`).then(link => $(".userIcon").attr("src", link))
}

function colorRatings(like) {
	if (like) {
		$("#likeBut").css("background", "radial-gradient(#20c68f, rgb(23, 81, 35))")
		$("#likeBut").css("box-shadow", "#20c68f80 0px 0px 29px")

		$(":root").css("--likeGlow", "brightness(6)")

		$("#dislikeBut").css("background", "#1c0505")
	}
	else {
		$("#dislikeBut").css("background", "radial-gradient(rgb(72, 0, 24), rgb(179, 7, 7))")
		$("#dislikeBut").css("box-shadow", "#ff0c00c9 0px 0px 29px")
		$(":root").css("--dislikeGlow", "brightness(6)")

		$("#likeBut").css("background", "#051c0c")
	}

}
function discolorRatings(l, d) {
	$("#likeBut").css("background", "")
	$("#likeBut").css("box-shadow", "")
	$("#dislikeBut").css("background", "")
	$("#dislikeBut").css("box-shadow", "")
	$(":root").css("--likeGlow", "none")
	$(":root").css("--dislikeGlow", "none")

	// make like bar
	if (l + d == 0) $(".likeFill").css("width", "") // reset bar, this would result in dividing by zero :O
	$(".likeFill").css("width", `${l / (l + d) * 100}%`)
}

function rateList(el) {
	let smashedLike = 0 | el.target.id == "likeBut"
	let postArray = { "id": LIST_ID, "action": smashedLike }
	$.post("php/rateAction.php", postArray, data => {
		$("#likes").text(data.ratings[0])
		$("#dislikes").text(data.ratings[1])
		$("#rateRatio").text(data.ratings[0] - data.ratings[1])

		discolorRatings(data.ratings[0], data.ratings[1])
		if (data.result == "deleted") return
		else colorRatings(smashedLike)
	})
}
