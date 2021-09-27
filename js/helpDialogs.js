
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
            "title": "Jméno role",
            "content": `<b style="color: #ffff00;">Role je věc, kterou člověk dělal v collabu</b>.<br><br>Do pole jména zadej jméno role.<br><br>Např.: Layout, Dekorace, Hudba, Optimalizace, Testování`
        },
        "roleHasPer": {
            "title": "Má část v collabu?",
            "content": `V dokončeném seznamu se vizuálně ukáží části na kterých lidé pracovali. Pokud tohle pro roli nedává smysl, nezašktrávej políčko.`
        },
        "roleColor": {
            "title": "Ba"
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

