

function checkJson(data) {
    $(".errorBox").css("padding", "1% 0.5%");
    try {
        JSON.parse(data);
        $(".errorBox").text("Všechno je v pořádku!");
        $(".errorBox").css("background-color", "rgba(73, 255, 103, 0.8)");
    } catch (error) {
        $(".errorBox").css("background-color", "rgba(255, 73, 73, 0.8)");

        if (data == "") {
            $(".errorBox").text("Nic jsi nezadal... :D");
        }
        else {
            $(".errorBox").text(error);
        }
    }
}

$(function () {
    if (location.search != "") {
        var password = location.search.slice(1).split("=")[1];

        if (isNaN(parseInt(password))) {
            var pstr = `Tvé heslo je ale hypergay. <b style="color: tomato;">Nehraj si se stránkou >:(</b>.`;
        }
        else {
            var pstr = `Uschovej si heslo, pokud ho budes chtit zmenit: <b style="color: lime;">${password}</b>`;
        }

        $(".uploaderDialog").html(`
<img src=./images/check.png align="center">
<p class="uploadText">Seznam byl nahran! ${pstr}</p>
        `);
    }

    var ok = $.get("./php/getLists.php", function (data) {
        if (data.match(/\|/g).length > 1) {
            let listsArray = data.split("|").slice(0, -1);
            for (i = 0; listsArray.length; i++) {
                let listData = (listsArray[i]).split(";");
                $(".customLists").append(`
                <div id="listPreview" class="button">
                    <a href="http://www.gamingas.wz.cz/index.html?id=${listData[4]}">
                    <div class="uploadText">${listData[1]}</div>
                    <div class="uploadText">Od: ${listData[0]}</div>
                    </a>
                </div>
                        `)
            };
        };
        if (data.match(/\|/g).length == 1) {
            let listData = (data).split(";");
            $(".customLists").append(`
                <div id="listPreview" class="button">
                    <a href="http://www.gamingas.wz.cz/lofttop10/index.html?id=${listData[4]}">
                    <div class="uploadText">${listData[1]}</div>
                    <div class="uploadText">Od: ${listData[0]}</div>
                    </a>
                </div>
                    `)
        }
    });
    $(".smallUploaderDialog").hide();
})

function hideUploader() {
    $(".uploaderDialog").hide();
    $(".smallUploaderDialog").show();
}
function showUploader() {
    $(".uploaderDialog").show();
    $(".smallUploaderDialog").hide();
}
