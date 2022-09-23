const EMOJI_AM = 18;

function listComments() {
  // Finally non-shit
  if ($(".boards").css("display") == "none") {
    $(".comments").fadeOut(50);
    $("#commButton").attr("style","")
    $(".boards").fadeIn(100);
    $("#commentTool").fadeOut(50)
  } else {
    $(".boards").fadeOut(50);
    $(".comments").fadeIn(100);
    $("#commButton").css("box-shadow","#39c4a95e 0px 0px 28px")
    $("#commentTool").fadeIn(50)
  }
}

function updateCharLimit() {
  var charLimit = actualText.length;

  // I finally got to use the switch statement!!! (so exciting)
  switch (Math.floor(charLimit / 50)) {
    case 2:
      $("#charLimit").css("color", "#fce8e8");
      break;
    case 3:
      $("#charLimit").css("color", "#fcc4c4");
      break;
    case 4:
      $("#charLimit").css("color", "#f49f9f");
      break;
    case 5:
      $("#charLimit").css("color", "#ef6969");
      break;
    case 6:
      $("#charLimit").css("color", "#b50e0e");
      break;
    default:
      $("#charLimit").css("color", "#ffffff");
      break;
  }

  // Maybe not neccessary? Unless a hyperhacker hacks the matrix.
  if (charLimit > 300) {
    $(".comInpArea").html($(".comInpArea").html().slice(0, 300));
    charLimit = $(".comInpArea").text().length;
  }

  $("#charLimit").text(charLimit + "/300");
}

var actualText = "";
var midText = "";
var commentColor = "";
function setupComments() {
  // Is on homepage? (do not load)
  if (LIST_ID == -9) return

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
      `<img class="listEmoji" src="./images/emoji/${em}.webp" onclick="addEmoji(${i})">`
    );
  }

  // Fetch comments
  $.get("./php/getComments.php?listid=" + LIST_ID, function (data) {
    deeta = data;
    displayComments(data);
  });

  // Adds a placeholder to the comment area
  var selectPholder = placeholders[parseInt(Math.random() * placeholders.length)];
  $(".comInpArea").text(selectPholder);
  $(".comInpArea").css("color", "rgba(255,255,255,0.5) !important");

  // Placeholder related stuff
  $(".comInpArea").on("blur", () => {
    if (actualText.length == 1) {
      $(".comInpArea").text(selectPholder);
      $(".comInpArea").css("color", "rgba(255,255,255,0.5) !important");
    }
  });

  $(".comInpArea").on("click", () => {
    if (placeholders.indexOf($(".comInpArea")["0"].innerText) != -1) {
      $(".comInpArea")["0"].innerText = "";
    }

    $(".comInpArea").css("color", "rgba(255,255,255,1) !important");
  });

  // MAIN comment handling stuff
  $(".comInpArea").on("keyup keypress", (k) => {
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

  // Pick a random comment color
  commentColor = randomColor(0,1);
  let invCol = [255 - commentColor[0], commentColor[1], commentColor[2]]
  commentColor = HSLtoHEX(...commentColor)

  let boxColor = HEXtoRGB(commentColor, 30);
  let darkerBoxColor = HEXtoRGB(commentColor, 50);

  $("#commentMaker").css("background-color", commentColor);
  $("#commentMaker").css("border-color", "rgb(" + boxColor.join(",") + ")");
  $(".comInpArea").css("background-color", "rgb(" + boxColor.join(",") + ")");
  $(".comInpThings").css(
    "background-color",
    "rgb(" + darkerBoxColor.join(",") + ")"
  );
  $(".sendBut").css("background-color", "hsl(" + invCol.join(",") + ")");
  $(".emojiPanel").css("background-color", "rgb(" + boxColor.join(",") + ")");
  $("#verticalLine").css("border-color", commentColor);
  $(".cpicker").val(commentColor);

  // Page switching
  $("#pageSwitcher").on("change", function () {
    commentPage = parseInt($(this).val()) - 1;
    if (commentPage > maxCommentPage - 1) {
      commentPage = maxCommentPage - 1;
      $("#pageSwitcher").val(maxCommentPage);
    }
    if (commentPage < 1) {
      commentPage = 0;
      $("#pageSwitcher").val(1);
    }
    displayComments(deeta);
  });
};

function getPlayerIcon() {
  let player = $(".pIconInp").val();
  $.get("https://gdbrowser.com/api/profile/" + player, (data, res) => {
    if (data == "-1") {
      $(".comUserError").show();
      $(".comUserError").text(jsStr["GDACC_NOEX"][LANG]);
      setTimeout(() => $(".comUserError").fadeOut(1000), 3000);
    } else if (res == "success") {
      $("#pIcon").attr("src", "https://gdbrowser.com/icon/" + player);
    } else {
      $(".comUserError").show();
      $(".comUserError").text(jsStr["GDB_FAIL"][LANG]);
      setTimeout(() => $(".comUserError").fadeOut(1000), 3000);
    }
  });
}

function addEmoji(id) {
  id++;
  let emoji = "&" + (id > 9 ? id : "0" + id);
  if (actualText.length + emoji.length < 300) {
    midText += `<img class='emojis' src='./images/emoji/${emoji.slice(
      1
    )}.webp'>`;
    $(".comInpArea").html(midText);

    actualText += emoji;
    updateCharLimit();
  }
}

var lastOpenedPanel = -1;
function displayPanel(what) {
  if (what == 1) {
    // Emoji
    $(".colorPicker").hide();
    $(".listEmoji").show();
  } else {
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

        $("#commentMaker").css(
          "background-color",
          `hsl(${hue}, ${DEFAULT_SATURATION}, ${lightness}%)`
        );
        $("#commentMaker").css(
          "border-color",
          `hsl(${hue}, ${DEFAULT_SATURATION}, ${lightness - 5}%)`
        );
        $(".comInpArea").css(
          "background-color",
          `hsl(${hue}, ${DEFAULT_SATURATION}, ${lightness - 5}%)`
        );
        $(".comInpThings").css(
          "background-color",
          `hsl(${hue}, ${DEFAULT_SATURATION}, ${lightness - 10}%)`
        );
        $(".emojiPanel").css(
          "background-color",
          `hsl(${hue}, ${DEFAULT_SATURATION}, ${lightness - 5}%)`
        );
        $("#verticalLine").css(
          "border-color",
          `hsl(${hue}, ${DEFAULT_SATURATION}, ${lightness - 5}%)`
        );

        $(".sendBut").css(
          "background-color",
          `hsl(${255-hue}, ${DEFAULT_SATURATION}, ${lightness - 5}%)`
        );

        let inHex = HSLtoHEX(hue, DEFAULT_SATURATION, lightness + "%");
        commentColor = inHex;
      });

      color.appendTo($(".emojiPanel"));
    }

    $(".colorPicker").show();
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

function sendComment() {
  if ($(".sendBut")["0"].className.match("disabled") == null) {
    if (actualText.length <= 10) {
      $(".comUserError").show();
      $(".comUserError").text(jsStr["COM_L"][LANG]);
      setTimeout(() => $(".comUserError").fadeOut(1000), 3000);
    } else if ($(".pIconInp").val().length <= 4) {
      $(".comUserError").show();
      $(".comUserError").text(jsStr["COMU_L"][LANG]);
      setTimeout(() => $(".comUserError").fadeOut(1000), 3000);
    } else {
      $(".sendBut").addClass("disabled");
      let postData = {
        creator: $(".pIconInp").val(),
        comment: actualText,
        comType: 0, // Change when I eventually add replies,
        listID: LIST_ID,
        comColor: commentColor,
      };

      $.post("./php/sendComment.php", postData, (data) => {
        if (data == 6) {
          // Success text
          $(".comUserError").show();
          $(".comUserError").css("color", "#5df469 !important");
          $(".comUserError").text(jsStr["C_SENT"][LANG]);
          setTimeout(() => {
            $(".comUserError").fadeOut(3000);
            $(".comUserError").css("color", "tomato");
          }, 3000);

          refreshComments();

          // Resetting comment form
          actualText = "";
          midText = "";
          $(".comInpArea").text("");
          updateCharLimit();

          // 10 second comment rate limit
          setTimeout(() => {
            $(".sendBut").removeClass("disabled");
          }, 10000);
        } else {
          // Comment send error
          $(".sendBut").removeClass("disabled");
          $(".comUserError").show();
          $(".comUserError").text(jsStr["C_ERR"][LANG] + data);
          setTimeout(() => $(".comUserError").fadeOut(1000), 3000);
        }
      })
    }
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
  let profPic = "";
  let clickable = ["", ""];
  let comColor = "#b9efb1";
  let time = chatDate(cd["timestamp"]);

  let dcc = HEXtoRGB(cd["bgcolor"], 40);
  let edcc = HEXtoRGB(cd["bgcolor"], 40);

  if (cd["timestamp"].length == 9) {
    cd["timestamp"] *= 10;
  } // First comment's date is not in milliseconds
  let nT = new Date(cd["timestamp"] * 1000);

  // Is user verified?
  if (cd["verified"] == 1) {
    profPic = `<img class="pIcon" style="height: var(--biggerFont);" src="https://gdbrowser.com/icon/${cd["username"]}">`;
    clickable[0] = "clickable";
    clickable[1] = `onclick="profile('${cd["username"]}')`;
    comColor = "#f9f99a";
  }

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
  
  // Making links clickable :)
  let urlRegex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/g
  let links = cd["comment"].match(urlRegex)
  if (links != null) {
    cd["comment"] = cd["comment"].replaceAll(/(http|https):\/\//g, "")
    
    links.forEach(link => {
      if (!cd["comment"].includes(`<a href="https://www.${link}" class="gamLink">${link}</a>`)
          && link.match(/\d+.webp/) == null) { // emoji check, so they don't get treated as link, hope it doesn't break stuff
        // i mean... http sites won't work, but who cares lmao
        cd["comment"] = cd["comment"].replaceAll(link, `<a href="https://${link}" class="gamLink">${link}</a>`)
      }
    });
  }
  
  $(element).append(`
  <div style="margin: 0.8em; box-shadow: #000000b3 0px 0px 32px;">
  
  <div class="comBoxThings ${clickable[0]
    } uploadText" id="comBoxHeader" ${clickable[1]}"
  style="justify-content: flex-start;
  background-color: ${"rgb(" + dcc.join(",") + ")"};
  border: solid ${"rgb(" + edcc.join(",") + ")"
    } 4px;">
${profPic}
            <h5 style="margin: 0 1%; color: ${comColor};">${cd["username"]}</h3>
            <h5 
                style="margin: 0 0 0 auto; cursor: help;"
                title="${nT.getDay() + 1}.${nT.getMonth() + 1
    }.${nT.getFullYear()} ${nT.getHours()}:${nT.getMinutes()}:${nT.getSeconds()}">${time}</h3>
        </div>
    
        <div class="comTextArea" id="comFont" style="width: 99%; background-color: ${cd["bgcolor"]
    };">${cd["comment"]}</div>
    
    </div>
    `);
}

var commentPage = 0;
var maxCommentPage = 1;
var deeta = "";

function redirectWarn(el) {
  el.preventDefault()
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

  $("#linkYes").click(() => { window.open("https://" + el.target.innerText, "_blank"); clPopup() })
  $("#linkNo").click(clPopup)
}

async function displayComments(data) {
  // Don't do anything on list previews and random lists that haven't replaced LIST_ID
  if ([-8, -11].includes(LIST_ID) || typeof data == "string") return

  $("#commAmount").text(data.length)

  let refreshBut = `<img id="searchLists" class="button refreshBut" onclick="refreshComments()" style="width: 3em;" src="images/replay.svg">`

  if ($("#commentList").children().length == 0) {
    await $.get("./parts/listBrowser.html", d => {
      $("#commentList").append(translateDoc(d, "listBrowser"))
    })
  }
  listViewerDrawer(data, "#commentList", 6, [1, 0], jsStr["COMM"][LANG], [refreshBut])
  $(".comTextArea .gamLink").click(el => redirectWarn(el))

}

function profile(name) {
  window.open("https://gdbrowser.com/u/" + name);
}

function refreshComments() {
  if ($(".refreshBut")["0"].className.match("disabled") == null) {
    $(".refreshBut").addClass("disabled");
    $.get("./php/getComments.php?listid=" + LIST_ID, function (data) {
      deeta = data;
      displayComments(data);
    });
    setTimeout(() => {
      $(".refreshBut").removeClass("disabled");
    }, 3000);
  }
}