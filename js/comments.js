const EMOJI_AM = 11;
try {
    var lID = (window.location.search).match(/id=\d+/)["0"].split("=")[1];
}
catch {
    var lID = "-1";
}
const LIST_ID = lID;


function listList() {
    // What a shitty function name bruh
    $(".comments").fadeOut(50);
    $(".boards").fadeIn(100);
    $(".lComm").removeClass("disabled")
    $(".lList").addClass("disabled")
}

function listComments() {
    $(".boards").fadeOut(50);
    $(".comments").fadeIn(100);
    $(".lComm").addClass("disabled")
    $(".lList").removeClass("disabled")
}

var placeholders = [
    "Tvůj seznam je...",
    "Líbí se mi tvůj seznam, protože...",
    "Máš jiný názor než já. Už nikdy nebudeš klidně spát, protože...",
    "Tvůj seznam stojí za prd, protože...",
    "Mrkni se i na můj seznam..."
]

function updateCharLimit() {
    var charLimit = actualText.length

    // I finally got to use the switch statement!!! (so exciting)
    switch (Math.floor(charLimit / 50)) {
        case 2:
            $("#charLimit").css("color", "#fce8e8")
            break;
        case 3:
            $("#charLimit").css("color", "#fcc4c4")
            break;
        case 4:
            $("#charLimit").css("color", "#f49f9f")
            break;
        case 5:
            $("#charLimit").css("color", "#ef6969")
            break;
        case 6:
            $("#charLimit").css("color", "#b50e0e")
            break;
        default:
            $("#charLimit").css("color", "#ffffff")
            break;
    }

    // Maybe not neccessary? Unless a hyperhacker hacks the matrix.
    if (charLimit > 300) {
        $(".comTextArea").html($(".comTextArea").html().slice(0, 300))
        charLimit = $(".comTextArea").text().length
    }

    $("#charLimit").text(charLimit + "/300")
}

var actualText = "";
var midText = ""
$(function () {
    $(".emojiPanel").hide();

    // Adds emojis into the emoji panel
    for (let i = 0; i < EMOJI_AM; i++) {
        let em = (i + 1 < 10) ? "0" + (i + 1) : i + 1
        $(".emojiPanel").append(`<img class="listEmoji" src="./images/emoji/${em}.png" onclick="addEmoji(${i})">`)
    }

    // Fetch comments
    displayComments(fakeDeeta); // DELETE LATER!!!
    $.get("./php/getComments.php", function (data) {
        displayComments(data)
    })

    // Adds a placeholder to the comment area
    var selectPholder = placeholders[parseInt(Math.random() * placeholders.length)];
    $(".comInpArea").text(selectPholder);
    $("#comFont").css("color", "rgba(255,255,255,0.5)")

    // Placeholder related stuff 
    $(".comInpArea").on("blur", () => {
        if (actualText.length == 1) {
            $(".comInpArea").text(selectPholder)
            $("#comFont").css("color", "rgba(255,255,255,0.5)")
        }
    })

    $(".comInpArea").on("click", () => {
        if (placeholders.indexOf($(".comTextArea")["0"].innerText) != -1) {
            $(".comTextArea")["0"].innerText = ""
        }

        $("#comFont").css("color", "rgba(255,255,255,1)")
    })

    // MAIN comment handling stuff
    $(".comInpArea").on("keyup keypress", (k) => {
        // Only perform stuff once
        if (k.type == "keyup") {
            let text = $(".comTextArea").html();

            text = text.replace(/<div>/g, "\n"); // Div tag is most likely newline
            text = text.replace(/<\/div>/g, ""); // Remove div tag end
            let keepImgs = text;
            keepImgs = keepImgs.replace(/<br>/g, "")

            // TODO: Replace with proper emoji ID
            text = text.replace(/<img class="emojis" src=".\/images\/emoji\/\d+.png">/g, "&01");

            // Remove excess tags
            text = text.replace(/<(“[^”]*”|'[^’]*’|[^'”>])*>/g, "");

            // Remove excess newline
            if (text.startsWith("\n")) {
                text = text.slice(1);
                keepImgs = keepImgs.slice(1);
            }

            actualText = text;
            midText = keepImgs;
            updateCharLimit()
        }
    })

    // Pick a random comment color
    let commentColor = RGBtoHEX(randomColor())
    let boxColor = HEXtoRGB(commentColor, 30);
    let darkerBoxColor = HEXtoRGB(commentColor, 50);

    $("#commentMaker").css("background-color", commentColor)
    $("#commentMaker").css("border-color", "rgb(" + boxColor.join(",") + ")")
    $(".comInpArea").css("background-color", "rgb(" + boxColor.join(",") + ")")
    $(".comInpThings").css("background-color", "rgb(" + darkerBoxColor.join(",") + ")")
    $(".emojiPanel").css("background-color", "rgb(" + boxColor.join(",") + ")")
    $("#verticalLine").css("border-color", commentColor)


    $(".cpicker").on("change", () => {
        let col = $(".cpicker").val();

        let boxColor = HEXtoRGB(col, 40);
        let darkerBoxColor = HEXtoRGB(col, 80);

        $("#commentMaker").css("background-color", col)
        $("#commentMaker").css("border-color", "rgb(" + boxColor.join(",") + ")")
        $(".comInpArea").css("background-color", "rgb(" + boxColor.join(",") + ")")
        $(".comInpThings").css("background-color", "rgb(" + darkerBoxColor.join(",") + ")")
        $(".emojiPanel").css("background-color", "rgb(" + boxColor.join(",") + ")")
        $("#verticalLine").css("border-color", col)
    })
})

function getPlayerIcon() {
    let player = $(".pIconInp").val();
    $.get("https://gdbrowser.com/api/profile/" + player, (data, res) => {
        if (data == "-1") {
            $(".comUserError").text("Geodeš účet neexistuje :/")
            setTimeout(() => $(".comUserError").fadeOut(1000), 3000)
        }
        else if (res == "success") {
            $("#pIcon").attr("src", "https://gdbrowser.com/icon/" + player);
        }
        else {
            $(".comUserError").text("Nepodařilo se připojit k GDBrowseru :/")
            setTimeout(() => $(".comUserError").fadeOut(1000), 3000)
        }
    })

}

function addEmoji(id) {
    id++
    let emoji = "&" + (id > 9 ? id : "0" + id);
    if (actualText.length + emoji.length < 300) {
        midText += `<img class='emojis' src='./images/emoji/${emoji.slice(1)}.png'>`
        $(".comTextArea").html(midText)

        actualText += emoji
        updateCharLimit()
    }
}

function displayEmojiPanel() {
    if ($(".emojiPanel").css("display") == "none") {
        $(".emojiPanel").slideDown(50)
    }
    else {
        $(".emojiPanel").slideUp(50)
    }
}

function sendComment() {
    if (actualText.length <= 10) {
        $(".comUserError").text("Komentář by měl mít víc než 10 znaků!")
        setTimeout(() => $(".comUserError").fadeOut(1000), 3000)
    }
    else {
        let postData = {
            "creator": $(".pIconInp").val(),
            "comment": actualText,
            "comType": 0, // Change when I eventually add replies,
            "listID": LIST_ID,
            "comColor": $("#comCPicker").val()
        }
        $.post("../php/sendComment.php", postData, () => {

        })
    }
}


var fakeDeeta = "Gamingas;Ahoj &01&05 ok?;0;#1757b7;0;0|Bytos;Ahoj;0;#d456D3;0;0|Test;Ahoj;0;#3d6637;0;0|okey;Ahoj;0;#ea5495;0;0"

function comBox(cd, dcc, edcc) {
    let profPic = "";
    let clickable = ["", ""];
    let comColor = "#b9efb1";

    // Is user verified?
    if (cd[5] == 1) {
        profPic = `<img class="pIcon " style="padding: 0.5vw;" src="https://gdbrowser.com/icon/${cd[0]}">`;
        clickable[0] = "clickable";
        clickable[1] = `onclick="profile('${cd[0]}')`;
        comColor = "#f9f99a";
    }

    // OwO, adding emojis
    while (cd[1].match(/&\d+/g) != null) {
        let sel = cd[1].indexOf(cd[1].match(/&\d+/));
        let selStart = cd[1].slice(0, sel);
        let emojiID = cd[1].slice(sel + 1, sel + 3);
        if (emojiID > EMOJI_AM) { emojiID = "sad" }

        // fix this if you add more than 100 emojis :O
        let selEnd = cd[1].slice(sel + 3);

        cd[1] = selStart + `<img class="emojis" src="./images/emoji/${emojiID}.png">` + selEnd;
    }

    return `
    <div>
    
        <div class="comBoxThings ${clickable[0]} uploadText" id="comBoxHeader" ${clickable[1]}"
            style="margin-bottom: 0 !important;
                    justify-content: flex-start;
                    background-color: ${"rgb(" + dcc.join(",") + ")"};
                    border: solid ${"rgb(" + edcc.join(",") + ")"} 10px">
            ${profPic}
            <h3 style="margin-left: 1%; color: ${comColor};">${cd[0]}</h3>
        </div>
    
        <div class="comTextArea" id="comFont" style="width: 98%; background-color: ${cd[3]};">${cd[1]}</div>
    
    </div>
    `
}
function displayComments(data) {
    data = data.slice(0, -2);

    try {
        if (data.match(/\|/g).length > 0) {
            let comArray = data.split("|");

            // Deleteee  e e
            if (comArray.indexOf("") != -1) { comArray.splice(comArray.indexOf(""), 1) }
            if (comArray.indexOf("\n") != -1) { comArray.splice(comArray.indexOf("\n"), 1) }

            for (x = 0; x < comArray.length + 1; x++) {
                let commentData = (comArray[x]).split(";");

                let darkerComColor = HEXtoRGB(commentData[3], 40)
                let evenDarkerComColor = HEXtoRGB(commentData[3], 40)

                console.log(i)
                $("#commentList").append(comBox(commentData, darkerComColor, evenDarkerComColor));
            }
        }
        else {
            throw ("ok");
        }
    }

    catch (error) {
        if (data.match(/\|/g) == null || data.endsWith("|\n")) {
            let commentData = (data).split(";");

            $("#commentList").append(comBox(commentData, darkerComColor, evenDarkerComColor));
        }

    }
}

function profile(name) {
    window.open("https://gdbrowser.com/u/" + name);
}

function refreshComments() {
    if ($("#refreshBut")["0"].className.match("disabled") == null) {
        $("#refreshBut").addClass("disabled");
        $.get("./php/getComments.php", function (data) {
            displayComments(data);
        })
        setTimeout(() => { $("#refreshBut").removeClass("disabled") }, 3000)

    }
}
