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
        this.HTMLobject.remove();
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
        this.HTMLobject.remove();
        levelList[currEditing]["creator"][2].splice(arrIndex, 1);
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
    $(".roleList").children().remove();
    roleArray.forEach(x => {
        if (x.name != "") {
            $(".roleList").append(`<option>${x.name}</option>`);
        }
    })

    // Enable/disable creator
    if (roleArray.length > 0) {
        $(".addHumanButton").removeClass("disabled");
        $(".collabHumans").show();
        $(".noRoles").hide();
    }
    else {
        $(".addHumanButton").addClass("disabled");
        $(".collabHumans").hide();
        $(".noRoles").show();
    }
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

    let roleInstance = new Role(presetName, false, "", [0])
    if (loading == 0) {
        levelList[currEditing]["creator"][1].push(roleInstance); // Role name, has %, COLOR (TODO)
    }


    let roleCode = $(`
    <tr class="tableRow">
        <td>
            <input id="collabInp" onchange="rolename($(this))" placeholder="Jméno" value=${presetName}></input>
        </td>
        <td>
            <img class="setCheckbox button" for="hasPer" src="images/check-off.png" onclick="checkCollabCheck('hasPer', $(this))"> 
        </td>
        <td>

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
    let humanInstance = new Human("",levelList[currEditing]["creator"][1][0].name ,[0,0], "", [0], 0)

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
        $(".collabTTitle").text(`- ${funnyNames[0]} -`);
    }

    let humanCode = $(`
    <tr class="tableRow">
        <td>
            <input id="collabInp" placeholder="Jméno"></input>
            <img class="button" style="float: none; width: 2vw;" src="images/getStats.png">
        </td>
        <td>
            <select class="uploadText roleList">
            <option disabled="">Žádná</option>
            </select>
        </td>
        <td>
            <input id="collabInp" style="width: 20%;" placeholder="Od"></input>
            <p class="uploadText" style="display: inline">-</p>
            <input id="collabInp" style="width: 20%;" placeholder="Do"></input>
        </td>
        <td>

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
}}

function rolename(el) {
    let index = getObjArrayIndex(el, 1);
    levelList[currEditing]["creator"][1][index].name = el.val()

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