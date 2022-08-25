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

        $.get("https://gdbrowser.com/api/level/" + givenID, function (data) {
            if (data != -1) {
                $(".cardLName" + id).val(data["name"]);
                levelList[id]["levelName"] = data["name"];
                $(".cardLCreator" + id).val(data["author"]);
                levelList[id]["creator"] = data["author"];
            }
            else {
                $(".idbox" + id).addClass("inputErr");
                setTimeout(() => { $(".idbox" + id).removeClass("inputErr") }, 500);
                // TODO: Add flickering or something....
            }
        })
        updateSmPos()
    }
}

var succ = false
async function getDetailsFromName(id) {
    succ = false

    id = id.toString()
    let givenName = $(".cardLName" + id).val();
    let givenMaker = $(".cardLCreator" + id).val();

    // Only level name passed in (most liked with that name)
    if (givenName != "" && givenMaker == "") url = `https://gdbrowser.com/api/search/${givenName}?count=1`
    // Only creator passed in (newest level from user)
    else if (givenName == "" && givenMaker != "") url = `https://gdbrowser.com/api/search/${givenMaker}?count=1&user`
    // Both passed in (newest level from passed in used with the passed in name)
    else {
        for (let pages = 0; pages < MAX_GDB_SCROLL; pages++) {
            if (!succ) {
                await $.ajax({
                    url: `https://gdbrowser.com/api/search/${givenMaker}?page=${pages}&user`, timeout: 1000, "Access-Control-Allow-Origin": "*",
                    success: data => {
                        Object.values(data).forEach(level => {
                            if (level.name.toLowerCase().includes(givenName.toLowerCase()) && level.author.toLowerCase().includes(givenMaker.toLowerCase())) {
                                saveGDBresult(id, level)
                            }
                        })
                    },
                    error: () => {
                        if (pages == MAX_GDB_SCROLL - 1) {
                            $(".cardLName" + id).addClass("inputErr");
                            setTimeout(() => { $(".cardLName" + id).removeClass("inputErr") }, 500);

                            $(".cardLCreator" + id).addClass("inputErr");
                            setTimeout(() => { $(".cardLCreator" + id).removeClass("inputErr") }, 500);
                        }
                    }
                }).then(() => { }, () => { })
            }
        }
        return null
    }

    // Hledání nejlikovanějšího levelu
    await $.ajax({
        url: url, timeout: 1000, "Access-Control-Allow-Origin": "*",
        success: data => {
            if (data.length > 0) {
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

    availFill(0, $(".cardLName" + id), "freedom69", id)
    availFill(1, $(".cardLCreator" + id), "freedom69", id)

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
}

function saveDifficulty(difficulty, cp, listPos) {
    // cp (gdbrowser cp): -1: keep old rate, 0: norate, 1: star rate, 2: featured, 3: epic

    // bad gdbrowser response
    let stringDiffs = ["NA", "Easy", "Normal", "Hard", "Harder", "Insane", "Easy Demon", "Medium Demon", "Hard Demon", "Insane Demon", "Extreme Demon", "Auto"]
    if (typeof difficulty == "string") difficulty = stringDiffs.indexOf(difficulty)
    // If not string, I passed it in as an integer (hopefully :P), corresponds to prev. line

    if (difficulty == 0) cp = 0

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
    $(".gdSlider").off("onclick")
}
function showBGdialog() {
    $(".bgProps").fadeIn(100)
    $(".boom").css("background-color", "#000000a0")
    $(".boom").show()
    $(".boom").animate({ "opacity": 100 }, 200)
}

function checkPassword() {
    if (Object.values($("#passSubmit")[0].classList).includes("disabled")) return

    if ($("#lpass").val().length == 0) return

    $("#lpass").attr("disabled", true)
    $("#passSubmit").addClass("disabled")

    let loadProps = JSON.parse(sessionStorage.getItem("listProps"))
    let postReq = {"pwdEntered": $("#lpass").val()};

    // Is list private?
    postReq[!loadProps[2] ? "id" : "pid"] = loadProps[0];
    $("#passEditor h3").text(jsStr["CHECKING"][LANG])
    $.post("./php/pwdCheckAction.php", postReq, function (data) {
        if (typeof data == "object") generateFromJSON(2, data)
        else {
            $("#passEditor h3").text(jsStr["TYPEPASS"][LANG])
            $("#passEditor").css("animation-name","inputError")
            setTimeout(() => {
                $("#lpass").attr("disabled", false)
                $("#passSubmit").removeClass("disabled")
                $("#lpass").val()
                $("#passEditor").css("animation-name","")
            }, 500);

        }
    })
}

function generateFromJSON(part, boards) {
    $(".uploadTitle").text(jsStr["EDITING"][LANG]);
    let loadProps = JSON.parse(sessionStorage.getItem("listProps"))

    // Disabling input boxes when editing a list
    $("#listnm").attr("disabled", "true");
    $("#creatornm").attr("disabled", "true");
    if (part == 1) {
        $("#listnm").val(loadProps[3]);
        $("#creatornm").val(loadProps[4]);
        $(".uploadBG > *:not(#listnm, #creatornm, br)").hide()
        $("#passEditor").show()
        return
    }

    $(".uploadBG > *:not(.imgPreview)").show()
    $("#passEditor").slideUp(50)
    $("#submitbutton").attr("value", jsStr["L_UPDATE"][LANG])
    $("#submitbutton").attr("onclick", "updateList()")

    $("#submitarea").append(`<input onclick="removeList()" class="button noMobileResize" type="button" id="removebutton" value="${jsStr["DELETE"][LANG]}">`)

    // Is the list hidden?
    if (boards["hidden"] != "0") {
        $(`img[for="hidden"]`).attr("src", "images/check-on.webp")
        $(`input[name="hidden"]`).attr("checked", true)
    }

    
    // Removing tutorial
    $("#mainContent").text("");
    $(".previewButton").removeClass("disabled");
    
    $("#listnm").val(boards["name"])
    $("#creatornm").val(boards["creator"])
    
    levelList = JSON.parse(boards["data"]);
    $(".titImgInp").val(levelList["titleImg"])
    
    // Is it a diff guess list?
    if (levelList["diffGuesser"] != undefined && levelList["diffGuesser"][0]) {
        $(`img[for="diffGuesser"]`).attr("src", "images/check-on.webp")
        $(`input[name="diffGuesser"]`).attr("checked", true)
        $(".settingSubbox").show()
        if (!levelList["diffGuesser"][1]) $(".settingSubbox img").eq(0).addClass("disabled")
        if (!levelList["diffGuesser"][2]) $(".settingSubbox img").eq(1).addClass("disabled")
    }

    // Change page background, if not default
    if (levelList["pageBGcolor"] != "#020202") {
        $("#bgcolorPicker").css("background", levelList["pageBGcolor"])
        $("body").css("background-color", levelList["pageBGcolor"])
        let hue = getHueFromHEX(levelList["pageBGcolor"])
        $(":root").css("--greenGradient", `linear-gradient(9deg, hsl(${hue},23.1%,10.2%), hsl(${hue},90.6%,16.7%))`)
    }

    for (y = 0; y < Object.keys(levelList).length - 1 - ADDIT_VALS; y++) {
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
        let rate = ["", "featured", "epic"][levelList[lp]["difficulty"][1]]

        $(`.dPick${lp} > .diffMain`).attr("src", `images/faces/${levelList[lp]["difficulty"][0]}.webp`) // change face
        if (rate != "") $(`.dPick${lp} > .diffBack`).attr("src", `images/faces/${rate}.webp`) // change rate glow

        if (rate == "featured") $(`.dPick${lp} > .diffBack`).attr("id", "featuredGlow") // glow ids
        else $(`.dPick${lp} > .diffBack`).attr("id", "epicGlow")
    }

    availFill(0, $(".cardLName" + lp), "freedom69", lp)
    availFill(1, $(".cardLCreator" + lp), "freedom69", lp)
}
function moveCard(position, currID) {
    let listPlacement = parseInt($(".listPosition" + currID.toString()).val());
    if (position == "up" & currID >= 0) {
        if (listPlacement > 1) {
            refreshCardDetails(listPlacement)
            $(".card" + (listPlacement - 1)).before($(".card" + (listPlacement)));

            updateCardData(listPlacement - 1, -1);
            updateCardData(listPlacement, listPlacement - 1);
            updateCardData(-1, listPlacement)

            refreshCardDetails(listPlacement)
            listPlacement--
        }
    }
    else if (position == "down" & currID < Object.keys(levelList).length - ADDIT_VALS) {
        if (listPlacement < Object.keys(levelList).length - 1 - ADDIT_VALS) {
            refreshCardDetails(listPlacement)
            $(".card" + (listPlacement + 1)).after($(".card" + (listPlacement)));

            updateCardData(listPlacement + 1, -1);
            updateCardData(listPlacement, listPlacement + 1);
            updateCardData(-1, listPlacement);

            refreshCardDetails(listPlacement)
            listPlacement++
        }
    }
    else { return false; }

    updateSmPos();
    document.getElementById("top" + listPlacement).scrollIntoView();
    $(".cardExtrasContainer").text('')
    $(".cardExtrasContainer").hide()
    return true;
}

function updateSmPos() {
    for (i = 1; i < Object.keys(levelList).length - ADDIT_VALS; i++) {
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
    if (id > 0 & id < Object.keys(levelList).length - ADDIT_VALS) {
        $(".smallPosEdit").show();
        $("#smtop" + id.toString()).hide();
        $(".positionEdit").hide();
        $("#top" + id.toString()).css("transform", "scaleY(0.8)");
        $("#top" + id.toString()).show();
        $("#top" + id.toString()).css("transform", "scaleY(1)");
        $(".cardExtrasContainer").text('')
        $(".cardExtrasContainer").hide()
        updateSmPos()

        // Disable/Enable search buttons depending on if there's text in them
        if ($(".idbox" + id).val().length != 0) { $(".idDetailGetter" + id).removeClass("disabled") }
        else { $(".idDetailGetter" + id).addClass("disabled") }
    }
}

function availFill(type, sel, key, pos) {
    // Shows/hides those white rectangles in the card
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
    if (Object.keys(levelList).length - ADDIT_VALS > 50) return

    $(".levelPickerContainer").text("")
    $(".savedFilter").val("")

    if (favesData != null) { favesData = OGfavesData; makeFavesPicker() }
    else $("iframe").attr("src", "./packs.html?type=fetchFaves")

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
    var listLenght = Object.keys(levelList).length - ADDIT_VALS;
    levelList[listLenght] = {
        "levelName": favesData[ind][0],
        "creator": favesData[ind][1],
        "levelID": favesData[ind][2],
        "video": null,
        "color": favesData[ind][3],
        "difficulty": [0, 0],
        "background": [1, true, 30, 100] //BG, gradient, alpha, brightness
    };
    loadLevel(listLenght)
    displayCard(listLenght)

    if (listLenght >= 50) { $(".levelPickerContainer").empty(); maxAddedDialog() }
}

var favesData
var OGfavesData
window.addEventListener("message", mess => {
    let state = mess.data;
    if (state == "fetchFaves") {
        let data = JSON.parse($("iframe")[0].contentDocument.querySelector(".fetcher").innerText)
        if (data != null) {
            favesData = JSON.parse($("iframe")[0].contentDocument.querySelector(".fetcher").innerText)
            OGfavesData = JSON.parse($("iframe")[0].contentDocument.querySelector(".fetcher").innerText)
        }

        // No key in localStorage (first time entering site)
        else { favesData = []; OGfavesData = [] }
        makeFavesPicker()
    }
}
)

function makeFavesPicker() {
    $(".levelPickerContainer").empty()
    if (Object.keys(levelList).length - ADDIT_VALS > 50) {
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

async function addLevel() {
    var listLenght = Object.keys(levelList).length - ADDIT_VALS;
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
        "background": [1, true, 30, 100] //BG, gradient, alpha, brightness
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
    $(".colButton" + prevID).attr("class", "button colButton" + newID);
    $(".cardContainer" + prevID).attr("class", "cardExtrasContainer cardContainer" + newID);
    $(".cPickerBut" + prevID).attr("onclick", "openColorPicker(" + newID + ")");
    $(".cPickerBut" + prevID).attr("class", "button cardButton cPickerBut" + newID);
    $(".dPick" + prevID).attr("onclick", "openDiffPicker(" + newID + ")");
    $(".dPick" + prevID).attr("class", "button cardButton diffContainer dPick" + newID);

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

function removeLevel(id) {
    delete levelList[($(".listPosition" + id.toString()).val())];

    // Enables the add button
    if (Object.keys(levelList).length - ADDIT_VALS < 51) {
        $(".addCardButton").removeClass("disabled");
    }

    for (j = id + 1; j <= Object.keys(levelList).length - ADDIT_VALS; j++) {
        updateCardData(j, j - 1);
        availFill(0, $(".cardLName" + id), "freedom69", id)
        availFill(1, $(".cardLCreator" + id), "freedom69", id)
    }

    // Adds the tutorial, when the list is empty
    if ((Object.keys(levelList)).length - ADDIT_VALS == 1) {
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

var levelList = {
    "titleImg": "",
    "pageBGcolor": "#020202",
    "diffGuesser": [false, true, true]
}

function card(index) {
    return `
    <div class="card${index}">
    <div onclick="displayCard(${index});" class="smallPosEdit" id="smtop${index}">
    </div>
    <div class="positionEdit" id="top${index}">
        <div style="display: flex">
            <div style="display: flex; align-items: center;">
                <img id="posInputPics" src="./images/star.webp">
                <input autocomplete="off" placeholder="${jsStr['L_LEVID'][LANG]}" id="posInputBox" class="idbox${index} cardInput" type="text" style="transform: translateY(0%);">

                <img id="fillButton" src="./images/getStats.webp" onclick="getDetailsFromID(${index})" class="fillID button disabled idDetailGetter${index}">
            </div>

            <div class="positionButtons">
                <img title="${jsStr['L_MOVE_D'][LANG]}" onclick="moveCard('up',${index})" 
                     class="button upmover${index}" style="transform: rotate(90deg);" id="moveLPosButton"
                     src="./images/arrow.webp">

                <input type="text" autocomplete="off" class="listPosition${index}" id="positionDisplay" disabled="true" value="${index}">

                <img title="${jsStr['L_MOVE_U'][LANG]}" onclick="moveCard('down',${index})"
                        class="button downmover${index}" style="transform: rotate(-90deg);" id="moveLPosButton"
                        src="./images/arrow.webp">
            </div>
        </div>

        <hr id="lineSplit${index}" class="lineSplitGeneral">

        <div style="display: flex; flex-wrap: wrap;">
            <div style="display: flex; flex-wrap: wrap; width: 100%; align-items: center;">
                <img id="posInputPics" src="./images/island.webp">
                <input id="posInputBox" class="cardLName${index} cardInput" type="text" autocomplete="off" placeholder="${jsStr['L_NAME'][LANG]}">

                <hr class="availFill" style="margin-left: 2%; opacity: 0.3;">

                <img id="fillButton" onclick="getDetailsFromName(${index})" class="disabled button nameDetailGetter${index}" src="./images/getStats.webp">
                
                <hr class="availFill" style="margin-right: 2%; opacity: 0.3;">

                <input id="posInputBox" class="cardInput cardLCreator${index}" autocomplete="off" type="text" placeholder="${jsStr['L_BUILDER'][LANG]}" style="width: 15vw;display: inline-flex;"><br />
                <img class="button colButton${index}" style="margin-left: 1vw;" id="posInputPics" src="./images/bytost.webp" onclick="showCollabTools(${index})">
            </div>

            <div style="display: flex; width: 100%;">
                <div style="display: flex; align-items: center;">
                    <img id="posInputPics" src="./images/yticon.webp">
                    <input class="cardLVideo${index} cardInput" autocomplete="off" id="posInputBox" type="text" placeholder="${jsStr['L_VIDEO'][LANG]}">
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
function preview(skipCheck = false) {
    if (!checkJson(JSON.stringify(levelList), true) && !skipCheck) return

    let data = JSON.stringify(levelList);
    let encodedData = [];
    for (i = 0; i < data.length; i++) {
        encodedData.push(data.charCodeAt(i));
    }
    encodedData = btoa(encodedData.join(","));
    sessionStorage.setItem("previewJson", encodedData);
    window.open("./index.html?preview=1", "_blank")

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

var fuckupMessages;
$(function () {
    $("#mainContent").append(jsStr["HELP_TEXT"][LANG]);

    $(".savedFilter").on("keyup", searchFaves)
})
