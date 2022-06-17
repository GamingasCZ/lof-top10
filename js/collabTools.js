var currEditing;
var clipboard;

var HOST_ROLE;
var presets;
var presetNames;

class Role {
    constructor(name, HTMLobject, id = 0) {
        this.name = name;
        this.HTMLobject = HTMLobject[0];
        this.id = new Date().getTime();
    }

    remove(arrIndex) {
        this.HTMLobject.remove()
        levelList[currEditing]["creator"][1].splice(arrIndex, 1);

        refreshRoleList();
    }
}

class Human {
    constructor(name, role, part, color, socials, HTMLobject, verified) {
        this.name = name;
        this.role = role;
        this.part = part;
        this.color = color;
        this.socials = socials;
        this.HTMLobject = HTMLobject[0];
        this.verified = verified;
    }
    remove(arrIndex) {
        this.HTMLobject.remove()
        levelList[currEditing]["creator"][2].splice(arrIndex, 1);

        refreshRoleList();
    }
}


function showCollabTools(id) {
    currEditing = id;
    let cardCol = $("#top" + id).css("background-color");
    let dark = HEXtoRGB(RGBtoHEX((cardCol.match(/\d+/g)).map(x => parseInt(x))), 40)
    $("body").css("overflow-y", "hidden")
    $(".collabTables").css("background-color", cardCol);
    $(".collabTables:nth-child(even)").css("background-color", dark);
    $(".eventButton").show();

    $(".collabTTitle").text(`- ${jsStr["CT_S_TIT_1"][LANG]} -`);
    $("#collabTools").css("background-color", cardCol);
    $("#collabTools").css("border-color", `rgb(${dark.join(",")})`)
    $(".collabHeader").css("background-color", `hsl(${getHueFromHEX(RGBtoHEX((cardCol.match(/\d+/g)).map(x => parseInt(x))))},40.7%,54%)`)
    $(".collabDIV").css("background-color", `hsl(${getHueFromHEX(RGBtoHEX((cardCol.match(/\d+/g)).map(x => parseInt(x))))},40.7%,34%)`)

    $("#collabTools").fadeIn(50);
    $("#collabTools").css("transform", "scaleY(1)");

    $(".roleBubble").remove();
    $(".tableRow").remove();

    // Clipboard loading
    if (sessionStorage.getItem("roleclip") == null) {
        $("#rolepaste").addClass("disabled");
    }
    if (sessionStorage.getItem("humclip") == null) {
        $("#humpaste").addClass("disabled")
    }

    $(".hostIcon").attr("src", "images/bytost.webp")
    let creaArray = levelList[id]["creator"];
    if (typeof creaArray == "object") {
        let longer = creaArray[1].length >= creaArray[2].length ? creaArray[1].length : creaArray[2].length
        $(".verifier").val(creaArray[0][0])
        for (let i = 0; i < longer; i++) {
            if (i < creaArray[1].length) { addRole(creaArray[1][i], 1) }
            if (i < creaArray[2].length) { addCollabHuman(creaArray[2][i]) }
        }
        refreshRoleList()

        if (creaArray[0][1] == 1) { // Is host verified?
            $(".hostIcon").attr("src", "images/check.webp")
        }
    }
    else {
        $(".verifier").val(creaArray)
    }

    // Loading a different empty level
    if (typeof creaArray != "object" || levelList[currEditing]["creator"][1].length == 0) {
        $(".addHumanButton").addClass("disabled");

        // Entire table elements
        $(".collabHumans").hide();
        $(".collabRoles").hide();

        // Help labels
        $(".noRoles").show();
        $(".noRolAdded").show();
        $(".addRoles").hide();
        $("#humpaste").addClass("disabled");
    }
}

function hideCollabTools() {
    // Collab tools turn creator into an array
    if (typeof levelList[currEditing]["creator"] == "object") {
        $(".colButton" + currEditing).css("filter", "hue-rotate(180deg)");

        // Remove HTMLobjects from SM arrays
        levelList[currEditing]["creator"][2].forEach(hum => {
            hum["socials"].forEach(soc => {
                soc.splice(2, 1);
            });
        });
    }
    else {
        $(".colButton" + currEditing).css("filter", "hue-rotate(0deg)");
    }

    $(".socSettings").css("opacity", 0)

    $("body").css("overflow-y", "scroll")

    $(".cardLCreator" + currEditing).val($(".verifier").val())

    $("#collabTools").fadeOut(50);
    $("#collabTools").css("transform", "scaleY(0.7)");
}

function refreshRoleList() {
    let roleArray = levelList[currEditing]["creator"][1]
    let humArray = levelList[currEditing]["creator"][2]
    if (roleArray == undefined) { roleArray = [] } // First time entering different colTools
    if (humArray == undefined) { humArray = [] } // First time entering different colTools

    // TODO: roles of humans get overwritten, make sure that doesn't happen
    $(".roleList").children().remove();
    if ($(".roleList").children().length == 0) {
        $(".roleList").append(`<option disabled>${jsStr["NO_ROLE"][LANG]}</option>`);
    }

    var select = ""

    let roleIDs = []
    roleArray.forEach(role => {
        roleIDs.push(role.id);

        if (role.name != "") {
            $(".roleList").append(`<option${select}>${role.name}</option>`);
        }
        else {
            $(".roleList").append(`<option${select}>(${jsStr["UNN_ROLE"][LANG]})</option>`);
        }
    });

    if ($(".roleList").length > 0) {
        let i = 0
        humArray.forEach(hum => {
            if (roleIDs.indexOf(hum.role) != -1 && $(".roleList")[i] != undefined) {

                let roleIndex = roleIDs.indexOf(hum.role);
                hum.role = roleIDs[roleIndex];
                $(".roleList")[i].childNodes[roleIndex + 1].setAttribute("selected", true);
            }
            else if (roleIDs.indexOf(hum.role) == -1) {
                if (roleIDs.length > 0) { hum.role = roleIDs[0]; } // Selects the first role
                else { hum.role = 0; } // When no role is available
            }
            i++
        })
    }

    // Enable/disable creator
    if (roleArray.length > 0) {
        $(".addHumanButton").removeClass("disabled");

        // Entire table elements
        $(".collabRoles").show();

        // Help labels
        $(".noRoles").hide();
        $(".noRolAdded").hide();
        $(".addRoles").show();
        if (sessionStorage.getItem("humclip") != undefined) { $("#humpaste").removeClass("disabled"); }
    }
    else {
        $(".addHumanButton").addClass("disabled");

        // Entire table elements
        $(".collabHumans").hide();
        $(".collabRoles").hide();

        // Help labels
        $(".noRoles").show();
        $(".noRolAdded").show();
        $(".addRoles").hide();
        $("#humpaste").addClass("disabled");
    }

    // Roles, but no humans (shocked emoji face yes)
    if (humArray.length > 0 && roleArray.length > 0) {
        $(".addRoles").hide();
        $(".collabHumans").show();
    }
    else { $(".collabHumans").hide(); }
}

function addRole(preset = null, loading = 0) {
    if (loading == 1) { var presetName = preset.name } // Loading from levelList object
    else { var presetName = preset != null ? presets[preset][0] : ""; } // Preset load
    if (preset != null & loading == 0) { $(`.eventButton:eq(${preset})`).hide(); } // Remove clicked preset button

    let currVerifier = levelList[currEditing]["creator"];
    if (typeof currVerifier != "object") {
        // TODO: first element verified might need to be fixed
        levelList[currEditing]["creator"] = [[currVerifier, 0, HOST_ROLE], [], []];

        // Role limit
        if (levelList[currEditing]["creator"][1].length == 10) {
            return false
        }
        else if (levelList[currEditing]["creator"][1].length == 9) {
            $(".roleAddButton").addClass("disabled");
        }
        else {
            $(".roleAddButton").removeClass("disabled");
        }
    }

    let roleInstance = new Role(presetName, [0])
    if (loading == 0) {
        levelList[currEditing]["creator"][1].push(roleInstance); // Role name
    }

    let roleCode = $(`
    <div class="roleBubble" style="background: ${randomColor()};">
        <input id="roleInp" maxlength="20" oninput="chRoleValue($(this), 'name', 1)" placeholder="${jsStr["NAME"][LANG]}" value=${presetName}></input>
        <div class="roleControls">
            <img class="button noMobileResize" src="images/copy.webp" onclick="clipboardTask(1, $(this).parent(), 1)"
            ><img class="button noMobileResize roleRm" src="images/delete.webp" onclick="removeColObject($(this), 1)">
        </div>
    </div>
    `).appendTo($(".collabRoles"));
    roleInstance.HTMLobject = roleCode[0];
    if (loading == 1) { preset.HTMLobject = roleCode[0]; }
    else { refreshRoleList(); }

    rollThing(0, true)
}

function verifyPerson(th) {
    let index = getObjArrayIndex(th, 2)
    let inp = $(th.siblings()[1]).val(); // Username

    // Verifying person
    $.get("https://gdbrowser.com/api/profile/" + inp, nm => {
        if (nm != "-1") {
            $(th.siblings()[0]).attr("src", "https://gdbrowser.com/icon/" + inp)
            $(th.siblings()[1]).val(nm.username)
            levelList[currEditing]["creator"][2][index].name = nm.username

            // Setting social media
            for (let i = 0; i < levelList[currEditing]["creator"][2][index]["socials"].length; i++) {
                lock_socChange = true;
                soc_changingInd = i;
                removeSocial();
            }

            let gdSocials = ["youtube", "twitter", "twitch"];
            let urls = ["https://youtube.com/channel/",
                "https://twitter.com/",
                "https://twitch.tv/"]
            soc_selected = index;
            gdSocials.forEach(m => {
                if (nm[m] != null) {
                    lock_socChange = false
                    let curr = gdSocials.indexOf(m);
                    soc_array = [curr, urls[curr] + nm[m]];
                    confirmSocial();

                    // Member color from GD pcol1
                    let p1col = RGBtoHEX([nm.col1RGB.r, nm.col1RGB.g, nm.col1RGB.b])
                    levelList[currEditing]["creator"][2][index].color = p1col;
                    $(".tableCpicker")[index].value = p1col;
                }
            })

            levelList[currEditing]["creator"][2][index].verified = [nm.icon, nm.col1, nm.col2, nm.glow]
        }
    })
}

function addCollabHuman(load = 0) {
    // name, role, part %, color, socials, element, verified, id
    let humanInstance = new Human("", levelList[currEditing]["creator"][1][0].id, [0, 0], "", [], [0], 0)
    if (load != 0) {
        humanInstance = load;
    }
    if (load == 0) { var cpickerCol = randomColor(); humanInstance.color = cpickerCol }
    else { var cpickerCol = load.color }

    // messages don't change when deleting, bur i don't care :p
    let humanCount = levelList[currEditing]["creator"][2].length
    let funnyNames = [jsStr["CT_S_TIT_1"][LANG], jsStr["CT_S_TIT_2"][LANG], jsStr["CT_S_TIT_3"][LANG], jsStr["CT_S_TIT_4"][LANG], jsStr["CT_S_TIT_5"][LANG]]

    if (humanCount < 5) {
        $(".collabTTitle").text(`- ${funnyNames[0]} -`);
    }
    else if (humanCount >= 5 && humanCount < 20) {
        $(".collabTTitle").text(`- ${funnyNames[1]} -`);
    }
    else if (humanCount >= 20 && humanCount < 50) {
        $(".collabTTitle").text(`- ${funnyNames[2]} -`);
    }
    else if (humanCount >= 50 && humanCount < 75) {
        $(".collabTTitle").text(`- ${funnyNames[3]} -`);
    }
    else {
        $(".collabTTitle").text(`- ${funnyNames[4]} -`);
    }

    // Is human verified?
    let verifySign = "images/bytost.webp";
    if (load != 0) { verifySign = humanInstance.verified ? "images/check.webp" : "images/bytost.webp" }

    let rowID = new Date().getTime();
    let humanCode = $(`
    <tr class="tableRow">
        <td>
            <img class="button noMobileResize" style="width: 2vw;" src="${verifySign}"
           ><input onchange="chRoleValue($(this), 'name', 2)" id="collabInp" placeholder="${jsStr["NAME"][LANG]}" value="${humanInstance.name}"></input
           ><img class="button noMobileResize" style="width: 2vw;" src="images/getStats.webp" onclick="verifyPerson($(this), 1)">
        </td>
        <td>
            <img class="button noMobileResize socAddButton" style="width: 2vw;" src="images/add.webp" onclick="addSocMedia($(this))"
       ></td>
        <td>
            <select onchange="chRoleValue($(this), 'role', 2)" class="uploadText roleList"></select>
        </td>
        <td>
            <input onchange="chRoleValue($(this), 'part', 2, 0)" type="number" min="0" max="100" id="collabInp" class="percCollab" style="width: 20%;" placeholder="${jsStr["FROM"][LANG]}" value="${humanInstance.part[0]}"></input
           ><p class="uploadText" style="display: inline">-</p
           ><input onchange="chRoleValue($(this), 'part', 2, 1)" type="number" min="0" max="100" id="collabInp" class="percCollab" style="width: 20%;" placeholder="${jsStr["TO"][LANG]}" value="${humanInstance.part[1]}"></input
           ><p class="uploadText" style="display: inline">%</p
        </td>
        <td>
            <input type="color" class="tableCpicker noMobileResize button" style="width: 85%" value="${cpickerCol}" onchange="chRoleValue($(this), 'color', 2)">
        </td>
        <td>
            <img class="button noMobileResize" style="width: 2.5vw;" src="images/copy.webp" onclick="clipboardTask(1, $(this), 2)"
           ><img class="button noMobileResize humRm" style="width: 2.5vw;" src="images/delete.webp" onclick="removeColObject($(this), 2)">
        </td>
        <input type="hidden" value="${rowID}">
    </tr>
    `).appendTo($(".collabHumans"))

    humanInstance.HTMLobject = humanCode[0];

    let cardCol = $("#top" + currEditing).css("background-color");
    let dark = HEXtoRGB(RGBtoHEX((cardCol.match(/\d+/g)).map(x => parseInt(x))), 40)
    $(".roleList").css("background", `rgb(${dark.join(",")})`)

    if (load == 0) {
        levelList[currEditing]["creator"][2].push(humanInstance);
        refreshRoleList();
    }
    else {
        // Loading socialMedia
        let socialCell = $($(humanInstance.HTMLobject).children()[1])
        if (humanInstance.socials.length >= 5) {
            socialCell.children().hide()
        }

        humanInstance["socials"].forEach(soc => {
            let smallBut = $(`<img class="button noMobileResize" style="width: 2vw" src=images/${imgs[soc[0]]}.webp>`).appendTo(socialCell)
            smallBut.on("click", changeSocial)
            smallBut.on("dblclick", x => { changeSocial(x); removeSocial() });
            // Adds corresponding HTMLelement to array
            soc[2] = smallBut["0"];

        });
    }

    rollThing(1, true)
}

function chRoleValue(el, changeValue, type, arr = null) {
    let index = getObjArrayIndex(el, type);
    if (changeValue == "role") {
        let roleNames = []
        let roleIDs = []
        levelList[currEditing]["creator"][1].forEach(role => {
            roleNames.push(role.name)
            roleIDs.push(role.id)
        });
        levelList[currEditing]["creator"][type][index][changeValue] = roleIDs[roleNames.indexOf(el.val())]
    }
    else {
        if (arr == null) {
            levelList[currEditing]["creator"][type][index][changeValue] = el.val()
        }
        else {
            levelList[currEditing]["creator"][type][index][changeValue][arr] = el.val()
        }
    }

    if (changeValue == "name" && type == 2 && levelList[currEditing]["creator"][2][index].verified) {
        // Unverifying person on input change
        levelList[currEditing]["creator"][2][index].verified = false;
        $(el.siblings()[0]).attr("src", "images/bytost.webp");
    }
    if (changeValue == "part") {
        const clamp = (num, min, max) => Math.min(Math.max(num, min), max)
        let [from, to] = [el.parent()[0].children[0].value, el.parent()[0].children[2].value]
        // Make sure "from" and "to" make sense
        if (arr == 0) { // From
            if (parseInt(from) > parseInt(to)) { to = clamp(parseInt(from) + 1, 0, 100) }
        }
        else { // To
            if (parseInt(to) < parseInt(from)) { from = clamp(parseInt(to) - 1, 0, 100) }
        }

        el.parent()[0].children[0].value = from
        el.parent()[0].children[2].value = to
        levelList[currEditing]["creator"][2][index].part[0] = from
        levelList[currEditing]["creator"][2][index].part[1] = to

    }

    refreshRoleList();
}

function chMainName(el, vyb) {
    if (typeof levelList[currEditing]["creator"] != "object") {
        let currVerifier = levelList[currEditing]["creator"];
        levelList[currEditing]["creator"] = [[currVerifier, 0, $(".verifierRole").val()], [], []]
    }

    if (vyb == 1) {
        levelList[currEditing]["creator"][0][1] = false;
        $(el.siblings()[0]).attr("src", "images/bytost.webp");
        levelList[currEditing]["creator"][0][0] = $(".verifier").val();
    }
    else if (vyb == 2) {
        // Verifying person
        $.get("https://gdbrowser.com/api/profile/" + $(".verifier").val(), nm => {
            if (nm != "-1") {
                $(".hostIcon").attr("src", "https://gdbrowser.com/icon/" + $(".verifier").val())
                levelList[currEditing]["creator"][0][1] = [nm.icon, nm.col1, nm.col2, nm.glow];
            }
        })
    }
    else if (vyb == 3) {
        // Changing host role
        levelList[currEditing]["creator"][0][0] = $(".verifierRole").val();
    }
}

function getObjArrayIndex(th, type) {
    var res = null;

    mainEl = type == 1 ? th.parent() : th.parent().parent()

    levelList[currEditing]["creator"][type].forEach(el => {
        if (el.HTMLobject.isEqualNode(mainEl["0"])) {
            res = levelList[currEditing]["creator"][type].indexOf(el);
        }
    })

    return res;
}

function killEverything() {
    $(".roleBubble").remove()
    $(".tableRow").remove()
    levelList[currEditing]["creator"][1] = []
    levelList[currEditing]["creator"][2] = []

    closeHelp()
    refreshRoleList()
}

function removeColObject(th, type) {
    if (type == 2) {
        // Hiding socials bar
        if (th.parent().siblings()[1].childNodes[1].style.filter != "") { // Add socials button
            $(".socSettings").css("opacity", 0);
        }
    }

    let isLastRole = levelList[currEditing]["creator"][1].length == 1
    let areHumans = levelList[currEditing]["creator"][2].length > 0
    if (type == 1 && isLastRole && areHumans) {
        openHelp("lastRoleDelete")
        return false
    }

    var finished = false
    levelList[currEditing]["creator"][type].forEach(el => { // Removing element
        mainEl = type == 1 ? th.parent() : th.parent().parent()
        if ($(el.HTMLobject).is(mainEl)) {
            el.remove(getObjArrayIndex(th, type))

            if (presetNames.indexOf(el.name) != -1) { // Restore preset
                $(`.eventButton:eq(${presetNames.indexOf(el.name)})`).show()
            }

            finished = true
        }
    })

    if (!finished) { // When the element fails to remove (happens randomly for some godforsaken reason ;-; )
        let deleteIndexR = Object.values($(".roleRm")).indexOf(th[0]);
        let deleteIndexH = Object.values($(".humRm")).indexOf(th[0]);

        $(".tableRow").remove();
        $(".roleBubble").remove();
        let creaArray = levelList[currEditing]["creator"];
        let longer = creaArray[1].length >= creaArray[2].length ? creaArray[1].length : creaArray[2].length;
        $(".verifier").val(creaArray[0][0]);
        for (let i = 0; i < longer; i++) {
            if (i < creaArray[1].length) { addRole(creaArray[1][i], 1); }
            if (i < creaArray[2].length) { addCollabHuman(creaArray[2][i]); }
        }
        if (type == 1) {
            $(".roleBubble")[deleteIndexR].remove();
            levelList[currEditing]["creator"][1].splice(deleteIndexR, 1);
        }
        else {
            $(".tableRow")[deleteIndexH + creaArray[1].length].remove();
            levelList[currEditing]["creator"][2].splice(deleteIndexH, 1);
        }
        refreshRoleList();
    }
}

function rollThing(thing, forceOpen = false) {
    // 0-Role, 1-Human

    // Socials popup
    $(".socialPicker").css("opacity", 0)

    if ($('.collabDIV')[thing].style.display != "none" && !forceOpen) {

        $($('.collabDIV')[thing]).slideUp(50);
    }
    else {
        $($('.collabDIV')[thing]).slideDown(50);
    }

    if ($('.collabDIV')[0].style.display == "none" && $('.collabDIV')[1].style.display == "none") {
        $("#emojiMan").show()
    }
    else {
        $("#emojiMan").hide()
    }
}

function clipboardTask(task, data, ind = -1) {
    // task - 1: copy, 2: paste
    if (task == 1) {
        let object = levelList[currEditing]["creator"][ind][getObjArrayIndex(data, ind)]
        let dataName = object.constructor.name == "Role" ? "role" : "hum"

        sessionStorage.setItem(dataName + "clip", JSON.stringify(object))
        $(`#${dataName}paste`).removeClass("disabled")
    }
    else {
        let pasteData = sessionStorage.getItem(data);
        if (pasteData == null) { return false }

        if (data == "roleclip") {
            let clip = JSON.parse(pasteData)
            let role = new Role(clip.name, ["lol"])

            levelList[currEditing]["creator"][1].push(role)
            addRole(role, 1);
        }
        else {
            if (typeof levelList[currEditing]["creator"] == "object" && levelList[currEditing]["creator"][1].length > 0) {
                let clip = JSON.parse(pasteData)
                let hum = new Human(clip.name, clip.role, clip.part, clip.color, clip.socials, ["lol"], clip.verified)

                levelList[currEditing]["creator"][2].push(hum)
                addCollabHuman(hum);
            }
        }
        refreshRoleList();
    }

}

// Adding social media
var soc_selected
var soc_array
var soc_changingInd
var lock_socChange

var names
var imgs

function align() {
    // Opens socialPicker popup an aligns it
    // Function aligns the popup under the socialPickerButton
    if (!lock_socChange) {
        $(".socialPicker").css("opacity", 1)
        $(".socialPicker").fadeToggle(75)

        let soc = $(".openSocPicker").position();
        $(".socialPicker").css("top", (soc.top + (window.innerWidth / 19)) + "px");
        $(".socialPicker").css("left", (soc.left + (window.innerHeight / 100)) + "px");
    }
}

function addSocMedia(el) {
    // Called upon clicking (+) in table cell
    lock_socChange = false
    $(".socSettings").css("pointer-events", "all")
    soc_selected = getObjArrayIndex(el, 2);

    $(".openSocPicker").removeClass("disabled")
    $(".addSocial").attr("title", jsStr["CONFIRM"][LANG])
    $(".rmSocial").attr("title", jsStr["CANCEL"][LANG])

    $(".socialPickerIcon").show()
    $(".socialPicker").hide();
    $(".socAddButton").css("filter", "hue-rotate(0deg)")
    el.css("filter", "hue-rotate(90deg)");

    $(".socSettings").animate({ "opacity": 1 }, 100);
    $(".socInp").val("");
    $(".socInp").focus()

    let addedSM = levelList[currEditing]["creator"][2][soc_selected]["socials"]
    if (addedSM.length == 5) {
        // Do not add SM when there's nothing to add
        return false
    }

    if (addedSM.length > 0) {
        // Hide SM already added in socialPicker popup
        let including = []
        addedSM.forEach(x => { including.push(x[0]); })
        let next = null
        for (let i = 0; i < 5; i++) {
            if (including.includes(i)) {
                $(".socialPickerIcon")[i].style.display = "none";
            }
            else if (next == null) { next = i }

        }

        if (next != null) {
            $(".openSocPicker").attr("src", `images/${imgs[next]}.webp`)
            $(".socInp").attr("placeholder", names[next]);
            soc_array = [next, ""]

        }
    }
    else {
        // When no SM has been added yet
        soc_array = [0, ""]
        $(".openSocPicker").attr("src", `images/${imgs[0]}.webp`)
        $(".socInp").attr("placeholder", names[0]);
    }
}

function confirmSocial() {
    // Called upon clicking check in socialMedia settings
    if (!lock_socChange) {
        levelList[currEditing]["creator"][2][soc_selected]["socials"].push([...soc_array]);

        // Adds a button to table cell
        let tableBit = $(".socAddButton")[soc_selected].parentElement
        let smallBut = $(`<img class="button noMobileResize" style="width: 2vw" src=images/${imgs[soc_array[0]]}.webp>`).appendTo(tableBit)
        smallBut.on("click", changeSocial)
        smallBut.on("dblclick", x => { changeSocial(x); removeSocial() });

        // Adds corresponding HTMLelement to array
        let ok = levelList[currEditing]["creator"][2][soc_selected]["socials"]
        ok[ok.length - 1].push(smallBut["0"]);

        // Hides (+) when no more SM can be added
        if (levelList[currEditing]["creator"][2][soc_selected]["socials"].length == 5) {
            $(".socAddButton")[soc_selected].style.display = "none";
        }
    }
    else {
        // Edits link, doesn't add new button
        levelList[currEditing]["creator"][2][soc_selected]["socials"][soc_changingInd[0]][1] = soc_array[1];
    }

    lock_socChange = false;
    $(".socSettings").css("pointer-events", "none")
    $(".socAddButton").css("filter", "hue-rotate(0deg)")
    $(".socSettings").animate({ "opacity": 0 }, 50);
}

function removeSocial() {
    // Called upon clicking (X) in socialMedia settings
    if (lock_socChange) {
        soc_changingInd[1].remove()
        levelList[currEditing]["creator"][2][soc_selected]["socials"].splice(soc_changingInd[0], 1)

        // Shows (+) button again in table cell
        if (levelList[currEditing]["creator"][2][soc_selected]["socials"].length == 4) {
            $(".socAddButton")[soc_selected].style.display = "inline";
        }
    }

    $(".socSettings").css("pointer-events", "none")
    $(".socSettings").animate({ "opacity": 0 }, 50);
    $(".socAddButton").css("filter", "hue-rotate(0deg)");

}

function selectSocialMedia(what) {
    // Called upon clicking a SM button in socialPicker popup
    if (!lock_socChange) {
        let selected = Object.values($(".socialPicker").children()).indexOf(what.target) - 1;

        $(".openSocPicker").attr("src", `images/${imgs[selected]}.webp`);
        $(".socInp").attr("placeholder", names[selected]);

        soc_array[0] = selected;

        $(".socialPicker").fadeToggle(75);
    }
}

function changeSocial(but) {
    // Called upon clicking thumbnail in table cell
    soc_selected = getObjArrayIndex($(but.target), 2)
    let target = but.target;
    $(".socAddButton").css("filter", "hue-rotate(0deg)")

    $(".addSocial").attr("title", jsStr["SAV_CHANG"][LANG])
    $(".rmSocial").attr("title", jsStr["DELETE"][LANG])

    let i = 0
    levelList[currEditing]["creator"][2][soc_selected]["socials"].forEach(s => {
        if (target.isEqualNode(s[2])) {
            soc_changingInd = [i, target];
            lock_socChange = true;
            $(".openSocPicker").attr("src", `images/${imgs[s[0]]}.webp`);
            $(".openSocPicker").addClass("disabled");
            $(".socInp").val(s[1]);
            $(".socInp").focus()

            $(target).siblings()[0].style.filter = "hue-rotate(90deg)";

            $(".socSettings").css("pointer-events", "all")
            $(".socSettings").animate({ "opacity": 1 }, 50);
        }
        i++
    });
}

$(function () {
    HOST_ROLE = "Host"
    presets = [[jsStr["DECO"][LANG], 1], [jsStr["LAYOUT"][LANG], 1], [jsStr["TESTER"][LANG], 0]];
    presetNames = [jsStr["DECO"][LANG], jsStr["LAYOUT"][LANG], jsStr["TESTER"][LANG]]

    names = [jsStr["YT_CHAN"][LANG], jsStr["TW_PROF"][LANG], jsStr["TW_CHAN"][LANG], jsStr["DC_SERV"][LANG], jsStr["CUST_LINK"][LANG]];
    imgs = ["youtube", "twitter", "twitch", "discord", "cust"];

    // Ctools human social media picker
    $(".openSocPicker").on("click", align);
    $(".socialPickerIcon").on("click", selectSocialMedia);

    $(".addSocial").on("click", confirmSocial);
    $(".rmSocial").on("click", removeSocial);

    $(".socInp").on("input", () => {
        soc_array[1] = $(".socInp").val();
    })

    window.addEventListener("resize", () => { $(".socialPicker").hide() });

    $(".roleTab").click(() => {
        $(".roleStuff").eq(0).css("display", "flex");
        $(".roleStuff").eq(1).css("display", "initial");
        $(".memberStuff").hide()
    })
    $(".humanTab").click(() => {
        $(".memberStuff").eq(0).css("display", "flex");
        $(".memberStuff").eq(1).css("display", "initial");
        $(".roleStuff").hide()
    })
})
