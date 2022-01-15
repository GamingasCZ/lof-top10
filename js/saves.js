const MAX_ON_PAGE = 4
var page = 0

var sorting = false
var currView = "" 
$(function() {
    let paramGetter = new URLSearchParams(window.location.search)
    let params = Object.fromEntries(paramGetter.entries());

    // Sets save page localStorage when faving a level
    window.addEventListener("message", mess => {
        localStorage.setItem("favorites", mess.data[0])
        localStorage.setItem("favoriteIDs", mess.data[1])
    })

    $("#sortBut").on("click", function () {
        let getObject = JSON.parse(decodeURIComponent(localStorage.getItem("favorites")));
        if (sorting) {
            $("#sortBut").css("transform", "scaleY(1)");
            $("#sortBut").attr("title", jsStr["OLDEST"][LANG])
            generateList(getObject.reverse());
        }
        else {
            $("#sortBut").css("transform", "scaleY(-1)");
            $("#sortBut").attr("title", jsStr["NEWEST"][LANG])
            generateList(getObject);
        }
        sorting = !sorting
    })

    // Prepping for future :O
    if (params["type"] != null && params["type"] == "favorites") {
        currView = "favorites"
        generateFaves()
    }
    $("body").css("opacity", 1);
})

function generateFaves() {
    $(".titles").text("- Oblíbené levely -")

    // levelName, levelCreator, levelID, cardCol, listID, listName, listPos, timeAdded
    let favorites = JSON.parse(decodeURIComponent(localStorage.getItem("favorites")))
    if (!sorting) favorites.reverse()
    
    if (favorites == null || Object.keys(favorites).length == 0) {
        $(".listContainer").html("<p class='uploadText' style='text-align: center; color: #f9e582'>Zatím nemáš nic v oblíbených!</p>")
    }
    else generateList(favorites)
}

function removeFromList(obj, id, el, listName, pos) {
    if (obj == "fav") {
        // Remove level
        let currIDs = JSON.parse(localStorage.getItem("favoriteIDs"))
        let currData = JSON.parse(localStorage.getItem("favorites"))
        let removeID = currIDs.indexOf((id).toString()) // TODO: broken
        
        currData.splice(removeID, 1)
		currIDs.splice(removeID, 1)

		localStorage.setItem("favorites", JSON.stringify(currData))
		localStorage.setItem("favoriteIDs", JSON.stringify(currIDs))

        sender = "http://gamingas.wz.cz"
        if (window.location.protocol == "file:") sender = "*" // Allow all if running locally
    
        window.parent.postMessage(["removing", [currData, currIDs, pos-1, listName]], sender)
    
        generateFaves()
    }
}

function goToList(obj, pos) {
    let page = ""
    switch (obj) {
        case -2:
            page = "index.html?year=2019";
            break;
        case -3:
            page = "index.html?year=2021";
            break;
        default:
            page = "index.html?id="+obj.toString();
            break;
    }

	sender = "http://gamingas.wz.cz"
	if (window.location.protocol == "file:") sender = "*" // Allow all if running locally

	window.parent.postMessage(["loading", page, pos], sender)
}

function generateList(obj) {
    $(".listContainer").text("")

    $("#maxPage").text("/"+(parseInt(Object.keys(obj).length/MAX_ON_PAGE)+1))
    obj.slice(MAX_ON_PAGE*page, MAX_ON_PAGE*page+MAX_ON_PAGE).forEach(object => {
        let darkCol = HEXtoRGB(object[3], 40)
        $(".listContainer").append(`
        <div id="listPreview" href="#" style="background: ${object[3]}; display:flex; border-color: rgb(${darkCol.join(",")});">
            <div style="width: 100%">
                <p class="uploadText" style="margin: 0;">${object[0]} - ${object[1]}</p>
                <p class="uploadText" style="font-size: 1.8vw; margin: 0;"><u onclick="goToList(${object[4]}, ${object[6]})">${object[5]}</u> - ID levelu: ${object[2]}</p>
            </div>
            <div>
                <img class="button" onclick="removeFromList('fav', ${object[2]}, $(this), '${object[5]}', ${object[6]});" style="width: 4vw" src="images/delete.png">
            </div>
        </div>
        `)
    });
}
