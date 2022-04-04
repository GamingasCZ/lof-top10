
var help;
$(function () {
    help = {
        "upload": {
            "title": jsStr["UPLOAD_T"][LANG],
            "content": jsStr["UPLOAD_D"][LANG]
        },

        "private": {
            "title": jsStr["PRIVATE_T"][LANG],
            "content": jsStr["PRIVATE_D"][LANG]
        },
        "shareCollab": {
            "title": jsStr["SHARECOLL_T"][LANG],
            "content": jsStr["SHARECOLL_D"][LANG]
        },
        "event": {
            "title": "Event - Lepší seznam",
            "content": `Když necháš tohle <b style="color: tomato">zaškrtlé</b>, tvůj určitě mnohem lepší seznam se zobrazí <b style="color: lime">vedlé mého 2021 seznamu.</b>`
        },
        "humansHelp": {
            "title": jsStr["HUM_T"][LANG],
            "content": jsStr["HUM_D"][LANG]
        },
        "lastRoleDelete": {
            "title": jsStr["RMROLE_T"][LANG],
            "content": jsStr["RMROLE_D"][LANG]
        },
        "newSkin": {
            "title": jsStr["NEWSKIN_T"][LANG],
            "content": jsStr["NEWSKIN_D"][LANG]
        },
        "license": {
            "title": jsStr["LICENSE"][LANG],
            "content": "Načítání..."
        },
        "pinnedLists": {
            "title": jsStr["PINNEDLIST_T"][LANG],
            "content": jsStr["PINNEDLIST_D"][LANG]
        },
        "officialLists": {
            "title": jsStr["OFFICIALLIST_T"][LANG],
            "content": jsStr["OFFICIALLIST_D"][LANG]
        }
    }
})

function closeHelp() {
    $(".popupHelp").slideUp();
    $(".helpBG").fadeOut();
}
async function openHelp(page) {
    if (page == "license") await $.get("https://raw.githubusercontent.com/GamingasCZ/lof-top10/master/LICENSE", d => {help[page]["content"] = d})

    $("#helpTitle").html(help[page]["title"])
    $("#helpContent").html(help[page]["content"])

    $(".popupHelp").slideDown()
    $(".helpBG").fadeIn();
}

