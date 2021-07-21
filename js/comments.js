
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
    let selectPholder = placeholders[parseInt(Math.random() * placeholders.length)];
    $(".comTextArea").attr("placeholder", selectPholder);

    $(".comTextArea").on("keyup keypress", () => {
        var charLimit = $(".comTextArea").val().length

        // I finally got to use the switch statement!!! (so exciting)
        switch (Math.floor(charLimit/50)) {
            case 2:
                $("#charLimit").css("color","#fce8e8")
                break;
            case 3:
                $("#charLimit").css("color","#fcc4c4")
                break;
            case 4:
                $("#charLimit").css("color","#f49f9f")
                break;
            case 5:
                $("#charLimit").css("color","#ef6969")
                break;
            case 6:
                $("#charLimit").css("color","#b50e0e")
                break;
            default:
                $("#charLimit").css("color","#ffffff")
                break;
        }

        if (charLimit > 300) {
            $(".comTextArea").val($(".comTextArea").val().slice(0, 300))
            charLimit = $(".comTextArea").val().length
        }

        $("#charLimit").text(charLimit + "/300")
    })

    let commentColor = RGBtoHEX(randomColor())
    let boxColor = HEXtoRGB(commentColor, 40);
    let darkerBoxColor = HEXtoRGB(commentColor, 80);

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
    $("#pIcon").attr("src","https://gdbrowser.com/icon/"+player);
}