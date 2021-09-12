
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

