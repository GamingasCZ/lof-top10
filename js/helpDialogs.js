var help = {
    "upload": {
        "title": "Obrázky seznamu",
        "content": `Jestli chceš svůj seznam pořádně vyzdobit, můžeš k němu přidat obrázek, který se u něho zobrazí!<br />
        <img style="width: 20vw; margin-left: 35%;" src="./images/tutorial.png"><br />
        <b style="color: tomato;">Nemusíš přidávat žádný obrázek!</b>`
    },
    "private": {
        "title": "Soukromé seznamy",
	"content": `Soukromé seznamy se <b style="color: lime;">nezobrazí veřejně</b> a mají <b style="color: tomato">speciální odkaz</b> k přístupu.<br><br>
	    <b style="color:yellow">Kdykoliv můžeš upravit seznam a udělat ho veřejný.</b>`
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
