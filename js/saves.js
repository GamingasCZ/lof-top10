$(function () {

  let paramGetter = new URLSearchParams(window.location.search);
  let params = Object.fromEntries(paramGetter.entries());

  // Sets save page localStorage when faving a level
  window.addEventListener("message", (mess) => {
    if (mess.data[0] == "remove") {
      let faves = JSON.parse(localStorage.getItem("favorites"))
      let faveIDs = JSON.parse(localStorage.getItem("favoriteIDs"))
      let levelIndex = faveIDs.indexOf(mess.data[1].toString())

      let objDeleted = faves[levelIndex]

      faves.splice(levelIndex, 1)
      faveIDs.splice(levelIndex, 1)

      localStorage.setItem("favorites", JSON.stringify(faves));
      localStorage.setItem("favoriteIDs", JSON.stringify(faveIDs));

      window.parent.postMessage(["removed", faves, objDeleted])
    }
  });

  // Prepping for future :O (future me - thanks!)
  if (params["type"] == "fetchFaves" || params["type"] == "favorites") {
    generateFaves(params["type"]);
  }
  else if (params["type"] == "homepage") {
    $(".savedTitle").remove()
    $(".searchTools").remove()
    makeHomepage()
  } 
});

function generateFaves(type) {
  // levelName, levelCreator, levelID, cardCol, listID, listName, listPos, timeAdded
  data = decodeURIComponent(localStorage.getItem("favorites"))

  $(".fetcher").text(data)
  window.parent.postMessage(type);
}

function removeFromList(id) {
	// Remove level
	let currIDs = JSON.parse(localStorage.getItem("favoriteIDs"));
	let currData = JSON.parse(localStorage.getItem("favorites"));
	let removeID = currIDs.indexOf(id.toString()); // TODO: broken

	currData.splice(removeID, 1);
	currIDs.splice(removeID, 1);

	localStorage.setItem("favorites", JSON.stringify(currData));
	localStorage.setItem("favoriteIDs", JSON.stringify(currIDs));

	window.parent.postMessage("refreshList");
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

  await $.get("./php/getLists.php?homepage=1", data => {
    hpData.newest = data
  })
  
  $(".fetcher").text(JSON.stringify(hpData))
  window.parent.postMessage("homepage");


}
