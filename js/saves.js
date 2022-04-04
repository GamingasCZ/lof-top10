const MAX_ON_PAGE = 4;
var page = 0;
var maxPage = 0;

var sorting = false;
var currView = "";
$(function () {

  let paramGetter = new URLSearchParams(window.location.search);
  let params = Object.fromEntries(paramGetter.entries());

  // Sets save page localStorage when faving a level
  window.addEventListener("message", (mess) => {
    localStorage.setItem("favorites", mess.data[0]);
    localStorage.setItem("favoriteIDs", mess.data[1]);
  });

  $("#sortBut").on("click", function () {
    if (JSON.parse(decodeURIComponent(localStorage.getItem("favorites"))).length > 1) {
      let getObject;
      if (filteredData == null)
        getObject = JSON.parse(decodeURIComponent(localStorage.getItem("favorites")));
      else getObject = sorting ? filteredData : filteredData.reverse();

      if (sorting) {
        $("#sortBut").css("transform", "scaleY(1)");
        $("#sortBut").attr("title", jsStr["OLDEST"][LANG]);
        generateList(getObject.reverse());
      } else {
        $("#sortBut").css("transform", "scaleY(-1)");
        $("#sortBut").attr("title", jsStr["NEWEST"][LANG]);
        generateList(getObject);
      }
      sorting = !sorting;
    }
  });

  $("#pageSwitcher").on("change", function () {
    page = parseInt($(this).val()) - 1;
    if (page > maxPage) {
      page = maxPage - 1;
      $("#pageSwitcher").val(maxPage);
    }
    if (page < 1) {
      page = 0;
      $("#pageSwitcher").val(1);
    }

    let obj = JSON.parse(decodeURIComponent(localStorage.getItem("favorites")));
    if (!sorting) obj.reverse();

    generateList(obj);
  });

  // Prepping for future :O (future me - thanks!)
  if (params["type"] != null && params["type"] == "favorites") {
    currView = "favorites";
    generateFaves();
  }
  else if (params["type"] == "homepage") {
    $(".savedTitle").remove()
    $(".searchTools").remove()
    makeHomepage()
  }

  $("body").css("opacity", 1);
});

function generateFaves() {
  $(".titles").text(jsStr["FAV_LEVELS"][LANG]);

  // levelName, levelCreator, levelID, cardCol, listID, listName, listPos, timeAdded
  let favorites = JSON.parse(
    decodeURIComponent(localStorage.getItem("favorites"))
  );

  if (favorites == null || Object.keys(favorites).length == 0) {
    $(".listContainer").html(
      `<p class='uploadText' style='text-align: center; color: #f9e582'>${jsStr["NOFAVED"][LANG]}</p>`
    );
  } else {
    if (!sorting) favorites.reverse();

    maxPage = Math.ceil(Object.keys(favorites).length / MAX_ON_PAGE);
    generateList(favorites);
  }
  resizeFrame()
}

function pageSwitch(num) {
  if (page + num < 0) page = 0;
  else if (page + num > maxPage - 1) page = maxPage - 1;
  else {
    page += num;
    $("#pageSwitcher").val(page + 1);

    // Not sure how I feel about this...
    let obj = JSON.parse(decodeURIComponent(localStorage.getItem("favorites")));
    if (!sorting) obj.reverse();

    generateList(obj);
  }
}

function resizeFrame() {
  let PADDING = 200;
  window.parent.document.querySelector('iframe').style.height = (document.body.scrollHeight + PADDING) + 'px'
  if (window.parent.document.querySelector('iframe').style.height == PADDING + 'px') {
    setTimeout(resizeFrame, 10)
  }
}

var filteredData = null;
function search() {
  deeta = JSON.parse(decodeURIComponent(localStorage.getItem(currView)));
  let query = $("#searchBar").val();
  if (query == "") {
    // Reset stuff
    page = 0;
    filteredData = null;
    $("#pageSwitcher").val("1");
    maxPage = Math.ceil(Object.keys(deeta).length / MAX_ON_PAGE);
    $("#maxPage").text("/" + maxPage);

    generateList(deeta);
  } else {
    let regex = new RegExp(".*(" + query + ").*", "ig"); // Matches all strings that contain "query"
    filteredData = deeta.filter((val) => JSON.stringify(val).match(regex));
    if (filteredData.length == 0) {
      $(".listContainer").text("");
      page = 0;
      $("#pageSwitcher").val("1");
      $("#maxPage").text("/1");
      $(".listContainer").append(
        `<p class="uploadText" align=center>${jsStr["NO_RES"][LANG]}</p>`
      );
    } else {
      page = 0;
      $("#pageSwitcher").val("1");
      maxPage = Math.ceil(Object.keys(filteredData).length / MAX_ON_PAGE);
      $("#maxPage").text("/" + maxPage);

      deeta = filteredData;

      generateList(filteredData);
    }
  }
}

function removeFromList(obj, id, el, listName, pos) {
  if (obj == "fav") {
    // Remove level
    let currIDs = JSON.parse(localStorage.getItem("favoriteIDs"));
    let currData = JSON.parse(localStorage.getItem("favorites"));
    let removeID = currIDs.indexOf(id.toString()); // TODO: broken

    currData.splice(removeID, 1);
    currIDs.splice(removeID, 1);

    localStorage.setItem("favorites", JSON.stringify(currData));
    localStorage.setItem("favoriteIDs", JSON.stringify(currIDs));

    sender = "http://www.gamingas.wz.cz";
    if (window.location.protocol == "file:") sender = "*"; // Allow all if running locally

    window.parent.postMessage(
      ["removing", [currData, currIDs, pos - 1, listName]],
      sender
    );

    generateFaves();
  }
}

var sender = "http://www.gamingas.wz.cz";
if (window.location.protocol == "file:" || window.location.port != "") sender = "*"; // Allow all if running locally

const goToList = (obj, pos) => window.parent.postMessage(["loading", "index.html?id=" + obj.toString(), pos], sender)
const redirectParent = page => window.parent.postMessage(["redirect", page], sender)
const showSaves = type => window.parent.postMessage(["showFaves", type], sender)

function generateList(obj, custElement = ".listContainer", previewType = 1) {
  $(custElement).text("");

  $("#maxPage").text("/" + maxPage);
  obj
    .slice(MAX_ON_PAGE * page, MAX_ON_PAGE * page + MAX_ON_PAGE)
    .forEach((object) => {
      if ([1, 3].includes(previewType)) { // Favorite level
        let darkCol = HEXtoRGB(object[3], 40);
        $(custElement).append(`
          <div class="noMobileResize" id="listPreview" href="#" style="background: rgb(${HEXtoRGB(
          object[3]
        )}); display:flex; border-color: rgb(${darkCol.join(",")});">
              <div style="width: 100%">
                  <p class="uploadText" style="margin: 0;">${object[0]} - ${object[1]
          }</p>
                  <p class="uploadText" style="font-size: 1.8vw; margin: 0;"><u onclick="goToList(${object[4]
          }, ${object[6]})">${object[5]}</u> - ${jsStr["L_LEVID"][LANG]}: ${object[2]}</p>
              </div>
              <div style="${previewType == 3 ? 'display: none;' : ''}">
                  <img class="button" onclick="removeFromList('fav', ${object[2]
          }, $(this), '${object[5]}', ${object[6]
          });" style="width: 4vw" src="images/delete.png">
              </div>
          </div>
          `);
      }
      else if (previewType == 2) { // Recently viewed list / Pinned list
        let lightCol = HEXtoRGB(object[3], -60)
        let darkCol = HEXtoRGB(object[3], 40)
        $(custElement).append(`
          <div id="listPreview" class="button noMobileResize" onclick="redirectParent('/index.html?id=${object[0]}')"
               style="background-image: linear-gradient(39deg, ${object[3]}, rgb(${lightCol.join(",")})); border-color: rgb(${darkCol.join(",")})">
              <div style="width: 100%">
                <div class="boxHeader">
                  <p class="uploadText" style="margin: 0;">${object[1]}</p>
                  <p class="uploadText" style="margin: 0;">${window.parent.window.chatDate(object[4] / 1000)}</p>
                </div>
                  <p class="uploadText" style="font-size: 1.8vw; margin: 0;">- ${object[2]} -</p>
              </div>
          </div>
          `);
      }
      else if (previewType == 4) { // Newest lists
        let level1col = object["data"][1].color
        let lightCol = HEXtoRGB(level1col, -60)
        let darkCol = HEXtoRGB(level1col, 40)
        $(custElement).append(`
          <div id="listPreview" class="button noMobileResize" onclick="redirectParent('/index.html?id=${object["id"]}')"
               style="background-image: linear-gradient(39deg, ${level1col}, rgb(${lightCol.join(",")})); border-color: rgb(${darkCol.join(",")})">
              <div style="width: 100%">
                  <p class="uploadText" style="margin: 0;">${object["name"]}</p>
                  <p class="uploadText" style="font-size: 1.8vw; margin: 0;">- ${object["creator"]} -</p>
              </div>
          </div>
          `);
      }

    });
}

async function makeHomepage() {
  await $.get("../parts/homepage.html", page => {
    $(".listContainer").html(page)

    let recentlyViewed = JSON.parse(decodeURIComponent(getCookie("recentlyViewed")))
    if (recentlyViewed !== false) generateList(recentlyViewed, ".recentlyViewed", 2)

    let pinned = JSON.parse(decodeURIComponent(getCookie("pinnedLists")))
    if (pinned !== false && pinned.length > 0) generateList(pinned, ".pinnedLists", 2)

    let savedLists = JSON.parse(decodeURIComponent(localStorage.getItem("favorites")))
    if (savedLists !== false && savedLists.length > 0) {
      let randomized = []
      let randIndexes = []
      let savedAm = savedLists.length > 4 ? 5 : savedLists.length

      while (randomized.length < savedAm) {
        let randNum = parseInt(Math.random() * savedLists.length)

        if (!randIndexes.includes(randNum)) {
          randomized.push(savedLists[randNum]);
          randIndexes.push(randNum)
        }
      }

      generateList(randomized, ".savedLists", 3)
    }

    let fakeOut = [{"creator":"TAYWAN","name":"TAYWANgay (GaminGasove videa)","data":{"1":{"levelName":"just level 2","creator":"TAYWAN","levelID":"76180123","video":"fM_eaOSqX2g&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=1&ab_channel=GamingasCZ","color":"#8a0000"},"2":{"levelName":"Gamingascz Challenge","creator":"TAYWAN","levelID":"76181192","video":"pU4kA6s0yWM&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=3&ab_channel=GamingasCZ","color":"#ff0000"},"3":{"levelName":"Frontlines","creator":"TAYWAN","levelID":"76181184","video":"FrVw0hB-bII&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=4&ab_channel=GamingasCZ","color":"#010000"},"4":{"levelName":"Gamingas challenge 2","creator":"TAYWAN","levelID":"76182236","video":"FrVw0hB-bII&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=4&ab_channel=GamingasCZ","color":"#050052"},"5":{"levelName":"Unstoppable","creator":"TAYWAN","levelID":"76182248","video":null,"color":"#11ff00"},"6":{"levelName":"Just Level 1","creator":"TAYWAN","levelID":"76191515","video":"VjozzMR44Q8&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=6&ab_channel=GamingasCZ","color":"#610000"},"7":{"levelName":"Maxo Challenge","creator":"TAYWAN","levelID":"76182257","video":"VjozzMR44Q8&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=6&ab_channel=GamingasCZ","color":"#030202"},"8":{"levelName":"Unstoppable 2","creator":"TAYWAN","levelID":"76182251","video":"57yjyH11_60&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=7&ab_channel=GamingasCZ","color":"#00b3ff"},"9":{"levelName":"gamingas challenge 3","creator":"TAYWAN","levelID":"76182245","video":"57yjyH11_60&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=7&ab_channel=GamingasCZ","color":"#16017e"},"10":{"levelName":"MEOW","creator":"TAYWAN","levelID":"76180118","video":"57yjyH11_60&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=7&ab_channel=GamingasCZ","color":"#00fffb"},"11":{"levelName":"Frontlines 2","creator":"TAYWAN","levelID":"76181188","video":"EYWqqm8wr_k&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=9&ab_channel=GamingasCZ","color":"#b30000"},"12":{"levelName":"soboph","creator":"TAYWAN","levelID":"76183755","video":"0rDX97jjt_g&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=11&ab_channel=GamingasCZ","color":"#570000"},"13":{"levelName":"Heartbeat Easy","creator":"TAYWAN","levelID":"76183751","video":"0rDX97jjt_g&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=11&ab_channel=GamingasCZ","color":"#00ff9d"},"14":{"levelName":"GamingSad ","creator":"TAYWAN","levelID":"76187921","video":"KPKrEXmfMxQ&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=13&ab_channel=GamingasCZ","color":"#ffffff"},"15":{"levelName":"Ultra Paracosm easy","creator":"TAYWAN","levelID":"76183768","video":"inTe-o2MsS0&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=14&ab_channel=GamingasCZ","color":"#7b00a8"},"16":{"levelName":"Stronger Layout","creator":"TAYWAN","levelID":"76187924","video":"inTe-o2MsS0&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=14&ab_channel=GamingasCZ","color":"#605c5c"},"17":{"levelName":"gamingas will cry","creator":"TAYWAN","levelID":"76190234","video":"inTe-o2MsS0&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=14&ab_channel=GamingasCZ","color":"#9b0303"},"18":{"levelName":"Gamingas Challenge 5","creator":"TAYWAN","levelID":"76187902","video":"inTe-o2MsS0&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=14&ab_channel=GamingasCZ","color":"#525252"},"19":{"levelName":"Cosmic Galaxy","creator":"TAYWAN","levelID":"76191502","video":"kENXfYsUtzY&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=15&ab_channel=GamingasCZ","color":"#670174"},"20":{"levelName":"Gaming Hell","creator":"TAYWAN","levelID":"76190242","video":"kENXfYsUtzY&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=15&ab_channel=GamingasCZ","color":"#0d0c0c"},"21":{"levelName":"Dream","creator":"TAYWAN","levelID":"76187934","video":"kENXfYsUtzY&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=15&ab_channel=GamingasCZ","color":"#0091ff"},"22":{"levelName":"Sakupen Circles","creator":"TAYWAN","levelID":"76187910","video":"kENXfYsUtzY&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=15&ab_channel=GamingasCZ","color":"#470000"},"23":{"levelName":"just dont ask","creator":"TAYWAN","levelID":"76190226","video":"kENXfYsUtzY&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=15&ab_channel=GamingasCZ","color":"#ff00c8"},"24":{"levelName":"GamingLights","creator":"TAYWAN","levelID":"76190238","video":"ltVNoh53KlU&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=16&ab_channel=GamingasCZ","color":"#ffffff"},"25":{"levelName":"Gamingas Blindfolded","creator":"TAYWAN","levelID":"76190231","video":"ltVNoh53KlU&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=16&ab_channel=GamingasCZ","color":"#00ff2a"},"26":{"levelName":"Gamingas challenge 4","creator":"TAYWAN","levelID":"76183776","video":"ltVNoh53KlU&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=16&ab_channel=GamingasCZ","color":"#110519"},"27":{"levelName":"FNF","creator":"TAYWAN","levelID":"76191508","video":"apxi5fELZlA&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=17&ab_channel=GamingasCZ","color":"#11ff00"},"titleImg":"","pageBGcolor":"#020202"},"id":"75","timestamp":"1638865693","hidden":"0"},{"creator":"Gaminags","name":"Deltarune","data":{"1":{"levelName":"susie","creator":"-","levelID":"61472","video":"xT8ji17S48I","color":"#8e26da"},"2":{"levelName":"kris","creator":"-","levelID":"6543304","video":"LhxzXpN0yDc","color":"#c6e006"},"titleImg":"https:\/\/i.kym-cdn.com\/photos\/images\/facebook\/002\/209\/990\/26a.png","pageBGcolor":"#1a5fb4"},"id":"74","timestamp":"1633023232","hidden":"0"},{"creator":"Adamo CZ","name":"Vysoce epick\u00e9 levely","data":{"1":{"levelName":"vvvvvv","creator":"zejoant","levelID":"70205233","video":null,"color":"#a3a938"},"2":{"levelName":"ReTraY","creator":"DiMaViKuLov26","levelID":"6508283","video":null,"color":"#6a0a84"},"3":{"levelName":"OuterSpace","creator":"Nicki1202","levelID":"27732941","video":null,"color":"#4b2a47"},"4":{"levelName":"Shock","creator":"danolex","levelID":"28225110","video":null,"color":"#c501d7"},"5":{"levelName":"Slozhno LVL","creator":"MaFFaKa","levelID":"70305729","video":null,"color":"#cef1a0"},"6":{"levelName":"Believe","creator":"AceVict","levelID":"28879542","video":null,"color":"#caec18"},"7":{"levelName":"Colorblind","creator":"danolex","levelID":"27961648","video":null,"color":"#8250b7"},"8":{"levelName":"The Creator","creator":"caio2000","levelID":"50007109","video":null,"color":"#a288ab"},"9":{"levelName":"Secrets","creator":"AceVict","levelID":"28648621","video":null,"color":"#31f49d"},"titleImg":""},"id":"64","timestamp":"1625235086","hidden":"0"}]
    generateList(fakeOut, ".newestLists", 4)

    // $.get("/php/getLists.php?homepage=1", data => {
    //   generateList(data, ".newestLists", 4)
    // })
  })
  resizeFrame()
}