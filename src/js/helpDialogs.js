
var help = {
    "upload": {
        "title": jsStr["UPLOAD_T"],
        "content": jsStr["UPLOAD_D"]
    },

    "private": {
        "title": jsStr["PRIVATE_T"],
        "content": jsStr["PRIVATE_D"]
    },
    "shareCollab": {
        "title": jsStr["SHARECOLL_T"],
        "content": jsStr["SHARECOLL_D"]
    },
    "event": {
        "title": "Event - Lepší seznam",
        "content": `Když necháš tohle <b style="color: tomato">zaškrtlé</b>, tvůj určitě mnohem lepší seznam se zobrazí <b style="color: lime">vedlé mého 2021 seznamu.</b>`
    },
    "humansHelp": {
        "title": jsStr["HUM_T"],
        "content": jsStr["HUM_D"]
    },
    "lastRoleDelete": {
        "title": jsStr["RMROLE_T"],
        "content": jsStr["RMROLE_D"]
    },
    "newSkin": {
        "title": jsStr["NEWSKIN_T"],
        "content": jsStr["NEWSKIN_D"]
    },
    "license": {
        "title": jsStr["LICENSE"],
        "content": "Načítání..."
    },
    "pinnedLists": {
        "title": jsStr["PINNEDLIST_T"],
        "content": jsStr["PINNEDLIST_D"]
    },
    "officialLists": {
        "title": jsStr["OFFICIALLIST_T"],
        "content": jsStr["OFFICIALLIST_D"]
    },
    "diffGuesser": {
        "title": jsStr["DIFFGUESSER_T"],
        "content": jsStr["DIFFGUESSER_D"]
    },
    "oldList": {
        "title": jsStr["OLDLIST_T"],
        "content": jsStr["OLDLIST_D"]
    },
}

function closeHelp() {
    $(".popupHelp").slideUp();
    $(".helpBG").fadeOut();
}
async function openHelp(yes) {
    if (yes == "license") await $.get("https://raw.githubusercontent.com/GamingasCZ/lof-top10/master/LICENSE", d => {help[yes]["content"] = d})

    $("#helpTitle").html(help[yes]["title"][LANG])
    $("#helpContent").html(help[yes]["content"][LANG])

    $(".popupHelp").slideDown()
    $(".helpBG").fadeIn();
}

