const MAX_GDB_SCROLL = 5

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

        $.get("https://gdbrowser.com/api/level/" + givenID, function (data, res) {
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
                    if (pages == MAX_GDB_SCROLL-1) {
                        $(".cardLName" + id).addClass("inputErr");
                        setTimeout(() => { $(".cardLName" + id).removeClass("inputErr") }, 500);

                        $(".cardLCreator" + id).addClass("inputErr");
                        setTimeout(() => { $(".cardLCreator" + id).removeClass("inputErr") }, 500);
                    }
                }
            }).then(() => {}, () => {})
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

    if ($(".idbox"+id).val() != "") { $(".idDetailGetter"+id).removeClass("disabled") }
    else { $(".idDetailGetter"+id).addClass("disabled") }

    availFill(0,$(".cardLName" + id), "freedom69", id)
    availFill(1,$(".cardLCreator" + id), "freedom69", id)

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

    $(".idbox" + id).val(jsonData["id"]);
    levelList[id]["levelID"] = jsonData["id"]
}

function colorizePage() {
    let selColor = $("#bgcolorPicker").val()

    let hue = getHueFromHEX(selColor)

    levelList["pageBGcolor"] = selColor;

    $("body").css("background-color", selColor)
    $(".editorHeader").css("background-color", "hsl(" + hue + ",40.7%,54%)")
    $("#mainContent").css("background-color", "hsl(" + hue + ",40.7%,25%)")
    $(".uploadBG").css("background-color", "hsl(" + hue + ",11.5%,22.2%)")
    $("#submitbutton").css("background-color", "hsl(" + hue + ",53.5%,63.7%)")
}

function generateFromJSON(event = null) {
    let listID = location.search.slice(1).split(/[=&]/g);
    let listType = "id";
    if (listID[0] == "pedit") {
        listType = "pid";
    }
    let postReq = { "pwdEntered": listID[3], "retData": "1" };
    postReq[listType] = listID[1];
    
    $.post("./php/pwdCheckAction.php", postReq, function (data) {
        if (["1","2"].includes(data)) {
            window.location.replace("./upload.html")
        }

        let lData = $("#listData").html(data).text()
        lData = lData.split(";-!-;")
        // Is the list hidden?
        if (lData[3] != "0") {
            $(`img[for="hidden"]`).attr("src", "images/check-on.png")
            $(`input[name="hidden"]`).attr("checked", true)
        }

        // Removing tutorial
        $("#mainContent").text("");
        $(".previewButton").removeClass("disabled");

        $("#listnm").val(lData[0])
        $("#creatornm").val(lData[1])

        levelList = JSON.parse(lData[2]);
        $(".titImgInp").val(levelList["titleImg"])
        $("#bgcolorPicker").val(levelList["pageBGcolor"])
        colorizePage()

        for (y = 0; y < Object.keys(levelList).length - 1 - ADDIT_VALS; y++) {
            loadLevel(y + 1)
        }
        updateSmPos()
        displayCard("1")
        
        isHidden = lData[3] != "0";
    })
}

function refreshCardDetails(lp) {
    $(".cardLName" + lp).val(levelList[lp]["levelName"])
    $(".cardLCreator" + lp).val(levelList[lp]["creator"])
    $(".idbox" + lp).val(levelList[lp]["levelID"])
    $(".cardLVideo" + lp).val(levelList[lp]["video"])
    $("#top" + lp).css("background-color", levelList[lp]["color"])
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
                $("#smtop" + i.toString()).text(`#${i} - ${levelList[i]["levelName"]} ${jsStr["CREATOR_BY"][LANG].slice(0,-2)} ${levelList[i]["creator"]}`);
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
    $("#top" + target).css("border-color", `hsl(${hue}, ${DEFAULT_SATURATION}, ${lightness-5}%)`);
    $("#lineSplit" + target).css("background-color", `hsl(${hue}, ${DEFAULT_SATURATION}, ${lightness-5}%)`);
    $(".cardContainer" + target).css("background-color", `hsl(${hue}, ${DEFAULT_SATURATION}, ${lightness-5}%)`);

    let inHex = HSLtoHEX(hue, DEFAULT_SATURATION, lightness+"%");
    levelList[target]["color"] = inHex;
}

function changeIDbox(k) {
    let selection = k.target.value
    let position = ($(this)[0]["className"]).match(/[0-9]/g).join("")
    if (k.type == "change") {
        levelList[position]["levelID"] = selection;
    }
    else {
        if (selection.length < 1) { $(".idDetailGetter"+position).addClass("disabled") }
        else if (selection.length > 0) { $(".idDetailGetter"+position).removeClass("disabled") }
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

function addLevel() {
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
    $("#mainContent").append(card(listLenght));
    // Skryje zabalenou kartu právě přidané karty
    $("#smtop" + listLenght).hide();
    // Adds the card to the JSON
    levelList[listLenght] = {
        "levelName": "",
        "creator": "",
        "levelID": null,
        "video": null,
        "color": ""
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
    $("#mainContent").append(card(pos))
    refreshCardDetails(pos)

    let chosenColor = levelList[pos]["color"];
    let rgb = HEXtoRGB(chosenColor, 40)

    $("#top" + pos).css("border-color", `rgb(${rgb.join(",")})`);
    $("#lineSplit" + pos).css("background-color", `rgb(${rgb.join(",")})`);

    // Setting card buttons
    $("#colorPicker" + listLenght).on("change", changeColPicker);
    $(".idbox" + listLenght).on("change keyup", changeIDbox);
    $(".cardLName" + listLenght).on("keyup", changeLevelName);
    $(".cardLCreator" + listLenght).on("keyup", changeLevelCreator);
    $(".cardLVideo" + listLenght).on("change", changeLevelVideo);
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
    $('.cardContainer'+lp).text('')
    $('.cardContainer'+lp).slideToggle(50)

    let color = makeColorElement(getHueFromHEX(levelList[lp]["color"]), getLightnessFromHEX(levelList[lp]["color"]))
    color.on("input", k => {
        changeColPicker($(k.target).val(), lp, k.target.previousElementSibling.className == "hueChanger")
    })
    color.appendTo($(".cardContainer"+lp))
}

function removeLevel(id) {
    delete levelList[($(".listPosition" + id.toString()).val())];

    // Enables the add button
    if (Object.keys(levelList).length - ADDIT_VALS < 51) {
        $(".addCardButton").removeClass("disabled");
    }

    for (j = id + 1; j <= Object.keys(levelList).length - ADDIT_VALS; j++) {
        updateCardData(j, j - 1);
        availFill(0,$(".cardLName" + id), "freedom69", id)
        availFill(1,$(".cardLCreator" + id), "freedom69", id)
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
    "pageBGcolor": "#020202"
}

function card(index, rndColor) {
    return `
<div class="card${index}">
    <div onclick="displayCard(${index});" class="smallPosEdit" id="smtop${index}">
    </div>
    <div class="positionEdit" id="top${index}">
        <div style="display: flex">
            <div style="display: flex; align-items: center;">
                <img id="posInputPics" src="./images/star.png">
                <input autocomplete="off" placeholder="${jsStr["L_LEVID"][LANG]}" id="posInputBox" class="idbox${index} cardInput" type="text" style="transform: translateY(0%);">

                <img id="fillButton" src="./images/getStats.png" onclick="getDetailsFromID(${index})"class="fillID button disabled idDetailGetter${index}">
            </div>

            <div class="positionButtons">
                <img title="${jsStr["L_MOVE_D"][LANG]}" onclick="moveCard('up',${index})" 
                     class="button upmover${index}" style="transform: rotate(90deg);" id="moveLPosButton"
                     src="./images/arrow.png">

                <input type="text" autocomplete="off" class="listPosition${index}" id="positionDisplay" disabled="true" value="${index}">

                <img title="${jsStr["L_MOVE_U"][LANG]}" onclick="moveCard('down',${index})"
                        class="button downmover${index}" style="transform: rotate(-90deg);" id="moveLPosButton"
                        src="./images/arrow.png">
            </div>
        </div>

        <hr id="lineSplit${index}" class="lineSplitGeneral">

        <div style="display: flex; flex-wrap: wrap;">
            <div style="display: flex; flex-wrap: wrap; width: 100%; align-items: center;">
                <img id="posInputPics" src="./images/island.png">
                <input id="posInputBox" class="cardLName${index} cardInput" type="text" autocomplete="off" placeholder="${jsStr["L_NAME"][LANG]}">

                <hr class="availFill" style="margin-left: 2%; opacity: 0.3;">

                <img id="fillButton" onclick="getDetailsFromName(${index})" class="disabled button nameDetailGetter${index}" src="./images/getStats.png">
                
                <hr class="availFill" style="margin-right: 2%; opacity: 0.3;">

                <input id="posInputBox" class="cardInput cardLCreator${index}" autocomplete="off" type="text" placeholder="${jsStr["L_BUILDER"][LANG]}" style="width: 15vw;display: inline-flex;"><br />
                <img class="button colButton${index}" style="margin-left: 1vw;" id="posInputPics" src="./images/bytost.png" onclick="showCollabTools(${index})">
            </div>

            <div style="display: flex; width: 100%;">
                <div style="display: flex; align-items: center;">
                    <img id="posInputPics" src="./images/yticon.png">
                    <input class="cardLVideo${index} cardInput" autocomplete="off" id="posInputBox" type="text" placeholder="${jsStr["L_VIDEO"][LANG]}">
                </div>
                
                <div class="cardButtonsContainer">
                    <img title="${jsStr["DEL_CARD"][LANG]}" class="removerButton${index} button cardButton"
                        onclick="removeLevel(${index})" src="./images/delete.png">

                    <img class="button cardButton cPickerBut${index}" onclick="openColorPicker(${index})" src="./images/colorSelect.png">
                </div>
            </div>

            <div class="cardExtrasContainer cardContainer${index}"></div>
        </div>
    </div>
</div>
    `;
}

var fupPos = 0;
function preview() {
    if (checkJson(JSON.stringify(levelList)) == false) {
        return null;
    }

    if (Object.keys(levelList).length - ADDIT_VALS > 1) {
        let data = JSON.stringify(levelList);
        let encodedData = [];
        for (i = 0; i < data.length; i++) {
            encodedData.push(data.charCodeAt(i));
        }
        encodedData = btoa(encodedData.join(","));
        sessionStorage.setItem("previewJson", encodedData);
        window.open("./index.html?preview=1", "_blank")
    }
    else {
        $(".headerTitle").text(fuckupMessages[fupPos]);
        fupPos++
        if (fupPos > fuckupMessages.length) {
            fupPos = 0;
        }
    }
}


var fuckupMessages;
$(function () {
    fuckupMessages = [
        jsStr["FUP1"][LANG], jsStr["FUP2"][LANG], jsStr["FUP3"][LANG], jsStr["FUP4"][LANG],
        jsStr["FUP5"][LANG], jsStr["FUP6"][LANG], jsStr["FUP7"][LANG], jsStr["FUP8"][LANG],
        jsStr["FUP9"][LANG], jsStr["FUP10"][LANG], jsStr["FUP11"][LANG], jsStr["FUP12"][LANG],
        jsStr["FUP13"][LANG], jsStr["FUP14"][LANG], jsStr["FUP15"][LANG], jsStr["FUP16"][LANG], "...",
        jsStr["FUP17"][LANG], jsStr["FUP18"][LANG], jsStr["FUP19"][LANG], jsStr["FUP20"][LANG],
        jsStr["FUP21"][LANG], jsStr["FUP22"][LANG], jsStr["FUP23"][LANG], jsStr["FUP24"][LANG],
        jsStr["FUP25"][LANG], jsStr["FUP26"][LANG], jsStr["FUP27"][LANG], jsStr["FUP28"][LANG],
        jsStr["FUP29"][LANG], jsStr["FUP30"][LANG], jsStr["FUP31"][LANG], jsStr["FUP32"][LANG], jsStr["FUP33"][LANG]
    ];

    $("#mainContent").append(jsStr["HELP_TEXT"][LANG]);

    // Keyboard stuff

    $("html").on("keydown", k => {
        if (Object.keys(levelList).length - ADDIT_VALS > 2) {
            let currCardShown = parseInt($(".positionEdit:not(:hidden)")[0].id.match(/[0-9]/g));
            $(".positionEdit:not(:hidden)")[0].focus()
            if (k.key == "ArrowDown") {
                displayCard(currCardShown + 1) // Key: W
                document.getElementById("top" + currCardShown++).scrollIntoView();
            }
            else if (k.key == "ArrowUp") {
                displayCard(currCardShown - 1) // Key: S
                document.getElementById("top" + currCardShown--).scrollIntoView();
            }
            else if (k.key == "ArrowLeft") {
                if (moveCard("up", currCardShown)) { currCardShown-- } // Key: A
            }
            else if (k.key == "ArrowRight") {
                if (moveCard("down", currCardShown)) { currCardShown++ } // Key: D
            }
        }

    })


    // Disabling input boxes when editing a list
    let listID = location.search.slice(1).split(/[=&]/g);
    if (["edit","pedit"].includes(listID[0])) {
        $(".uploadTitle").text(jsStr["EDITING"][LANG]);

        $("#listnm").attr("disabled", "true");
        $("#creatornm").attr("disabled", "true");

        $("#submitbutton").attr("value", jsStr["L_UPDATE"][LANG])
        $("#submitbutton").attr("onclick", "updateList()")

        $("#submitarea").append(`<input onclick="removeList()" class="button noMobileResize" type="button" id="removebutton" value="${jsStr["DELETE"][LANG]}">`)
    }

    // $(window).on("resize", function () {
    //     // Editor disable on portrait orientaton
    //     if ($(window).width() < $(window).height()) {
    //         $(".headerTitle").text(jsStr["MOBILE_ED"][LANG]);
    //         $("#mainContent").hide()
    //         $(".headerButtons").hide()
    //     }
    //     else {
    //         $(".headerTitle").html(jsStr["LEVELS"][LANG]);
    //         $("#mainContent").show()
    //         $(".headerButtons").show()
    //     }

    // })

    $("#bgcolorPicker").on("change", function () {
        colorizePage()
    })
})
