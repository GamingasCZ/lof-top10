var LANG = 0;
const LANG_AM = 2;

var jsStr = {
    // images
    "TIT_IMG": ["./images/title.webp","./images/titleEng.webp"],
    "COMM_IMG": ["./images/community.webp","./images/communityEng.webp"],
    "YES_IMG": ["./images/yeees.webp","./images/yeeesEng.webp"],
    "NO_IMG": ["./images/ne.webp","./images/no.webp"],

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
    "NO_NAME_C": ["Level na %d místě nemá <b style='color:lime'>jméno!</b>", "Level at position %d doesn't have a <b style='color:lime'>name!</b>"],
    "NO_CREA_C": ["Level na %d místě nemá <b style='color:lime'>tvůrce!</b>", "Level at position %d doesn't have a <b style='color:lime'>creator!</b>"],
    "SUCC_UPL": ["Všechno je v pořádku!", "Everything is ok!"],
    "NO_JSON": ["Nic jsi nezadal... :D", "You have not entered anything... :D"],
    "CREATOR_BY": ["Od: ", "By: "],
    "NEWEST": ["Nejnovější", "Newest"],
    "OLDEST": ["Nejstarší", "Oldest"],
    "SH_IMPREV": ["Ukázat náhled obrázku", "Show image preview"],
    "HI_IMPREV": ["Skrýt náhled obrázku", "Hide image preview"],
    "IM_NOTFOUND": ["Obrázek nenalezen :/", "Image not found :/"],
    "LIST_UPDATED": ["Seznam byl aktualizovan!", "The list has been updated!"],
    "KEEP_PWD": ["<cb>Schovej si heslo</cb>, protože pomocí neho mužeš upravit/smazat seznam!",
        "<cb>Keep the password</cb>, because you can edit/delete the list with it!"],
    "LIST_SUCC_UPL": ["Seznam byl nahrán!", "The list has been uploaded!"],
    "LIST_FAIL_UPL": ["Seznam se nepodařilo nahrát! Kód: ", "List upload failed! Code: "],
    "SHARE": ["Sdílet", "Share"],
    "CONF_DEL": ["Opravdu chceš smazat svůj seznam?", "Are you sure you want to delete the list?"],
    "NO_RES": ["- Žádné výsledky -", "- No results -"],
    "TOOBIG1": ["Tvůj seznam je moc velký!", "Your list is too large"],
    "TOOBIG2": ["nad limitem!", "over the limit!"],
    "TOOBIG3": ["Smaž nějaké levely/collaby z levelů!", "Remove some levels/collabs from levels"],
    "YES": ["Ano", "Yes"],
    "NO": ["Ne", "No"],
    "LIST_UPDATED": ["Seznam aktualizován!", "List updated!"],
    "LIST_UNCHANGED": ["Nezměnil jsi nic v seznamu!", "Your list is unchanged!"],
    "LIST_UPFAIL": ["Seznam se nepodařilo aktualizovat! Zkus to znova později.", "Failed to update the list! Try again later."],
    "DBLCLKTIP": ["Klikni dvakrát k přeskočení kontroly","Double-click to skip check"],

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
    "PREVIEW_L": ["Náhled seznamu", "List Preview"],
    "CLOSE": ["Zavřít", "Close"],
    "CHECKOUT": ["Mrkni se na můj Geodeš seznam", "Check out my GD list"],
    "PIN_LIST": ["Připnout", "Pin"],
    "UNPIN_LIST": ["Odepnout", "Unpin"],
    "NO_PREV_DATA": ["Není z čeho udělat náhled!", "There's no data to make a preview from!"],
    "NOPINNED": ["- Zatím jsi nepřipnul žádné seznamy! -", "- You haven't pinned any lists yet! -"],
    "NOVIEWED": ["- Zatím jsi nenavštívil žádné seznamy! -", "- You haven't looked at any lists yet! -"],
    "SKIP": ["Přeskočit", "Skip"],
    "LEVDIFF_Q": ["Jakou má level obtížnost?", "What's the level's difficulty?"],
    "LEVRATE_Q": ["Jaký má level rating?", "What's the level's rating?"],
    "BACK": ["Zpět", "Back"],
    "EMPLIST": ["Seznam je prázdný, přidej do něho level!", "The list is empty, add levels into it!"],
    "DEADLIST": ["Tento seznam neexistuje!", "This list doesn't exist!"],
    "BY": ["od", "by"],
    "SCORBET": ["Dokážeš to líp?", "Can you score better?"],
    "LIST_FIN": ["Dokončil jsi seznam!", "You finished the list!"],
    "YOU_GOT": ["Získal jsi", "You got"],
    "OUTTA": ["z", "out of"],
    "POINTS": ["bodů", "points"],
    "PLAY_AGAIN": ["Hrát znova", "Play Again"],
    "TWIT_SHARE": ["Sdílet na Twitteru", "Share on Twitter"],

    // helpDialogs
    "LICENSE": ["Licence","License"],
    "NEWSKIN_T": ["Nový skin", "New Skin!"],
    "NEWSKIN_D": ["Odemknul jsi nový skin! Vyzkoušej ho v nastavení :).<br><br>Klikej dál!","You've unlocked a new skin! Apply it in the settings :).<br><br>Keep on clicking!"],
    "UPLOAD_T": ["Obrázky seznamu", "List Header Images"],
    "UPLOAD_D": [`Jestli chceš svůj seznam pořádně vyzdobit, můžeš k němu přidat obrázek, který se u něho zobrazí!<br />
        <img style="width: 20vw; margin-left: 35%;" src="./images/tutorial.webp"><br />
        <cr>Nemusíš přidávat žádný obrázek!</cr>`
        , `If you really want to spice up your list, you can add an image, that'll display as the header!<br />
        <img style="width: 20vw; margin-left: 35%;" src="./images/tutorial.webp"><br />
        <cr>You don't have to add an image!</cr>`],
    "PRIVATE_T": ["Soukromé seznamy", "Private Lists"],
    "PRIVATE_D": [`Soukromé seznamy se <cg>nezobrazí veřejně</cg>, mají <cr>speciální odkaz</cr> k přístupu a <cb>nejde u nich psát komentáře</cb>.<br><br>
	      <cy>Kdykoliv můžeš upravit seznam a udělat ho veřejný.<cy>`
        , `Private lists <cg>won't show up publicly</cg>, you access them with a <cr>special link</cr> and <cb>they cannot be commented on</cb>.<br><br>
          <cy>You can edit the list anytime and make it public.<cy>`],
    "HUM_T": ["Členové v collabu","Collab members"],
    "HUM_D": [`<cy">Jméno:</cy> Sem patří jméno člověka, který měl část v collabu. Lupa najde jeho GD profil a udělá ho jeho profil klikatelný v dokončeném seznamu.<br><br>
    <cy">Sítě:</cy> Slouží k přidávání sociálních sítí, na kterých lze člena najít. Dvojitým klikem na náhled se dá rychle síť smazat.<br><br>
    <cy">Role:</cy> Pomoc není potřeba :D<br><br>
    <cy">Část:</cy> V procentech odkud pokud dělal člen na části.<br><br>
    <cy">Barva:</cy> Barva jména člena, která se objeví v hotovém seznamu.`,
            `<cy">Name:</cy> Here goes the GD username of the creator who was taken part in the collab. The search icon will find their profile and make it visitable in the finished list.<br><br>
            <cy">Links:</cy> Used for adding the creator's social media sites. Double-clicking a finished icon will quickly delete the link.<br><br>
            <cy">Role:</cy> No help needed :D<br><br>
            <cy">Part:</cy> Where the creator started and ended making his part, in percentage.<br><br>
            <cy">Color:</cy> Color of the creator's name in the finished list.`],
    "RMROLE_T": ["Smazání poslední role", "Removing last role"],
    "RMROLE_D": [`Smazáním poslední role smazeš i všechny členy. Pokračovat?<br><br>

    <button class="button uploadText eventButton" onclick="killEverything()">Ano</button>
    <button class="button uploadText eventButton" onclick="closeHelp()">Ne</button>
    `, `Deleting the last role will also delete all members. Continue?<br><br>
    <button class="button uploadText eventButton" onclick="killEverything()">Yes</button>
    <button class="button uploadText eventButton" onclick="closeHelp()">No</button>
    `],
    "SHARECOLL_T": ["Sdílení collabů", "Collab sharing"],
    "SHARECOLL_D": [`Pokud využiješ collab nástroje a zaškrtneš toto políčko, tak kdokoliv poté bude moct využít <cr>tvá nastavení</cr> collabu pro jeho seznam.`,
                    `If you've used collab tools and tick this check, anyone will be able to use your collab settings for their lists.`],
    "PINNEDLIST_T": ["Připnuté seznamy", "Pinned Lists"],
    "PINNEDLIST_D": [`Pokud se k nějakému seznamu často vracíš, můžeš si ho připnout!<br>Připnuté seznamy se zobrazí na domovské stránce k rychlému přístupu. Můžeš jich mít <cy>maximálně 5</cy>!<br><br>
                      Seznam připneš <cb>připínacím tlačítkem</cb> na stránce se <cr>seznamem</cr>.`,
                     `You can pin list you frequently return to!<br>Pinned lists show up on the home page for quick access. You can have <cy>up to 5</cy> of them!<br><br>
                      Pin a list with the <cb>pin button</cb> on the <cr>list page</cr>.
                     `],
    "OFFICIALLIST_T": ["Oficiální seznamy", "Official Lists"],
    "OFFICIALLIST_D": [`Toto jsou seznamy s <cr>nejlepšími levely</cr> z Levelů od Fanoušků!`, `These lists contain the <cr>best levels</cr> from my level request series!`],
    "DIFFGUESSER_T": ["Hádání obtížností", "Difficulty guesser"],
    "DIFFGUESSER_D": [`Když je hádání zapnuté a někdo přejde na tvůj seznam, uvidí jen <cb>první level</cb>. Levely se <cg>postupně odemykají</cg> dalším hádáním.`,
                      `When guessing is enabled and someone visits your list, they'll only see the <cb>first level</cb>. The rest of levels get unlocked <cg>as you guess them</cg>.`],


    // graphicEditor
    "UNNAMED": ["Bezejmenný", "Unnamed"],
    "HELP_TEXT": [`<p class="helpText">Kliknutím na <img width=5% id="plusSign" src="images/add.webp"> přidáš level!</p>`,
        `<p class="helpText">Click the <img width=5% id="plusSign" src="images/add.webp"> to add a level!</p>`],
    "L_MOVE_D": ["Přesunout level níž", "Move level up"],
    "L_MOVE_U": ["Přesunout level výš", "Move level down"],
    "L_LEVID": ["ID levelu", "Level ID"],
    "L_NAME": ["Jméno levelu", "Level Name"],
    "L_BUILDER": ["Tvůrce", "Creator"],
    "L_VIDEO": ["Video", "Video"],
    "DEL_CARD": ["Smazat kartu", "Delete card"],
    "CARD_COL": ["Barva karty", "Card color"],
    "TAGSTIT": ["Štítky", "Tags"],
    "EDITING": ["Upravování", "Editing"],
    "L_UPDATE": ["Aktualizovat", "Update"],
    "LEVELS": ["Levely", "Levels"],
    "MOBILE_ED": ["Pro použití editoru si otoč mobil ;).", "Turn your phone into landscape to use the editor ;)."],
    "DELETE": ["Smazat", "Delete"],
    "MAX_INLIST": ["Víc levelů už se do seznamu nevejde!", "More levels won't fit in the list!"],
    "SEARCH_NOLVL": ["Neuložil jsi level s tímto jménem!", "No levels found!"],
    "NOSAVEYET": ["Nemáš žádné uložené levely!", "You don't have any levels saved!"],
    "CARD_COL": ["Barva karty", "Card color"],
    "LEV_DIFF": ["Obtížnost levelu", "Level difficulty"],
    "NORATE": ["Bez ratu", "Unrated"],
    "CHECKING": ["Kontrolování...", "Checking..."],
    "TYPEPASS": ["Zadej heslo seznamu", "Enter the list's password"],
    "TAGS": [["Pomalý","Rychlý","Hodně objektů","2P","Hacknutý","Layout","Dekorace","1.9","Šílený","Unratelý","Nemožný","Shitpost","Minihra","List Demon","Jam","Challenge","Ztracený","","","",""],
             ["Slow", "Fast", "High Object Count","2P","Hacked","Layout","Decorated","1.9","Mindboggling","Unrated","Impossible","Shitpost","Minigame","List Demon","Jam","Challenge","Lost"]],
    "UPLOAD": ["Nahrávání", "Upload"],

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
    "LOCAL_F": ["Lokálně nejde posílat komentáře!", "Cannot send comments locally!"],
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
    "REDIRECT": ["Chystáš se přejít na...","You're about to be redirected to..."],
    "TRUST": ["Navštěvej jen weby, kterým věříš!","Only visit sites you trust!"],
    "CONTINUE": ["Pokračovat","Continue"],

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
    "FAV_LEVELS": ["Oblíbené levely","Favorite Levels"],
    "NOFAVED": ["Zatím nemáš nic v oblíbených!", "You haven't saved anything yet!"]
}

var parts = {
    "navbar": [
        ["Editor", "Editor"],
        ["Seznamy", "Lists"],
        ["Uložené", "Saved"],
        ["Editor", "Editor"],
        ["Seznamy", "Lists"],
        ["Uložené", "Saved"],
        ["Jazyk", "Language"],
        ["Čeština", "Czech"],
        ["Angličtina", "English"],
        ["Animace", "Animations"]
    ],
    "homepage": [
        ["Hledat seznamy...", "Search for lists..."],
        ["Vytvořit seznam","Create a list"],
        ["Zkusit štestí","Try luck"],
        ["Nejnovější", "Newest"],
        ["Více", "More"],
        ["- Načítání -","- Loading -"],
        ["Připnuté", "Pinned"],
        ["- Zatím jsi nepřipnul žádné seznamy! -", "- You haven't pinned any lists yet! -"],
        ["Navštívené", "Visited"],
        ["Promazat", "Clear"],
        ["- Zatím jsi nenavštívil žádné seznamy! -", "- You haven't looked at any lists yet! -"],
        ["Výběr z uložených","Favorites mix"],
        ["Více","More"],
        ["- Zatím jsi neuložil žádné levely! -", "- You haven't saved any levels yet! -"],
        ["Oficiální", "Official"],
        ["Top 10 Levelů od Fanoušků 2019","Top 10 Request Levels 2019"],
        ["Top 15 Levelů od Fanoušků 2021","Top 15 Request Levels 2021"]
    ],
    "listBrowser": [
        ["        Hledání", "        Search"]
    ],
    "listViewer": [
        ["Sdílet", "Share"],
        ["Skočit na", "Jump To"],
        ["Členové", "Members"],
        ["Sdílet", "Share"],
        ["Skočit na", "Jump To"],
        ["Připnout", "Pin"],
        ["Upravit", "Edit"],
        ["Komentáře", "Comments"],
        ["Jméno", "Username"],
        ["Komentář", "Comments"],
        ["Emotikony", "Emotes"],
        ["Barva komentáře", "Comment color"],
        ["Odeslat komentář", "Send comment"],
        ["Strana: ", "Page: "],
        ["- Žádné komentáře -", "- No comments -"]
    ],
    "editor": [
        ["Jejda!", "Oh no!"],
        ["Štítky", "Tags"],
        ["- Nastavení collabu -", "- Collab Settings -"],
        ["Role nahrávatele", "Uploader role"],
        ["Host", "Host"],
        ["Nahrál", "Uploaded by"],
        ["Role", "Roles"],
        ["Členové", "Members"],
        ["Role", "Roles"],
        ["Dekorace", "Decoration"],
        ["Layout", "Layout"],
        ["Tester", "Tester"],
        ["Vložit ze schránky", "Paste from Clipboard"],
        ["Přidat roli", "Add role"],
        ["K přidání role vyber předvolbu, nebo klikni na", "To add a role, pick a preset or click"],
        ["Členové", "Members"],
        ["Vlastní odkaz", "Custom link"],
        ["YouTube kanál", "YouTube channel"],
        ["Přidat", "Add"],
        ["Zrušit", "Cancel"],
        ["Vložit ze schránky", "Paste from Clipboard"],
        ["Přidat člověka", "Add member"],
        ["K přidání členů přidej roli.", "To add a member, add a role."],
        ["K přidání člena klikni na", "To add a member, click"],
        ["Jméno", "Name"],
        ["Sítě", "Socials"],
        ["Role", "Role"],
        ["Část", "Part"],
        ["Barva", "Color"],
        ["Uložené levely", "Saved Levels"],
        ["        Hledat level...", "        Search levels..."],
        ["Nahrávání", "Upload"],
        ["Jméno seznamu", "List Name"],
        ["Tvůrce", "List Creator"],
        ["Zadej heslo seznamu", "Enter the list's password"],
        ["     Heslo", "     Password"],
        ["Ukázat náhled obrázku", "Show preview"],
        ["Obrázek seznamu", "List Image"],
        ["Barva pozadí:", "Background Color:"],
        ["Levely", "Levels"],
        ["Náhled seznamu", "List Preview"],
        ["Přidat z uložených", "Add from Saved"],
        ["Přidat level do seznamu", "Add level"],
        ["- Nastavení -", "- Settings -"],
        ["Soukromý seznam", "Private List"],
        ["Hádání obtížnosti", "Difficulty Guessing"],
        ["Hádat: ", "Guess: "],
        ["Obtížnosti", "Difficulties"],
        ["Rating", "Rating"],
        ["Nahrát", "Upload"]
    ]
}

function translateDoc(doc, ind) {
    for (let word = 0; word < parts[ind].length; word++) {
        doc = doc.replace(/%%s/, parts[ind][word][LANG])
    }

    return doc
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
            return Object.values(finishedCooks)[getSearched]
            }
        else return false;
    }
    else return finishedCooks;
}

function makeCookie(val) { // Also works for changing cookies
    let expireDate = "Sun, 1 Jan 2040 12:00:00 UTC"
    document.cookie = `${val[0]}=${encodeURIComponent(val[1])}; expires=${expireDate}; SameSite=Lax`
}

$(function() {
    var currLang = getCookie("lang");
    if (currLang == null) {
        let getLang = navigator.language;
        if (["cs", "sk"].includes(getLang)) { currLang = 0; }
        else { currLang = 1; }
        
        makeCookie(["lang", currLang])
    }
    LANG = currLang;
    $($(".settingsDropdown").children()[currLang]).attr("selected", true)
})