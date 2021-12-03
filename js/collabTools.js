var currEditing;
const presets = [["Dekorace", 1], ["Layout", 1], ["Tester", 0]];
const presetNames = ["Dekorace", "Layout", "Tester"]

class Role {
    constructor(name, hasPer, color, HTMLobject, id = 0) {
        this.name = name;
        this.hasPer = hasPer;
        this.color = color;
        this.HTMLobject = HTMLobject[0];
        this.id = levelList[currEditing]["creator"][1].length - 1;
    }

    remove(arrIndex) {
        this.HTMLobject.remove()
        levelList[currEditing]["creator"][1].splice(arrIndex, 1);

        refreshRoleList();
    }
}

class Human {
    constructor(name, role, part, color, HTMLobject, verified, id = 0) {
        this.name = name;
        this.role = role;
        this.part = part;
        this.color = color
        this.HTMLobject = HTMLobject[0];
        this.verified = verified;
        this.id = levelList[currEditing]["creator"][2].length - 1;

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

    $("#collabTools").fadeIn(50);
    $("#collabTools").css("transform", "scaleY(1)");
    $(".tableRow").remove();

    let creaArray = levelList[id]["creator"];
    if (typeof creaArray == "object") {
        let longer = creaArray[1].length >= creaArray[2].length ? creaArray[1].length : creaArray[0].length
        $(".verifier").val(creaArray[0][0])
        for (let i = 0; i < longer; i++) {
            if (i < creaArray[1].length) { addRole(creaArray[1][i], 1) }
            if (i < creaArray[2].length) { addCollabHuman(creaArray[2][i]) }
        }
    }
    else {
        $(".verifier").val(creaArray)
    }

    refreshRoleList()
}

function hideCollabTools() {
    // Collab tools turn creator into an array
    if (typeof levelList[currEditing]["creator"] == "object") {
        $(".colButton" + currEditing).css("filter", "hue-rotate(180deg)");
    }
    else {
        $(".colButton" + currEditing).css("filter", "hue-rotate(0deg)");
    }

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
    roleArray.forEach(role => {
        humArray.forEach(hum => {
            if (hum.role == role.name) { select = " selected"}
        });

        if (role.name != "") {
            $(".roleList").append(`<option${select}>${role.name}</option>`);
        } 
    })
    // Enable/disable creator
    if (roleArray.length > 0) {
        $(".addHumanButton").removeClass("disabled");

        // Entire table elements
        $(".collabRoles").show();

        // Help labels
        $(".noRoles").hide();
        $(".noRolAdded").hide();
        $(".addRoles").show();
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
    }

    // Roles, but no humans (shocked emoji face yes)
    if (humArray.length > 0) {
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
        levelList[currEditing]["creator"][1].push(roleInstance); // Role name, has %, COLOR (TODO)
    }

    let roleCode = $(`
    <tr class="tableRow">
        <td>
            <input id="collabInp" onchange="chRoleValue($(this), 'name', 1)" placeholder="Jméno" value=${presetName}></input>
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
            <img class="button" style="float: none; width: 2.5vw;" src="images/delete.png" onclick="removeColObject($(this), 1)">
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
    // name, role, part %, color, element, verified, id
    let humanInstance = new Human("", levelList[currEditing]["creator"][1][0].name, [0, 0], "", [0], 0)
    if (load != 0) {
        console.log(load)
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
            <input onchange="chRoleValue($(this), 'name', 2)" id="collabInp" placeholder="Jméno" value="${humanInstance.name}"></input>
            <img class="button" style="float: none; width: 2vw;" src="images/getStats.png">
        </td>
        <td>
            <select onchange="chRoleValue($(this), 'role', 2)" class="uploadText roleList"></select>
        </td>
        <td>
            <input onchange="chRoleValue($(this), 'part', 2, 0)" id="collabInp" style="width: 20%;" placeholder="Od" value="${humanInstance.part[0]}"></input>
            <p class="uploadText" style="display: inline">-</p>
            <input onchange="chRoleValue($(this), 'part', 2, 1)" id="collabInp" style="width: 20%;" placeholder="Do" value="${humanInstance.part[1]}"></input>
        </td>
        <td>
        <input type="color" class="tableCpicker button" style="float: none; width: 85%" value="${cpickerCol}" onchange="chRoleValue($(this), 'color', 2)">
        </td>
        <td>
            <img class="button" style="float: none; width: 2.5vw;" src="images/delete.png" onclick="removeColObject($(this), 2)" >
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

    refreshRoleList();
}

function chRoleValue(el, changeValue, type, arr=null) {
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
    levelList[currEditing]["creator"][type].forEach(el => {
        if ($(el.HTMLobject).is(th.parent().parent())) {
            el.remove(getObjArrayIndex(th, 1))

            if (presetNames.indexOf(el.name) != -1) {
                $(`.eventButton:eq(${presetNames.indexOf(el.name)})`).show()
            }
        }
    })
}

function rollThing(thing) {
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