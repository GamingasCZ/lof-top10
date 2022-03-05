//Holba buenas hyperhackeře :D. Nyní sleduješ můj hrozný kód :).

function checkJson(data) {
    try {
        // Kontrola názvů atd.
        let invalidNames = ["Gamingas", "GamingasCZ"];

        let listName = $("#listnm").val();
        let listCreator = $("#creatornm").val();

        if (listName.length < 3) { throw (jsStr["LIST_L"][LANG]); }
        if (listName.length > 40) { throw (jsStr["LIST_TOOL"][LANG]); }

        if (listCreator.length < 3) { throw (jsStr["CREA_L"][LANG]); }
        if (listCreator.length > 20) { throw (jsStr["CREA_TOOL"][LANG]); }
        if (listCreator.toLowerCase().includes("gamingas")) { throw (jsStr["GG_NEVER"][LANG]); }

        // 1/3 Je to vůbec JSON?
        var parsedData = JSON.parse(data);
        $(".errorBox").text(jsStr["SUCC_UPL"][LANG]);

        // 1.5/3 Je seznam prázdný?
        if (Object.keys(parsedData).length - ADDIT_VALS < 2) { throw (jsStr["EMPT_L"][LANG]) }

        if (data.length > 25000) {
            throw (`Tvůj seznam je moc velký! (${(data.length/25000).toFixed(2)}% nad limitem!). Smaž nějaké levely/collaby z levelů!`)
        }

        // 2/3 Neobsahuje prázdné jméno/tvůrce
        for (i = 1; i < Object.keys(parsedData).length - ADDIT_VALS; i++) {
            if (parsedData[i] == undefined) {
                throw (i + ". místo neexistuje. Bug mi nahlaš (nebo si nehrej s JSONem :D).")
            }
            if (parsedData[i]["levelName"] == "") {
                throw ("Level na " + i + ". místě nemá <b style='color:lime'>jméno!</b>")
            }
            if (parsedData[i]["creator"] == "") {
                throw ("Level na " + i + ". místě nemá <b style='color:lime'>tvůrce!</b>")
            }
        }
        return true;
    }
    catch (error) {
        $(".errNotif").fadeIn(100);

        if (data == "") {
            $(".errorBox").html(jsStr["NO_JSON"][LANG]);
        }
        else {
            $(".errorBox").html(error);
        }

        setTimeout(() => { $(".errNotif").fadeOut(200) }, 2000);
        return false
    }
}

var isHidden = $("input[name='hidden']").attr("checked") == "checked";
var page = 0;
var maxPage = 0;
var listNames = [];
function displayComLists(doita) {
    $(".customLists").children().remove();

    let data = JSON.parse(JSON.stringify(doita));
    let listAmount = Object.keys(data).length;

    maxPage = Math.ceil(listAmount / 4);
    $("#maxPage").text("/" + maxPage);

    if (Object.keys(data).length > 0) {
        data.slice(4 * page, 4 * page + 4).forEach(list => {
            let listColor = list["data"]["1"].color;
            let darkCol = HEXtoRGB(listColor, 40);

            $(".customLists").append(`
            <a style="text-decoration: none;" href="./index.html?id=${list.id}">
                <div id="listPreview" class="button noMobileResize" style="background-color: ${listColor}; border-color: rgb(${darkCol.join(",")})">
                    <div class="uploadText">${list.name}</div>
                    <div class="uploadText">${jsStr["CREATOR_BY"][LANG]}${list.creator}</div>
                </div>
            </a>
                    `);
        });
    }
}

function showFaves() {
    $(".searchTools").hide();
    $(".uploadBG").hide();
    $(".titles").hide();
    $(".customLists").hide();

    $("iframe").show();
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
            "hidden": listHidden,
            "isNowHidden": isHidden
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

function debugLists(am) {
    // not translatable, because I don't feel like it :D
    let adj = ["Big", "Small", "Good", "Bad", "Funny", "Stupid", "Furry", "Christian", "Best", "Gay", "Nice", "Thicc", "OwO", "Cringe", "Big PP", "Life-changing", "Gamingas", "Reddit", "Dramatic", "Hot", "Shit"]
    let noun = ["Levels", "Collabs", "Megacollabs", "Layouts", "Deco", "Effect Levels", "Grass Levels", "Glow Levels", "2.1 Levels", "Wave Levels", "Virgin Levels", "Extreme Demon Levels", "Viprin Levels",
        "Main Levels", "List Levels", "Dangerous Levels", "Gauntlet Levels", "Energetic Levels", "Questionable Levels"]
    if (am == 2) {
        deeta = [];
        for (let i = 0; i < parseInt($("#lDebugAm").val()); i++) {
            deeta.push({ "creator": i, "name": `Top ${parseInt(Math.random() * 25)} ${adj[parseInt(Math.random() * adj.length)]} ${noun[parseInt(Math.random() * noun.length)]}`, "data": { "1": { "color": randomColor() } }, "id": 45, "timestamp": 10 })
        }
        ogDeeta = deeta;

        displayComLists(deeta);
    }
    else {
        $("#lDebugAm").val(parseInt($("#lDebugAm").val()) + am)
        if ($("#lDebugAm").val() < 0) {
            $("#lDebugAm").val("0")
        }
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
        displayComLists(deeta.reverse())
        if (sorting) {
            $("#sortBut").css("transform", "scaleY(1)");
            $("#sortBut").attr("title", jsStr["NEWEST"][LANG])
        }
        else {
            $("#sortBut").css("transform", "scaleY(-1)");
            $("#sortBut").attr("title", jsStr["OLDEST"][LANG])
        }
        sorting = !sorting
    })


    // List image preview action
    $("#imageArrow").on("click", function () {
        $("#imgError").text("")
        if ($(this).css("transform").match("-1")) {
            // Hide preview
            $("#imageArrow").css("transform", "scaleY(1)");
            $("#imageArrow").attr("title", jsStr["SH_IMPREV"][LANG])
            $(".imgPreview").slideUp(200)
        }
        else {
            // Show preview
            $("#imageArrow").css("transform", "scaleY(-1)");
            $("#imageArrow").attr("title", jsStr["HI_IMPREV"][LANG])
            $("#imagePrev").css("width", "40vw")
            $("#imagePrev").attr("src", $(".titImgInp").val())
            $(".imgPreview").slideDown(200)
        }
    })
    // When the image failed to load (sad crying emoji)
    $("#imagePrev").on("error", function () {
        $("#imagePrev").css("width", "10%")
        $("#imagePrev").attr("src", "./images/error.png")
        $("#imgError").text(jsStr["IM_NOTFOUND"][LANG])
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

        if (["edit", "pedit"].includes(password[0]) & password[2] == "pass") {
            generateFromJSON()
            isHidden = $("input[name='hidden']").attr("checked") == "checked";
        }
        else if (password[0] == "update") {

            $(".uploaderDialog").html(`
            <img style="padding-left: 3%" src=./images/check.png>
            <p class="uploadText" style="padding: 0 3% 0 3%">${jsStr["LIST_UPDATED"][LANG]}</p>

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

            var pstr = `${jsStr["KEEP_PWD"][LANG]}: <b style="color: lime;">${password[1]}</b>`;

            $(".uploaderDialog").html(`
<img style="padding-left: 3%" src=./images/check.png>
<p class="uploadText" style="padding: 0 3% 0 3%">${jsStr["LIST_SUCC_UPL"][LANG]} ${pstr}</p>

<div style="margin-top: 5%;">
<h6 class="shareTitle uploadText">${jsStr["SHARE"][LANG]}</h6>
<div class="shareBG uploadText">${currWebsite}
<img class="button shareBut" src="./images/openList.png" onclick="window.open('${currWebsite}','_blank')">
</div>
</div>

`);
        }
    }

    $(".smallUploaderDialog").hide();

    // Generates stuff
    $.get("./php/getLists.php", function (data) {
        deeta = data;
        ogDeeta = data;
        displayComLists(deeta);
    });

    if (window.location.protocol.includes("file")) {
        $(".customLists").append(`<p align=center>${jsStr['NO_RES'][LANG]}</p>`);
        $(".debugTools").show()
    }
    else { $(".debugTools").remove() }

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
    <img id="rmimg2" class="removeImg" style="width: 23%; margin-top: -3.04em;" src="./images/szn1.png">
    <p id="removeText" style="display: none; text-align: center; font-size: 4vw;">${jsStr["CONF_DEL"][LANG]}</p>
    <div style="display:flex; flex-direction: row; justify-content: center; opacity:0" class="rmButSet">
        <img id="rmbutton" onclick="confirmDelete()" class="button" src="${jsStr["YES_IMG"][LANG]}">
        <img id="rmbutton" onclick="closeRmScreen()" class="button" src="${jsStr["NO_IMG"][LANG]}">
    <div>
    </div>`);

    $(".boom").css("background-color", "black");
    $(".boom").css("display", "initial");
    $(".boom").animate({ "opacity": 1 }, 500, function () {
        $("#removeText").fadeIn(2000);
        $(".rmButSet").animate({ "opacity": 1 }, 2000);
    })

    $("#rmbutton").on("mouseover", function () {
        $("#rmimg1").css("transform", "translateY(-5%)");
        $("#rmimg2").css("transform", "translateY(5%)");
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
        let regex = new RegExp(".*(" + query + ").*", "ig"); // Matches all strings that contain "query"
        let filteredData = deeta.filter(val => JSON.stringify(val).match(regex));
        if (filteredData.length == 0) {
            $(".customLists").children().remove()
            page = 0;
            $("#pageSwitcher").val("1");
            $("#maxPage").text("/1")
            $(".customLists").append(`<p align=center>${jsStr['NO_RES'][LANG]}</p>`);
        }
        else {
            page = 0;
            $("#pageSwitcher").val("1");
            deeta = filteredData;

            displayComLists(filteredData);
        }
    }
}
