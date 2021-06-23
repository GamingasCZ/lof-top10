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
        $("#listData").attr("value",JSON.stringify(levelList));
        $("#levelUpload").submit();
    }
}

$(function () {
    if (location.search != "") {
        let password = location.search.slice(1).split(/[=&]/g);

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
})

function hideUploader() {
    $(".uploaderDialog").hide();
    $(".smallUploaderDialog").show();
}
function showUploader() {
    $(".uploaderDialog").show()
    $(".smallUploaderDialog").hide();
}