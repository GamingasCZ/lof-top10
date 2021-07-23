
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


    $(".comTextArea").on("keyup keypress", () => {
        var charLimit = $(".comTextArea").text().length

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

        if (charLimit > 300) {
            $(".comTextArea").text($(".comTextArea").text().slice(0, 300))
            charLimit = $(".comTextArea").text().length
        }

        $("#charLimit").text(charLimit + "/300")

        /*
        var newLinesArr = Object.keys($(".comTextArea").children()).slice(0, -2)
        var newLines = $(".comTextArea").children()
        if (newLinesArr.length != 0) {
            newLinesArr.forEach(element => {
                if (newLines[element].localName == "div" & element != "0") {
                    newLines[element].remove()
                    $(".comTextArea").append("<br />")
                }
            });
        }
        */

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

function addEmoji() {
    /*
    let line = 2.6 * Math.ceil($(".comTextArea").val().length / 56)
    let left = 2 + ((($(".comTextArea").val().length) * 1.5) - (76.5 * (line / 2.6 - 1)))
    $(".emojis").append(`<img src='./images/check.png' style='left: ${Math.abs(left)}vw; bottom: ${17.3 - line}vw'>`)
    $(".comTextArea").val($(".comTextArea").val() + "  ")
    */
    $(".comTextArea").append("<img class='emojis' src='./images/check.png'>")
}