
function getDetailsFromID() {
    // Tohle budeš pak muset předělat, až bude všechno fungovat :D
    let givenID = $(".idbox").val();
    $.get("https://gdbrowser.com/api/level/" + givenID, function (data) {
        console.log("https://gdbrowser.com/api/level/" + givenID);
        $(".cardLName").val(data["name"]);
        $(".cardLCreator").val(data["author"]);
    })
}

function moveCard(position) {
    var listPlacement = parseInt($(".listPosition").val());
    if (position == "up") {
        if (listPlacement > 1) {
            $(".listPosition").val(listPlacement - 1);
        }
    }
    else {
        $(".listPosition").val(listPlacement + 1);
    }
}

function addLevel() {
    var listLenght = Object.keys(levelList).length;
    if (listLenght == 1) {
        // Smazání tutorialu
        $("#mainContent").text("");
    }
    
    $("#mainContent").append(card);
    levelList[listLenght] = "ok";

    document.getElementById("positionEdit").addEventListener("input", function () {
        $(".positionEdit").css("background-color",$("#colorPicker").val());
    })
}

var levelList = {
    "titleImg": ""
}

var card = `
<div class="positionEdit">
    <label class="uploadText">ID: </label><input autocomplete="off" id="posInputBox" class="idbox" type="text">

    <button type="button" onclick="getDetailsFromID()" class="button" style="float: none;">
        <img id="fillButton" src="./images/getStats.png">
    </button>

    <div style="display: inline; margin-left: 10%;">
        <button title="Přesunout level výš" type="button" onclick="moveCard('up')" class="button" style="float: none;">
            <img id="moveLPosButton" src="./images/arrow.png" style="transform: rotate(90deg);">
        </button>

        <input type="text" autocomplete="off" style="width: 3%; margin: 0.5%;" class="listPosition">

        <button title="Přesunout level níž" type="button" onclick="moveCard('down')" class="button" style="float: none;">
            <img id="moveLPosButton" src="./images/arrow.png" style="transform: rotate(-90deg);">
        </button>
    </div>

    <hr id="lineSplit">
    <img id="posInputPics" src="./images/gauntlet.png">
    <input id="posInputBox" class="cardLName" type="text" autocomplete="off" placeholder="Jméno levelu">

    <img id="posInputPics" src="./images/bytost.png">
    <input id="posInputBox" class="cardLCreator" autocomplete="off" type="text"placeholder="Tvurce"><br />

    <img id="posInputPics" src="./images/yticon.png"><input autocomplete="off" id="posInputBox" type="text" placeholder="Video">

    <input title="Smazat kartu" type="button" class="button cardButton">
    <input title="Barva karty" type="color" id="colorPicker" class="button cardButton">
</div>
    `;

function changeCardColor() {
    $(".positionEdit").addEventListener("input", function () {
        $(".positionEdit").css("background-color",$("#colorPicker").val());
    })
}


$(function () {
    document.getElementById("positionEdit").addEventListener("input", function () {
        $(".positionEdit").css("background-color",$("#colorPicker").val());
    })
}
)