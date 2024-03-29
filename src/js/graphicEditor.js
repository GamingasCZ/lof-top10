const MAX_GDB_SCROLL = 5

var openedPane = 0
function getDetailsFromID(id) {
    // Tohle budeš pak muset předělat, až bude všechno fungovat :D
    let givenID = $(".idbox" + id).val();

    if (givenID != "") {
        if (isNaN(parseInt(givenID))) {
            $(".idbox" + id).css("background-color", "rgba(255, 0, 0, 0.5)");
            setTimeout(() => { $(".idbox" + id).css("background-color", "") }, 50);

            $(".idbox" + id).val("");
            $(".idDetailGetter" + id).addClass("disabled");
            return false
        }

        $.get("./php/rubLevelData.php", {"id": givenID}, function (data) {
            if (data != -1) saveGDBresult(id, data)
            else {
                $(".idbox" + id).addClass("inputErr");
                setTimeout(() => { $(".idbox" + id).removeClass("inputErr") }, 500);
                // TODO: Add flickering or something....
            }
        })
    }
}

var succ = false
async function getDetailsFromName(id) {
    succ = false

    id = id.toString()
    let givenName = $(".cardLName" + id).val();
    let givenMaker = $(".cardLCreator" + id).val();

    // Only level name passed in (most liked with that name)
    if (givenName != "" && givenMaker == "") url = `./php/rubLevelData.php/?levelName=${givenName}`
    // Only creator passed in (newest level from user)
    else if (givenName == "" && givenMaker != "") url = `./php/rubLevelData.php/?levelMaker=${givenMaker}`
    // Both passed in (newest level from passed in used with the passed in name)
    else {
        for (let pages = 0; pages < MAX_GDB_SCROLL; pages++) {
            if (!succ) {
                await $.ajax({
                    url: `./php/rubLevelData.php/?userSearch=${givenMaker}&name=${givenName}&page=${pages}`, timeout: 1000, "Access-Control-Allow-Origin": "*",
                    success: data => {
                        if (data.name != undefined) {
                            saveGDBresult(id, data)
                            succ = true
                        }
                    },
                    error: () => {
                        if (pages == MAX_GDB_SCROLL - 1) {
                            $(".cardLName" + id).addClass("inputErr");
                            setTimeout(() => { $(".cardLName" + id).removeClass("inputErr") }, 500);

                            $(".cardLCreator" + id).addClass("inputErr");
                            setTimeout(() => { $(".cardLCreator" + id).removeClass("inputErr") }, 500);
                        }
                    }
                })
            }
        }
        return
    }

    // Hledání nejlikovanějšího levelu
    await $.ajax({
        url: url, timeout: 1000, "Access-Control-Allow-Origin": "*",
        success: data => {
            if (Object.values(data).length > 0) {
                saveGDBresult(id, data)
            }
        },
        error: () => {
            $(".cardLName" + id).addClass("inputErr");
            setTimeout(() => { $(".cardLName" + id).removeClass("inputErr") }, 500);

            $(".cardLCreator" + id).addClass("inputErr");
            setTimeout(() => { $(".cardLCreator" + id).removeClass("inputErr") }, 500);
        }
    })

    if ($(".idbox" + id).val() != "") { $(".idDetailGetter" + id).removeClass("disabled") }
    else { $(".idDetailGetter" + id).addClass("disabled") }

    availFill(0, $(".cardLName" + id).val(), "freedom69", id)
    availFill(1, $(".cardLCreator" + id).val(), "freedom69", id)

    updateSmPos()
}

function saveGDBresult(id, data) {
    succ = true

    let jsonData = "";
    if (data[0] == undefined) { jsonData = data } // When searching, result is nested
    else { jsonData = data[0] } // When fetching level, it is not nested (shocking lmao)

    $(".cardLName" + id).val(jsonData["name"]);
    levelList[id]["levelName"] = jsonData["name"];
    $(".cardLCreator" + id).val(jsonData["author"]);

    if (typeof levelList[id]["creator"] == "object") { levelList[id]["creator"][0] = [jsonData["author"], 1] } // Collab tools enabled
    else { levelList[id]["creator"] = jsonData["author"]; } // Not enabled

    saveDifficulty(jsonData["difficulty"], jsonData["cp"], id)

    $(".idbox" + id).val(jsonData["id"]);
    levelList[id]["levelID"] = jsonData["id"]

    availFill(0, $(".cardLName" + id), "freedom69", id)
    availFill(1, $(".cardLCreator" + id), "freedom69", id)

    updateSmPos()
}

function saveDifficulty(difficulty, cp, listPos) {
    // cp (gdbrowser cp): -1: keep old rate, 0: norate, 1: star rate, 2: featured, 3: epic

    // bad gdbrowser response
    //let stringDiffs = ["Unrated", "Easy", "Normal", "Hard", "Harder", "Insane", "Easy Demon", "Medium Demon", "Hard Demon", "Insane Demon", "Extreme Demon", "Auto"]
    //if (typeof difficulty == "string") difficulty = stringDiffs.indexOf(difficulty)
    // If not string, I passed it in as an integer (hopefully :P), corresponds to prev. line

    //if (difficulty == 0) cp = 0


    $($(".diffMain")[listPos - 1]).attr("src", `images/faces/${difficulty}.webp`)
    $(".faceSelected").removeClass("faceSelected")
    $($(`.diffFace`)[difficulty]).addClass("faceSelected")

    if (cp == -1) cp = levelList[listPos]["difficulty"][1]
    $(".diffOptions img").addClass("disabled")
    $(".diffOptions img").eq(cp).removeClass("disabled")

    if (cp != -1) {
        switch (cp) {
            case 0:
                $($(".diffBack")[listPos - 1]).attr("src", ``); break;
            case 1:
                $($(".diffBack")[listPos - 1]).attr("src", `images/star.webp`);
                $($(".diffBack")[listPos - 1]).attr("id", `starRate`); break;
            case 2:
                $($(".diffBack")[listPos - 1]).attr("src", `images/faces/featured.webp`);
                $($(".diffBack")[listPos - 1]).attr("id", `featuredGlow`); break;
            case 3:
                $($(".diffBack")[listPos - 1]).attr("src", `images/faces/epic.webp`);
                $($(".diffBack")[listPos - 1]).attr("id", `epicGlow`); break;
            default:
                break;
        }
    }

    levelList[listPos]["difficulty"] = [difficulty, cp]
}
function openDiffPicker(lp) {
    $('.cardContainer' + lp).text('')
    if (openedPane == 2 || $('.cardContainer' + lp).css("display") == "none") $('.cardContainer' + lp).slideToggle(50)
    openedPane = 2

    if (levelList[lp]["difficulty"] == undefined) { levelList[lp]["difficulty"] = [0, 0] }
    let diff = levelList[lp]["difficulty"]

    let difficulties = [];
    for (i = 0; i < 12; i++) difficulties.push(`<img class="button diffFace" onclick="saveDifficulty(${i}, -1, ${lp})" src='images/faces/${i}.webp'>`)
    difficulties = difficulties.join("\n")

    $('.diffOptions').empty()
    // TODO: text orientation causes options to overflow
    $('.cardContainer' + lp).append(`
    <div class="difficultyPicker">
        <div class="diffFaces">${difficulties}</div>
        <div style="display: flex;margin-right:0.5vw;align-items: center;">
            <div class="diffOptions">
                <img src="./images/error.webp" title="${jsStr["NORATE"][LANG]}" class="button diffOptions">
                <img src="./images/star.webp" title="Star rate" class="button diffOptions">
                <img src="./images/faces/featured.webp" title="Featured" class="button diffOptions">
                <img src="./images/faces/epic.webp" title="Epic" class="button diffOptions">
            </div>
        </div>
    </div>`)
    $(".diffOptions img").eq(0).click(() => saveDifficulty(levelList[lp]['difficulty'][0], 0, lp))
    $(".diffOptions img").eq(1).click(() => saveDifficulty(levelList[lp]['difficulty'][0], 1, lp))
    $(".diffOptions img").eq(2).click(() => saveDifficulty(levelList[lp]['difficulty'][0], 2, lp))
    $(".diffOptions img").eq(3).click(() => saveDifficulty(levelList[lp]['difficulty'][0], 3, lp))

    saveDifficulty(diff[0], diff[1], lp)
}

const changeBG = (ind, pos) => { levelList[pos]["background"][0] = ind }
const changeGrad = (ind, pos) => { levelList[pos]["background"][1] = ind }
function openBGPicker(lp) {
    $('.cardContainer' + lp).text('')
    if (openedPane == 3 || $('.cardContainer' + lp).css("display") == "none") $('.cardContainer' + lp).slideToggle(50)
    openedPane = 3

    let titles = ["Žádné", "Výchozí", "YouTube náhled", "Šrafování"]
    let bgs = ["none", "original", "youtube", "stripes"];
    bgs = bgs.map(i => `<img class='button bgPick' onclick='changeBG(${bgs.indexOf(i)}, ${lp})' title='${titles[bgs.indexOf(i)]}' src='images/bgIcons/${i}.svg'>`).join("\n")

    $('.cardContainer' + lp).append(`
    <div class="difficultyPicker">
        <div class="diffFaces">${bgs}</div>
        <div class="diffOptions">
            <div>
                <input onchange='changeGrad($("#inpGrad").prop("checked"), ${lp})' id="inpGrad" class="button setCheckbox" type="checkbox"></input>
                <label for="inpGrad" class="uploadText">Přechod</label>
            </div>
            <div class="bgSettingsContainer">
                <img src="images/gauntlet.webp" style="width: 3vw;" class="button" onclick="showBGdialog()">
                <img src="images/preview.webp" style="width: 3vw;" class="button">
            </div>
        </div>
    </div>`)

    $("#inpGrad").prop("checked", levelList[lp]["background"][1])
}

function hideBGdialog() {
    $(".bgProps").fadeOut(100)
    $(".boom").fadeOut(100)
}
function showBGdialog() {
    $(".bgProps").fadeIn(100)
    $(".boom").css("background-color", "#000000a0")
    $(".boom").show()
    $(".boom").animate({ "opacity": 100 }, 200)
}

function hideDescriptionDialog() {
    $(".mainInpContainer .descriptionThing").val(levelList.description ?? "")
    $(".fullscreenDescription").fadeOut(100)
    $(".boom").fadeOut(100)
}
function showDescriptionDialog() {
    $(".fullscreenDescription").fadeIn(100)
    $(".fsDescriptionArea").val(levelList.description ?? "")
    $(".boom").css("background-color", "#000000a0")
    $(".boom").show()
    $(".boom").animate({ "opacity": 100 }, 200)
}

function formatText(type) {
    if ($("#descPreviewButton").attr("data-on") == "1") return

    let chars = ["**", "//", "__", "--"][type]
    let textbox = $(".fsDescriptionArea")
    let selStart = textbox[0].selectionStart
    switch (true) {
        case type >= 0 && type <= 3:
            if (selStart == textbox[0].selectionEnd) { // No text selected
                textbox.val(textbox.val().slice(0, selStart) + `${chars} ${chars}` + textbox.val().slice(selStart))
                textbox.focus()
                textbox.prop("selectionStart", selStart+2)
                textbox.prop("selectionEnd", selStart+3)
            }
            else {
                let selectedText = textbox.val().slice(selStart, textbox[0].selectionEnd)
                textbox.val(textbox.val().slice(0, selStart) + `${chars}${selectedText}${chars}` + textbox.val().slice(textbox[0].selectionEnd))
                textbox.focus()
                textbox.prop("selectionStart", textbox[0].selectionEnd+2)
                textbox.prop("selectionEnd", textbox[0].selectionEnd+2)
            }
            
            break;
            case [4,5].includes(type):
                let format = type == 4 ? "#" : "*"
                let startLF = [undefined, "\n"].includes(textbox.val()[selStart-1]) ? "" : "\n"
                textbox.val(textbox.val().slice(0, selStart) + `${startLF}${format}` + textbox.val().slice(selStart))
                textbox.focus()
                textbox.prop("selectionStart", selStart+2)
                textbox.prop("selectionEnd", selStart+2)
                break;
                
            default:
                break;
            }
    levelList.description = textbox.val()
}

function previewDescription() {
    if ($("#descPreviewButton").attr("data-on") == "0") {
        $(".formattingButton:not(#descPreviewButton)").addClass("disabled")
        $(".fsDescriptionArea").hide()
        $("#descriptionPreview").html(parseFormatting(levelList.description))
        $("#descriptionPreview").show()
        $("#descPreviewButton").css("background", "#ffffff4a")
        $("#descPreviewButton").attr("data-on", "1")
    }
    else {
        $(".formattingButton:not(#descPreviewButton)").removeClass("disabled")
        $(".fsDescriptionArea").show()
        $("#descriptionPreview").hide()
        $("#descPreviewButton").css("background", "")
        $("#descPreviewButton").attr("data-on", "0")
    }
}

function parseFormatting(text) {
    let chars = ["\\*\\*", "\\/\\/", "__", "--"]
    let tags = ["b", "i", "u", "strike"]
    let i = 0
    chars.forEach(c => {
        let regex = new RegExp(`${c}(.*?)${c}`, "g")
        text = text.replace(regex, `<${tags[i]}>$1</${tags[i]}>`)
        i++
    });
    text = text.replace(/#(.*?)\n/g, `<div class="header">$1</div>\n`)
    text = text.replace(/\*(.*?)(\n|$)/g, `<li class="descList">$1</li>\n`)

    let urlRegex = /(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*))/g
    text = text.replace(urlRegex, `<a href="$1" class="gamLink">$1</a>`)

    return text
}

function hideBGsettings() {
    hideBGdialog()
    $(".backSett").fadeOut(50)
}

function showBGsettings() {
    showBGdialog()
    $(".cutImage").css("background-image", `url("${levelList.titleImg[0]})`)
    $(".backSett").fadeIn(50)
    $(".bgError").hide()

    if (levelList.titleImg[0].length == 0) {
        $("#backImageSettings").hide()
        $(".bgNoneEntered").show()
        return
    }

    let image = new Image()
    image.src = levelList.titleImg[0]
    image.addEventListener('load', () => {
        $("#backImageSettings").show()
        $(".cutImage").css("background-image", `url("${levelList.titleImg[0]}")`)
        $(".BGsettBG").css("background-image", `url("${levelList.titleImg[0]}")`)
        let ratio = image.width / image.height
        $("#backDragContainer").css("width", `192px`)
        $("#backDragContainer").css("height", `${192 / ratio}px`)

        $("#bgCoverageSlider").on("input", updateDragBox)
        $(".cutImage").css("background", $("#listimg").val())

        let svgWidth = $(".cutImage").width()
        let svgHeight = $(".cutImage").height() * ($("#bgCoverageSlider").val() / 100)
        $(".cutBox").attr("width", svgWidth)
        $(".cutBox").attr("height", svgHeight)
        $(".cutBox > path").attr("d", `M0 0 L${svgWidth} 0 L${svgWidth} ${svgHeight} L0 ${svgHeight} L0 0`)

        $(".alignButtons").css("filter","brightness(0.3)")
        $(".alignButtons").eq(levelList["titleImg"][3]).css("filter","")
        $(".alignButtons").off("click")
        $(".alignButtons").on("click", e => {
            let pos = Object.values($(".alignButtons")).indexOf(e.target)
            levelList["titleImg"][3] = pos
            $(".alignButtons").css("filter", "brightness(0.3)")
            $(e.target).css("filter", "")
            $(".BGsettBG").css("background-position-x", ["left", "center", "right"][pos])
        })

        $(".gradCheckbox").off("click")
        $(".gradCheckbox").on("click", () => {
            levelList["titleImg"][4] = !levelList["titleImg"][4]
            $(".gradCheckbox").attr("src",`images/modernCheck${levelList["titleImg"][4] ? "On" : ""}.svg`)
        })

        $("#backDragContainer").off("mousemove")
        $("#backDragContainer").on("mousemove", e => {
            let dragPos;
            // Center of the select box = offset from #backDragContainer Y pos + 1/2 of the select box
            let center = $("#backDragContainer").position().top - e.originalEvent.clientY + $(".backSett").position().top + $(".cutBox").height()/2
            if (center > 0) dragPos = 0 // Do not use the first half of the select box
            else dragPos = clamp(Math.abs(center), 0, parseInt($(".cutImage").height() - $(".cutImage").height() * ($("#bgCoverageSlider").val() / 100)))

            if (e.originalEvent.buttons == 1) { // Move only when holding LMB
                $(".cutBox").css("top", `${dragPos}px`)
                levelList.titleImg[1] = (dragPos+$(".cutBox").height())/$(".cutImage").height()*100
                $(".BGsettBG").css("background-position-y", `${levelList.titleImg[1]}%`)
            }
        })
        $("#backDragContainer").one("mouseup", () => levelList.titleImg[1] = parseInt($(".cutBox").css("top").slice(0, -2)))
    });
    image.addEventListener('error', () => {
        $("#backImageSettings").hide()
        $(".bgBadFetch").show()
    })
}

function updateDragBox() {
    levelList.titleImg[2] = $("#bgCoverageSlider").val()
    let svgWidth = $(".cutImage").width()
    let svgHeight = $(".cutImage").height() * ($("#bgCoverageSlider").val() / 100)
    $(".cutBox").attr("width", svgWidth)
    $(".cutBox").attr("height", svgHeight)
    $(".cutBox > path").attr("d", `M0 0 L${svgWidth} 0 L${svgWidth} ${svgHeight} L0 ${svgHeight} L0 0`)

    $(".cutBox").css("top", 0)
}

function generateFromJSON(part, boards) {
    $(".uploadTitle").text(jsStr["EDITING"][LANG]);
    let loadProps = JSON.parse(sessionStorage.getItem("listProps"))

    // Disabling input boxes when editing a list
    $("#listnm").attr("disabled", "true");
    $("#listnm").val(loadProps[3]);

    $(".uploadBG > *:not(.imgPreview)").show()
    $("#submitbutton > div").text(jsStr["L_UPDATE"][LANG])
    $("#submitbutton").attr("onclick", "updateList()")

    $("#submitarea").append(`
    <div onclick="removeList()" class="button noMobileResize uploadText removeList" id="submitbutton" style="background-color: rgb(255, 100, 100)">
        <img src="images/del.svg">
        <div>${jsStr["DELETE"][LANG]}</div>
    </div>
    `)

    // Is the list hidden?
    if (boards["hidden"] != "0") {
        $(`img[for="hidden"]`).attr("src", "images/modernCheckOn.svg")
        $(`input[name="hidden"]`).attr("checked", true)
    }


    // Removing tutorial
    $("#mainContent").text("");
    $(".previewButton").removeClass("disabled");

    $("#listnm").val(boards["name"])

    levelList = JSON.parse(boards["data"]);

    $(".mainInpContainer .descriptionThing").text(levelList.description ?? "")

    if (levelList["translucent"] != undefined && levelList["translucent"]) {
        $(`img[for="transCards"]`).attr("src", "images/modernCheckOn.svg")
        $(`input[name="transCards"]`).attr("checked", true)
    }

    if (typeof levelList["titleImg"] == "string") { // Old lists
        let link = levelList["titleImg"]
        levelList["titleImg"] = DEFAULT_LEVELLIST.titleImg
        levelList["titleImg"][0] = link
    }
    $("#listimg").val(levelList["titleImg"][0])
    $(".cutBox").css("top", `${levelList["titleImg"][1]}%`)
    
    $("#bgCoverageSlider").val(levelList["titleImg"][2])
    
    $(".alignButtons").css("filter","brightness(0.3)")
    $(".alignButtons").eq(levelList["titleImg"][3]).css("filter","")

    if (!levelList["titleImg"][4]) $(".gradCheckbox").attr("src",`images/modernCheck.svg`)

    // Is it a diff guess list?
    if (levelList["diffGuesser"] != undefined && levelList["diffGuesser"][0]) {
        $(`img[for="diffGuesser"]`).attr("src", "images/modernCheckOn.svg")
        $(`input[name="diffGuesser"]`).attr("checked", true)
        $(".settingSubbox").show()
        if (!levelList["diffGuesser"][1]) $(".settingSubbox img").eq(0).addClass("disabled")
        if (!levelList["diffGuesser"][2]) $(".settingSubbox img").eq(1).addClass("disabled")
    }

    // Change page background, if not default
    if (levelList["pageBGcolor"] != "#020202") {
        $("#bgcolorPicker").css("background", levelList["pageBGcolor"])
        $(":root").css("--siteBackground", levelList["pageBGcolor"])
        let hue = getHueFromHEX(levelList["pageBGcolor"])
        $(":root").css("--greenGradient", `linear-gradient(9deg, hsl(${hue},23.1%,10.2%), hsl(${hue},90.6%,16.7%))`)
        
    }

    for (y = 0; y < getListLen(levelList); y++) {
        loadLevel(y + 1)
    }
    updateSmPos()
    displayCard("1")
    isHidden = boards["hidden"] != "0";
}

function refreshCardDetails(lp) {
    $(".cardLName" + lp).val(levelList[lp]["levelName"])

    if (typeof levelList[lp]["creator"] == "object") {
        $(".cardLCreator" + lp).val(levelList[lp]["creator"][0][0]) // Is collab?
        $(".colButton" + lp).css("filter", "hue-rotate(180deg)");
    }
    else $(".cardLCreator" + lp).val(levelList[lp]["creator"])

    $(".idbox" + lp).val(levelList[lp]["levelID"])
    $(".cardLVideo" + lp).val(levelList[lp]["video"])
    $("#top" + lp).css("background-color", levelList[lp]["color"])

    if (levelList[lp]["difficulty"] != undefined) {
        let rate = ["", "star", "featured", "epic"][levelList[lp]["difficulty"][1]]

        $(`.dPick${lp} > .diffMain`).attr("src", `images/faces/${levelList[lp]["difficulty"][0]}.webp`) // change face
        if (rate != "") $(`.dPick${lp} > .diffBack`).attr("src", `images/faces/${rate}.webp`) // change rate glow

        if (rate == "featured") $(`.dPick${lp} > .diffBack`).attr("id", "featuredGlow") // glow ids
        else $(`.dPick${lp} > .diffBack`).attr("id", "epicGlow")
    }

    availFill(0, $(".cardLName" + lp).val(), "freedom69", lp)
    availFill(1, $(".cardLCreator" + lp).val(), "freedom69", lp)
}
function moveCard(position, currID) {
    let listPlacement = parseInt($(".listPosition" + currID.toString()).val());
    if (position == "up" & currID >= 0) {
        if (listPlacement > 1) {
            $(".card" + (listPlacement - 1)).before($(".card" + (listPlacement)));

            updateCardData(listPlacement - 1, -1);
            updateCardData(listPlacement, listPlacement - 1);
            updateCardData(-1, listPlacement)

            listPlacement--
            refreshCardDetails(listPlacement)
        }
    }
    else if (position == "down" & currID < getListLen(levelList)) {
        if (listPlacement < getListLen(levelList)) {
            $(".card" + (listPlacement + 1)).after($(".card" + (listPlacement)));

            updateCardData(listPlacement + 1, -1);
            updateCardData(listPlacement, listPlacement + 1);
            updateCardData(-1, listPlacement);

            listPlacement++
            refreshCardDetails(listPlacement)
        }
    }
    else { return false; }

    updateSmPos();
    $("body").css("scroll-behavior","initial")
    document.getElementById("top" + listPlacement).scrollIntoView();
    $("body").css("scroll-behavior","smooth")
    $(".cardExtrasContainer").text('')
    $(".cardExtrasContainer").hide()
    return true;
}

function updateSmPos() {
    for (i = 1; i < getListLen(levelList) + 1; i++) {
        let chosenColor = $("#top" + i).css("background-color");
        $("#smtop" + i).css("background-color", chosenColor);
        $("#smtop" + i).css("border-color", chosenColor);

        if (levelList[i]["levelName"] == "") {
            $("#smtop" + i.toString()).text(`#${i} - ${jsStr["UNNAMED"][LANG]}`);
        }
        else if (levelList[i]["creator"] == "" & levelList[i]["levelName"] != "") {
            $("#smtop" + i.toString()).text(`#${i} - ${levelList[i]["levelName"]}`);
        }
        else {
            if (typeof levelList[i]["creator"] == "object") {
                let includeFrom = levelList[i]["creator"][0][0]
                if (levelList[i]["creator"][0][0] != "") { includeFrom = "od " + includeFrom }
                $("#smtop" + i.toString()).text(`#${i} - ${levelList[i]["levelName"]} ${includeFrom} (Collab)`);
            }
            else {
                $("#smtop" + i.toString()).text(`#${i} - ${levelList[i]["levelName"]} ${jsStr["CREATOR_BY"][LANG].slice(0, -2)} ${levelList[i]["creator"]}`);
            }
        }
    }
}

function displayCard(id) {
    if (id > 0 & id < getListLen(levelList) + 1) {
        $(".smallPosEdit").show();
        $("#smtop" + id.toString()).hide();
        $(".positionEdit").hide();
        $("#top" + id.toString()).css("transform", "scaleY(0.8)");
        $("#top" + id.toString()).show();
        $("#top" + id.toString()).css("transform", "scaleY(1)");
        $(".cardExtrasContainer").text('')
        $(".cardExtrasContainer").hide()
        updateSmPos()

        availFill(0, $(".cardLName" + id).val(), "freedom69", id)
        availFill(1, $(".cardLCreator" + id).val(), "freedom69", id)
    }
}

function availFill(type, sel, key, pos) {
    // Shows/hides those white rectangles in the card
    $(".positionEdit:visible .button").css("transition-duration", "0s")
    if (sel.length < 1) {
        $(".availFill:visible")[type].style.opacity = 0.3
        if ($(".availFill:visible")[0].style.opacity == 0.3 && $(".availFill:visible")[1].style.opacity == 0.3) {
            $(".nameDetailGetter" + pos).addClass("disabled")
        }
    }
    else if (sel.length > 0) {
        $(".availFill:visible")[type].style.opacity = 1
        $(".nameDetailGetter" + pos).removeClass("disabled")
    }

    if ($(".idbox" + pos).val() == "") $(".idDetailGetter"+pos).addClass("disabled")
    else $(".idDetailGetter"+pos).removeClass("disabled")
    $(".positionEdit:visible .button").css("transition-duration", "")
}

async function changeColPicker(chosenColor, target, isChangingValue) {
    let lightness = await isChangingValue ? chosenColor : getLightnessFromHEX(levelList[target]["color"])
    let hue = await isChangingValue ? getHueFromHEX(levelList[target]["color"]) : chosenColor

    $("#top" + target).css("background-color", `hsl(${hue}, ${DEFAULT_SATURATION}, ${lightness}%)`);
    $("#top" + target).css("border-color", `hsl(${hue}, ${DEFAULT_SATURATION}, ${lightness - 5}%)`);
    $("#lineSplit" + target).css("background-color", `hsl(${hue}, ${DEFAULT_SATURATION}, ${lightness - 5}%)`);
    $(".cardContainer" + target).css("background-color", `hsl(${hue}, ${DEFAULT_SATURATION}, ${lightness - 5}%)`);

    let inHex = HSLtoHEX(hue, DEFAULT_SATURATION, lightness + "%");
    levelList[target]["color"] = inHex;
}

function changeIDbox(k) {
    let selection = k.target.value
    let position = ($(this)[0]["className"]).match(/[0-9]/g).join("")
    if (k.type == "change") {
        levelList[position]["levelID"] = selection;
    }
    else {
        if (selection.length < 1) { $(".idDetailGetter" + position).addClass("disabled") }
        else if (selection.length > 0) { $(".idDetailGetter" + position).removeClass("disabled") }
    }
}

function changeLevelName(k) {
    let selection = k.target.value
    let position = ($(this)[0]["className"]).match(/[0-9]/g).join("")
    levelList[position]["levelName"] = selection;

    availFill(0, selection, k.key, position)
}

function changeLevelCreator(k) {
    let selection = k.target.value
    let position = ($(this)[0]["className"]).match(/[0-9]/g).join("")
    if (typeof levelList[position]["creator"] == "object") {
        // Do not overwrite collab tools
        levelList[position]["creator"][0][0] = selection;
        levelList[position]["creator"][0][1] = false;
    }
    else {
        levelList[position]["creator"] = selection;
    }

    availFill(1, selection, k.key, position)
}

function changeLevelVideo() {
    // Link is a regular YT link
    if ($(this).val().match(/(watch\?v=)/g)) {
        let linkMatch = $(this).val().match(/(?<=\?v=).+/g);
        $(this).val(linkMatch);
    }
    // Link is most likely a shortened YT link
    else {
        let linkMatch = $(this).val().match(/(?<=youtu.be\/).+/g);
        $(this).val(linkMatch);
    }

    let selection = $(".cardLVideo" + ($(this)[0]["className"]).match(/[0-9]/g).join("")).val()
    let position = ($(this)[0]["className"]).match(/[0-9]/g).join("")
    levelList[position]["video"] = selection;
}

function searchFaves(data) {
    let searchTerms = data.target.value
    favesData = OGfavesData.filter(x => (x[0].toLowerCase()).includes(searchTerms.toLowerCase()))

    makeFavesPicker()
}

function addFromFaves() {
    if (getListLen(levelList) + 1 > 50) return

    $(".levelPickerContainer").text("")
    $(".savedFilter").val("")

    if (favesData != null) { favesData = OGfavesData; makeFavesPicker() }
    else {
        let data = null
        if (hasLocalStorage()) data = JSON.parse(localStorage.getItem("favorites"))
        
        if (data != null) {
            favesData = data
            OGfavesData = JSON.parse(JSON.stringify(data))
        }

        // No key in localStorage (first time entering site)
        else { favesData = []; OGfavesData = [] }
        makeFavesPicker()
    }

    $(".boom").show()
    $(".boom").css("background-color", "black")
    $(".boom").css("opacity", "0.7")
    $(".levelPicker").fadeIn(70)
}
function hideFavePicker() {
    $(".boom").css("background-color", "white")
    $(".boom").css("opacity", "0")
    $(".boom").hide()
    $(".levelPicker").fadeOut(70)

}

function maxAddedDialog() {
    $(".levelPickerContainer").append(`
<div class="noSaves">
    <img src="./images/close.svg">
    <p class="uploadText">${jsStr["MAX_INLIST"][LANG]}</p>
</div>
        `)
    $(".addCardButton").addClass("disabled")
    return
}

function addPicked(ind) {
    var listLenght = getListLen(levelList) + 1;
    levelList[listLenght] = {
        "levelName": favesData[ind][0],
        "creator": favesData[ind][1],
        "levelID": favesData[ind][2],
        "video": null,
        "color": favesData[ind][3],
        "difficulty": [0, 0],
        "background": [1, true, 30, 100], //BG, gradient, alpha, brightness
        "tags": favesData[ind][8] != undefined ? favesData[ind][8] : [] // TODO: možná změň index
    };
    loadLevel(listLenght)
    displayCard(listLenght)

    if (listLenght >= 50) { $(".levelPickerContainer").empty(); maxAddedDialog() }
}

var favesData
var OGfavesData

function makeFavesPicker() {
    $(".levelPickerContainer").empty()
    if (getListLen(levelList) + 1 > 50) {
        maxAddedDialog()
        return
    }

    if (favesData.length == 0) {
        // No search results
        if ($(".savedFilter").val().length > 0) {
            $(".levelPickerContainer").append(`
<div class="noSaves">
    <img src="./images/searchOpaque.svg">
    <p class="uploadText">${jsStr["SEARCH_NOLVL"][LANG]}</p>
</div>
            `)
            return
        }

        // No saved levels
        $(".levelPickerContainer").append(`
<div class="noSaves">
    <img src="./images/savedMobHeader.svg">
    <p class="uploadText">${jsStr["NOSAVEYET"][LANG]}</p>
</div>
        `)
        return
    }

    let i = 0;
    favesData.forEach(data => {
        // Delete collab text
        if (data[1].includes("(Collab)")) {
            data[1] = data[1].split(" ").slice(0, -3).join(" ")
            favesData[i][1] = data[1]
        }

        $(".levelPickerContainer").append(`
        <div id="favBubble" class="roleBubble button" style="background-color: ${data[3]};" onclick="addPicked(${favesData.indexOf(data)})">${data[0]} - ${data[1]}
        </div>
        `)
        i++
    })
}

class Level {
    constructor(levelName = "", creator = "", levelID = -1, video = "", color = "", difficulty = [0, 0], tags = []) {
        this.levelName = levelName;
        this.creator = creator;
        this.levelID = levelID;
        this.video = video;
        this.color = color;
        this.difficulty = difficulty;
        this.tags = tags;
    }
}

async function addLevel() {
    var listLenght = getListLen(levelList) + 1;
    if (listLenght == 1) {
        // Removing tutorial
        $("#mainContent").text("");
        $(".previewButton").removeClass("disabled");
    }
    else if (listLenght > 50) { return null }
    else if (listLenght > 49) { $(".addCardButton").addClass("disabled") }

    $(".headerTitle").text(jsStr["LEVELS"][LANG]);
    fupPos = 0;

    // Skryje všechny rozbalené karty
    $(".positionEdit").hide();
    // Zobrazí všechny sbalené karty
    $(".smallPosEdit").show();

    updateSmPos();

    // Adds the CARD!
    await $("#mainContent").append(await card(listLenght));
    // Skryje zabalenou kartu právě přidané karty
    $("#smtop" + listLenght).hide();
    // Adds the card to the JSON
    levelList[listLenght] = {
        "levelName": "",
        "creator": "",
        "levelID": null,
        "video": null,
        "color": "",
        "difficulty": [0, 0],
        "background": [1, true, 30, 100], //BG, gradient, alpha, brightness
        "tags": []
    };

    $("#top" + listLenght).css("transform", "scaleY(1)");

    // Random color generation
    let hsl = randomColor();

    let darker = HEXtoRGB(hsl, 40);

    $("#top" + listLenght).css("background-color", hsl);
    $("#top" + listLenght).css("border-color", `rgb(${darker.join(",")})`);
    $(".cardContainer" + listLenght).css("background-color", `rgb(${darker.join(",")})`);
    $("#smtop" + listLenght).css("background-color", hsl);
    $("#smtop" + listLenght).css("border-color", `rgb(${darker.join(",")})`);
    $("#lineSplit" + listLenght).css("background-color", `rgb(${darker.join(",")})`);

    levelList[listLenght]["color"] = hsl;

    // Sets the color of the added card
    $("#colorPicker" + listLenght).on("change", changeColPicker);
    $(".idbox" + listLenght).on("change keyup", changeIDbox);
    $(".cardLName" + listLenght).on("keyup", changeLevelName);
    $(".cardLCreator" + listLenght).on("keyup", changeLevelCreator);
    $(".cardLVideo" + listLenght).on("change", changeLevelVideo);

}

function loadLevel(pos) {
    // Do not go over 50 levels
    if (pos > 50) return

    $(".previewButton").removeClass("disabled");
    $("#mainContent").append(card(pos))
    refreshCardDetails(pos)

    let chosenColor = levelList[pos]["color"];
    let rgb = HEXtoRGB(chosenColor, 40)

    $(".cardContainer" + pos).css("background-color", `rgb(${rgb.join(",")})`);
    $("#top" + pos).css("border-color", `rgb(${rgb.join(",")})`);
    $("#lineSplit" + pos).css("background-color", `rgb(${rgb.join(",")})`);

    $("#smtop" + pos).hide()
    // Setting card buttons
    $("#colorPicker" + pos).on("change", changeColPicker);
    $(".idbox" + pos).on("change keyup", changeIDbox);
    $(".cardLName" + pos).on("keyup", changeLevelName);
    $(".cardLCreator" + pos).on("keyup", changeLevelCreator);
    $(".cardLVideo" + pos).on("change", changeLevelVideo);

    $(".helpText").hide()
}

function updateCardData(prevID, newID) {
    if (parseInt(prevID) != parseInt(newID)) {
        levelList[prevID + "waiting"] = levelList[prevID];
        levelList[newID + "waiting"] = levelList[newID];
    }

    // FUCK THIS!
    $(".card" + prevID).attr("class", "card" + newID);
    $("#smtop" + prevID).attr("onclick", "displayCard(" + newID + ")");
    $("#smtop" + prevID).attr("id", "smtop" + newID);
    $("#top" + prevID).attr("id", "top" + newID);
    $(".idbox" + prevID).attr("class", "cardInput idbox" + newID);
    $(".idDetailGetter" + prevID).attr("onclick", "getDetailsFromID(" + newID + ")");
    $(".idDetailGetter" + prevID).attr("class", "button idDetailGetter" + newID);
    $(".upmover" + prevID).attr("onclick", "moveCard('up'," + newID + ")");
    $(".upmover" + prevID).attr("class", "button upmover" + newID);
    $(".listPosition" + prevID).attr("value", newID);
    $(".listPosition" + prevID).attr("class", "listPosition" + newID);
    $(".downmover" + prevID).attr("onclick", "moveCard('down'," + newID + ")");
    $(".downmover" + prevID).attr("class", "button downmover" + newID);
    $("#lineSplit" + prevID).attr("id", "lineSplit" + newID);
    $(".cardLName" + prevID).attr("class", "cardInput cardLName" + newID);
    $(".nameDetailGetter" + prevID).attr("onclick", "getDetailsFromName(" + newID + ")");
    $(".nameDetailGetter" + prevID).attr("class", "button nameDetailGetter" + newID);
    $(".cardLCreator" + prevID).attr("class", "cardInput cardLCreator" + newID);
    $(".cardLVideo" + prevID).attr("class", "cardInput cardLVideo" + newID);
    $(".removerButton" + prevID).attr("onclick", "removeLevel(" + newID + ")");
    $(".removerButton" + prevID).attr("class", "button cardButton removerButton" + newID);
    $("#colorPicker" + prevID).attr("id", "colorPicker" + newID);
    $(".colButton" + prevID).attr("onclick", "showCollabTools(" + newID + ")");
    $(".colButton" + prevID).attr("class", "button collListBut colButton" + newID);
    $(".cardContainer" + prevID).attr("class", "cardExtrasContainer cardContainer" + newID);
    $(".cPickerBut" + prevID).attr("onclick", "openColorPicker(" + newID + ")");
    $(".cPickerBut" + prevID).attr("class", "button cardButton cPickerBut" + newID);
    $(".dPick" + prevID).attr("onclick", "openDiffPicker(" + newID + ")");
    $(".dPick" + prevID).attr("class", "button cardButton diffContainer dPick" + newID);
    $(".tagPicker" + prevID).attr("onclick", "openTagPicker(" + newID + ")");
    $(".tagPicker" + prevID).attr("class", "button cardButton tagPicker" + newID);

    if (parseInt(prevID) != parseInt(newID)) {
        levelList[prevID] = levelList[newID + "waiting"];
        levelList[newID] = levelList[prevID + "waiting"];
        delete levelList[newID + "waiting"];
        delete levelList[prevID + "waiting"];

        // Deletes nonexistent cards
        if (levelList[prevID] == undefined) { delete levelList[prevID] }
        if (levelList[newID] == undefined) { delete levelList[newID] }
    }

}

function openColorPicker(lp) {
    $('.cardContainer' + lp).text('')
    if (openedPane == 1 || $('.cardContainer' + lp).css("display") == "none") $('.cardContainer' + lp).slideToggle(50)
    openedPane = 1

    let color = makeColorElement(getHueFromHEX(levelList[lp]["color"]), getLightnessFromHEX(levelList[lp]["color"]))
    color.on("input", k => {
        changeColPicker($(k.target).val(), lp, k.target.previousElementSibling.className == "hueChanger")
    })
    color.appendTo($(".cardContainer" + lp))
}

function tagPopup(lp) {
    showBGdialog()

    $(".badgeBox").removeClass("tagInUse")
    levelList[lp]["tags"].forEach(tag => {
        $(".badgeBox").eq(tag[0]).addClass("tagInUse")
    });

    $(".tagTop").fadeIn(50)

    if ($(".tagContainer").children().length == 0) {
        let tagNames = jsStr["TAGS"][LANG]
        for (let b = 0; b < 27; b++) {
            $(".tagContainer").append(`
            <div class="badgeBox button noMobileResize">
                <img src="images/badges/${b}.svg">
                <div class="uploadText tagName" style="font-size: var(--miniFont)">${tagNames[b]}</div>
            </div>
            `)
        }
    }
    else {
        $(".tagClose").off("click")
        $(".badgeBox").off("click")  
    }

    $(".tagClose").click(() => { hideBGdialog(); $(".tagTop").fadeOut(50) })
    $(".badgeBox").click(e => { clickTag(e, lp) })

}

function clickTag(e, lp) {
    let tagName, badgeIndex, linkURL
    let linkHighlight = "none"
    if (levelList[lp]["tags"].length == 0) $(".tagViewer").empty()
    if (typeof e != "number") { // Event details from click, used in tag picker
        $(e.currentTarget).addClass("tagInUse")
        badgeIndex = Object.values($(".badgeBox")).indexOf(e.currentTarget)
        tagName = $(".tagName").eq(badgeIndex).text()
        linkURL = ""

        // [badgeIndex, name (-1 default),link]
        levelList[lp]["tags"].push([badgeIndex, -1, ""])
    }
    else { // loading index from tag array
        badgeIndex = levelList[lp]["tags"][e][0]
        tagName = levelList[lp]["tags"][e][1] == -1 ? jsStr["TAGS"][LANG][levelList[lp]["tags"][e][0]] : levelList[lp]["tags"][e][1]
        linkURL = levelList[lp]["tags"][e][2]
        linkHighlight = levelList[lp].tags[e][2] == "" ? "none" : "var(--redHighlight)"
    }

    $(".tagViewer").append(`
    <div class="tagEditBox">
        <img src="images/showCommsL.svg" class="button tagMoveL">
        <div class="tagDataContainer">
            <div class="tagButtonsContainer">
                <img src="images/link.svg" class="button tagLink" style="filter: ${linkHighlight};">
                <img src='images/badges/${badgeIndex}.svg' id="editBadge">
                <img src="images/close.svg" class="button deleteTag">
            </div>
            <input maxlength="50" type="text" id="tagNameInput" class="tagInput" placeholder="${jsStr['TAGDESC'][LANG]}" value="${tagName}">
            <input maxlength="100" type="text" id="tagNameInput" class="tagLinkInput" placeholder="${jsStr['TAGLINK'][LANG]}" style="display:none" value="${linkURL}">
        </div>
        <img src="images/showComms.svg" class="button tagMoveR">
    </div>
    `)

    $(".deleteTag:last()").click(e => {
        let index = Object.values($(".tagEditBox")).indexOf($(e.currentTarget).parents()[2])
        levelList[lp]["tags"].splice(index, 1)
        $(e.currentTarget).parents().eq(2).remove()

        if (levelList[lp]["tags"].length == 0) {
            $(".tagViewer:visible").append(jsStr["TAGADDHELP"][LANG])
        }
    })
    $(".tagLink:last()").click(e => {
        let index = Object.values($(".tagEditBox")).indexOf($(e.currentTarget).parents()[2])
        let linkInput = $(e.currentTarget).parents().eq(1).children().eq(2)
        let nameInput = $(e.currentTarget).parents().eq(1).children().eq(1)
        if (linkInput.css("display") != "none") {
            linkInput.hide(); nameInput.show();
            $(e.currentTarget).css("filter", levelList[lp].tags[index][2] == "" ? "none" : "var(--redHighlight)")
        }
        else { linkInput.show(); nameInput.hide(); $(e.currentTarget).css("filter", "var(--lightHighlight)") }
    })

    $(".tagMoveL:last()").click(e => {
        let currIndex = Object.values($(".tagEditBox")).indexOf($(e.currentTarget).parent()[0])

        if (currIndex > 0) {
            let prevValue = levelList[lp]["tags"][currIndex]
            levelList[lp]["tags"].splice(currIndex, 1) // Delete current value
            levelList[lp]["tags"].splice(currIndex - 1, 0, prevValue) // Insert it again

            $(".tagEditBox").eq(currIndex).insertBefore($(".tagEditBox").eq(currIndex - 1))
        }
    })

    $(".tagMoveR:last()").click(e => {
        let currIndex = Object.values($(".tagEditBox")).indexOf($(e.currentTarget).parent()[0])

        if (currIndex < $(".tagEditBox").length) {
            let prevValue = levelList[lp]["tags"][currIndex]
            levelList[lp]["tags"].splice(currIndex, 1) // Delete current value
            levelList[lp]["tags"].splice(currIndex + 1, 0, prevValue) // Insert it again

            $(".tagEditBox").eq(currIndex).insertAfter($(".tagEditBox").eq(currIndex + 1))
        }
    })

    $(".tagInput:last()").on("change", e => {
        let index = Object.values($(".tagEditBox")).indexOf($(e.currentTarget).parents().eq(1)[0])

        if (e.target.value.length == 0) {
            levelList[lp]["tags"][index][1] = -1
            e.target.value = jsStr["TAGS"][LANG][badgeIndex]
        }
        levelList[lp]["tags"][index][1] = e.target.value
    })
    $(".tagLinkInput:last()").on("change", e => {
        let index = Object.values($(".tagEditBox")).indexOf($(e.currentTarget).parents().eq(1)[0])

        levelList[lp]["tags"][index][2] = e.target.value
    })
}

function openTagPicker(lp) {
    $('.cardContainer' + lp).empty()
    if (openedPane == 3 || $('.cardContainer' + lp).css("display") == "none") $('.cardContainer' + lp).slideToggle(50)
    openedPane = 3

    $('.cardContainer' + lp).append(`
    <div class="difficultyPicker" style="height: 4.7em;">
    <div class="tagViewer" style="display: flex; gap: 1em; overflow: auto; align-items: center;"><div class="addTagHelp">${jsStr["TAGADDHELP"][LANG]}</div></div>        <div style="display: flex;align-items: center;">
            <img style="width:2em; margin-right: 0.5em;" src="./images/plus.svg" title="${jsStr["ADDTAG"][LANG]}" class="button diffOptions" onclick="tagPopup(${lp})">
        </div>
    </div>`)

    if (levelList[lp]["tags"] == undefined) {
        levelList[lp]["tags"] = []
    }

    if (levelList[lp]["tags"].length > 0) {
        $(".addTagHelp").remove()
    }
    let i = 0;
    levelList[lp]["tags"].forEach(tag => {
        clickTag(i, lp)
        i++
    })
}

function removeLevel(id) {
    delete levelList[($(".listPosition" + id.toString()).val())];

    // Enables the add button
    if (getListLen(levelList) + 1 < 51) {
        $(".addCardButton").removeClass("disabled");
    }

    for (j = id + 1; j <= getListLen(levelList) + 1; j++) {
        updateCardData(j, j - 1);
        availFill(0, $(".cardLName" + id).text(), "freedom69", id)
        availFill(1, $(".cardLCreator" + id).text(), "freedom69", id)
    }

    // Adds the tutorial, when the list is empty
    if (getListLen(levelList) + 1 == 1) {
        $("#mainContent").html(jsStr["HELP_TEXT"][LANG]);
        $(".previewButton").addClass("disabled");
    }

    $("#top" + id.toString()).remove();
    $("#smtop" + id.toString()).remove();

    updateSmPos();
    $("#top" + id.toString()).show();
    $("#smtop" + id.toString()).hide();

    // Removing a card duplicates the "card" div - fix
    for (k = 0; k < $(".card" + id.toString()).length; k++) {
        // Removes all card empty divs
        if ($(".card" + id.toString())[k]["innerHTML"].length < 20) {
            $(".card" + id.toString())[k].remove()
        }
    }
}

function card(index) {
    return `
    <div class="card${index}">
    <div onclick="displayCard(${index});" class="smallPosEdit" id="smtop${index}">
    </div>
    <div class="positionEdit" id="top${index}">
        <div style="display: flex; justify-content: space-between;">
            <div style="display: flex; align-items: center;">
                <img id="posInputPics" src="./images/star.webp">
                <input autocomplete="off" maxlength="8" placeholder="${jsStr['L_LEVID'][LANG]}" id="posInputBox" class="idbox${index} cardInput" type="text">
                <img id="passSubmit" src="images/searchOpaque.svg" onclick="getDetailsFromID(${index})" class="fillID button disabled idDetailGetter${index}" style="margin-left: 1em;">
            </div>

            <div class="positionButtons">
                <img title="${jsStr['L_MOVE_U'][LANG]}" onclick="moveCard('up',${index})" 
                     class="button upmover${index}" id="moveLPosButton"
                     src="./images/showCommsU.svg">

                <input type="text" autocomplete="off" class="listPosition${index}" id="positionDisplay" disabled="true" value="${index}">

                <img title="${jsStr['L_MOVE_D'][LANG]}" onclick="moveCard('down',${index})"
                        class="button downmover${index}" id="moveLPosButton"
                        src="./images/showCommsD.svg">
            </div>
        </div>

        <hr id="lineSplit${index}" class="lineSplitGeneral">

        <div style="display: flex; flex-wrap: wrap;">
            <div style="display: flex; flex-wrap: wrap; width: 100%; align-items: center;">
                <img id="posInputPics" src="./images/island.webp">
                <input id="posInputBox" maxlength="25" class="cardLName${index} cardInput" type="text" autocomplete="off" placeholder="${jsStr['L_NAME'][LANG]}">

                <hr class="availFill" style="margin-left: 2%; opacity: 0.3;">

                <img id="passSubmit" src="images/searchOpaque.svg" onclick="getDetailsFromName(${index})" class="disabled button nameDetailGetter${index}">

                <hr class="availFill" style="margin-right: 2%; opacity: 0.3;">

                <input id="posInputBox" maxlength="25" class="cardInput cardLCreator${index}" autocomplete="off" type="text" placeholder="${jsStr['L_BUILDER'][LANG]}" style="display: inline-flex;"><br />
                <img class="collListBut button colButton${index}" style="margin-left: 1vw;" id="posInputPics" src="./images/bytost.webp" onclick="showCollabTools(${index})">
            </div>

            <div style="display: flex; width: 100%;">
                <div style="display: flex; align-items: center;">
                    <img id="posInputPics" src="./images/yticon.webp">
                    <input class="cardLVideo${index} cardInput" maxlength="50" autocomplete="off" id="posInputBox" type="text" placeholder="${jsStr['L_VIDEO'][LANG]}">
                </div>
                
                <div class="cardButtonsContainer">
                    <img title="${jsStr['DEL_CARD'][LANG]}" class="removerButton${index} button cardButton"
                        onclick="removeLevel(${index})" src="./images/delete.webp">

                    <img title="${jsStr['CARD_COL'][LANG]}" class="button cardButton cPickerBut${index}" onclick="openColorPicker(${index})" src="./images/colorSelect.webp">
                    <div title="${jsStr["LEV_DIFF"][LANG]}" class="button cardButton diffContainer dPick${index}" onclick="openDiffPicker(${index})">
                        <img id="diffBG" src="./images/faces/diffContainer.webp">
                        <img class="diffIcon diffMain" src="./images/faces/0.webp">
                        <img class="diffIcon diffBack">
                    </div>
                    <img title="${jsStr['TAGSTIT'][LANG]}" class="button cardButton tagPicker${index}"
                        onclick="openTagPicker(${index})" src="./images/tags.webp">
                </div>
            </div>

            <div class="cardExtrasContainer cardContainer${index}">
            </div>
        </div>
    </div>
</div>
    `;
}
// <img title="Pozadí karty" class="button cardButton cPickerBut${index}" onclick="openBGPicker(${index})" src="./images/bgSelect.webp">
async function preview(skipCheck = false) {
    if (!checkJson(JSON.stringify(levelList), true) && !skipCheck) return
    $(".errNotif").fadeOut(10)
    $("#levelUpload").fadeOut(100)

    $(".uploadTitle").text(jsStr["PREVIEW_L"][LANG])
    $(".uploader").prepend(`<img src="images/arrow-left.webp" class="button backToEditor">`)
    $(".backToEditor").click(editorBack)

    if ($(".preview").length == 0) {
        await $.get("./parts/listViewer.html", data => {
            $("#app").append("<div class='preview'>" + translateDoc(data, "listViewer") + "</div>")
        })
    }
    else { $(".preview").fadeIn(100) }

    LIST_ID = -8
    let previewList = JSON.parse(JSON.stringify(levelList))
    generateList(previewList, [$("#listnm").val(), $("#creatornm").val()])
}

function editorBack() {
    $(".uploadTitle").text(jsStr["UPLOAD"][LANG])
    $(".preview").fadeOut(100)
    $(".backToEditor").remove()
    $(".boards").empty()
    $("#levelUpload").fadeIn(100)
}

function guesserOptions(ind) {
    levelList.diffGuesser[ind] = !levelList.diffGuesser[ind]
    $(".diffSelBut img").eq(ind - 1).toggleClass("disabled")
    if (levelList.diffGuesser.filter(x => x == true).length == 1) {
        $(".diffSelBut img").removeClass("disabled")
        levelList.diffGuesser = [false, true, true]
        $(".settingSubbox").slideToggle(50)
        checkCheckbox("diffGuesser")
    }
}
