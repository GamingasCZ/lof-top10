
function getDetailsFromID(id) {
    // Tohle budeš pak muset předělat, až bude všechno fungovat :D
    let givenID = $(".idbox" + id).val();
    $.get("https://gdbrowser.com/api/level/" + givenID, function (data) {
        $(".cardLName" + id).val(data["name"]);
        levelList[id]["levelName"] = data["name"];
        $(".cardLCreator" + id).val(data["author"]);
        levelList[id]["creator"] = data["author"];
    })
}

function getAccountID(accountData) {
    return accountData["accountID"];
}

function getDetailsFromName(id) {
    id = id.toString()
    let givenName = $(".cardLName" + id).val();
    let givenMaker = $(".cardLCreator" + id).val();

    // Hledání nejlikovanějšího levelu
    if (givenMaker == "") {
        $.get("https://gdbrowser.com/api/search/" + givenName + "?count=1", function (data) {
            console.log(data);
            console.log("https://gdbrowser.com/api/search/" + givenName + "?count=1");
            $(".cardLName" + id).val(data[0]["name"]);
            levelList[id]["levelName"] = data[0]["name"];
            $(".cardLCreator" + id).val(data[0]["author"]);
            levelList[id]["creator"] = data[0]["author"];
            $(".idbox" + id).val(data[0]["id"]);
            levelList[id]["levelID"] = data[0]["id"]
        })
    }
    else {
        let accID = $.get("https://gdbrowser.com/api/profile/" + givenMaker, getAccountID(data));
        console.log(accID);
        $.get("https://gdbrowser.com/api/search/" + givenName + "?count=1?creators", function (data) {
            console.log(data);
            console.log("https://gdbrowser.com/api/search/" + givenName + "?count=1");
            $(".cardLName" + id).val(data[0]["name"]);
            $(".cardLCreator" + id).val(data[0]["author"]);
            $(".idbox" + id).val(data[0]["id"]);
        })
    }
}


function moveCard(position, currID) {
    let listPlacement = parseInt($(".listPosition" + currID.toString()).val());
    if (position == "up") {
        if (listPlacement > 1) {
            $(".cardLName" + (listPlacement)).val(levelList[(listPlacement)]["levelName"])
            $(".cardLCreator" + (listPlacement)).val(levelList[(listPlacement)]["creator"])
            $(".idbox" + (listPlacement)).val(levelList[(listPlacement)]["levelID"])
            $(".cardLVideo" + (listPlacement)).val(levelList[(listPlacement)]["video"])
            $("#top" + (listPlacement)).css("background-color", levelList[(listPlacement)]["color"])

            $(".card" + (listPlacement - 1)).before($(".card" + (listPlacement)));

            updateCardData(listPlacement - 1, -1);
            updateCardData(listPlacement, listPlacement - 1);
            updateCardData(-1, listPlacement)

            $(".cardLName" + (listPlacement)).val(levelList[(listPlacement)]["levelName"])
            $(".cardLCreator" + (listPlacement)).val(levelList[(listPlacement)]["creator"])
            $(".idbox" + (listPlacement)).val(levelList[(listPlacement)]["levelID"])
            $(".cardLVideo" + (listPlacement)).val(levelList[(listPlacement)]["video"])
            $("#top" + (listPlacement)).css("background-color", levelList[(listPlacement)]["color"])

            listPlacement--
        }
    }
    else {
        if (listPlacement < Object.keys(levelList).length - 1) {
            $(".cardLName" + (listPlacement)).val(levelList[(listPlacement)]["levelName"])
            $(".cardLCreator" + (listPlacement)).val(levelList[(listPlacement)]["creator"])
            $(".idbox" + (listPlacement)).val(levelList[(listPlacement)]["levelID"])
            $(".cardLVideo" + (listPlacement)).val(levelList[(listPlacement)]["video"])
            $("#top" + (listPlacement)).css("background-color", levelList[(listPlacement)]["color"])


            $(".card" + (listPlacement + 1)).after($(".card" + (listPlacement)));

            updateCardData(listPlacement + 1, -1);
            updateCardData(listPlacement, listPlacement + 1);
            updateCardData(-1, listPlacement);

            $(".cardLName" + (listPlacement)).val(levelList[(listPlacement)]["levelName"])
            $(".cardLCreator" + (listPlacement)).val(levelList[(listPlacement)]["creator"])
            $(".idbox" + (listPlacement)).val(levelList[(listPlacement)]["levelID"])
            $(".cardLVideo" + (listPlacement)).val(levelList[(listPlacement)]["video"])
            $("#top" + (listPlacement)).css("background-color", levelList[(listPlacement)]["color"])

            listPlacement++
        }
    }
    updateSmPos();
    document.getElementById("top"+listPlacement).scrollIntoView();
}

function updateSmPos() {
    for (i = 1; i < Object.keys(levelList).length; i++) {
        let chosenColor = $("#top" + i).css("background-color");
        $("#smtop" + i).css("background-color", chosenColor);
        $("#smtop" + i).css("border-color", chosenColor);

        if (levelList[i]["levelName"] == "") {
            $("#smtop" + i.toString()).text(`#${i} - Bezejmenný`);
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
    $(".smallPosEdit").show();
    $("#smtop" + id.toString()).hide();
    $(".positionEdit").hide();
    $("#top" + id.toString()).css("transform", "scaleY(0.8)");
    $("#top" + id.toString()).show();
    $("#top" + id.toString()).css("transform", "scaleY(1)");
    updateSmPos()
}


function addLevel() {
    var listLenght = Object.keys(levelList).length;
    if (listLenght == 1) {
        // Removing tutorial
        $("#mainContent").text("");
        $(".previewButton").removeClass("disabled");
    }
    else if (listLenght > 50) {
        $(".addCardButton").addClass("disabled");
        return null
    }

    $(".headerTitle").text("Levely");
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
    let rgb = [];
    for (i = 0; i < 3; i++) {
        rgb.push(parseInt(Math.random() * 255));
    }

    let darker = rgb.map(c => c - 40);

    $("#top" + listLenght).css("background-color", `rgb(${rgb.join(",")})`);
    $("#top" + listLenght).css("border-color", `rgb(${darker.join(",")})`);
    $("#smtop" + listLenght).css("background-color", `rgb(${rgb.join(",")})`);
    $("#smtop" + listLenght).css("border-color", `rgb(${darker.join(",")})`);
    $("#lineSplit" + listLenght).css("background-color", `rgb(${darker.join(",")})`);

    let inhex = rgb.map(c => (c).toString(16))
    levelList[listLenght]["color"] = "#" + inhex.join("");

    // Sets the color of the added card
    $("#colorPicker" + listLenght).on("change", function () {
        let chosenColor = $(this).val()
        let rgb = [];
        for (i = 1; i < 6; i += 2) {
            rgb.push(parseInt("0x" + chosenColor.slice(i, i + 2)) - 40);
        }
        $("#top" + listLenght).css("background-color", $(this).val());
        $("#top" + listLenght).css("border-color", `rgb(${rgb.join(",")})`);
        $("#lineSplit" + listLenght).css("background-color", `rgb(${rgb.join(",")})`);

        levelList[listLenght]["color"] = chosenColor;
    });

    $(".idbox" + listLenght).on("change", function () {
        levelList[listLenght]["levelID"] = $(this).val();
    });

    $(".cardLName" + listLenght).on("change", function () {
        levelList[listLenght]["levelName"] = $(this).val();
    });

    $(".cardLCreator" + listLenght).on("change", function () {
        levelList[listLenght]["creator"] = $(this).val();
    });

    $(".cardLVideo" + listLenght).on("change", function () {
        levelList[listLenght]["video"] = $(this).val();
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
    $(".cardLCreator" + prevID).attr("class", "cardInput cardLCreator" + newID);
    $(".cardLVideo" + prevID).attr("class", "cardInput cardLVideo" + newID);
    $(".removerButton" + prevID).attr("onclick", "removeLevel(" + newID + ")");
    $(".removerButton" + prevID).attr("class", "button cardButton removerButton" + newID);
    $("#colorPicker" + prevID).attr("id", "colorPicker" + newID);

    if (parseInt(prevID) != parseInt(newID)) {
        levelList[prevID] = levelList[newID + "waiting"];
        levelList[newID] = levelList[prevID + "waiting"];
        delete levelList[newID + "waiting"];
        delete levelList[prevID + "waiting"];

        // Smaže neexistující karty
        if (levelList[prevID] == undefined) { delete levelList[prevID] }
        if (levelList[newID] == undefined) { delete levelList[newID] }
    }

}

function removeLevel(id) {
    delete levelList[($(".listPosition" + id.toString()).val())];

    for (i = 2; i < Object.keys(levelList).length; i++) {
        $(".listPosition" + id.toString()).val()
    }

    for (j = id + 1; j <= Object.keys(levelList).length; j++) {
        updateCardData(j, j - 1);
    }

    // Přidá tutorial, když je seznam prázdný
    if ((Object.keys(levelList)).length == 1) {
        $("#mainContent").html(`<p class="helpText">Kliknutím na <img width=5% id="plusSign" src="images/add.png"> pridáš level!</p>`);
        $(".previewButton").addClass("disabled");
    }

    $("#top" + id.toString()).remove();
    $("#smtop" + id.toString()).remove();

    updateSmPos();
    $("#top" + id.toString()).show();
    $("#smtop" + id.toString()).hide();

}

var levelList = {
    "titleImg": ""
}

function card(index, rndColor) {
    return `
<div class="card${index}">
    <div onclick="displayCard(${index});" class="smallPosEdit" id="smtop${index}">
    </div>
    <div class="positionEdit" id="top${index}">
        <div style="display: flex">
            <div>
                <img id="posInputPics" src="./images/idtext.png">
                <input autocomplete="off" id="posInputBox" class="idbox${index} cardInput" type="text">

                <button type="button" onclick="getDetailsFromID(${index})" style="float: none;" class="button idDetailGetter${index}">
                    <img id="fillButton" src="./images/getStats.png">
                </button>
            </div>

            <div class="positionButtons">
                <button title="Přesunout level níž" type="button" onclick="moveCard('up',${index})" class="button upmover${index}" style="float: none;">
                    <img id="moveLPosButton" src="./images/arrow.png" style="transform: rotate(90deg);">
                </button>

                <input type="text" autocomplete="off" class="listPosition${index}" id="positionDisplay" disabled="true" value="${index}">

                <button title="Přesunout level výš" type="button" onclick="moveCard('down',${index})" class="button downmover${index}" style="float: none;">
                    <img id="moveLPosButton" src="./images/arrow.png" style="transform: rotate(-90deg);">
                </button>
            </div>
        </div>

        <hr id="lineSplit${index}" class="lineSplitGeneral">
        <img id="posInputPics" src="./images/gauntlet.png"><input id="posInputBox" class="cardLName${index} cardInput" type="text" autocomplete="off" placeholder="Jméno levelu">

        <button type="button" onclick="getDetailsFromName(${index})" class="button nameDetailGetter" style="float: none;">
            <img id="fillButton" src="./images/getStats.png">
        </button>
        
        <img id="posInputPics" src="./images/bytost.png">
        <input id="posInputBox" class="cardLCreator${index}" autocomplete="off" type="text" placeholder="Tvurce" style="width: 15vw;display: inline-flex;"><br />

        <img id="posInputPics" src="./images/yticon.png"><input class="cardLVideo${index} cardInput" autocomplete="off" id="posInputBox" type="text" placeholder="Video">

        <button title="Smazat kartu" onclick="removeLevel(${index})" type="button" class="removerButton${index} button cardButton">
            <img src="./images/delete.png" style="width: inherit; height: inherit;">
        </button>
        <button type="button" class="button cardButton">
            <img src="./images/colorSelect.png" style="width: inherit; height: inherit;">
            <input title="Barva karty" type="color" id="colorPicker${index}" class="cardButton cpicker" value="${rndColor}">
        </button>
    </div>
</div>
    `;
}

var fuckupMessages = [
    "Přidej prosím level :).",
    "Nejdřív přidej level!",
    "Tím klikáním nic neuděláš :D.",
    "Oho, snažíš se mě vyzvat na zápas?",
    "Mám času dost! Klikej dál.",
    "Svůj náhled ale nedostaneš.",
    "Je zábava tě sledovat :D.",
    "Jdu si udělat chutný nápoj!",
    "Zelený, nebo černý čaj?",
    "Asi se nemusím ptát...",
    "Jen klikej dál!",
    "Energií tvého prstu ohřívám konvici :D.",
    "Konvice již vaří.",
    "A mám čaj připravený.",
    "Klikáš vážně dobře!",
    "Je poznat, že jsi Geodeš hráč.",
    "...",
    "Oh né! Co jsem to udělal!",
    "Mohu za to všechno já!",
    "Zasekl jsem tě do nekonečné smyčky klikání.",
    "Jak tě ale mám zastavit?",
    "Mohl bych být hnusák a nechat tě tu... :<'",
    "Čaj už mám skoro dopitý.",
    "Vařící čaj...",
    "To je jedno!",
    "Hohó! Pokračuj, protože odcházím.",
    "Ano! Toto je můj poslední dialog!",
    "Úplně poslední!",
    "Spočítejme to spolu!",
    "Tři!",
    "Dva.",
    "Jedna.",
    "Zahraj si SuperGamingasBros. :D.",
    "Konec!"
];
var fupPos = 0;
function preview() {
    if (checkJson(JSON.stringify(levelList)) == false) {
        return null;
    }
    
    if (Object.keys(levelList).length > 1) {
        let data = JSON.stringify(levelList);
        let encodedData = [];
        for (i = 0; i < data.length; i++) {
            encodedData.push(data.charCodeAt(i));
        }
        encodedData = btoa(encodedData.join(","));
        console.log(encodedData);
        window.open("./index.html?preview=" + encodedData, "_blank")
    }
    else {
        $(".headerTitle").text(fuckupMessages[fupPos]);
        fupPos++
        if (fupPos > fuckupMessages.length) {
            fupPos = 0;
        }
    }
}

function closeHelp() {
    $(".popupHelp").hide();
    $(".helpBG").hide();
}
function openHelp() {
    $(".popupHelp").show();
    $(".helpBG").show();
}


$(function () {
    $(window).on("resize", function () {
        if ($(window).width() < $(window).height()) {
            $(".headerTitle").text("Pro použití editoru si otoč mobil ;).");
            $("#mainContent").hide()
        }
        else {
            $(".headerTitle").html(`Levely`);
            $("#mainContent").show()
        }

    })
})
