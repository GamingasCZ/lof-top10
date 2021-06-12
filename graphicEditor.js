
function getDetailsFromID() {
    // Tohle budeš pak muset předělat, až bude všechno fungovat :D
    let givenID = $(".idbox").val();
    $.get("https://gdbrowser.com/api/level/" + givenID, function (data) {
        console.log("https://gdbrowser.com/api/level/" + givenID);
        $(".cardLName").val(data["name"]);
        $(".cardLCreator").val(data["author"]);
    })
}

function getAccountID(accountData) {
    return accountData["accountID"];
}

function getDetailsFromName() {
    let givenName = $(".cardLName").val();
    let givenMaker = $(".cardLCreator").val();
    
    // Hledání nejlikovanějšího levelu
    if (givenMaker == "") {
        $.get("https://gdbrowser.com/api/search/"+givenName+"?count=1", function(data) {
            console.log(data);
            console.log("https://gdbrowser.com/api/search/"+givenName+"?count=1");
            $(".cardLName").val(data[0]["name"]);
            $(".cardLCreator").val(data[0]["author"]);
            $(".idbox").val(data[0]["id"]);
            })
        }
    else {
        let accID = $.get("https://gdbrowser.com/api/profile/"+givenMaker, getAccountID(data));
        $.get("https://gdbrowser.com/api/search/"+givenName+"?count=1?creators", function(data) {
            
            
            console.log(data);
            console.log("https://gdbrowser.com/api/search/"+givenName+"?count=1");
            $(".cardLName").val(data[0]["name"]);
            $(".cardLCreator").val(data[0]["author"]);
            $(".idbox").val(data[0]["id"]);
            })
        }
    }
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

    $("#mainContent").append(card(listLenght));
    levelList[listLenght] = "ok";


    $("#colorPicker").on("change", function () {
        let chosenColor = $(this).val()
        let rgb = [];
        for (i = 1; i < 6; i += 2) {
            rgb.push(parseInt("0x"+chosenColor.slice(i,i+2))-40);
        }
            $(".positionEdit").css("background-color", $(this).val());
            $(".positionEdit").css("border-color", `rgb(${rgb.join(",")})`);
            $("#lineSplit").css("background-color", `rgb(${rgb.join(",")})`);
    })
}

function removeLevel() {
    delete levelList[($(".listPosition").val())];
    
    // Přidá tutorial, když je seznam prázdný
    if ((Object.keys(levelList)).length == 1) {
        $("#mainContent").html(`Kliknutím na <img width=5% src="images/add.png"> pridáš level!`);
    }
        
    $(".positionEdit").remove();
    
}

var levelList = {
    "titleImg": ""
}

function card(index) {
    return `
<div class="positionEdit">
    <label class="uploadText">ID: </label><input autocomplete="off" id="posInputBox" class="idbox" type="text">

    <button type="button" onclick="getDetailsFromID()" class="button" style="float: none;">
        <img id="fillButton" src="./images/getStats.png">
    </button>

    <div style="display: inline; margin-left: 10%;">
        <button title="Přesunout level výš" type="button" onclick="moveCard('up')" class="button" style="float: none;">
            <img id="moveLPosButton" src="./images/arrow.png" style="transform: rotate(90deg);">
        </button>

        <input type="text" autocomplete="off" style="width: 3%; margin: 0.5%;" class="listPosition" value="${index}">

        <button title="Přesunout level níž" type="button" onclick="moveCard('down')" class="button" style="float: none;">
            <img id="moveLPosButton" src="./images/arrow.png" style="transform: rotate(-90deg);">
        </button>
    </div>

    <hr id="lineSplit">
    <img id="posInputPics" src="./images/gauntlet.png"><input id="posInputBox" class="cardLName" type="text" autocomplete="off" placeholder="Jméno levelu">

    <button type="button" onclick="getDetailsFromName()" class="button" style="float: none;">
        <img id="fillButton" src="./images/getStats.png">
    </button>
    
    <img id="posInputPics" src="./images/bytost.png">
    <input id="posInputBox" style="width:15vw;" class="cardLCreator" autocomplete="off" type="text"placeholder="Tvurce"><br />

    <img id="posInputPics" src="./images/yticon.png"><input autocomplete="off" id="posInputBox" type="text" placeholder="Video">

    <button title="Smazat kartu" onclick="removeLevel()" type="button" class="button cardButton" style="width: 8vw; height: 8vw;">
        <img src="./images/delete.png" style="width: inherit; height: inherit;">
    </button>
    <button type="button" class="button" style="width: 8vw; height: 8vw;">
        <img src="./images/colorSelect.png" style="width: inherit; height: inherit;">
        <input title="Barva karty" type="color" id="colorPicker" class="cardButton">
    </button>
</div>
    `;
}

function changeCardColor() {
    $(".positionEdit").addEventListener("input", function () {
        $(".positionEdit").css("background-color", $("#colorPicker").val());
    })
}

$(function () {

}
)
