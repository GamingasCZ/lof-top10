var LANG = 0;
const LANG_AM = 2;

var strings = [
    ["title", "index.html", 0, ["Top 10 Levelů od Fanoušků", "Top 10 Fan Levels"]],
    [".lList", "index.html", "title", ["Seznam levelů", "Level List"]],
    [".lComm", "index.html", "title", ["Komentáře", "Comments"]],
    ["h3:nth-child(1)", "index.html", 0, ["Komentář", "Comment"]],
    [".pIconInp", "index.html", "placeholder", ["Jméno", "Username"]],
    [".comFooterButton:nth-child(1)", "index.html", "title", ["Barva komentáře", "Comment Color"]],
    [".comFooterButton:nth-child(2)", "index.html", "title", ["Emotikony", "Emoji"]],
    [".sendBut", "index.html", "title", ["Odeslat komentář", "Send Comment"]],
    [".comTitles", "index.html", 0, ["- Komentáře -", "- Comments -"]],
    ["#pageStr", 0, 0, ["Strana: ", "Page: "]],
    [".noComm", "index.html", 0, ["- Žádné komentáře -", "- No Comments -"]],

    ["title", "upload.html", 0, ["Komunitní seznamy", "Community Lists"]],
    [".uploadTitle", "upload.html", 0, ["Nahrávání", "Upload"]],
    ["#listnm", "upload.html", "placeholder", ["Jméno seznamu", "List Name"]],
    ["#creatornm", "upload.html", "placeholder", ["Tvůrce", "List Creator"]],
    ["#imageArrow", "upload.html", "title", ["Ukázat náhled obrázku", "Display image preview"]],
    [".titImgInp", "upload.html", "placeholder", ["Obrázek seznamu", "Header Image"]],
    ["label[for='bgcolor']", "upload.html", 0, ["Barva pozadí:", "Background Color:"]],
    [".headerTitle", "upload.html", 0, ["Levely", "Levels"]],
    [".addCardButton", "upload.html", "title", ["Přidat level do seznamu", "Add level to list"]],
    [".previewButton", "upload.html", "title", ["Náhled seznamu", "Preview list"]],
    [".setTitle", "upload.html", 0, ["- Nastavení -", "- Settings -"]],
    ["#submitbutton", "upload.html", "value", ["Nahrát", "Upload"]],
    ["label[for='private']", "upload.html", 0, ["Soukromý seznam", "Private List"]],
    [".titles", "upload.html", 0, ["- Komunitní seznamy -", "- Community Lists -"]],
    ["#sortStr", "upload.html", 0, ["Řazení: ", "Sorting: "]],
    ["#searchBar", "upload.html", "placeholder", ["Hledání", "Search"]]

]

var jsStr = {
    // images
    "TIT_IMG": ["./images/title.png","./images/titleEng.png"],
    "COMM_IMG": ["./images/community.png","./images/communityEng.png"],
    "YES_IMG": ["./images/yeees.png","./images/yeeesEng.png"],
    "NO_IMG": ["./images/ne.png","./images/no.png"],

    // editor
    "LIST_L": ["Jméno tvého seznamu by mělo být delší :).",
        "The name of your list should be longer :)."],
    "LIST_TOOL": ["Jméno tvého seznamu je delší, než doba, kterou mi trvá zeditovat video :D.",
        "Your list name is longer than the time it takes me to make a video :D."],
    "CREA_L": ["Tvé jméno by mělo být delší :).", "Your name should be longer :)."],
    "CREA_TOOL": ["Lidi musí psat slohovky, aby tě oslovili :D?", "That's a very long name... :D"],
    "GG_NEVER": ["Nikdy nebudeš Gamingasem :).",
        "You will never be Gamingas :)."],
    "SUCC_UPL": ["Všechno je v pořádku!", "Everything is ok!"],
    "": ["", ""],
    "": ["", ""],
    "": ["", ""],
    "NO_JSON": ["Nic jsi nezadal... :D", "You have not entered anything... :D"],
    "CREATOR_BY": ["Od: ", "By: "],
    "NEWEST": ["Nejnovější", "Newest"],
    "OLDEST": ["Nejstarší", "Oldest"],
    "SH_IMPREV": ["Ukázat náhled obrázku", "Show image preview"],
    "HI_IMPREV": ["Skrýt náhled obrázku", "Hide image preview"],
    "IM_NOTFOUND": ["Obrázek nenalezen :/", "Image not found :/"],
    "LIST_UPDATED": ["Seznam byl aktualizovan!", "The list has been updated!"],
    "KEEP_PWD": ["Schovej si heslo, protože pomocí neho mužeš upravit/smazat seznam!",
        "Keep the password, because you can edit/delete the list with it!"],
    "LIST_SUCC_UPL": ["Seznam byl nahran!", "The list has been uploaded!"],
    "SHARE": ["Sdílet", "Share"],
    "CONF_DEL": ["Opravdu chceš smazat svůj seznam?", "Are you sure you want to delete the list?"],
    "NO_RES": ["- Žádné výsledky -", "- No results -"],

    // generator
    "LEV_NOEXIST": ["Level neexistuje!", "Level doesn't exist!"],
    "VID_NOEXIST": ["Video neexistuje!", "Video hasn't been set!"],
    "DISP_EP": ["Zobrazit epizodu", "Play on YouTube"],
    "GDB_DISP": ["Zobrazit v GDBrowseru", "Display in GD Browser"],
    "COPY_ID": ["Zkopírovat ID levelu", "Copy level ID"],
    "ID_COPIED": ["ID zkopírováno", "ID copied!"],
    "LLOAD_FAIL": ["<p>Nepodarilo se nacíst seznam!</p>", "<p>Loading the list failed</p>"],
    "PREVIEW": ["<p>(Náhled)</p>", "<p>(Preview)</p>"],
    "L_NOEXIST": ["<p>Seznam neexistuje :/!</p>", "<p>This list doesn't exist :/!</p>"],
    "L_INVID": ["<p>Jakej génius hodil slovo namísto IDcka :D</p>", "<p>Who put a word there instead of an ID :D</p>"],
    "L_NONUM": ["<p>Ježišmarja, dyť to ani není číslo :D</p>", "<p>Yo, that's not even a number :D!</p>"],
    "L_NOYEAR": ["<p>Tenhle rok neexistuje :D</p>", "<p>This year doesn't exist :D</p>"],
    "CHECKING": ["Kontrolování...", "Checking..."],
    "INC_PWD": ["Heslo je nesprávné!", "Incorrect password!"],

    // helpDialogs
    "UPLOAD_T": ["Obrázky seznamu", "List Header Images"],
    "UPLOAD_D": [`Jestli chceš svůj seznam pořádně vyzdobit, můžeš k němu přidat obrázek, který se u něho zobrazí!<br />
        <img style="width: 20vw; margin-left: 35%;" src="./images/tutorial.png"><br />
        <b style="color: tomato;">Nemusíš přidávat žádný obrázek!</b>`
        , `If you really want to spice up your list, you can add an image, that'll display as the header!<br />
        <img style="width: 20vw; margin-left: 35%;" src="./images/tutorial.png"><br />
        <b style="color: tomato;">You don't have to add an image!</b>`],
    "PRIVATE_T": ["Soukromé seznamy", "Private Lists"],
    "PRIVATE_D": [`Soukromé seznamy se <b style="color: lime;">nezobrazí veřejně</b> a mají <b style="color: tomato">speciální odkaz</b> k přístupu.<br><br>
	      <b style="color:yellow">Kdykoliv můžeš upravit seznam a udělat ho veřejný.</b>`
        , `Private lists <b style="color: lime;">won't show up publicly</b> and you access them with a <b style="color: tomato">special link.</b><br><br>
          <b style="color:yellow">You can edit the list anytime and make it public.</b>`],

    // graphicEditor
    "UNNAMED": ["Bezejmenný", "Unnamed"],
    "HELP_TEXT": [`<p class="helpText">Kliknutím na <img width=5% id="plusSign" src="images/add.png"> přidáš level!</p>`,
        `<p class="helpText">Click the <img width=5% id="plusSign" src="images/add.png"> to add a level!</p>`],
    "L_MOVE_D": ["Přesunout level níž", "Move level up"],
    "L_MOVE_U": ["Přesunout level výš", "Move level down"],
    "L_NAME": ["Jméno levelu", "Level Name"],
    "L_BUILDER": ["Tvůrce", "Creator"],
    "L_VIDEO": ["Video", "Video"],
    "DEL_CARD": ["Smazat kartu", "Delete card"],
    "CARD_COL": ["Barva karty", "Card color"],
    "EDITING": ["Upravování", "Editing"],
    "L_UPDATE": ["Aktualizovat", "Update"],
    "LEVELS": ["Levely", "Levels"],
    "MOBILE_ED": ["Pro použití editoru si otoč mobil ;).", "Turn your phone into landscape to use the editor ;)."],
    "DELETE": ["Smazat", "Delete"],
    "FUP1": ["Přidej prosím level :).", "Please add a level :)."],
    "FUP2": ["Nejdřív přidej level!", "Add a level first!"],
    "FUP3": ["Tím klikáním nic neuděláš :D.", "Your clicking won't do anything :D."],
    "FUP4": ["Oho, snažíš se mě vyzvat na zápas?", "Heh, is this a challenge?"],
    "FUP5": ["Mám času dost! Klikej dál.", "I have a ton of time! Keep clicking."],
    "FUP6": ["Svůj náhled ale nedostaneš.", "You'll never get your preview though."],
    "FUP7": ["Je zábava tě sledovat :D.", "It's fun watching you :D."],
    "FUP8": ["Jdu si udělat chutný nápoj!", "I'll go make something to drink!"],
    "FUP9": ["Zelený, nebo černý čaj?", "Black or green tea?"],
    "FUP10": ["Asi se nemusím ptát...", "You're not really listening..."],
    "FUP11": ["Jen klikej dál!", "Keep clicking!"],
    "FUP12": ["Energií tvého prstu ohřívám konvici :D.", "I'm using your finger's energy to heat up my kettle :D."],
    "FUP13": ["Konvice již vaří.", "The kettle is on fire."],
    "FUP14": ["A mám čaj připravený.", "And my tea is done."],
    "FUP15": ["Klikáš vážně dobře!", "You're a real good clicker!"],
    "FUP16": ["Je poznat, že jsi Geodeš hráč.", "You're the Dash in Geometry Dash."],
    "FUP17": ["Oh né! Co jsem to udělal!", "Oh no! What have I done!"],
    "FUP18": ["Mohu za to všechno já!", "It's all my fault!"],
    "FUP19": ["Zasekl jsem tě do nekonečné smyčky klikání.", "You're stuck in infinite click loop."],
    "FUP20": ["Jak tě ale mám zastavit?", "How do I stop you?"],
    "FUP21": ["Mohl bych být hnusák a nechat tě tu... :<'", "I could just leave you here... :<'"],
    "FUP22": ["Čaj už mám skoro dopitý.", "I'm running out of tea."],
    "FUP23": ["Vařící čaj...", "Boiling tea..."],
    "FUP24": ["To je jedno!", "Oh well..."],
    "FUP25": ["Hohó! Pokračuj, protože odcházím.", "You can continue, because I'm leaving!"],
    "FUP26": ["Ano! Toto je můj poslední dialog!", "Yes! This is my last dialog!"],
    "FUP27": ["Úplně poslední!", "Totally last!"],
    "FUP28": ["Spočítejme to spolu!", "Let's count it down!"],
    "FUP29": ["Tři!", "Three."],
    "FUP30": ["Dva.", "Two."],
    "FUP31": ["Jedna.", "One."],
    "FUP32": ["Zahraj si SuperGamingasBros. :D.", "Please play SuperGamingasBros. :D"],
    "FUP33": ["Konec!", "End!"],

    // comments
    "PHOLD1": ["Tvůj seznam je...",
        "Your list is..."],
    "PHOLD2": ["Líbí se mi tvůj seznam, protože...",
        "I like your list, because..."],
    "PHOLD3": ["Máš jiný názor než já. Už nikdy nebudeš klidně spát, protože...",
        "Your opinion differs from mine. Prepare to get cancelled, because..."],
    "PHOLD4": ["Tvůj seznam stojí za prd, protože...",
        "Your list is bad, because..."],
    "PHOLD5": ["Mrkni se i na můj seznam...",
        "Please check out my list..."],
    "GDACC_NOEX": ["Geodeš účet neexistuje :/", "GD account doesn't exist :/"],
    "GDB_FAIL": ["Nepodařilo se připojit k GDBrowseru :/", "Connecting to GDBrowser failed :/"],
    "COM_L": ["Komentář by měl mít víc než 10 znaků!", "Comment must be more than 10 char. long!"],
    "COMU_L": ["Tvé jméno by mělo mít víc než 4 znaky!", "Username must be more than 4 char. long"],
    "C_SENT": ["Odesláno!", "Sent!"],
    "C_ERR": ["Nepodařilo se odeslat komentář! Kód: ", "Sending comment failed! Code: "],
    "YEAR": ["rokem", "year ago"],
    "YEARS": ["lety", "years ago"],
    "MONTH": ["měsícem", "month ago"],
    "MONTHS": ["měsíci", "months ago"],
    "DAY": ["dnem", "day ago"],
    "DAYS": ["dny", "days ago"],
    "HOUR": ["hodinou", "hour ago"],
    "HOURS": ["hodinami", "hours ago"],
    "MINUTE": ["minutou", "minute ago"],
    "MINUTES": ["minutami", "minutes ago"],
    "SECONDS": ["sekundami", "seconds ago"],
    "FEWSECS": ["před pár sekundami", "a few seconds ago"],
    "AGO": ["před ", ""]
}

$(function () {
    var currLang = localStorage.getItem("lang");
    if (currLang == null) {
        $(".notify").show();
        let getLang = navigator.language;
        if (["cs", "sk"].includes(getLang)) { currLang = 0; }
        else { currLang = 1; }
        localStorage.setItem("lang", currLang);
    }
    LANG = currLang;
})

function changeLang() {
    LANG = parseInt(LANG) + 1
    if (LANG >= LANG_AM) {
        LANG = 0
    }
    localStorage.setItem("lang", LANG);
    window.location.reload()
}

function translate() {
    /* Strings:
0 - Selector
1 - Page (0 - both pages)
2 - Attribute (0 - Tag content)
3 - Strings array

    */

    strings.forEach(i => {
        // Replace depending on the directory
        let isIndex = location.pathname == "/lofttop10/" & i[1] == "index.html";

        // Apply only to current page
        if (location.pathname.match(i[1]) != null || i[1] == 0 || isIndex) {
            if (i[2] == 0) {
                // Replacing tag content (text)
                $(i[0]).text(i[3][LANG])
            }
            else {
                // Replacing tag attribute
                $(i[0]).attr(i[2], i[3][LANG])
            }
        }

    })
}