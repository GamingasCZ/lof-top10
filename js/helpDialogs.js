
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

        "event": {
            "title": "Event - Lepší seznam",
            "content": `Když necháš tohle <b style="color: tomato">zaškrtlé</b>, tvůj určitě mnohem lepší seznam se zobrazí <b style="color: lime">vedlé mého 2021 seznamu.</b>`
        },
        "roleName": {
            "title": jsStr["ROLE_NM_T"][LANG],
            "content": jsStr["ROLE_NM_D"][LANG]
        },
        "roleHasPer": {
            "title": jsStr["ROLE_HP_T"][LANG],
            "content": jsStr["ROLE_HP_D"][LANG]
        },
        "roleColor": {
            "title": jsStr["ROLE_CO_T"][LANG],
            "content": jsStr["ROLE_CO_D"][LANG]
        },
        "humansHelp": {
            "title": jsStr["HUM_T"][LANG],
            "content": jsStr["HUM_D"][LANG]
        }
    }
})

function closeHelp() {
    $(".popupHelp").slideUp();
    $(".helpBG").fadeOut();
}
function openHelp(page) {
    $("#helpTitle").html(help[page]["title"])
    $("#helpContent").html(help[page]["content"])

    $(".popupHelp").slideDown()
    $(".helpBG").fadeIn();
}

