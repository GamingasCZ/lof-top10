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
});

function generateFaves() {
  // levelName, levelCreator, levelID, cardCol, listID, listName, listPos, timeAdded
  $("body").text(decodeURIComponent(localStorage.getItem("favorites")))
  window.parent.postMessage("favorites");
}

async function makeHomepage() {
  let hpData = {"recViewed": null, "pinned": null, "favPicks": null, "newest": null};

  let recentlyViewed = JSON.parse(decodeURIComponent(getCookie("recentlyViewed")))
  if (recentlyViewed !== null) hpData.recViewed = recentlyViewed

  let pinned = JSON.parse(decodeURIComponent(getCookie("pinnedLists")))
  if (pinned !== null && pinned.length > 0) hpData.pinned = pinned

  let savedLists = JSON.parse(decodeURIComponent(localStorage.getItem("favorites")))
  if (savedLists != null && savedLists !== false && savedLists.length > 0) {
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

    hpData.favPicks = randomized
  }

  let fakeOut = [{"creator":"TAYWAN","name":"TAYWANgay (GaminGasove videa)","data":{"1":{"levelName":"just level 2","creator":"TAYWAN","levelID":"76180123","video":"fM_eaOSqX2g&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=1&ab_channel=GamingasCZ","color":"#8a0000"},"2":{"levelName":"Gamingascz Challenge","creator":"TAYWAN","levelID":"76181192","video":"pU4kA6s0yWM&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=3&ab_channel=GamingasCZ","color":"#ff0000"},"3":{"levelName":"Frontlines","creator":"TAYWAN","levelID":"76181184","video":"FrVw0hB-bII&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=4&ab_channel=GamingasCZ","color":"#010000"},"4":{"levelName":"Gamingas challenge 2","creator":"TAYWAN","levelID":"76182236","video":"FrVw0hB-bII&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=4&ab_channel=GamingasCZ","color":"#050052"},"5":{"levelName":"Unstoppable","creator":"TAYWAN","levelID":"76182248","video":null,"color":"#11ff00"},"6":{"levelName":"Just Level 1","creator":"TAYWAN","levelID":"76191515","video":"VjozzMR44Q8&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=6&ab_channel=GamingasCZ","color":"#610000"},"7":{"levelName":"Maxo Challenge","creator":"TAYWAN","levelID":"76182257","video":"VjozzMR44Q8&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=6&ab_channel=GamingasCZ","color":"#030202"},"8":{"levelName":"Unstoppable 2","creator":"TAYWAN","levelID":"76182251","video":"57yjyH11_60&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=7&ab_channel=GamingasCZ","color":"#00b3ff"},"9":{"levelName":"gamingas challenge 3","creator":"TAYWAN","levelID":"76182245","video":"57yjyH11_60&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=7&ab_channel=GamingasCZ","color":"#16017e"},"10":{"levelName":"MEOW","creator":"TAYWAN","levelID":"76180118","video":"57yjyH11_60&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=7&ab_channel=GamingasCZ","color":"#00fffb"},"11":{"levelName":"Frontlines 2","creator":"TAYWAN","levelID":"76181188","video":"EYWqqm8wr_k&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=9&ab_channel=GamingasCZ","color":"#b30000"},"12":{"levelName":"soboph","creator":"TAYWAN","levelID":"76183755","video":"0rDX97jjt_g&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=11&ab_channel=GamingasCZ","color":"#570000"},"13":{"levelName":"Heartbeat Easy","creator":"TAYWAN","levelID":"76183751","video":"0rDX97jjt_g&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=11&ab_channel=GamingasCZ","color":"#00ff9d"},"14":{"levelName":"GamingSad ","creator":"TAYWAN","levelID":"76187921","video":"KPKrEXmfMxQ&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=13&ab_channel=GamingasCZ","color":"#ffffff"},"15":{"levelName":"Ultra Paracosm easy","creator":"TAYWAN","levelID":"76183768","video":"inTe-o2MsS0&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=14&ab_channel=GamingasCZ","color":"#7b00a8"},"16":{"levelName":"Stronger Layout","creator":"TAYWAN","levelID":"76187924","video":"inTe-o2MsS0&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=14&ab_channel=GamingasCZ","color":"#605c5c"},"17":{"levelName":"gamingas will cry","creator":"TAYWAN","levelID":"76190234","video":"inTe-o2MsS0&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=14&ab_channel=GamingasCZ","color":"#9b0303"},"18":{"levelName":"Gamingas Challenge 5","creator":"TAYWAN","levelID":"76187902","video":"inTe-o2MsS0&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=14&ab_channel=GamingasCZ","color":"#525252"},"19":{"levelName":"Cosmic Galaxy","creator":"TAYWAN","levelID":"76191502","video":"kENXfYsUtzY&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=15&ab_channel=GamingasCZ","color":"#670174"},"20":{"levelName":"Gaming Hell","creator":"TAYWAN","levelID":"76190242","video":"kENXfYsUtzY&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=15&ab_channel=GamingasCZ","color":"#0d0c0c"},"21":{"levelName":"Dream","creator":"TAYWAN","levelID":"76187934","video":"kENXfYsUtzY&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=15&ab_channel=GamingasCZ","color":"#0091ff"},"22":{"levelName":"Sakupen Circles","creator":"TAYWAN","levelID":"76187910","video":"kENXfYsUtzY&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=15&ab_channel=GamingasCZ","color":"#470000"},"23":{"levelName":"just dont ask","creator":"TAYWAN","levelID":"76190226","video":"kENXfYsUtzY&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=15&ab_channel=GamingasCZ","color":"#ff00c8"},"24":{"levelName":"GamingLights","creator":"TAYWAN","levelID":"76190238","video":"ltVNoh53KlU&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=16&ab_channel=GamingasCZ","color":"#ffffff"},"25":{"levelName":"Gamingas Blindfolded","creator":"TAYWAN","levelID":"76190231","video":"ltVNoh53KlU&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=16&ab_channel=GamingasCZ","color":"#00ff2a"},"26":{"levelName":"Gamingas challenge 4","creator":"TAYWAN","levelID":"76183776","video":"ltVNoh53KlU&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=16&ab_channel=GamingasCZ","color":"#110519"},"27":{"levelName":"FNF","creator":"TAYWAN","levelID":"76191508","video":"apxi5fELZlA&list=PLEMInDX6qdj7EliOfA6laCjMF8X9chEOe&index=17&ab_channel=GamingasCZ","color":"#11ff00"},"titleImg":"","pageBGcolor":"#020202"},"id":"75","timestamp":"1638865693","hidden":"0"},{"creator":"Gaminags","name":"Deltarune","data":{"1":{"levelName":"susie","creator":"-","levelID":"61472","video":"xT8ji17S48I","color":"#8e26da"},"2":{"levelName":"kris","creator":"-","levelID":"6543304","video":"LhxzXpN0yDc","color":"#c6e006"},"titleImg":"https:\/\/i.kym-cdn.com\/photos\/images\/facebook\/002\/209\/990\/26a.png","pageBGcolor":"#1a5fb4"},"id":"74","timestamp":"1633023232","hidden":"0"},{"creator":"Adamo CZ","name":"Vysoce epick\u00e9 levely","data":{"1":{"levelName":"vvvvvv","creator":"zejoant","levelID":"70205233","video":null,"color":"#a3a938"},"2":{"levelName":"ReTraY","creator":"DiMaViKuLov26","levelID":"6508283","video":null,"color":"#6a0a84"},"3":{"levelName":"OuterSpace","creator":"Nicki1202","levelID":"27732941","video":null,"color":"#4b2a47"},"4":{"levelName":"Shock","creator":"danolex","levelID":"28225110","video":null,"color":"#c501d7"},"5":{"levelName":"Slozhno LVL","creator":"MaFFaKa","levelID":"70305729","video":null,"color":"#cef1a0"},"6":{"levelName":"Believe","creator":"AceVict","levelID":"28879542","video":null,"color":"#caec18"},"7":{"levelName":"Colorblind","creator":"danolex","levelID":"27961648","video":null,"color":"#8250b7"},"8":{"levelName":"The Creator","creator":"caio2000","levelID":"50007109","video":null,"color":"#a288ab"},"9":{"levelName":"Secrets","creator":"AceVict","levelID":"28648621","video":null,"color":"#31f49d"},"titleImg":""},"id":"64","timestamp":"1625235086","hidden":"0"}]
  hpData.newest = fakeOut
  $("body").text(JSON.stringify(hpData))

    // $.get("/php/getLists.php?homepage=1", data => {
    //   generateList(data, ".newestLists", 4)
    // })
}
