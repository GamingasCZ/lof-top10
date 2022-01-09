const MAX_ON_PAGE = 4
var page = 0

$(function() {
    let paramGetter = new URLSearchParams(window.location.search)
    let params = Object.fromEntries(paramGetter.entries());

    // Prepping for future :O
    if (params["type"] != null && params["type"] == "favorites") {
        $(".titles").text("- Oblíbené levely -")

        let favorites = JSON.parse(document.cookie)
        if (favorites == null) {
            $(".listContainer").html("<p class='uploadText'>Zatím nemáš nic v oblíbených!</p>")
        }
        else generateList(favorites)
    }
})

function generateList(obj) {
    $("#maxPage").text("/"+(parseInt(Object.keys(obj).length/MAX_ON_PAGE)+1))
    obj.slice(MAX_ON_PAGE*page, MAX_ON_PAGE*page+MAX_ON_PAGE).forEach(object => {
        let darkCol = HEXtoRGB(object[3], 40)
        $(".listContainer").append(`
        <div id="listPreview" style="background: ${object[3]}; border-color: rgb(${darkCol.join(",")});" class="button">
            <p class="uploadText">${object[0]} - ${object[1]} (${object[2]})</p>
        </div>
        `)
    });
}