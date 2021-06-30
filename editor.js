//Holba buenas hyperhackeře :D. Nyní sleduješ můj hrozný kód :).

function checkJson(data) {
    $(".errorBox").css("padding", "1% 0.5%");
    try {
        // Kontrola názvů atd.
        let invalidNames = ["Gamingas", "GamingasCZ"];

        let listName = $("#listnm").val();
        let listCreator = $("#creatornm").val();

        if (listName.length < 3) { throw ("Jméno tvého seznamu by mělo být delší :)."); }
        if (listName.length > 40) { throw ("Jméno tvého seznamu je delší, než doba, kterou mi trvá zeditovat video :D."); }

        if (listCreator.length < 3) { throw ("Tvé jméno by mělo být delší :)."); }
        if (listCreator.length > 20) { throw ("Lidi musí psat slohovky, aby tě oslovili :D?"); }
        if (listCreator.toLowerCase().includes("gamingas")) { throw ("Nikdy nebudeš Gamingasem :)."); }

        // 1/3 Je to vůbec JSON?
        var parsedData = JSON.parse(data);
        $(".errorBox").text("Všechno je v pořádku!");
        $(".errorBox").css("background-color", "rgba(73, 255, 103, 0.8)");

        // 2/3 Neobsahuje prázdné jméno/tvůrce
        for (i = 1; i < Object.keys(parsedData).length; i++) {
            if (parsedData[i] == undefined) {
                throw (i + ". místo neexistuje. Bug mi nahlaš (nebo si nehrej s JSONem :D).")
            }
            if (parsedData[i]["levelName"] == "") {
                throw ("Level na " + i + ". místě nemá JMÉNO!")
            }
            if (parsedData[i]["creator"] == "") {
                throw ("Level na " + i + ". místě nemá TVŮRCE!")
            }
        }
        return true;
    }
    catch (error) {
        $(".errorBox").css("background-color", "rgba(255, 73, 73, 0.8)");

        if (data == "") {
            $(".errorBox").text("Nic jsi nezadal... :D");
        }
        else {
            $(".errorBox").text(error);
        }
        return false
    }
}

function uploadList() {
    let isValid = checkJson(JSON.stringify(levelList));
    if (isValid) {
        $("#listData").attr("value", JSON.stringify(levelList));
        $("#levelUpload").submit();
    }
}
function updateList() {
    let isValid = checkJson(JSON.stringify(levelList));
    if (isValid) {
        // will later also update uploadList()
        let data = location.search.slice(1).split(/[=&]/g);
        let postData = {
            "listData": JSON.stringify(levelList),
            "id": data[1],
            "pwdEntered": data[3]
        }
        $.post("./php/updateList.php", postData, function (data) {
            let updateData = data.split(";")
            window.location.replace(`http://www.gamingas.wz.cz/lofttop10/upload.html?update=1`);
        })
    }
}

$(function () {
    if (location.search != "") {
        let password = location.search.slice(1).split(/[=&]/g);

        if (password[0] == "edit" & password[2] == "pass") {
            generateFromJSON()
        }
        else if (password[0] == "update") {

            $(".uploaderDialog").html(`
            <img style="padding-left: 3%" src=./images/check.png>
            <p class="uploadText" style="padding: 0 3% 0 3%">Seznam byl aktualizovan!</p>

            </div>
            </div>
            
            `);
        }
        else {
            // Change depending on your website
            let currWebsite = `http://gamingas.wz.cz/lofttop10/?id=${password[3]}`;

            if (isNaN(parseInt(password[1]))) {
                var pstr = `Tvé heslo je ale hypergay. <b style="color: tomato;">Nehraj si se stránkou >:(</b>.`;
            }
            else {
                var pstr = `Schovej si heslo, protože pomocí neho mužeš upravit/smazat seznam!: <b style="color: lime;">${password[1]}</b>`;
            }

            $(".uploaderDialog").html(`
<img style="padding-left: 3%" src=./images/check.png>
<p class="uploadText" style="padding: 0 3% 0 3%">Seznam byl nahran! ${pstr}</p>

<div style="margin-top: 5%;">
<h6 class="shareTitle uploadText">Sdílet</h6>
<div class="shareBG uploadText" style="float: none;">${currWebsite}
<img class="button shareBut" src="./images/openList.png" onclick="window.open('${currWebsite}','_blank')">
</div>
</div>

`);
        }
    }

    $(".smallUploaderDialog").hide();
    $.get("./php/getLists.php", function (data) {
        // Zbavení se line breaku
        data = data.slice(0, -2);

        try {
            if (data.match(/\|/g).length > 0) {
                let listsArray = data.split("|");
                for (i = 0; i < listsArray.length; i++) {
                    let listData = (listsArray[i]).split(";");
                    $(".customLists").append(`
                <a style="text-decoration: none;" href="http://www.gamingas.wz.cz/lofttop10/index.html?id=${listData[3]}">
                    <div id="listPreview" class="button">
                        <div class="uploadText">${listData[1]}</div>
                        <div class="uploadText">Od: ${listData[0]}</div>
                    </div>
                </a>
                        `);
                }
            }
            else {
                throw ("ok");
            }
        }

        catch (error) {
            if (data.match(/\|/g) == null || data.endsWith("|\n")) {
                let listData = (data).split(";");
                $(".customLists").append(`
                <a style="text-decoration: none;" href="http://www.gamingas.wz.cz/lofttop10/index.html?id=${listData[3]}">
                <div id="listPreview" class="button">
                    <div class="uploadText">${listData[1]}</div>
                    <div class="uploadText">Od: ${listData[0]}</div>
                </div>
            </a>
                        `);
            }

        }
    });

    // Mobile optimzations
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        $(".uploadBG").css("margin", "0")
        $(".uploadBG").css("border", "none")
        $("body").css("margin", "0")
    }
})

function hideUploader() {
    $(".uploaderDialog").hide();
    $(".smallUploaderDialog").show();
}
function showUploader() {
    $(".uploaderDialog").show()
    $(".smallUploaderDialog").hide();
}


function closeRmScreen() {
    $(".removeScreen").fadeOut(100)
    $(".boom").animate({ "opacity": 0 }, 500, function () {
        $(".boom").css("background-color", "white")
        $(".boom").css("display", "none")
        $(".removeScreen").remove()
    })   
}
function confirmDelete() {
    closeRmScreen()
    setInterval(function () {
        let data = location.search.slice(1).split(/[=&]/g);
        let postData = {
            "id": data[1],
            "pwdEntered": data[3]
        }
        murderList();
        $.post("./php/removeList.php", postData, function (data) {
            murderList();
        })  
    }, 600)
}

function removeList() {
    // Confirm remove
    $(".boom").append(`<div class="uploadText removeScreen">
    <img id="rmimg1" class="removeImg" style="width: 23%;" src="./images/szn2.png"><br />
    <img id="rmimg2" class="removeImg" style="width: 23%; margin-top: -1.64em;" src="./images/szn1.png">
    <p id="removeText" style="display: none; text-align: center; font-size: 4vw;">Opravdu chces smazat svuj seznam?</p>
    <div style="display:flex; flex-direction: row; justify-content: center; opacity:0" class="rmButSet">
        <img id="rmbutton" onclick="confirmDelete()" class="button" src="./images/yeees.png">
        <img id="rmbutton" onclick="closeRmScreen()" class="button" src="./images/ne.png">
    <div>
    </div>`);

    $(".boom").css("background-color", "black");
    $(".boom").css("display", "initial");
    $(".boom").animate({ "opacity": 1 }, 500, function() {
        $("#removeText").fadeIn(2000);
        $(".rmButSet").animate({ "opacity": 1 }, 2000);
    })

    $("#rmbutton").on("mouseover", function () {
        $("#rmimg1").css("transform","translateY(-10%)");
        $("#rmimg2").css("transform","translateY(10%)");
        $(".boom").css("background-color","rgb(11, 0, 0)");
    })
    $("#rmbutton").on("mouseout", function () {
        $("#rmimg1").css("transform","translateY(0%)");
        $("#rmimg2").css("transform","translateY(0%)");
        $(".boom").css("background-color","rgb(0, 0, 0)");
    })
}
function murderList() {
    $(".boom").css("display", "initial");

    $(".boom").animate({ "opacity": 1 }, 2000, () => window.location.replace("./upload.html"));
    $("#levelUpload").addClass("killList");
}