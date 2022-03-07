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
    if (filteredData.length > 1) {
      let getObject;
      if (filteredData == null)
        getObject = JSON.parse(
          decodeURIComponent(localStorage.getItem("favorites"))
        );
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

  // Prepping for future :O
  if (params["type"] != null && params["type"] == "favorites") {
    currView = "favorites";
    generateFaves();
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
      "<p class='uploadText' style='text-align: center; color: #f9e582'>Zatím nemáš nic v oblíbených!</p>"
    );
  } else {
    if (!sorting) favorites.reverse();

    maxPage = Math.ceil(Object.keys(favorites).length / MAX_ON_PAGE);
    generateList(favorites);
  }
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

    sender = "http://gamingas.wz.cz";
    if (window.location.protocol == "file:") sender = "*"; // Allow all if running locally

    window.parent.postMessage(
      ["removing", [currData, currIDs, pos - 1, listName]],
      sender
    );

    generateFaves();
  }
}

function goToList(obj, pos) {
  let page = "";
  switch (obj) {
    case -2:
      page = "index.html?year=2019";
      break;
    case -3:
      page = "index.html?year=2021";
      break;
    default:
      page = "index.html?id=" + obj.toString();
      break;
  }

  sender = "http://www.gamingas.wz.cz";
  if (window.location.protocol == "file:") sender = "*"; // Allow all if running locally

  window.parent.postMessage(["loading", page, pos], sender);
}

function generateList(obj) {
  $(".listContainer").text("");

  $("#maxPage").text("/" + maxPage);
  obj
    .slice(MAX_ON_PAGE * page, MAX_ON_PAGE * page + MAX_ON_PAGE)
    .forEach((object) => {
      let darkCol = HEXtoRGB(object[3], 40);
      $(".listContainer").append(`
        <div id="listPreview" href="#" style="background: rgb(${HEXtoRGB(
          object[3]
        )}); display:flex; border-color: rgb(${darkCol.join(",")});">
            <div style="width: 100%">
                <p class="uploadText" style="margin: 0;">${object[0]} - ${
        object[1]
      }</p>
                <p class="uploadText" style="font-size: 1.8vw; margin: 0;"><u onclick="goToList(${
                  object[4]
                }, ${object[6]})">${object[5]}</u> - ${jsStr["L_LEVID"][LANG]}: ${object[2]}</p>
            </div>
            <div>
                <img class="button" onclick="removeFromList('fav', ${
                  object[2]
                }, $(this), '${object[5]}', ${
        object[6]
      });" style="width: 4vw" src="images/delete.png">
            </div>
        </div>
        `);
    });
}
