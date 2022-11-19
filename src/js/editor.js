//Holba buenas hyperhackeře :D. Nyní sleduješ můj hrozný kód :).

function checkJson(data, isPreview = false) {
    try {
        // Kontrola názvů atd.
        let listName = $("#listnm").val();

        if (listName.length < 3) { throw (jsStr["LIST_L"][LANG]); }
        if (listName.length > 40) { throw (jsStr["LIST_TOOL"][LANG]); }

        // 1/3 Je to vůbec JSON?
        var parsedData = JSON.parse(data);
        $(".errorBox").text(jsStr["SUCC_UPL"][LANG]);

        // 1.5/3 Je seznam prázdný?
        if (getListLen(parsedData) == 0) { throw (jsStr["EMPT_L"][LANG]) }

        if (data.length > 25000) {
            throw (`${jsStr["TOOBIG1"][LANG]} (${(data.length / 25000).toFixed(2)}% ${jsStr["TOOBIG2"][LANG]}).${jsStr["TOOBIG3"][LANG]}`)
        }

        // 2/3 Neobsahuje prázdné jméno/tvůrce
        for (i = 1; i < getListLen(parsedData) + 1; i++) {
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
            if (isPreview) error += "<br><br><cy>Tip: " + jsStr["DBLCLKTIP"][LANG] + ".</cy>"
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
            $(":root").css("--siteBackground", HSLtoHEX(k.target.value, "37%", val))
            hue = k.target.value
            $(":root").css("--greenGradient", `linear-gradient(9deg, hsl(${hue},23.1%,10.2%), hsl(${hue},90.6%,16.7%))`)
            $("[name='theme-color']").attr("content", HSLtoHEX(hue, "91%", "13%"))

            let hex = HSLtoHEX(hue, "37%", val)
            levelList.pageBGcolor = hex
            $("#bgcolorPicker").css("background", hex)
        })
        $(".bgcolorContainer >> input")[1].addEventListener("input", k => {
            let hue = getHueFromHEX(levelList.pageBGcolor)
            $(":root").css("--siteBackground", HSLtoHEX(hue, "37%", (k.target.value * 2) + "%"))
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
    if ($("#submitbutton").hasClass("disabled")) return

    let isValid = checkJson(JSON.stringify(levelList));
    if (isValid) {
        $("#listData").attr("value", JSON.stringify(levelList));

        $("#submitbutton").prepend("<img class='loading' src='images/loading.webp'>")
        $("#submitbutton").addClass("disabled")
        $(".editables").addClass("disabled")
        $(".editables").css("pointer-events", "none")
        $("#listnm").addClass("disabled")
        $("#listnm").css("pointer-events", "none")

        // Is the "hidden" checkbox checked?
        if ($("input[name='hidden']").attr("checked") == "checked") { var listHidden = "1" }
        else { var listHidden = "0" }

        let postData = {
            "listData": JSON.stringify(levelList),
            "lName": $("#listnm").val(),
        }
        if (listHidden == "1") postData["hidden"] = listHidden

        $.post("./php/sendList.php", postData, function (data) {
            //0 - password, 1 - listID
            // Change depending on your website
            if (typeof data == "object") {
                sessionStorage.setItem("listUpload", JSON.stringify([data[0], 0]))
                switchLoFList(data[0])
                return
            }

            let error = data.length != 1
            if (!error) {
                currWebsite = `${window.location.href.split(window.location.hash)[0]}#${data[0]}`;
            }
            let sendMess = !error ? "" : jsStr["LIST_FAIL_UPL"][LANG] + data

            if (error) {
                $(".errorBox").html(sendMess); // List fart

                $(".errNotif").fadeIn(100);
                setTimeout(() => { $(".errNotif").fadeOut(200) }, 2000);
            }

            $("#submitbutton").removeClass("disabled")
            $(".editables").removeClass("disabled")
            $(".editables").css("pointer-events", "")
            $("#listnm").removeClass("disabled")
            $("#listnm").css("pointer-events", "")
            $(".loading").remove()
        })
    }
}
function updateList() {
    if ($("#submitbutton").hasClass("disabled")) return

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
            "pwdEntered": $("#lpass").val(),
            "hidden": listHidden,
            "isNowHidden": param[2]
        }

        $("#submitbutton").prepend("<img class='loading' src='images/loading.webp'>")
        $("#submitbutton").addClass("disabled")
        $(".editables").addClass("disabled")
        $(".editables").css("pointer-events", "none")
        $(".removeList").hide()

        $.post("./php/updateList.php", postData, function (data) {
            // Update success
            if (typeof data == "object") {
                sessionStorage.setItem("listUpload", JSON.stringify([data[0], 1]))
                switchLoFList(data[0])
                return
            }

            else if (data == 4) $(".errorBox").html(jsStr["LIST_UNCHANGED"][LANG]); // List is unchanged
            else $(".errorBox").html(jsStr["LIST_UPFAIL"][LANG]); // List fart

            $(".errNotif").fadeIn(100);
            setTimeout(() => { $(".errNotif").fadeOut(200) }, 2000);

            $("#submitbutton").removeClass("disabled")
            $(".editables").removeClass("disabled")
            $(".editables").css("pointer-events", "")
            $(".loading").remove()
            $(".removeList").show()
        })
    }
}

var deeta = '';
var ogDeeta = '';
const DEFAULT_LEVELLIST = {
    "titleImg": ["", 0, 33, 1, true], // URL, position, coverage, halign, gradient
    "pageBGcolor": "#020202",
    "diffGuesser": [false, true, true], // enabled, diff, rating
    "translucent": false
}

function makeEditor(update) {
    // Check login
    if (hasLocalStorage() && localStorage.getItem("userInfo") == null) {
        $("#levelUpload").remove()
        $("#loginHelp").show()
        lockQuotes()
    }
    else {
        $("#loginHelp").remove()
    }

    // Do nothing if in editor
    $(".pickerContainer").on("click", showBGColorPicker)
    if (window.location.search.includes("edit")) $(".uploader").show()

    // List preview
    $(".previewButton").on("click", () => preview(false))
    $(".previewButton").on("dblclick", () => preview(true))

    $("img[for='diffGuesser']").click(() => {
        $(".settingSubbox").slideToggle(50);
        checkCheckbox("diffGuesser");
        $(".diffSelBut img").removeClass("disabled")
        levelList.diffGuesser = [$("input[name='diffGuesser']").prop("checked"), true, true]
    })

    // TODO: fix for old lists!!
    $("#listimg").on("change", () => levelList.titleImg[0] = $("#listimg").val())
    $(".imgSetButton").click(showBGsettings)

    $("img[for=transCards]").click(() => { checkCheckbox("transCards", (x, y) => levelList.translucent = y) })

    // Show alert if creating list
    window.addEventListener('beforeunload', pageExit);

    $("#mainContent").append(jsStr["HELP_TEXT"][LANG]);
    $(".savedFilter").on("keyup", searchFaves)

    if (update) {
        let info = JSON.parse(sessionStorage.getItem("listProps"))
        if (info == null) return

        let id = info[2] ? "pid" : "id"
        let postArray = {}
        postArray[id] = info[0] // (id/pid): listID

        $.post("./php/pwdCheckAction.php", postArray, check => {
            if (typeof check == "object") generateFromJSON(2, check)
            else generateFromJSON(1)
        })
        isHidden = $("input[name='hidden']").attr("checked") == "checked";
    }
}

const pageExit = exit => {
    if (getListLen(boards)) exit.preventDefault();
}

function makeBrowser() {
    let isSearching = false
    $.get("./parts/listBrowser.html", dt => {
        hash = window.location.hash
        let search = hash.includes("!") ? hash.split("!")[1] : ""
        if (search != "") {
            $("#searchBar").val(decodeURIComponent(search))
            isSearching = true
        }

        // Add switch buttons
        if (hasLocalStorage() && localStorage.getItem("userInfo") != null) {
            $(".titleTools").after(`<div class="browserContainer">
                <button class="browserButton noMobileResize uploadText button" onclick="switchBrowser('#browse')">${jsStr["NEWEST"][LANG]}</button>
                <button class="browserButton noMobileResize uploadText button" onclick="switchBrowser('#uploads')">${jsStr["UPLOADS"][LANG]}</button>
            </div>`)
            $(".browserButton").eq(hash == "#uploads").attr("id", "browserBSelected")
        }

        // Generates stuff
        if (hash == "#uploads") browser = 1

        $(".browserButton").attr("id", "")
        if (browser > 0) {
            if ($(".privateSel").length == 0) {
                $(".browserContainer").append(`<div style="padding: 0.3em 0.4em 0;" class="button browserButton noMobileResize privateSel" title="${jsStr["SH_PRIVATE"][LANG]}"><img style="width: 1.6em;" src="images/hidden.svg"></div>`)
                $(".privateSel").click(() => switchBrowser("#hidden"))
            }
        }
        $(".browserButton").eq(browser).attr("id", "browserBSelected")

        listOnlineViewerDrawer(
            {startID: 999999, searchQuery: null, page: 0, path: "/php/getLists.php", fetchAmount: 8, sort: 0},
            "#communityContainer", 4, [0, 0], jsStr["CLISTS"][LANG])
    })
}

function changeUsernames(data, type) {
    let ind = 0
    if (type != 4) {
        $("#commAmount").text(data[2].commAmount)  
        data[0].forEach(c => {
          data[0][ind].avatar = `images/oldPFP.png` // Old comments
          data[1].forEach(u => {
            if (c.uid == u.id) {
              data[0][ind].username = u.username
              if (u.avatar_hash == "") data[0][ind].avatar = "images/defaultPFP.webp" // user is using default dc pfp for some reason
              else data[0][ind].avatar = `https://cdn.discordapp.com/avatars/${u.discord_id}/${u.avatar_hash}.png`
            }
          })
          ind++
        })
    } else {
        data[0].forEach(c => {
            data[1].forEach(u => {
                // Old comments
                if (c.uid != -1 && c.uid == u.discord_id) data[0][ind].creator = u.username
            })
            ind++
        })
    }
}

let browser = 0
function switchBrowser(hash) {
    let req = ""
    let ind = 0
    switch (hash) {
        case "#uploads":
            req = "user"; ind = 1; break;
        case "#hidden":
            req = "hidden"; ind = 2; break;
        default:
            break;
    }
    if (browser == ind) return
    browser = ind

    $(".browserButton").attr("id", "")
    $(".browserButton").eq(ind).attr("id", "browserBSelected")
    if (["#uploads", "#hidden"].includes(hash)) {
        if ($(".privateSel").length == 0) {
            $(".browserContainer").append(`<div style="padding: 0.3em 0.4em 0;" class="button browserButton noMobileResize privateSel" title="${jsStr["SH_PRIVATE"][LANG]}"><img style="width: 1.6em;" src="images/hidden.svg"></div>`)
            $(".privateSel").click(() => switchBrowser("#hidden"))
        }
    }
    else $(".privateSel").remove()

    online = {startID: 999999, searchQuery: null, page: 0, path: "/php/getLists.php", fetchAmount: 8, sort: 0}
    online[req] = 1
    listOnlineViewerDrawer(online, "#communityContainer", 4, [0, 0], jsStr["CLISTS"][LANG])
}

function closeRmScreen() {
    $(".removeScreen").fadeOut(100)
    $("#app > .boom").animate({ "opacity": 0 }, 500, function () {
        $("#app > .boom").css("background-color", "white")
        $("#app > .boom").css("display", "none")
        $(".removeScreen").remove()
    })
}
function confirmDelete() {
    closeRmScreen()

    let data = JSON.parse(sessionStorage.getItem("listProps"))
    let postData = {
        "id": data[0],
        "pwdEntered": $("#lpass").val(),
        "isHidden": data[2] ? 1 : 0
    }
    $.post("./php/removeList.php", postData, function () {
        window.removeEventListener("beforeunload", pageExit)
        murderList();
    })
}

function removeList() {
    // Confirm remove
    $("#app > .boom").append(`<div class="uploadText removeScreen">
    <img id="rmimg1" class="removeImg" style="width: 23%;" src="./images/szn2.webp"><br />
    <img id="rmimg2" class="removeImg" style="width: 23%; margin-top: -5.4vw;" src="./images/szn1.webp">
    <p id="removeText" style="text-align: center; font-size: var(--bigFont)">${jsStr["CONF_DEL"][LANG]}</p>
    <div style="display:flex; flex-direction: row; justify-content: center; opacity:0" class="rmButSet">
        <button id="rmbutton" onclick="confirmDelete()" class="button uploadText eventButton">${jsStr["YES"][LANG]}</button>
        <button id="rmbutton" onclick="closeRmScreen()" class="button uploadText eventButton">${jsStr["NO"][LANG]}</button>
    <div>
    </div>`);

    $("#app > .boom").css("background-color", "black");
    $("#app > .boom").css("display", "block");
    $("#app > .boom").animate({ "opacity": 1 }, 500, function () {
        $("#removeText").fadeIn(2000);
        $(".rmButSet").animate({ "opacity": 1 }, 2000);
    })

    $("#rmbutton").on("mouseover", function () {
        $("#rmimg1").css("transform", "translateY(-5%)");
        $("#rmimg2").css("transform", "translateY(5%)");
        $("#app > .boom").css("background-color", "rgb(11, 0, 0)");
    })
    $("#rmbutton").on("mouseout", function () {
        $("#rmimg1").css("transform", "translateY(0%)");
        $("#rmimg2").css("transform", "translateY(0%)");
        $("#app > .boom").css("background-color", "rgb(0, 0, 0)");
    })
}
function murderList() {
    $("#app").before("<div class='boom boomReal'></div>")

    $(".boomReal").css("display", "block")
    $(".boomReal").animate({ "opacity": 1 }, 2000, () => {
        window.location.hash = "#editor"
        $(".boomReal").animate({ "opacity": 0 }, 100, () => {
            $(".boomReal").remove()
        });
    });
    $("#levelUpload").addClass("killList");
}

function checkCheckbox(changeVal, runFun = null) {
    if ($(`img[for="${changeVal}"]`).attr("src").match("On") != null) {
        $(`img[for="${changeVal}"]`).attr("src", "images/modernCheck.svg")
        $(`input[name="${changeVal}"]`).attr("checked", false)
        if (runFun != null) runFun(changeVal, false)
    }
    else {
        $(`img[for="${changeVal}"]`).attr("src", "images/modernCheckOn.svg")
        $(`input[name="${changeVal}"]`).attr("checked", true)
        if (runFun != null) runFun(changeVal, true)
    }
}

function lockQuotes() {
    let faces = ["04", "05", "07", "08", "15", "12", "10"]
    let quotes = jsStr["QUOTES"][LANG]
    let pick = parseInt(Math.random() * faces.length)

    $(".loginEmoji").attr("src", `images/emoji/${faces[pick]}.webp`)
    $(".quote").text(quotes[pick])

}
