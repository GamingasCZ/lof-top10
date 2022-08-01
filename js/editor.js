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
            throw (`${jsStr["TOOBIG1"][LANG]} (${(data.length / 25000).toFixed(2)}% ${jsStr["TOOBIG2"][LANG]}).${jsStr["TOOBIG3"][LANG]}`)
        }

        // 2/3 Neobsahuje prázdné jméno/tvůrce
        for (i = 1; i < Object.keys(parsedData).length - ADDIT_VALS; i++) {
            if (parsedData[i] == undefined) {
                throw (i + ". místo neexistuje. Bug mi nahlaš (nebo si nehrej s JSONem :D).")
            }
            if (parsedData[i]["levelName"] == "") {
                throw (jsStr["NO_NAME_C"][LANG].replace("%d", i))
            }
            if (parsedData[i]["creator"] == "") {
                throw (jsStr["NO_CREA_C"][LANG].replace("%d", i))
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
var listNames = [];

function showBGColorPicker() {
    if ($(".bgcolorContainer").css("display") == "none") {
        $(".bgcolorContainer").text("")
        $(".bgcolorContainer").slideDown(50)

        let hue = getHueFromHEX(levelList.pageBGcolor)
        let val = getLightnessFromHEX(levelList.pageBGcolor) + "%"
        let val2 = getLightnessFromHEX(levelList.pageBGcolor)

        $(".bgcolorContainer").append(makeColorElement(hue, val2))

        $(".bgcolorContainer >> input")[0].addEventListener("input", k => {
            $("body").css("background-color", HSLtoHEX(k.target.value, "37%", val))
            hue = k.target.value
            $(":root").css("--greenGradient", `linear-gradient(9deg, hsl(${hue},23.1%,10.2%), hsl(${hue},90.6%,16.7%))`)
            $("[name='theme-color']").attr("content", HSLtoHEX(hue, "91%", "13%"))

            let hex = HSLtoHEX(hue, "37%", val)
            levelList.pageBGcolor = hex
            $("#bgcolorPicker").css("background", hex)
        })
        $(".bgcolorContainer >> input")[1].addEventListener("input", k => {
            let hue = getHueFromHEX(levelList.pageBGcolor)
            $("body").css("background-color", HSLtoHEX(hue, "37%", (k.target.value * 2) + "%"))
            $(":root").css("--greenGradient", `linear-gradient(9deg, hsl(${hue},23.1%,10.2%), hsl(${hue},90.6%,16.7%))`)
            $("[name='theme-color']").attr("content", HSLtoHEX(hue, "91%", "13%"))
            val = (k.target.value * 2) + "%"

            let hex = HSLtoHEX(hue, "37%", val)
            levelList.pageBGcolor = hex
            $("#bgcolorPicker").css("background", hex)
        })

    }
    else {
        $(".bgcolorContainer").slideUp(50)
    }
}

function uploadList() {
    let isValid = checkJson(JSON.stringify(levelList));
    if (isValid) {
        $("#listData").attr("value", JSON.stringify(levelList));

        $("#submitbutton").replaceWith($("<img class='loading' style='animation-name: loading;' src='images/loading.webp'>"))

        // Is the "hidden" checkbox checked?
        if ($("input[name='hidden']").attr("checked") == "checked") { var listHidden = "1" }
        else { var listHidden = "0" }

        let postData = {
            "listData": JSON.stringify(levelList),
            "lName": $("#listnm").val(),
            "lCreator": $("#creatornm").val(),
        }
        if (listHidden == "1") postData["hidden"] = listHidden

        $.post("./php/sendList.php", postData, function (data) {
            //0 - password, 1 - listID
            // Change depending on your website
            let error = data.length != 2

            let currWebsite
            let pstr
            if (!error) {
                currWebsite = `${window.location.origin + "/lofttop10"}/?${isNaN(data[1]) ? "pid" : "id"}=${data[1]}`;
                pstr = `<br>${jsStr["KEEP_PWD"][LANG]}: <b style="color: lime;">${data[0]}</b>`;
            }
            let sendMess = !error ? jsStr["LIST_SUCC_UPL"][LANG] + " " + pstr : jsStr["LIST_FAIL_UPL"][LANG] + data

            $(".uploaderDialog").html(`
                <img style="padding-left: 3%" src=./images/${!error ? "check" : "error"}.webp >
                <p class="uploadText" style="padding: 0 3% 0 3%">${sendMess}</p>

                <div style="display:flex; flex-direction: column${error ? ';display: none;' : ';'}">
                    <h6 class="shareTitle uploadText">${jsStr["SHARE"][LANG]}</h6>
                    <div class="uploadText shareContainer">
                        <p class="shareBG uploadText">${currWebsite}</p>
                        <img class="button shareBut" src="./images/openList.webp" onclick="window.open('${currWebsite}','_blank')">
                    </div>
                </div >

            `);
        })
    }
}
function updateList() {
    let isValid = checkJson(JSON.stringify(levelList));
    if (isValid) {
        // Is the "hidden" checkbox checked?
        if ($("input[name='hidden']").attr("checked") == "checked") { var listHidden = "1" }
        else { var listHidden = "0" }

        // will later also update uploadList()
        let param = JSON.parse(sessionStorage.getItem("listProps"))
        let postData = {
            "listData": JSON.stringify(levelList),
            "id": param[0],
            "pwdEntered": param[1],
            "hidden": listHidden,
            "isNowHidden": isHidden
        }

        $("#submitbutton").html("<img class='loading' src='images/loading.webp'>")
        $("#removebutton").remove()

        $.post("./php/updateList.php", postData, function (data) {
            // Update success
            if (data == 3) {
                $(".uploaderDialog").html(`
                <div style="padding: 3%">
                    <img src="./images/check.webp" style="width:7%;">
                    <p class="uploadText">${jsStr["LIST_UPDATED"][LANG]}</p>
                </div>
                `)
            }

            // List is unchanged
            else if (data == 4) {
                $(".uploaderDialog").html(`
                <div style="padding: 3%">
                    <img src="./images/help.webp" style="width:7%;">
                    <p class="uploadText">${jsStr["LIST_UNCHANGED"][LANG]}</p>
                </div>
                `)
            }

            else {
                $(".uploaderDialog").html(`
                <div style="padding: 3%">
                    <img src="./images/error.webp" style="width:7%;">
                    <p class="uploadText">${jsStr["LIST_UPFAIL"][LANG]}</p>
                </div>
                `)
            }
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
            deeta.push({"creator": i, "name": `Top ${parseInt(Math.random() * 25)} ${adj[parseInt(Math.random() * adj.length)]} ${noun[parseInt(Math.random() * noun.length)]}`, "data": { "1": { "color": randomColor() } }, "id": 45, "timestamp": 10})
        }

        listViewerDrawer(deeta, ".communityContainer", 4)
    }
    else {
        $("#lDebugAm").val(parseInt($("#lDebugAm").val()) + am)
        if ($("#lDebugAm").val() < 0) {
            $("#lDebugAm").val("0")
        }
    }
    $(".debugTools").remove()
}

$(function () {
    // Do nothing if in editor
    $(".pickerContainer").on("click", showBGColorPicker)
    if (window.location.search.includes("edit")) $(".uploader").show()

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
        $("#imagePrev").attr("src", "./images/error.webp")
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
    // Showing color picker

    let isSearching = false
    let paramGetter = new URLSearchParams(window.location.search)
    let params = Object.fromEntries(paramGetter.entries());

    if (Object.keys(params).length == 0 || params.browse != null || params.s != null) {
        $(".browser").show()
        $.get("./parts/listViewer.html", dt => {
            $(".communityContainer").append(translateDoc(dt, "listViewer"))

            if (params.s != null) {
                $(".communityContainer").show()
                $("#searchBar").val(params.s)
                isSearching = true
            }

            // Generates stuff
            $.get("./php/getLists.php", data => {
                if (typeof data != "object") { $(".listContainer").text(jsStr["NO_RES"][LANG]); return; }
                listViewerDrawer(data, ".communityContainer", 4)
                if (isSearching) $(".communityContainer .doSearch").click()
            });
        })
    }

    if (params.editing != null) {
        generateFromJSON()
        isHidden = $("input[name='hidden']").attr("checked") == "checked";
    }


    if (window.location.port != "") {
        $(".customLists").append(`<p align=center>${jsStr['NO_RES'][LANG]}</p>`);
        $(".debugTools").show()
    }
    else { $(".debugTools").remove() }

    $("img[for='diffGuesser']").click(() => {
        $(".settingSubbox").slideToggle(50);
        checkCheckbox("diffGuesser");
        $(".diffSelBut img").removeClass("disabled")
        levelList.diffGuesser = [$("input[name='diffGuesser']").prop("checked"),true,true]
    })
})

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
        let data = JSON.parse(sessionStorage.getItem("listProps"))
        let postData = {
            "id": data[0],
            "pwdEntered": data[1],
            "isHidden": data[2] == "id" ? 0 : 1
        }
        murderList();
        $.post("./php/removeList.php", postData, function () {
            murderList();
        })
    }, 600)
}

function removeList() {
    // Confirm remove
    $(".boom").append(`<div class="uploadText removeScreen">
    <img id="rmimg1" class="removeImg" style="width: 23%;" src="./images/szn2.webp"><br />
    <img id="rmimg2" class="removeImg" style="width: 23%; margin-top: -5.4vw;" src="./images/szn1.webp">
    <p id="removeText" style="display: none; text-align: center; font-size: 4vw;">${jsStr["CONF_DEL"][LANG]}</p>
    <div style="display:flex; flex-direction: row; justify-content: center; opacity:0" class="rmButSet">
        <button id="rmbutton" onclick="confirmDelete()" class="button uploadText eventButton">${jsStr["YES"][LANG]}</button>
        <button id="rmbutton" onclick="closeRmScreen()" class="button uploadText eventButton">${jsStr["NO"][LANG]}</button>
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

    $(".boom").animate({ "opacity": 1 }, 2000, () => window.location.replace("./upload.html?editor"));
    $("#levelUpload").addClass("killList");
}