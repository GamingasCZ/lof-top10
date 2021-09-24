function getDetailsFromID(id) {
    // Tohle budeš pak muset předělat, až bude všechno fungovat :D
    let givenID = $(".idbox" + id).val();
    $.get("https://gdbrowser.com/api/level/" + givenID, function (data) {
        if (data != -1) {
            $(".cardLName" + id).val(data["name"]);
            levelList[id]["levelName"] = data["name"];
            $(".cardLCreator" + id).val(data["author"]);
            levelList[id]["creator"] = data["author"];
        }
        else {
            $(".idbox" + id).addClass("inputErr")
            setTimeout(() => { $(".idbox" + id).removeClass("inputErr") }, 500)
            // TODO: Add flickering or something....
        }
    })
    updateSmPos()
}

function getDetailsFromName(id) {
    id = id.toString()
    let givenName = $(".cardLName" + id).val();
    let givenMaker = $(".cardLCreator" + id).val();

    // Hledání nejlikovanějšího levelu
    $.get("https://gdbrowser.com/api/search/" + givenName + "?count=1", function (data) {
        if (data != -1) {
            $(".cardLName" + id).val(data[0]["name"]);
            levelList[id]["levelName"] = data[0]["name"];
            $(".cardLCreator" + id).val(data[0]["author"]);
            levelList[id]["creator"] = data[0]["author"];
            $(".idbox" + id).val(data[0]["id"]);
            levelList[id]["levelID"] = data[0]["id"]
        }
        else {
            // TODO: Add flickering or something....
        }
    })
    updateSmPos()
}

function showCollabTools(id) {
    $("#collabTools").css("background-color", $("#top" + id).css("background-color"))
    $("#collabTools").css("border-color", $("#top" + id).css("background-color"))

    $("#collabTools").fadeIn(50);
    $("#collabTools").css("transform", "scaleY(1)")
}

function hideCollabTools() {
    $("#collabTools").fadeOut(50);
    $("#collabTools").css("transform", "scaleY(0.7)")
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
    $.post("./php/pwdCheckAction.php", { "id": listID[1], "pwdEntered": listID[3], "retData": "1" }, function (data) {
        if (data == 2) {
            window.location.replace("./upload.html")
        }
        if (event) {
            var data = JSON.stringify(boards);
            data = ";;" + data + ";0";
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
            $("#smtop" + i.toString()).text(`#${i} - ${levelList[i]["levelName"]} od ${levelList[i]["creator"]}`);
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
        updateSmPos()
    }
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
    let rgb = randomColor()

    let darker = rgb.map(c => c - 40);

    $("#top" + listLenght).css("background-color", `rgb(${rgb.join(",")})`);
    $("#top" + listLenght).css("border-color", `rgb(${darker.join(",")})`);
    $("#smtop" + listLenght).css("background-color", `rgb(${rgb.join(",")})`);
    $("#smtop" + listLenght).css("border-color", `rgb(${darker.join(",")})`);
    $("#lineSplit" + listLenght).css("background-color", `rgb(${darker.join(",")})`);


    let inhex = rgb.map(c => ((c).toString(16).length == 1 ? "0" + (c).toString(16) : (c).toString(16)))
    levelList[listLenght]["color"] = "#" + inhex.join("");

    // Sets the color of the added card
    $("#colorPicker" + listLenght).on("change", function () {
        let chosenColor = $(this).val()
        let cardSelected = ($(this)[0]["id"]).match(/[0-9]/g).join("")

        let rgb = HEXtoRGB(chosenColor, 40)

        $("#top" + cardSelected).css("background-color", chosenColor);
        $("#top" + cardSelected).css("border-color", `rgb(${rgb.join(",")})`);
        $("#lineSplit" + cardSelected).css("background-color", `rgb(${rgb.join(",")})`);

        levelList[cardSelected]["color"] = chosenColor;
    });

    $(".idbox" + listLenght).on("change keydown", function (k) {
        if (k.type == "change") {
            let selection = $(".idbox" + ($(this)[0]["className"]).match(/[0-9]/g).join("")).val()
            let position = ($(this)[0]["className"]).match(/[0-9]/g).join("")
            levelList[position]["levelID"] = selection;
        }
        else {
            if ($(this).val() == "") { $("fillID").removeClass("disabled") }
            else { $("fillID").addClass("disabled") }
        }
    });

    $(".cardLName" + listLenght).on("change", function () {
        let selection = $(".cardLName" + ($(this)[0]["className"]).match(/[0-9]/g).join("")).val()
        let position = ($(this)[0]["className"]).match(/[0-9]/g).join("")
        levelList[position]["levelName"] = selection;
    });

    $(".cardLCreator" + listLenght).on("change", function () {
        let selection = $(".cardLCreator" + ($(this)[0]["className"]).match(/[0-9]/g).join("")).val()
        let position = ($(this)[0]["className"]).match(/[0-9]/g).join("")
        levelList[position]["creator"] = selection;
    });

    $(".cardLVideo" + listLenght).on("change", function () {
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
    });
}

function loadLevel(pos) {
    $("#mainContent").append(card(pos))
    refreshCardDetails(pos)

    let chosenColor = levelList[pos]["color"];
    let rgb = HEXtoRGB(chosenColor, 40)

    $("#top" + pos).css("border-color", `rgb(${rgb.join(",")})`);
    $("#lineSplit" + pos).css("background-color", `rgb(${rgb.join(",")})`);

    // Setting card buttons
    $("#colorPicker" + pos).on("change", function () {
        let chosenColor = $(this).val()
        let cardSelected = ($(this)[0]["id"]).match(/[0-9]/g).join("")

        let rgb = HEXtoRGB(chosenColor, 40)

        $("#top" + cardSelected).css("background-color", chosenColor);
        $("#top" + cardSelected).css("border-color", `rgb(${rgb.join(",")})`);
        $("#lineSplit" + cardSelected).css("background-color", `rgb(${rgb.join(",")})`);

        levelList[cardSelected]["color"] = chosenColor;
    });

    $(".idbox" + pos).on("change keydown", function (k) {
        if (k.type == "change") {
            let selection = $(".idbox" + ($(this)[0]["className"]).match(/[0-9]/g).join("")).val()
            let position = ($(this)[0]["className"]).match(/[0-9]/g).join("")
            levelList[position]["levelID"] = selection;
        }
        else {
            if ($(this).val() == "") { $("fillID").addClass("disabled") }
            else { $("fillID").removeClass("disabled") }
        }
    });

    $(".cardLName" + pos).on("change", function () {
        let selection = $(".cardLName" + ($(this)[0]["className"]).match(/[0-9]/g).join("")).val()
        let position = ($(this)[0]["className"]).match(/[0-9]/g).join("")
        levelList[position]["levelName"] = selection;
    });

    $(".cardLCreator" + pos).on("change", function () {
        let selection = $(".cardLCreator" + ($(this)[0]["className"]).match(/[0-9]/g).join("")).val()
        let position = ($(this)[0]["className"]).match(/[0-9]/g).join("")
        levelList[position]["creator"] = selection;
    });

    $(".cardLVideo" + pos).on("change", function () {
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
    });
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

function removeLevel(id) {
    delete levelList[($(".listPosition" + id.toString()).val())];

    // Enables the add button
    if (Object.keys(levelList).length - ADDIT_VALS < 51) {
        $(".addCardButton").removeClass("disabled");
    }

    for (j = id + 1; j <= Object.keys(levelList).length - ADDIT_VALS; j++) {
        updateCardData(j, j - 1);
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
                <p style="margin: 2%;">ID:</p>
                <input autocomplete="off" id="posInputBox" class="idbox${index} cardInput" type="text" style=" margin-left: 4%; transform: translateY(0%);">

                <img id="fillButton" src="./images/getStats.png" onclick="getDetailsFromID(${index})" style="float: none;" class="fillID button disabled idDetailGetter${index}">
            </div>

            <div class="positionButtons">
                <img title="${jsStr["L_MOVE_D"][LANG]}" onclick="moveCard('up',${index})" 
                     class="button upmover${index}" style="float: none; transform: rotate(90deg);" id="moveLPosButton"
                     src="./images/arrow.png">

                <input type="text" autocomplete="off" class="listPosition${index}" id="positionDisplay" disabled="true" value="${index}">

                <img title="${jsStr["L_MOVE_U"][LANG]}" onclick="moveCard('down',${index})"
                        class="button downmover${index}" style="float: none; transform: rotate(-90deg);" id="moveLPosButton"
                        src="./images/arrow.png">
            </div>
        </div>

        <hr id="lineSplit${index}" class="lineSplitGeneral">

        <div style="display: flex; flex-wrap: wrap;">
            <div style="display: flex; flex-wrap: wrap; width: 100%; align-items: center;">
                <img id="posInputPics" src="./images/gauntlet.png">
                <input id="posInputBox" class="cardLName${index} cardInput" type="text" autocomplete="off" placeholder="${jsStr["L_NAME"][LANG]}">

                <hr class="availFill" style="margin-left: 2%">

                <button type="button" onclick="getDetailsFromName(${index})" class="button nameDetailGetter${index}" style="float: none;">
                    <img id="fillButton" src="./images/getStats.png">
                </button>
                
                <hr class="availFill" style="margin-right: 2%">

                <input id="posInputBox" class="cardLCreator${index}" autocomplete="off" type="text" placeholder="${jsStr["L_BUILDER"][LANG]}" style="width: 15vw;display: inline-flex;"><br />
                <img class="button colButton${index}" style="float: none;" id="posInputPics" src="./images/bytost.png" onclick="showCollabTools(${index})">
            </div>

            <div style="display: flex; width: 100%;">
                <div style="display: flex; align-items: center;">
                    <img id="posInputPics" src="./images/yticon.png">
                    <input style="margin: 5%;" class="cardLVideo${index} cardInput" autocomplete="off" id="posInputBox" type="text" placeholder="${jsStr["L_VIDEO"][LANG]}">
                </div>
                
                <div style="display: flex; justify-content: right; flex-grow: 1; align-items: center;">
                    <img title="${jsStr["DEL_CARD"][LANG]}" class="removerButton${index} button cardButton"
                        onclick="removeLevel(${index})" src="./images/delete.png">

                    <img class="button cardButton" onclick="document.querySelector("#colorPicker${index}").click();" src="./images/colorSelect.png">
                    <input style="display: none;" title="${jsStr["CARD_COL"][LANG]}" type="color" id="colorPicker${index}" class="cardButton cpicker" value="${rndColor}">
                </div>
            </div>   
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
        let currCardShown = parseInt($(".positionEdit:not(:hidden)")[0].id.match(/[0-9]/g));
        $(".positionEdit:not(:hidden)")[0].focus()
        if (k.key == "ArrowDown") {
            displayCard(currCardShown + 1) // Key: W
        }
        else if (k.key == "ArrowUp") {
            displayCard(currCardShown - 1) // Key: S
        }
        else if (k.key == "ArrowLeft") {
            if (moveCard("up", currCardShown)) { currCardShown-- } // Key: A
        }
        else if (k.key == "ArrowRight") {
            if (moveCard("down", currCardShown)) { currCardShown++ } // Key: D
        }
    })


    // Disabling input boxes when editing a list
    let listID = location.search.slice(1).split(/[=&]/g);
    if (listID.indexOf("edit") != -1) {
        $(".uploadTitle").text(jsStr["EDITING"][LANG]);

        $("#listnm").attr("disabled", "true");
        $("#creatornm").attr("disabled", "true");

        $("#submitbutton").attr("value", jsStr["L_UPDATE"][LANG])
        $("#submitbutton").attr("onclick", "updateList()")

        $("#submitarea").append(`<input onclick="removeList()" type="button" id="removebutton" value="${jsStr["DELETE"][LANG]}">`)
    }

    $(window).on("resize", function () {
        // Editor disable on portrait orientaton
        if ($(window).width() < $(window).height()) {
            $(".headerTitle").text(jsStr["MOBILE_ED"][LANG]);
            $("#mainContent").hide()
            $(".headerButtons").hide()
        }
        else {
            $(".headerTitle").html(jsStr["LEVELS"][LANG]);
            $("#mainContent").show()
            $(".headerButtons").show()
        }

    })

    $("#bgcolorPicker").on("change", function () {
        colorizePage()
    })
})
