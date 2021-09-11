const LANG = 1

var strings = [
    ["title","index,html",0, ["Top 10 Levelů od Fanoušků", "Top 10 Fan Levels"]],
    [".lList","index.html","title", ["Seznam levelů","Level List"]],
    [".lComm","index.html","title", ["Komentáře","Comments"]],
    ["h3:nth-child(1)", "index.html",0,["Komentář", "Comment"]],
    [".pIconInp","index.html", "placeholder", ["Jméno", "Username"]],
    [".comFooterButton:nth-child(1)", "index.html","title",["Barva komentáře", "Comment Color"]],
    [".comFooterButton:nth-child(2)", "index.html","title",["Emotikony", "Emoji"]],
    [".sendBut", "index.html","title",["Odeslat komentář", "Send Comment"]],
    [".comTitles", "index.html",0,["- Komentáře -", "- Comments -"]],
    ["#pageStr", 0, 0, ["Strana: ", "Page: "]],
    [".noComm", "index.html", 0, ["- Žádné komentáře -", "- No Comments -"]]
    
]

function translate() {
    /* Strings:
0 - Selector
1 - Page (0 - both pages)
2 - Attribute (0 - Tag content)
3 - Strings array

    */
    strings.forEach(i => {
        // Apply only to current page
        if (location.pathname.match(i[1]) != -1) {
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

$(function () {
    translate();
    })
