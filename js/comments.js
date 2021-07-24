
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
    /*
    if (charLimit > 300) {
        $(".comTextArea").text($(".comTextArea").text().slice(0, 300))
        charLimit = $(".comTextArea").text().length
    }
    */

    $("#charLimit").text(charLimit + "/300")
}

var actualText = "";
$(function () {
    var selectPholder = placeholders[parseInt(Math.random() * placeholders.length)];

    $(".comTextArea").text(selectPholder);
    $("#comFont").css("color", "rgba(255,255,255,0.5)")


    $(".comTextArea").on("blur", () => {
        if ($(".comTextArea").text().length == 0) {
            $(".comTextArea").text(selectPholder)
            $("#comFont").css("color", "rgba(255,255,255,0.5)")
        }
    })

    $(".comTextArea").on("click", () => {
        if (placeholders.indexOf($(".comTextArea").text()) != -1) {
            $(".comTextArea").text("")
        }

        $("#comFont").css("color", "rgba(255,255,255,1)")
    })


    $(".comTextArea").on("keyup keypress", (k) => {

        if (k.type == "keyup") {

            /*
            // Special keys
            if ((k.key).length > 1) {
                switch (k.key) {
                    case "Enter":
                        actualText += "\n";
                        break;
                    case "Backspace":
                        // TODO: remove emojis properly, update properly when deleting a selection!!!!!!!!!!!!!
                        let lenCheck = actualText
                        lenCheck = lenCheck.replace("\n","")
                        lenCheck = lenCheck.replace(/&\d+/g, "")
                        
                        if ($(".comTextArea").text().length != lenCheck.length) {
                            actualText = $(".comTextArea").text()
                        }
                        else { actualText = actualText.slice(0, -1); }
                        break;
                    default:
                        break;
                }
            }
            
            else {
                actualText += k.key
            }
            updateCharLimit()
            */
            let text = $(".comTextArea").html()

            text = text.replace(/<div>/g, "")
            text = text.replace(/<\/div>/g, "\n")
            text = text.replace(/<br>/g, "\n")
            text = text.replace(/<img class="emojis" src=".\/images\/emoji\/\d+.png">/g, "&01")

            if (text.endsWith("\n")) {
                text = text.slice(0, -2)
            }

            actualText = text
            updateCharLimit()
        }
    })

    let commentColor = RGBtoHEX(randomColor())
    let boxColor = HEXtoRGB(commentColor, 30);
    let darkerBoxColor = HEXtoRGB(commentColor, 50);

    $("#commentMaker").css("background-color", commentColor)
    $("#commentMaker").css("border-color", "rgb(" + boxColor.join(",") + ")")
    $(".comTextArea").css("background-color", "rgb(" + boxColor.join(",") + ")")
    $(".comBoxThings").css("background-color", "rgb(" + darkerBoxColor.join(",") + ")")


    $(".cpicker").on("change", () => {
        let col = $(".cpicker").val();

        let boxColor = HEXtoRGB(col, 40);
        let darkerBoxColor = HEXtoRGB(col, 80);

        $("#commentMaker").css("background-color", col)
        $("#commentMaker").css("border-color", "rgb(" + boxColor.join(",") + ")")
        $(".comTextArea").css("background-color", "rgb(" + boxColor.join(",") + ")")
        $(".comBoxThings").css("background-color", "rgb(" + darkerBoxColor.join(",") + ")")
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
    let emojiIDs = ["&01"]

    if (actualText.length + emojiIDs[id].length < 300) {
        actualText += emojiIDs[id]
        actualText.length + "/300"
        updateCharLimit()

        $(".comTextArea").append(`<img class='emojis' src='./images/emoji/${emojiIDs[id].slice(1)}.png'>`)
    }
}
