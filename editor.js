//Holba buenas hyperhackeře :D. Nyní sleduješ můj hrozný kód :).

function checkJson(data) {
    $(".errorBox").css("padding", "1% 0.5%");
    try {
        // Kontrola názvů atd.
        let invalidNames = ["Gamingas","GamingasCZ",""];

        let listName = $("#listnm").val();
        let listCreator = $("#creatornm").val();
        
        if (listName.length < 3) {throw ("Jméno tvého seznamu by mělo být delší :).");}
        if (listName.length > 40) {throw ("Jméno tvého seznamu je delší, než doba, kterou mi trvá zeditovat video :D.");}

        if (listCreator.length < 3) {throw ("Tvé jméno by mělo být delší :).");}
        if (listCreator.length > 20) {throw ("Lidi musí psat slohovky, aby tě oslovili :D?");}
        if (listCreator.toLowerCase().includes("gamingas")) {throw ("Nikdy nebudeš Gamingasem :).");}

        // 1/3 Je to vůbec JSON?
        var parsedData = JSON.parse(data);
        $(".errorBox").text("Všechno je v pořádku!");
        $(".errorBox").css("background-color", "rgba(73, 255, 103, 0.8)");
        return true;

        // 2/3 Má všechno?


        // Má title obrázek?
        /*
        if (parsedData.hasOwnProperty("titleImg")) {
            var properties = ["levelName", "creator", "levelID", "video", "color"];
            for (i = 1; i < ((Object.keys(parsedData)).length); i++) {
                console.log(i);
                for (j = 0; j < (Object.keys((i).toString()).length); i++) {

                    // Má nějaké klíče navíc?
                    if (Object.keys(parsedData[i]).length != properties.length) {
                        throw ("JSON obsahuje nějaké klíče navíc! (nepřidávej nic do šablony :D)");
                    }
                    //console.log(parsedData[(i).toString()].indexOf([Object.keys((i).toString())[j]]));
                    // Má všechny potřebné klíče?
                    let key = Object.keys(parsedData[i])[j];
                    
                    if (properties.indexOf(key) == -1) {
                        console.log(Object.keys(parsedData[i])[j]);
                        throw ("JSON neobsahuje některé klíče! (nemaž/nepřejmenovávej 'levelName', 'creator' atd... :D)");
                    
                }

            }

        }
        else {
            throw ("Jsi gay :D");
        }
        */
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
    let isValid = checkJson($("#jsonBox").val());
    console.log(isValid);
    if (isValid) {
        $("#levelUpload").submit();
    }
}

$(function () {
    if (location.search != "") {
        var password = location.search.slice(1).split("=")[1];

        if (isNaN(parseInt(password))) {
            var pstr = `Tvé heslo je ale hypergay. <b style="color: tomato;">Nehraj si se stránkou >:(</b>.`;
        }
        else {
            var pstr = `Mužeš si nechat heslo na památku, protože zmením systém :) : <b style="color: lime;">${password}</b>`;
        }

        $(".uploaderDialog").html(`
<img src=./images/check.png align="center">
<p class="uploadText">Seznam byl nahran! ${pstr}</p>
        `);
    }
    $(".smallUploaderDialog").hide();
    var ok = $.get("./php/getLists.php", function (data) {
        // Zbavení se line breaku
        data = data.slice(0,-2);

        try {
        if (data.match(/\|/g).length > 0) {
            let listsArray = data.split("|");
            for (i = 0; listsArray.length-1; i++) {
                let listData = (listsArray[i]).split(";");
                $(".customLists").append(`
                <a style="text-decoration: none;" href="http://www.gamingas.wz.cz/lofttop10/index.html?id=${listData[4]}">
                    <div id="listPreview" class="button">
                        <div class="uploadText">${listData[1]}</div>
                        <div class="uploadText">Od: ${listData[0]}</div>
                    </div>
                </a>
                        `);
            }
        }
        else {
            throw("ok");
        }
        }

        catch (error) {
            if (data.match(/\|/g) == null || data.endsWith("|\n")) {
                let listData = (data).split(";");
                $(".customLists").append(`
                <a style="text-decoration: none;" href="http://www.gamingas.wz.cz/lofttop10/index.html?id=${listData[4]}">
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
    $(".uploaderDialog").show();
    $(".smallUploaderDialog").hide();
}
