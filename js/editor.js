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
        for (i = 1; i < Object.keys(parsedData).length - ADDIT_VALS; i++) {
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

var page = 0;
var maxPage = 0;
var listNames = [];
function displayComLists(data) {
    // Zbavení se line breaku
    data = data.slice(0, -2);

    $(".customLists").children().remove()

    try {
        if (data.match(/\|/g).length > 0) {
            let listsArray = data.split("|-!-|");

            // Deleteee  e e
            if (listsArray.indexOf("") != -1) { listsArray.splice(listsArray.indexOf(""), 1) }
            if (listsArray.indexOf("\n") != -1) { listsArray.splice(listsArray.indexOf("\n"), 1) }

            maxPage = Math.ceil(listsArray.length / 4);
            $("#maxPage").text("/" + maxPage);

            // List sorting
            if (!sorting) {
                listsArray.reverse();
            }

            // Appends list names (only needs to be done once)
            if (listNames.length == 0) {
                listsArray.forEach((val) => listNames.push(val.split(";-!-;")[1]));
            }


            for (i = 4 * page; i < 4 * page + 4; i++) {
                let listData = (listsArray[i]).split(";-!-;");
                let listColor = JSON.parse(listData[2])["1"]["color"]
                let rgb = [];
                for (j = 1; j < 6; j += 2) {
                    rgb.push(parseInt("0x" + listColor.slice(j, j + 2)) - 40);
                }
                $(".customLists").append(`
        <a style="text-decoration: none;" href="http://www.gamingas.wz.cz/lofttop10/index.html?id=${listData[3]}">
            <div id="listPreview" class="button" style="background-color: ${listColor}; border-color: rgb(${rgb.join(",")})">
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
            let listData = (data).split(";-!-;");

            let listColor = JSON.parse(listData[2])["1"]["color"]
            let rgb = [];
            for (j = 1; j < 6; j += 2) {
                rgb.push(parseInt("0x" + listColor.slice(j, j + 2)) - 40);
            }

            if (listNames.length == 0) {
                listNames.push(listData[1]);
            }

            $(".customLists").append(`
        <a style="text-decoration: none;" href="http://www.gamingas.wz.cz/lofttop10/index.html?id=${listData[3]}">
        <div id="listPreview" class="button" style="background-color: ${listColor}; border-color: rgb(${rgb.join(',')})">
            <div class="uploadText">${listData[1]}</div>
            <div class="uploadText">Od: ${listData[0]}</div>
        </div>
    </a>
                `);
        }

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
        // Is the "hidden" checkbox checked?
        if ($("input[name='hidden']").attr("checked") == "checked") { var listHidden = "1" }
        else { var listHidden = "0" }

        // will later also update uploadList()
        let data = location.search.slice(1).split(/[=&]/g);
        let postData = {
            "listData": JSON.stringify(levelList),
            "id": data[1],
            "pwdEntered": data[3],
            "hidden": listHidden
        }
        $.post("./php/updateList.php", postData, function (data) {
            let updateData = data.split(";-!-;")
            window.location.replace(`http://www.gamingas.wz.cz/lofttop10/upload.html?update=1`);
        })
    }
}

var debug_mode = false;

var deeta = '';
var ogDeeta = '';

// List generator
if (debug_mode) {
    for (let i = 0; i < 4; i++) {
        deeta += `${i};${btoa(i * 48514654894984 / 1.848564)};{"1":{"color":"rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})"}};45;10|`

    }
}


var sorting = false;
$(function () {
    $("#pageSwitcher").on("change", function () {
        page = parseInt($(this).val()) - 1;
        if (page > maxPage) { page = maxPage - 1; $("#pageSwitcher").val(maxPage) }
        if (page < 1) { page = 0; $("#pageSwitcher").val(1) }
        displayComLists(deeta);
    })

    // Sort button action
    $("#sortBut").on("click", function () {
        displayComLists(deeta.split("|-!-|").reverse().join("|-!-|"))
        if (sorting) {
            $("#sortBut").css("transform", "scaleY(1)");
            $("#sortBut").attr("title", "Nejnovější")
        }
        else {
            $("#sortBut").css("transform", "scaleY(-1)");
            $("#sortBut").attr("title", "Nejstarší")
        }
        sorting = !sorting
    })


    // List image preview action
    $("#imageArrow").on("click", function () {
        $("#imgError").text("")
        if ($(this).css("transform").match("-1")) {
            // Hide preview
            $("#imageArrow").css("transform", "scaleY(1)");
            $("#imageArrow").attr("title", "Ukázat náhled obrázku")
            $(".imgPreview").slideUp(200)
        }
        else {
            // Show preview
            $("#imageArrow").css("transform", "scaleY(-1)");
            $("#imageArrow").attr("title", "Skrýt náhled obrázku")
            $("#imagePrev").css("width", "40vw")
            $("#imagePrev").attr("src", $(".titImgInp").val())
            $(".imgPreview").slideDown(200)
        }
    })
    // When the image failed to load (sad crying emoji)
    $("#imagePrev").on("error", function () {
        $("#imagePrev").css("width", "10%")
        $("#imagePrev").attr("src", "./images/error.png")
        $("#imgError").text("Obrázek nenalezen :/")
    })
    // Change preview image on URL change
    $(".titImgInp").on("change", function () {
        if ($("#imageArrow").css("transform").match("-1")) {
            $("#imgError").text("")
            $("#imagePrev").css("width", "40vw")
            $("#imagePrev").attr("src", $(".titImgInp").val())
        }
    })


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
        else if (password[0] == "event") {
            if (password[1] == 1) { checkCheckbox("event"); }
            else { checkCheckbox("event"); generateFromJSON(boards); }
            $("#listnm").val("Lepší seznam");
        }
        else {
            // Change depending on your website
            let currWebsite = `http://gamingas.wz.cz/lofttop10/?${isNaN(password[3]) ? "pid" : "id"}=${password[3]}`;

            var pstr = `Schovej si heslo, protože pomocí neho mužeš upravit/smazat seznam!: <b style="color: lime;">${password[1]}</b>`;

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

    // Generates stuff
    if (debug_mode) { displayComLists(deeta) }

    $.get("./php/getLists.php", function (data) {
        deeta = data;
        ogDeeta = data;
        displayComLists(deeta);
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
    <img id="rmimg2" class="removeImg" style="width: 23%; margin-top: -1.74em;" src="./images/szn1.png">
    <p id="removeText" style="display: none; text-align: center; font-size: 4vw;">Opravdu chceš smazat svůj seznam?</p>
    <div style="display:flex; flex-direction: row; justify-content: center; opacity:0" class="rmButSet">
        <img id="rmbutton" onclick="confirmDelete()" class="button" src="./images/yeees.png">
        <img id="rmbutton" onclick="closeRmScreen()" class="button" src="./images/ne.png">
    <div>
    </div>`);

    $(".boom").css("background-color", "black");
    $(".boom").css("display", "initial");
    $(".boom").animate({ "opacity": 1 }, 500, function () {
        $("#removeText").fadeIn(2000);
        $(".rmButSet").animate({ "opacity": 1 }, 2000);
    })

    $("#rmbutton").on("mouseover", function () {
        $("#rmimg1").css("transform", "translateY(-10%)");
        $("#rmimg2").css("transform", "translateY(10%)");
        $(".boom").css("background-color", "rgb(11, 0, 0)");
    })
    $("#rmbutton").on("mouseout", function () {
        $("#rmimg1").css("transform", "translateY(0%)");
        $("#rmimg2").css("transform", "translateY(0%)");
        $(".boom").css("background-color", "rgb(0, 0, 0)");
    })
}
function murderList() {
    $(".boom").css("display", "initial");

    $(".boom").animate({ "opacity": 1 }, 2000, () => window.location.replace("./upload.html"));
    $("#levelUpload").addClass("killList");
}

function pageSwitch(num) {
    if (page + num < 0) {
        page = 0
    }
    else if (page + num > maxPage - 1) {
        page = maxPage - 1;
    }
    else {
        page += num;
        $("#pageSwitcher").val(page + 1);
        displayComLists(deeta);
    }
}

function search() {
    deeta = ogDeeta;
    let query = $("#searchBar").val();
    if (query == "") {
        // Reset stuff
        page = 0;
        $("#pageSwitcher").val("1");
        displayComLists(deeta);
    }
    else {
        let regex = new RegExp(";.*(" + query + ").*;{", "ig"); // Matches all strings that contain "query"
        let splitData = deeta.split("|-!-|");
        let filteredData = splitData.filter((val) => val.match(regex));
        if (filteredData.length == 0) {
            $(".customLists").children().remove()
            page = 0;
            $("#pageSwitcher").val("1");
            $("#maxPage").text("/1")
            $(".customLists").append("<p align=center>- Žádné výsledky -</p>");
        }
        else {
            page = 0;
            $("#pageSwitcher").val("1");
            deeta = "";
            filteredData.forEach((val) => deeta += val + "|-!-|");

            displayComLists(filteredData.join("|-!-|"));
        }
    }
}

function checkCheckbox(changeVal) {
    if ($(`img[for="${changeVal}"]`).attr("src").match("off") == null) {
        $(`img[for="${changeVal}"]`).attr("src", "images/check-off.png")
        $(`input[name="${changeVal}"]`).attr("checked", false)

    }
    else {
        $(`img[for="${changeVal}"]`).attr("src", "images/check-on.png")
        $(`input[name="${changeVal}"]`).attr("checked", true)

    }
}
