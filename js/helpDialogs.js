var help = {
    "upload": {
        "title": "Obrázky seznamu",
        "content": `Jestli chceš svůj seznam pořádně vyzdobit, můžeš k němu přidat obrázek, který se u něho zobrazí!<br />
        <img style="width: 20vw; margin-left: 35%;" src="./images/tutorial.png"><br />
        <b style="color: tomato;">Nemusíš přidávat žádný obrázek!</b>`
    },
    "hidden": {
        "title": "Skryté seznamy",
        "content": `Skryté seznamy se <b style="color: lime">nezobrazí veřejně</b> a nejde je vyhledat.<br /><br />
        Kdokoliv je ale může zobrazit pomocí odkazu nebo ID.`
    }
}

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