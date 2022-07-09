const EMOJI_AM = 18;
function getID() {
  let paramGetter = new URLSearchParams(window.location.search)
  let params = Object.fromEntries(paramGetter.entries());

  if (params["preview"] != null) { return -8 } // List preview from editor
  if (params["pid"] != null) { return -10 } // Disable comments on private lists
  if (params["random"] != null) { return -11 } // -11 will be replaced with actual ID later
  if (params["id"] != null) { return params["id"] } // Community level/2019 or 2021 list (-2,-3)
  if (params["year"] != null) { return params["year"] == "2021" ? "-3" : "-2" }
  else { return -9 } // Is Homepage
}
var LIST_ID = getID();

function listList() {
  // What a shitty function name bruh
  $(".comments").fadeOut(50);
  $(".boards").fadeIn(100);
  $(".lComm").removeClass("disabled");
  $(".lList").addClass("disabled");
}

function listComments() {
  $(".boards").fadeOut(50);
  $(".comments").fadeIn(100);
  $(".lComm").addClass("disabled");
  $(".lList").removeClass("disabled");
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
$(function () {
  // Is on homepage? (do not load)
  if (LIST_ID == -9) return

  // Disabling comments on private lists
  if (LIST_ID == -10) {
    $(".listOptions > div:nth-child(1)").remove()

    return null
  }

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
  commentColor = randomColor();
  let boxColor = HEXtoRGB(commentColor, 30);
  let darkerBoxColor = HEXtoRGB(commentColor, 50);

  $("#commentMaker").css("background-color", commentColor);
  $("#commentMaker").css("border-color", "rgb(" + boxColor.join(",") + ")");
  $(".comInpArea").css("background-color", "rgb(" + boxColor.join(",") + ")");
  $(".comInpThings").css(
    "background-color",
    "rgb(" + darkerBoxColor.join(",") + ")"
  );
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

  // Hide debug tools when not running locally
  if (window.location.port == "") {
    $(".debugTools").remove();
  }
});

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
          $(".pIconInp").val("");
          actualText = "";
          midText = "";
          $(".comInpArea").text("");
          updateCharLimit();

          $("body")[0].scrollTop = 0 // Scroll to top to show comment

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

function comBox(cd, dcc, edcc) {
  let profPic = "";
  let clickable = ["", ""];
  let comColor = "#b9efb1";
  let time = chatDate(cd["timestamp"]);

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

  return `
    <div style="margin-bottom: 2vw">
    
        <div class="comBoxThings ${clickable[0]
    } uploadText" id="comBoxHeader" ${clickable[1]}"
            style="margin-bottom: 0 !important;
                    justify-content: flex-start;
                    background-color: ${"rgb(" + dcc.join(",") + ")"};
                    border: solid ${"rgb(" + edcc.join(",") + ")"
    } 4px;">
            ${profPic}
            <h3 style="margin-left: 1%; color: ${comColor};">${cd["username"]}</h3>
            <h3 id="comFont" 
                style="margin: 0 0 0 auto; cursor: help;"
                title="${nT.getDay() + 1}.${nT.getMonth() + 1
    }.${nT.getFullYear()} ${nT.getHours()}:${nT.getMinutes()}:${nT.getSeconds()}">${time}</h3>
        </div>
    
        <div class="comTextArea" id="comFont" style="width: 99%; background-color: ${cd["bgcolor"]
    };">${cd["comment"]}</div>
    
    </div>
    `;
}

var commentPage = 0;
var maxCommentPage = 1;
var deeta = "";

function debugComments(am) {
  if (am == 2) {
    deeta = [];
    for (let i = 0; i < parseInt($("#lDebugAm").val()); i++) {
      deeta.push({
        "username": fakeNames[Math.floor(Math.random() * fakeNames.length)],
        "comment": "This is a comment!",
        "comType": "0",
        "bgcolor": randomColor(),
        "listID": "-2",
        "comID": "27",
        "verified": "1",
        "timestamp": Math.floor((Math.random() * Date.now()) / 1000)
      })
    }

    displayComments(deeta);
  } else {
    $("#lDebugAm").val(parseInt($("#lDebugAm").val()) + am);
    if ($("#lDebugAm").val() < 0) {
      $("#lDebugAm").val("0");
    }
  }
}

function displayComments(data) {
  // Don't do anything on list previews and random lists that haven't replaced LIST_ID
  if ([-8, -11].includes(LIST_ID) || typeof data == "string") return

  const PER_PAGE = 5;

  if (data != 2) $("#commAmount").text(data.length)
  else $("#commAmount").text("0")

  $("#commentList").html("");
  $(".noComm").hide();

  if (data == 2 || data == "") {
    $(".noComm").show();
    return null;
  }
  let comArray = JSON.parse(JSON.stringify(data)).reverse();

  // Max page
  maxCommentPage = Math.ceil(data.length / PER_PAGE);
  $("#maxPage").text("/" + maxCommentPage);

  for (x = commentPage * PER_PAGE; x < commentPage * PER_PAGE + PER_PAGE; x++) {
    let commentData = data[x]

    let darkerComColor = HEXtoRGB(commentData["bgcolor"], 40);
    let evenDarkerComColor = HEXtoRGB(commentData["bgcolor"], 40);

    $("#commentList").append(
      comBox(commentData, darkerComColor, evenDarkerComColor)
    );
  }
}

function commpageSwitch(num) {
  if (commentPage + num < 0) {
    commentPage = 0;
  } else if (commentPage + num > maxCommentPage - 1) {
    commentPage = maxCommentPage - 1;
  } else {
    commentPage += num;
    $("#pageSwitcher").val(commentPage + 1);
    displayComments(deeta);
  }
}

function profile(name) {
  window.open("https://gdbrowser.com/u/" + name);
}

function refreshComments() {
  if ($("#refreshBut")["0"].className.match("disabled") == null) {
    $("#refreshBut").addClass("disabled");
    $.get("./php/getComments.php?listid=" + LIST_ID, function (data) {
      deeta = data;
      displayComments(data);
    });
    setTimeout(() => {
      $("#refreshBut").removeClass("disabled");
    }, 3000);
  }
}
