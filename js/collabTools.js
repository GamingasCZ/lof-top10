var currEditing;
var clipboard;

const presets = [["Dekorace", 1], ["Layout", 1], ["Tester", 0]];
const presetNames = ["Dekorace", "Layout", "Tester"]

class Role {
    constructor(name, hasPer, color, HTMLobject) {
        this.name = name;
        this.hasPer = hasPer;
        this.color = color;
        this.HTMLobject = HTMLobject[0];
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

    $("#collabTools").css("background-color", cardCol);
    $("#collabTools").css("border-color", `rgb(${dark.join(",")})`)
    $(".collabHeader").css("background-color", `hsl(${getHueFromHEX(RGBtoHEX((cardCol.match(/\d+/g)).map(x => parseInt(x))))},40.7%,54%)`)
    $(".collabDIV").css("background-color", `hsl(${getHueFromHEX(RGBtoHEX((cardCol.match(/\d+/g)).map(x => parseInt(x))))},40.7%,34%)`)

    $("#collabTools").fadeIn(50);
    $("#collabTools").css("transform", "scaleY(1)");
    $(".tableRow").remove();

    // Clipboard loading
    if (sessionStorage.getItem("roleclip") == null) {
        $("#rolepaste").addClass("disabled");
    }
    if (sessionStorage.getItem("humclip") == null) {
        $("#humpaste").addClass("disabled")
    }

    let creaArray = levelList[id]["creator"];
    if (typeof creaArray == "object") {
        let longer = creaArray[1].length >= creaArray[2].length ? creaArray[1].length : creaArray[2].length
        $(".verifier").val(creaArray[0][0])
        for (let i = 0; i < longer; i++) {
            if (i < creaArray[1].length) { addRole(creaArray[1][i], 1) }
            if (i < creaArray[2].length) { addCollabHuman(creaArray[2][i]) }
        }
    }
    else {
        $(".verifier").val(creaArray)
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
        $(".roleList").append(`<option disabled>Žádná</option>`);
    }

    var select = ""

    let roleNames = []
    roleArray.forEach(role => {
        roleNames.push(role.name);

        if (role.name != "") {
            $(".roleList").append(`<option${select}>${role.name}</option>`);
        }
        else {
            $(".roleList").append(`<option${select}>(Bezejmenná)</option>`);
        }
    });

    if ($(".roleList").length > 0) {
        let i = 0
        humArray.forEach(hum => {
            if (roleNames.indexOf(hum.role) != -1 && $(".roleList")[i] != undefined) {

                let roleIndex = roleNames.indexOf(hum.role);
                $(".roleList")[i].childNodes[roleIndex + 1].setAttribute("selected", true)
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
        $("#humpaste").removeClass("disabled");
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
        levelList[currEditing]["creator"] = [[currVerifier, 0], [], []];

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

    if (loading == 0) { var cpickerCol = RGBtoHEX(randomColor()) }
    else { var cpickerCol = preset.color }

    // Checking 'hasPer' check when loading
    let loadCheck = "off"
    if (loading && preset.hasPer) { loadCheck = "on" }

    let roleInstance = new Role(presetName, false, cpickerCol, [0])
    if (loading == 0) {
        levelList[currEditing]["creator"][1].push(roleInstance); // Role name, has %, COLOR
    }

    let roleCode = $(`
    <tr class="tableRow">
        <td>
            <input id="collabInp" maxlength="20" oninput="chRoleValue($(this), 'name', 1)" placeholder="Jméno" value=${presetName}></input>
        </td>
        <td>
            <img class="setCheckbox button" for="hasPer" src="images/check-${loadCheck}.png" onclick="checkCollabCheck('hasPer', $(this))"> 
            <div style="margin:0; display: inline;" class="uploadText">Vypnuto</div>
        </td>
        <td>
            <input type="color" class="tableCpicker button" style="float: none;" value="${cpickerCol}" onchange="chRoleValue($(this), 'color', 1)">
            <p id="roleColPicker" style="display: inline;">${cpickerCol.slice(1)}</p>
        </td>
        <td>
            <img class="button" style="float: none; width: 2.5vw;" src="images/copy.png" onclick="clipboardTask(1, $(this), 1)"
           ><img class="button roleRm" style="float: none; width: 2.5vw;" src="images/delete.png" onclick="removeColObject($(this), 1)">
        </td>
    </tr>
    `).appendTo($(".collabRoles"));
    roleInstance.HTMLobject = roleCode[0];
    if (loading == 1) { preset.HTMLobject = roleCode[0] }

    refreshRoleList();
}

function checkCollabCheck(name, el) {
    let index = getObjArrayIndex(el, 1);
    if ($(`img[for="${name}"]:eq(${index})`).attr("src").match("off") == null) {
        $(`img[for="${name}"]:eq(${index})`).attr("src", "images/check-off.png")
        levelList[currEditing]["creator"][1][index].hasPer = false;

    }
    else {
        $(`img[for="${name}"]:eq(${index})`).attr("src", "images/check-on.png")
        levelList[currEditing]["creator"][1][index].hasPer = true;

    }
}

function addCollabHuman(load = 0) {
    // name, role, part %, color, socials, element, verified, id
    let humanInstance = new Human("", levelList[currEditing]["creator"][1][0].name, [0, 0], "", [], [0], 0)
    if (load != 0) {
        humanInstance = load;
    }
    if (load == 0) { var cpickerCol = RGBtoHEX(randomColor()) }
    else { var cpickerCol = load.color }

    let humanCount = levelList[currEditing]["creator"][2].length
    let funnyNames = ["Nastavení collabu", "Nastavení megacollabu", "Nastavení gigacollabu", "Cože", "Správa planety"]
    if (humanCount >= 74) {
        $(".collabTTitle").text(`- ${funnyNames[4]} -`);
    }
    else if (humanCount > 49) {
        $(".collabTTitle").text(`- ${funnyNames[3]} -`);
        $("")
    }
    else if (humanCount > 19) {
        $(".collabTTitle").text(`- ${funnyNames[2]} -`);
    }
    else if (humanCount > 4) {
        $(".collabTTitle").text(`- ${funnyNames[1]} -`);
    }
    else if (humanCount == 4) {
        $("#collabTools").css("background-image", "url('images/sadTroll.jpg')")
        $(".collabTTitle").text(`- ${funnyNames[0]} -`);
    }

    let humanCode = $(`
    <tr class="tableRow">
        <td>
            <img class="button" style="float: none; width: 2vw;" src="images/bytost.png"
           ><input onchange="chRoleValue($(this), 'name', 2)" id="collabInp" placeholder="Jméno" value="${humanInstance.name}"></input
           ><img class="button" style="float: none; width: 2vw;" src="images/getStats.png">
        </td>
        <td>
            <img class="button socAddButton" style="float: none; width: 2vw;" src="images/add.png" onclick="addSocMedia($(this))"
       ></td>
        <td>
            <select onchange="chRoleValue($(this), 'role', 2)" class="uploadText roleList"></select>
        </td>
        <td>
            <input onchange="chRoleValue($(this), 'part', 2, 0)" id="collabInp" style="width: 20%;" placeholder="Od" value="${humanInstance.part[0]}"></input
           ><p class="uploadText" style="display: inline">-</p
           ><input onchange="chRoleValue($(this), 'part', 2, 1)" id="collabInp" style="width: 20%;" placeholder="Do" value="${humanInstance.part[1]}"></input>
        </td>
        <td>
            <input type="color" class="tableCpicker button" style="float: none; width: 85%" value="${cpickerCol}" onchange="chRoleValue($(this), 'color', 2)">
        </td>
        <td>
            <img class="button" style="float: none; width: 2.5vw;" src="images/copy.png" onclick="clipboardTask(1, $(this), 2)"
           ><img class="button humRm" style="float: none; width: 2.5vw;" src="images/delete.png" onclick="removeColObject($(this), 2)">
        </td>
    </tr>
    `).appendTo($(".collabHumans"))

    humanInstance.HTMLobject = humanCode[0];

    let cardCol = $("#top" + currEditing).css("background-color");
    let dark = HEXtoRGB(RGBtoHEX((cardCol.match(/\d+/g)).map(x => parseInt(x))), 40)
    $(".roleList").css("background", `rgb(${dark.join(",")})`)

    if (load == 0) {
        levelList[currEditing]["creator"][2].push(humanInstance);
    }
    else {
        // Loading socialMedia
        let socialCell = $($(humanInstance.HTMLobject).children()[1])
        if (humanInstance.socials.length >= 5) {
            socialCell.children().hide()
        }

        humanInstance["socials"].forEach(soc => {
            let smallBut = $(`<img class="button" style="float: none; width: 2vw" src=images/${imgs[soc[0]]}.png>`).appendTo(socialCell)
            smallBut.on("click", changeSocial)
            smallBut.on("dblclick", x => { changeSocial(x); removeSocial() });
            // Adds corresponding HTMLelement to array
            soc[2] = smallBut["0"];

        });
    }

    refreshRoleList();
}

function chRoleValue(el, changeValue, type, arr = null) {
    let index = getObjArrayIndex(el, type);
    if (arr == null) {
        levelList[currEditing]["creator"][type][index][changeValue] = el.val()
    }
    else {
        levelList[currEditing]["creator"][type][index][changeValue][arr] = el.val()
    }


    if (changeValue == "color") {
        // Change text next to role color picker
        el.siblings().text(el.val().slice(1))
    }

    refreshRoleList();
}

function getObjArrayIndex(th, type) {
    var res = null;
    levelList[currEditing]["creator"][type].forEach(el => {
        if (el.HTMLobject.isEqualNode(th.parent().parent()["0"])) {
            res = levelList[currEditing]["creator"][type].indexOf(el);
        }
    })

    return res;
}

function removeColObject(th, type) {
    // Hiding socials bar
    if (th.parent().siblings()[1].childNodes[1].style.filter != "") { // Add socials button
        $(".socSettings").css("opacity", 0);
    }

    var finished = false
    levelList[currEditing]["creator"][type].forEach(el => {
        if ($(el.HTMLobject).is(th.parent().parent())) {
            el.remove(getObjArrayIndex(th, type))

            if (presetNames.indexOf(el.name) != -1) {
                $(`.eventButton:eq(${presetNames.indexOf(el.name)})`).show()
            }

            finished = true
        }
    })

    if (!finished) {
        console.log("refreshing...");
        let deleteIndexR = Object.values($(".roleRm")).indexOf(th[0]);
        let deleteIndexH = Object.values($(".humRm")).indexOf(th[0]);

        $(".tableRow").remove();
        let creaArray = levelList[currEditing]["creator"];
        let longer = creaArray[1].length >= creaArray[2].length ? creaArray[1].length : creaArray[2].length;
        $(".verifier").val(creaArray[0][0]);
        for (let i = 0; i < longer; i++) {
            if (i < creaArray[1].length) { addRole(creaArray[1][i], 1); }
            if (i < creaArray[2].length) { addCollabHuman(creaArray[2][i]); }
        }
        if (type == 1) {
            $(".tableRow")[deleteIndexR].remove();
            levelList[currEditing]["creator"][1].splice(deleteIndexR, 1);
        }
        else {
            $(".tableRow")[deleteIndexH + creaArray[1].length].remove();
            levelList[currEditing]["creator"][2].splice(deleteIndexH, 1);
        }
        refreshRoleList();
    }
}

function rollThing(thing) {
    // 0-Role, 1-Human

    // Socials popup
    if (thing == 1) { $(".socialPicker").css("opacity", 0) }
    else { align(); }

    if ($('.collabDIV')[thing].style.height != "0px") {

        $('.collabDIV')[thing].style.height = 0
    }
    else {
        $('.collabDIV')[thing].style.height = "98vh"
    }

    if ($('.collabDIV')[0].style.height == "0px" && $('.collabDIV')[1].style.height == "0px") {
        $("#emojiMan").show()
    }
    else {
        $("#emojiMan").hide()
    }
}

function debugArray() {
    let roleArray = levelList[currEditing]["creator"][1];
    let humArray = levelList[currEditing]["creator"][2];

    console.log(roleArray);
    console.log(humArray);
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
            let role = new Role(clip.name, clip.hasPer, clip.color, ["lol"])

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
var lock_socChange = false

var names = ["Youtube kanál", "Twitter účet", "Twitch kanál", "Discord tag / server", "Vlastní odkaz"];
var imgs = ["youtube", "twitter", "twitch", "discord", "cust"];

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
    $(".socSettings").css("pointer-events","all")
    soc_selected = getObjArrayIndex(el, 2);

    $(".openSocPicker").removeClass("disabled")
    $(".addSocial").attr("title", "Přidat")
    $(".rmSocial").attr("title", "Zrušit")

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
            $(".openSocPicker").attr("src", `images/${imgs[next]}.png`)
            $(".socInp").attr("placeholder", names[next]);
            soc_array = [next, ""]

        }
    }
    else {
        // When no SM has been added yet
        soc_array = [0, ""]
        $(".openSocPicker").attr("src", `images/${imgs[0]}.png`)
        $(".socInp").attr("placeholder", names[0]);
    }
}

function confirmSocial() {
    // Called upon clicking check in socialMedia settings
    if (!lock_socChange) {
        levelList[currEditing]["creator"][2][soc_selected]["socials"].push([...soc_array]);

        // Adds a button to table cell
        let tableBit = $(".socAddButton")[soc_selected].parentElement
        let smallBut = $(`<img class="button" style="float: none; width: 2vw" src=images/${imgs[soc_array[0]]}.png>`).appendTo(tableBit)
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
    $(".socSettings").css("pointer-events","none")
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

    $(".socSettings").css("pointer-events","none")
    $(".socSettings").animate({ "opacity": 0 }, 50);
    $(".socAddButton").css("filter", "hue-rotate(0deg)");

}

function selectSocialMedia(what) {
    // Called upon clicking a SM button in socialPicker popup
    if (!lock_socChange) {
        let selected = Object.values($(".socialPicker").children()).indexOf(what.target) - 1;

        $(".openSocPicker").attr("src", `images/${imgs[selected]}.png`);
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

    $(".addSocial").attr("title", "Uložit úpravy")
    $(".rmSocial").attr("title", "Smazat")

    let i = 0
    levelList[currEditing]["creator"][2][soc_selected]["socials"].forEach(s => {
        if (target.isEqualNode(s[2])) {
            soc_changingInd = [i, target];
            lock_socChange = true;
            $(".openSocPicker").attr("src", `images/${imgs[s[0]]}.png`);
            $(".openSocPicker").addClass("disabled");
            $(".socInp").val(s[1]);
            $(".socInp").focus()

            $(target).siblings()[0].style.filter = "hue-rotate(90deg)";

            $(".socSettings").css("pointer-events","all")
            $(".socSettings").animate({ "opacity": 1 }, 50);
        }
        i++
    });
}

$(function () {
    // Ctools human social media picker
    $(".openSocPicker").on("click", align);
    $(".socialPickerIcon").on("click", selectSocialMedia);

    $(".addSocial").on("click", confirmSocial);
    $(".socInp").on("change",confirmSocial)
    
    $(".rmSocial").on("click", removeSocial);

    $(".socInp").on("input", () => {
        soc_array[1] = $(".socInp").val();
    })

    window.addEventListener("resize", () => { $(".socialPicker").hide() });
})
