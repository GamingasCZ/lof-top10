const EMOJI_AM = 18;

function listComments() {
  // Finally non-shit
  if ($(".boards").css("display") == "none") {
    $(".comments").fadeOut(50);
    $("#commButton").attr("style", "")
    $(".boards").fadeIn(100);
    $("#commentTool").fadeOut(50)
  } else {
    setupComments()
    $(".boards").fadeOut(50);
    $(".comments").fadeIn(100);
    $("#commButton").css("box-shadow", "#39c4a95e 0px 0px 28px")
    $("#commentTool").fadeIn(50)
  }
}

function updateCharLimit() {
  // I finally got to use the switch statement!!! (so exciting) - just removed it, sorry past gamingas
  let comLen = Math.floor(actualText.length/300*100)
  $(".sendBut").css("background", `conic-gradient(${commentColor} ${comLen}%, ${$(".comInpArea").css("background-color")} ${comLen+3}%)`);
  $(".sendBut").css("background-color", $(".comInpArea").css("background-color"))

  if (actualText.length > 10) $(".sendBut").css("border-color", $(".comInpArea").css("background-color"))
  else $(".sendBut").css("border-color", "")

  if (actualText.length > 300) $(".comInpArea").html($(".comInpArea").html().slice(0, 300));
}

var actualText = "";
var midText = "";
var commentColor = "";
var commentPoll = {"q": "", "opt": [false, true]}
function setupComments() {
  // Is on homepage? (do not load)
  if (LIST_ID == -9) return
  // Is already setup?
  if ($("#commentList").text() != "") return

  var placeholders = [
    jsStr["PHOLD1"][LANG],
    jsStr["PHOLD2"][LANG],
    jsStr["PHOLD3"][LANG],
    jsStr["PHOLD4"][LANG],
    jsStr["PHOLD5"][LANG],
  ];

  $(".emojiPanel").hide();

  // Adds emojis into the emoji panel
  for (let i = 0; i < EMOJI_AM; i++) {
    let em = i + 1 < 10 ? "0" + (i + 1) : i + 1;
    $(".emojiPanel").append(
      `<img class="listEmoji button" src="./images/emoji/${em}.webp" onclick="addEmoji(${i})">`
    );
  }

  // Setup name and pfp, check login
  let userInfo = null
  if (hasLocalStorage()) userInfo = JSON.parse(localStorage.getItem("userInfo"))
  if (userInfo != null) {
    if (userInfo[2] == null) $("#pIcon").attr("src", "images/defaultPFP.webp")
    else $("#pIcon").attr("src", `https://cdn.discordapp.com/avatars/${userInfo[1]}/${userInfo[2]}.png`)
    $("#commentName").text(userInfo[0])
  }
  else {
    $("#loginHelp").show()
    lockQuotes()
    $("#commentMaker").remove()
    $("#comBoxFooter").remove()
    if (!hasLocalStorage()) {
      $("#loginHelp").remove()
    }
  }

  displayComments();

  // Adds a placeholder to the comment area
  var selectPholder = placeholders[parseInt(Math.random() * placeholders.length)];
  $("#comFont").text(selectPholder);
  $("#comFont").css("color", "rgba(255,255,255,0.5)");

  // Placeholder related stuff
  $("#comFont").on("blur", () => {
    if ($("#comFont").text() == "") {
      $("#comFont").text(selectPholder);
      $("#comFont").css("color", "rgba(255,255,255,0.5)");
    }
  });

  $("#comFont").on("focus", () => {
    if (placeholders.indexOf($("#comFont")["0"].innerText) != -1) {
      $("#comFont")[0].innerText = "";
      $("#comFont").css("color", "");
    }

  });

  // Pick a random comment color
  commentColor = randomColor(0, 1);
  hexColor = HSLtoHEX(...commentColor)
  let darkHexColor = HSLtoHEX(commentColor[0], "100%", "3.7%")

  $(".comInpArea").css("background-color", darkHexColor);
  $(".comInpArea").css("border", `${hexColor} 3px solid`);
  $(".comInpArea").css("box-shadow", `${hexColor} 0 0 10px`);
  $(".comInpThings").css(
    "background-color",
    `hsl(${commentColor[0]}, 100%, 3.7%)`
  );
  $(".sendBut").css(
    "background", `conic-gradient(${hexColor} ${Math.floor(actualText.length/300*100)}%, ${darkHexColor} 0%)`
    );
  $(".sendBut").css("background-color", darkHexColor)
  $(".emojiPanel").css("background-color", darkHexColor);
  $(".pollAdd").css("background", hexColor);
  commentColor = HSLtoHEX(...commentColor)

  // MAIN comment handling stuff
  $(".comInpArea").on("keyup keydown", (k) => {
    // Only perform stuff once
    if (k.type == "keyup") {
      let text = $(".comInpArea").html();

      text = text.replace(/<div>/g, "\n"); // Div tag is most likely newline
      text = text.replace(/<\/div>/g, ""); // Remove div tag end
      let keepImgs = text;
      keepImgs = keepImgs.replace(/<br>/g, "");

      // this is the worst fix imaginable
      text = text.replace(/<img class="emojis" src=".\/images\/emoji\//g, "&");
      text = text.replace(/.webp">/g, "");

      // Remove excess tags
      text = text.replace(/<(“[^”]*”|'[^’]*’|[^'”>])*>/g, "");

      // Remove excess newline
      if (text.startsWith("\n")) {
        text = text.slice(1);
        keepImgs = keepImgs.slice(1);
      }

      actualText = text;
      midText = keepImgs;

      updateCharLimit();
    }
  });
};

function addEmoji(id) {
  id++;
  let emoji = "&" + (id > 9 ? id : "0" + id);
  if (actualText.length + emoji.length < 300) {
    midText += `<img class='emojis' src='./images/emoji/${emoji.slice(
      1
    )}.webp'>`;
    if (midText.includes("\n")) {
      let newText = "<div>"+midText.replace(/\n/g, "</div><div>")+"</div>"
      newText = newText.replace(/<div><\/div>/g, "<div><br></div>")
      $(".comInpArea").html(newText);
    }
    else $(".comInpArea").html(midText);

    actualText += emoji;
    updateCharLimit();
  }
}

// e.clipboardData.getData("Text")
var lastOpenedPanel = -1;
function displayPanel(what) {
  if (what == 1) {
    // Emoji
    $(".pollDialog").hide();
    $(".mediaDialog").hide();
    $(".colorPicker").hide();
    $(".listEmoji").show();
  }
  else if (what == 2) {
    // Color picker
    if ($(".colorPicker").length < 1) {
      let color = makeColorElement(
        getHueFromHEX(commentColor),
        getLightnessFromHEX(commentColor)
      );
      color.on("input", (k) => {
        let isChangingValue = false;
        if (k.target.previousElementSibling.className == "hueChanger")
          isChangingValue = true;
        let lightness = isChangingValue
          ? k.target.value
          : getLightnessFromHEX(commentColor);
        let hue = isChangingValue
          ? getHueFromHEX(commentColor)
          : k.target.value;

        $(".comInpArea").css({"background-color": `hsl(${hue}, ${DEFAULT_SATURATION}, 3.7%)`,
                              "border-color": `hsl(${hue}, ${DEFAULT_SATURATION}, ${lightness}%)`,
                              "box-shadow": `hsl(${hue}, ${DEFAULT_SATURATION}, ${lightness}%) 0 0 10px`});

        $(".comInpThings").css("background-color", `hsl(${hue}, ${DEFAULT_SATURATION}, 3.7%)`);

        $(".emojiPanel").css("background-color", `hsl(${hue}, ${DEFAULT_SATURATION}, 3.7%)`);

        $(".sendBut").css(
          "background", `conic-gradient(hsl(${hue}, ${DEFAULT_SATURATION}, ${lightness}%) ${Math.floor(actualText.length/300*100)}%, hsl(${hue}, ${DEFAULT_SATURATION}, 3.7%) 0%)`
        );
        $(".sendBut").css("background-color", `hsl(${hue}, ${DEFAULT_SATURATION}, 3.7%)`)
        $(".pollAdd").css("background", commentColor);

        let inHex = HSLtoHEX(hue, DEFAULT_SATURATION, lightness + "%");
        commentColor = inHex;
      });

      color.appendTo($(".emojiPanel"));
    }

    $(".colorPicker").show();
    $(".pollDialog").hide();
    $(".mediaDialog").hide();
    $(".listEmoji").hide();
  }
  else if (what == 3) {
    // Polls
    if ($(".pollSwitcher").length == 0) {
      addPollOption()
      addPollOption()
      $(".pollQuestion").on("change", el => commentPoll.q = $(el.target).val())
    }

    $(".pollDialog").show();
    $(".colorPicker").hide();
    $(".mediaDialog").hide();
    $(".listEmoji").hide();
  }
  else {
    $(".mediaDialog").show();
    $(".pollDialog").hide();
    $(".colorPicker").hide();
    $(".listEmoji").hide();
  }

  if (lastOpenedPanel == what || $(".emojiPanel").css("display") == "none") {
    if ($(".emojiPanel").css("display") == "none") {
      $(".emojiPanel").slideDown(50);
    } else {
      $(".emojiPanel").slideUp(50);
    }
  }
  lastOpenedPanel = what;
}

function addPollOption() {
  if ($(".pollSwitcher").length == 5) return
  let style = ["yes", "no", "normal", "spike", "deco"][$(".pollSwitcher").length]

  $(".pollContainer").append(`
  <div class="pollInput pollOptContainer"><img src="images/pollOptions/${style}.webp" class="button pollSwitcher" id="pollStyle">
    <input type="text" class="pollOptInput" placeholder="Volba ${$(".pollSwitcher").length+1}"><img src="images/close.svg" id="passSubmit" class="button pollDelete"></div>
  `)
  if ($(".pollSwitcher").length == 5) $(".pollAdd").addClass("disabled")

  let opt = $(".pollSwitcher").length
  commentPoll[opt-1] = [$(".pollSwitcher").length-1, ""]
  $(".pollOptContainer:last()").attr("data-index", opt-1)
  $(".pollOptInput:last()").on("change", el => pollOptInput(el))
  $(".pollSwitcher:last()").click(el => switchPollStyle(el))
  $(".pollDelete:last()").click(el => deletePollOpt(el))
}

function chPollSetting(opt) {
  if (opt == "pinToList") commentPoll.opt[0] = !commentPoll.opt[0]
  else commentPoll.opt[1] = !commentPoll.opt[1]
}

function pollOptInput(el) {
  commentPoll[$(el.target).parent().attr("data-index")][1] = $(el.target).val()
}

function deletePollOpt(el) {
  $(".pollAdd").removeClass("disabled")
  $(el.target).parent().remove()
  for (let i = 0; i < $(".pollOptInput").length+1; i++) {
    $(".pollOptInput").eq(i).attr("placeholder", `Volba ${i+1}`)
    $(".pollOptContainer").eq(i).attr("data-index", i)
  }
}

function switchPollStyle(el) {
  let ind = parseInt($(el.target).parent().attr("data-index"))+1
  let images = ["yes", "no", "normal", "spike", "deco"].map(x => `images/pollOptions/${x}.webp`)
  let currImg = images.indexOf($(".pollSwitcher").eq(ind-1).attr("src"))

  let imgIndex = images.length-1 == currImg ? 0 : currImg+1
  commentPoll[ind-1][0] = imgIndex
  $(".pollSwitcher").eq(ind-1).attr("src", images[imgIndex])
}

function sendComment() {
  if ($(".sendBut")["0"].className.match("disabled") == null) {
    $(".sendBut").addClass("disabled");
    let postData = {
      comment: actualText,
      comType: 0, // Change when I eventually add replies,
      listID: LIST_ID,
      comColor: commentColor,
    };

    $.post("./php/sendComment.php", postData, (data) => {
      if (data == 6) {
        $(".refreshBut").click()

        // Resetting comment form
        actualText = "";
        midText = "";
        $(".comInpArea").text("");
        updateCharLimit();

        // 10 second comment rate limit
        setTimeout(() => {
          $(".sendBut").removeClass("disabled");
        }, 10000);
      }
    })
  }
}

function chatDate(stamp) {
  let currStamp = Math.floor(new Date().getTime() / 1000);
  let seconds = currStamp - stamp * 10;
  // Why does this happen ? >:(
  if (seconds < 0) {
    seconds = currStamp - stamp;
  }

  if (seconds > 31557600) {
    return `${jsStr["AGO"][LANG]}${Math.floor(seconds / 31557600)} ${Math.floor(seconds / 31557600) == 1
      ? jsStr["YEAR"][LANG]
      : jsStr["YEARS"][LANG]
      }`;
  } else if (seconds > 2629800) {
    return `${jsStr["AGO"][LANG]}${Math.floor(seconds / 2629800)} ${Math.floor(seconds / 2629800) == 1
      ? jsStr["MONTH"][LANG]
      : jsStr["MONTHS"][LANG]
      }`;
  } else if (seconds > 86400) {
    return `${jsStr["AGO"][LANG]}${Math.floor(seconds / 86400)} ${Math.floor(seconds / 86400) == 1
      ? jsStr["DAY"][LANG]
      : jsStr["DAYS"][LANG]
      }`;
  } else if (seconds > 3600) {
    return `${jsStr["AGO"][LANG]}${Math.floor(seconds / 3600)} ${Math.floor(seconds / 3600) == 1
      ? jsStr["HOUR"][LANG]
      : jsStr["HOURS"][LANG]
      }`;
  } else if (seconds > 60) {
    return `${jsStr["AGO"][LANG]}${Math.floor(seconds / 60)} ${Math.floor(seconds / 60) == 1
      ? jsStr["MINUTE"][LANG]
      : jsStr["MINUTES"][LANG]
      }`;
  } else if (seconds >= 10) {
    return `${jsStr["AGO"][LANG]}${Math.floor(seconds)} ${jsStr["SECONDS"][LANG]
      }`;
  } else if (seconds < 10) {
    return jsStr["FEWSECS"][LANG];
  }
}

function comBox(cd, element) {
  let time = chatDate(cd["timestamp"]);

  if (cd["timestamp"].length == 9) {
    cd["timestamp"] *= 10;
  } // First comment's date is not in milliseconds
  let nT = new Date(cd["timestamp"] * 1000);

  let comGlow = `${cd["bgcolor"]} 0 0 10px`
  let comBorder = `${cd["bgcolor"]} 3px solid`

  // OwO, adding emojis
  while (cd["comment"].match(/&\d+/g) != null) {
    let sel = cd["comment"].indexOf(cd["comment"].match(/&\d+/));
    let selStart = cd["comment"].slice(0, sel);
    let emojiID = cd["comment"].slice(sel + 1, sel + 3);
    if (emojiID > EMOJI_AM) {
      emojiID = "sad";
    }

    // fix this if you add more than 100 emojis :O
    let selEnd = cd["comment"].slice(sel + 3);

    cd["comment"] =
      selStart +
      `<img class="emojis" src="./images/emoji/${emojiID}.webp">` +
      selEnd;
  }
  cd["comment"] = cd["comment"].replace(/\n/g, "<br>")

  // Making links clickable :)
  let urlRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/g
  let links = cd["comment"].match(urlRegex)
  if (links != null) {
    links.forEach(link => {
      if (!cd["comment"].includes(`class="gamLink"`)
        && link.match(/\d+.webp/) == null) { // emoji check, so they don't get treated as link, hope it doesn't break stuff
        cd["comment"] = cd["comment"].replaceAll(link, `<a href="${link}" class="gamLink">${link}</a>`)
      }
    });
  }
  
  let darkBG = `hsl(${getHueFromHEX(cd["bgcolor"])}, 100%, 3.7%)`
  let hoverDate = `title="${nT.toLocaleDateString()} ${nT.toLocaleTimeString()}"`
  $(element).append(`
  <div style="margin: 1em auto; max-width: 70em;">
    <div class="comBoxThings uploadText" id="comBoxHeader" style="justify-content: flex-start;">
      <img id="pIcon" src="${cd.avatar}">
      <div class="comHeaderText">
        <h5>${cd["username"]}</h5>
        <h5 style="font-size: var(--tinyFont); cursor: help;" ${hoverDate}>${time}</h5>
        </div>
        </div>
        
        <div class="comTextArea" id="comFont" style="background-color: ${darkBG}; box-shadow: ${comGlow}; border: ${comBorder};">
        ${cd["comment"]}
        </div>
        </div>
  `);   
}

function redirectWarn(el) {
  window.event.preventDefault()
  $("#popupBG").show()
  $("#popupBG").css("opacity", 1)
  $("#popupBG").fadeIn(100)

  // lmao reusing the share dialog
  $("body").append(`
  <div class="uploadBG uploadText linkWarn" id="shareTools" style="position: fixed; display: block;">
    <p class="uploadText" id="shareText" style="margin-bottom: 0;">${jsStr["REDIRECT"][LANG]}</p>
    <input class="uploadText settingsBG" id="linkViewer" readonly value="${el.target.innerText}"></input>
    <p class="uploadText" id="shareText" style="margin-bottom: 0;"><cg>${jsStr["TRUST"][LANG]}</cg><br>${jsStr["CONTINUE"][LANG]}?</p>
    <div>
      <button class="uploadText button eventButton" id="linkYes">${jsStr["YES"][LANG]}</button>
      <button class="uploadText button eventButton" id="linkNo">${jsStr["NO"][LANG]}</button>
    </div>
  </div>
  `)

  let clPopup = () => { $("#popupBG").fadeOut(100, () => $("#popupBG").css("opacity", 0)); $(".linkWarn").remove() }

  $("#linkYes").click(() => { window.open(el.target.innerText, "_blank"); clPopup() })
  $("#linkNo").click(clPopup)
}

async function displayComments(online = null) {
  // Don't do anything on list previews and random lists that haven't replaced LIST_ID
  if ([-8, -11].includes(LIST_ID)) return

  if ($("#commentList").children().length == 0) {
    await $.get("./parts/listBrowser.html", d => {
      $("#commentList").append(translateDoc(d, "listBrowser"))
    })
  }
  let refreshBut = `<img id="searchLists" class="button refreshBut" style="width: 3em;" src="images/replay.svg">`
  if (online == null) {
    online = await listOnlineViewerDrawer(
      {startID: 999999, searchQuery: null, page: 0, path: "/php/getComments.php", fetchAmount: 8, sort: 0, listid: LIST_ID},
      "#commentList", 6, [1, 0], jsStr["COMM"][LANG], [refreshBut])
  }
  else {
    online = await listOnlineViewerDrawer(online, "#commentList", 6, [1, 0], jsStr["COMM"][LANG], [refreshBut])
  }
  $(".refreshBut").one("click", () => refreshComments(online))

  data = currentListData["#commentList"]

}

function refreshComments(online) {
  if ($(".refreshBut")["0"].className.match("disabled") == null) {
    $(".refreshBut").addClass("disabled")
    online.startID = 9999999
    displayComments(online);
    setTimeout(() => {
      $(".refreshBut").removeClass("disabled");
    }, 3000);
  }
}

function rollExtras() {
  if ($("#cToolTop").css("transform") == "none") {
    $(".mobileExtras").show()
    $("#cToolTop").css("transform", `translateX(${-$(".listMore").position().left + 10}px)`)
  }
  else {
    $(".mobileExtras").fadeOut(100)
    $("#cToolTop").css("transform", "none")
  }
}