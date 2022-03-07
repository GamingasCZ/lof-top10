var LANG = 0;
const LANG_AM = 2;
var strings = [[".lList", "index.html", "title", ["Seznam levelů", "Level List"]],
    [".colMembers", "index.html", 0, ["Členové", "Members"]],
    [".lComm", "index.html", "title", ["Komentáře", "Comments"]],
    ["h3:nth-child(1)", "index.html", 0, ["Komentář", "Comment"]],
    [".pIconInp", "index.html", "placeholder", ["Jméno", "Username"]],
    [".comFooterButton:nth-child(1)", "index.html", "title", ["Barva komentáře", "Comment Color"]],
    [".comFooterButton:nth-child(2)", "index.html", "title", ["Emotikony", "Emoji"]],
    [".sendBut", "index.html", "title", ["Odeslat komentář", "Send Comment"]],
    [".comTitles", "index.html", 0, ["- Komentáře -", "- Comments -"]],
    ["#pageStr", 0, 0, ["Strana: ", "Page: "]],
    [".commBut", 0, 0, ["Komunitní", "Community"]],
    [".savedBut", 0, 0, ["Uložené", "Saved"]],
    [".langText", 0, 0, ["Jazyk", "Language"]],
    ["#czech", 0, 0, ["Čeština", "Czech"]],
    ["#english", 0, 0, ["Angličtina", "English"]],
    ["#skinText", 0, 0, ["Vzhled", "Skin"]],
    [".anims", 0, 0, ["Animace", "Animations"]],
    [".noComm", "index.html", 0, ["- Žádné komentáře -", "- No Comments -"]],
    [".passInput", "index.html", "placeholder", ["Heslo", "Password"]],
    ["#jumpToText", "index.html", 0, ["Skočit na...", "Jump to..."]],
    ["#jumpToBut", "index.html", "title", ["Skočit na...", "Jump to..."]],
    ["#shareText", "index.html", 0, ["Sdílet", "Share"]],
    ["#shareBut", "index.html", "title", ["Sdílet", "Share"]],

    ["title", "upload.html", 0, ["Komunitní seznamy | GD Seznamy", "Community Lists | GD Lists"]],
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
    ["label[for='shareCollab']", "upload.html", 0, ["Sdílet collaby", "Share Collabs"]],
    [".titles", "upload.html", 0, ["- Komunitní seznamy -", "- Community Lists -"]],
    ["#sortStr", "upload.html", 0, ["Řazení: ", "Sorting: "]],
    ["#searchBar", "upload.html", "placeholder", ["Hledání", "Search"]],

    ["#sortStr", "packs.html", 0, ["Řazení: ", "Sorting: "]],
    ["#searchBar", "packs.html", "placeholder", ["Hledání", "Search"]],

    [".collabTTitle","upload.html",0,["- Nastavení collabu -","- Collab Settings -"]],
    [".verifierRole","upload.html","placeholder",["Role","Role"]],
    [".verifier","upload.html","placeholder",["Nahrál...","Uploaded by..."]],
    [".roleHead","upload.html",0,["Role","Roles"]],
    [".presetButtonContainer > button:nth-child(1)","upload.html",0,["Dekorace","Decoration"]],
    [".presetButtonContainer > button:nth-child(2)","upload.html",0,["Layout","Layout"]],
    [".presetButtonContainer > button:nth-child(3)","upload.html",0,["Tester","Tester"]],
    ["#rolepaste","upload.html","title",["Vložit ze schránky","Paste from clipboard"]],
    [".roleAddButton","upload.html","title",["Přidat roli","Add role"]],
    [".noRolAdded","upload.html",1,[
        `K přidání role vyber předvolbu, nebo klikni na<img style="width: 2.2%" id="plusSign"src="images/add.png">`,
        `To add a role, pick a preset, or click on<img style="width: 2.2%" id="plusSign"src="images/add.png">`]],
    ["#r_name","upload.html",0,["Jméno","Name"]],
    ["#r_hasPart","upload.html",0,["Má část?","Has part?"]],
    ["#r_color","upload.html",0,["Barva","Color"]],
    [".humHead","upload.html",0,["Členové","Members"]],
    [".cLink","upload.html","title",["Vlastní odkaz","Custom Link"]],
    ["#collabInp","upload.html","placeholder",["YouTube kanál","YouTube Channel"]],
    [".addSocial","upload.html","title",["Přidat","Add"]],
    [".rmSocial","upload.html","title",["Zrušit","Cancel"]],
    ["#humpaste","upload.html","title",["Vložit ze schránky","Paste from clipboard"]],
    [".addHumanButton","upload.html","title",["Přidat člověka","Add member"]],
    [".noRoles","upload.html",0,["K\ přidání členů přidej roli.","To add a member, add a role."]],
    [".addRoles","upload.html",1,[`K přidání člena klikni na<img style="width: 2.2%" id="plusSign" src="images/add.png">`,
    `To add a member, click on<img style="width: 2.2%" id="plusSign" src="images/add.png">`]],
    ["#h_name","upload.html",0,["Jméno","Username"]],
    ["#h_social","upload.html",0,["Sítě","Links"]],
    ["#h_role","upload.html",0,["Role","Role"]],
    ["#h_part","upload.html",0,["Část","Part"]],
    ["#h_color","upload.html",0,["Barva","Color"]],
    [".errTitle","upload.html",0,["Jejda!","Oh no!"]],

    ["title","packs.html",0,["Uložené levely | GD Seznamy", "Saved Levels | GD Lists"]]
]

var jsStr = {
    // images
    "TIT_IMG": ["./images/title.png","./images/titleEng.png"],
    "COMM_IMG": ["./images/community.png","./images/communityEng.png"],
    "YES_IMG": ["./images/yeees.png","./images/yeeesEng.png"],
    "NO_IMG": ["./images/ne.png","./images/no.png"],

    // editor
    "CZECH": ["Čeština", "Czech"],
    "EMPT_L": ["Snažiš se poslat <b style='color:cyan'>prázdný seznam!</b>", "You're trying to send an <b style='color:cyan'>empty list!</b>"],
    "LIST_L": ["Jméno tvého seznamu by mělo být delší :).",
        "The name of your list should be longer :)."],
    "LIST_TOOL": ["Jméno tvého seznamu je delší, než doba, kterou mi trvá zeditovat video :D.",
        "Your list name is longer than the time it takes me to make a video :D."],
    "CREA_L": ["Tvé jméno by mělo být delší :).", "Your name should be longer :)."],
    "CREA_TOOL": ["Lidi musí psat slohovky, aby tě oslovili :D?", "That's a very long name... :D"],
    "GG_NEVER": ["Nikdy nebudeš Gamingasem :).",
        "You will never be Gamingas :)."],
    "SUCC_UPL": ["Všechno je v pořádku!", "Everything is ok!"],
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
    "CLICKS": ["Kliknutí: ","Clicks: "],
    "SKIN1": ["Výchozí", "Default"],
    "SKIN2": ["Pluska", "Addition"],
    "SKIN3": ["Čáry", "Lines"],
    "SKIN4": ["Nevím", "k"],
    "SKIN5": ["Bloky", "Blocks"],
    "SKIN6": ["Freedom69", "Freedom69"],
    "SKIN7": ["Výchozí", "Default"],
    "SKIN8": ["Výchozí", "Default"],
    "GDLISTS": ["GD Seznamy","GD Lists"],
    "FAV_REM": ["Odstranit z oblíbených", "Remove from Favorites"],
    "FAV_ADD": ["Přidat do oblíbených", "Add to Favorites"],
    "COMMUNITY": ["Komunitní", "Community"],
    "SAVED": ["Uložené", "Saved"],
    "SHOW_PROFILE": ["Zobrazit profil", "Show profile"],
    "NONEXISTENT_L": ["Neexistující seznam", "Nonexistent list"],
    "DEBUG_L": ["Debug seznam", "Debug List"],
    "PREVIEW_L": ["Náhled seznamu", "List Preview"],
    "CLOSE": ["Zavřít", "Close"],

    // helpDialogs
    "LICENSE": ["Licence","License"],
    "NEWSKIN_T": ["Nový skin", "New Skin!"],
    "NEWSKIN_D": ["Odemknul jsi nový skin! Vyzkoušej ho v nastavení :).<br><br>Klikej dál!","You've unlocked a new skin! Apply it in the settings :).<br><br>Keep on clicking!"],
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
    "HUM_T": ["Členové v collabu","Collab members"],
    "HUM_D": [`<b style="color: #ffff00;">Jméno:</b> Sem patří jméno člověka, který měl část v collabu. Lupa najde jeho GD profil a udělá ho jeho profil klikatelný v dokončeném seznamu.<br><br>
    <b style="color: #ffff00;">Sítě:</b> Slouží k přidávání sociálních sítí, na kterých lze člena najít. Dvojitým klikem na náhled se dá rychle síť smazat.<br><br>
    <b style="color: #ffff00;">Role:</b> Pomoc není potřeba :D<br><br>
    <b style="color: #ffff00;">Část:</b> V procentech odkud pokud dělal člen na části.<br><br>
    <b style="color: #ffff00;">Barva:</b> Barva jména člena, která se objeví v hotovém seznamu.`,
            `<b style="color: #ffff00;">Name:</b> Here goes the GD username of the creator who was taken part in the collab. The search icon will find their profile and make it visitable in the finished list.<br><br>
            <b style="color: #ffff00;">Links:</b> Used for adding the creator's social media sites. Double-clicking a finished icon will quickly delete the link.<br><br>
            <b style="color: #ffff00;">Role:</b> No help needed :D<br><br>
            <b style="color: #ffff00;">Part:</b> Where the creator started and ended making his part, in percentage.<br><br>
            <b style="color: #ffff00;">Color:</b> Color of the creator's name in the finished list.`],
    "RMROLE_T": ["Smazání poslední role", "Removing last role"],
    "RMROLE_D": [`Smazáním poslední role smazeš i všechny členy. Pokračovat?<br><br>

    <button class="button uploadText eventButton" onclick="killEverything()">Ano</button>
    <button class="button uploadText eventButton" onclick="closeHelp()">Ne</button>
    `, `Deleting the last role will also delete all members. Continue?<br><br>
    <button class="button uploadText eventButton" onclick="killEverything()">Yes</button>
    <button class="button uploadText eventButton" onclick="closeHelp()">No</button>
    `],
    "SHARECOLL_T": ["Sdílení collabů", "Collab sharing"],
    "SHARECOLL_D": [`Pokud využiješ collab nástroje a zaškrtneš toto políčko, tak kdokoliv poté bude moct využít <b style="color: tomato;">tvá nastavení</b> collabu pro jeho seznam.`,
                    `If you've used collab tools and tick this check, anyone will be able to use your collab settings for their lists.`],

    // graphicEditor
    "UNNAMED": ["Bezejmenný", "Unnamed"],
    "HELP_TEXT": [`<p class="helpText">Kliknutím na <img width=5% id="plusSign" src="images/add.png"> přidáš level!</p>`,
        `<p class="helpText">Click the <img width=5% id="plusSign" src="images/add.png"> to add a level!</p>`],
    "L_MOVE_D": ["Přesunout level níž", "Move level up"],
    "L_MOVE_U": ["Přesunout level výš", "Move level down"],
    "L_LEVID": ["ID levelu", "Level ID"],
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
    "AGO": ["před ", ""],

    // Collab tools
    "GHOST": ["Duch Dashera", "Dasher Ghost"],
    "PART_TO": ["až","to"],
    "DECO": ["Dekorace", "Decoration"],
    "LAYOUT": ["Layout", "Layout"],
    "TESTER": ["Tester", "Tester"],
    "NO_ROLE": ["Žádná", "None"],
    "UNN_ROLE": ["Bezejmenná", "Unnamed"],
    "NAME": ["Jméno", "Name"],
    "DISABLED": ["Zapnuto", "Enabled"], // This is not a mistake :P
    "ENABLED": ["Vypnuto", "Disabled"],
    "CT_S_TIT_1": ["Nastavení collabu", "Collab Settings"],
    "CT_S_TIT_2": ["Nastavení megacollabu", "Megacollab Settings"],
    "CT_S_TIT_3": ["Nastavení gigacollabu", "Gigacollab Settings"],
    "CT_S_TIT_4": ["Cože", "What"],
    "CT_S_TIT_5": ["Správa planety", "Planet Management"],
    "FROM": ["Od", "Fr."],
    "TO": ["Do", "To"],
    "YT_CHAN": ["Youtube kanál", "YouTube Channel"],
    "TW_PROF": ["Twitter účet", "Twitter Account"],
    "TW_CHAN": ["Twitch kanál", "Twitch Channel"],
    "DC_SERV": ["Discord tag / server", "Discord tag / server"],
    "CUST_LINK": ["Vlastní odkaz", "Custom Link"],
    "SAV_CHANG": ["Uložit úpravy", "Save changes"],
    "DELETE": ["Smazat", "Delete"],
    "CONFIRM": ["Přidat", "Add"],
    "CANCEL": ["Zrušit", "Cancel"],

    // saves
    "FAV_LEVELS": ["- Oblíbené levely -","- Favorite Levels -"],
    "NOFAVED": ["Zatím nemáš nic v oblíbených!", "You haven't saved anything yet!"]
}

function slapArrayIntoObject(arr) {
    let obj = {}
    for (let i = 0; i < arr.length; i += 2) {
        obj[arr[i]] = arr[i+1]
    }
    return obj
}

function getCookie(val="") {
    let allCooks = document.cookie;
    if (allCooks == "") return null // No cookies set
    
    let arrayOfCooks = allCooks.split("; ");
    let finishedCooks = [];
    
    arrayOfCooks.forEach(x => {
        if (x.includes("=")) {
            finishedCooks.push(x.split("=")[0])
            finishedCooks.push(x.split("=")[1])
            };
    })
        
    finishedCooks = slapArrayIntoObject(finishedCooks)
    if (val != "") {
        let getSearched = Object.keys(finishedCooks).indexOf(val);
        if (getSearched != -1) { // Not found
            let searchObj = {};
            return Object.values(finishedCooks)[getSearched]
            }
        else return false;
    }
    else return finishedCoocks;
}

function makeCookie(val) { // Also works for changing cookies
    let expireDate = "Sun, 1 Jan 2040 12:00:00 UTC"
    document.cookie = `${val[0]}=${encodeURIComponent(val[1])}; expires=${expireDate}; SameSite=Lax`
}

$(function () {
    var currLang = getCookie("lang");
    if (currLang == null) {
        let getLang = navigator.language;
        if (["cs", "sk"].includes(getLang)) { currLang = 0; }
        else { currLang = 1; }
        
        makeCookie(["lang", currLang])
    }
    LANG = currLang;
    $($(".settingsDropdown").children()[currLang]).attr("selected", true)
    
    
    $(".settingsDropdown:not(.skins)").on("change", () => {
        let switchLang = $(".settingsDropdown").val() == jsStr["CZECH"][LANG] ? 0 : 1
        makeCookie(["lang", switchLang])
        window.location.reload();
    })
})

function changeLang() {
    LANG = parseInt(LANG) + 1
    if (LANG >= LANG_AM) {
        LANG = 0
    }
    makeCookie(["lang", switchLang])
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
        let isIndex = location.pathname == "/loftop10/" & i[1] == "index.html";

        // Apply only to current page
        if (location.pathname.match(i[1]) != null || i[1] == 0 || isIndex) {
            if (i[2] == 0) {
                // Replacing tag content (text)
                $(i[0]).text(i[3][LANG])
            }
            else if (i[2] == 1) {
                // Replacing tag content (html)
                $(i[0]).html(i[3][LANG])
            }
            else {
                // Replacing tag attribute
                $(i[0]).attr(i[2], i[3][LANG])
            }
        }

    })
}
