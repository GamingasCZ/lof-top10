async function makeProfile(username) {
    if ($(".settingsMenu:visible").length > 0) openSettings() // Close settings

    $("title").text(`Profil | ${jsStr["GDLISTS"][LANG]}`)
    await $.get("../parts/profile.html", page => {
        $("#app").append(translateDoc(page, "profiles"))
    })
    $.get("../php/profiles.php", {"user": username}, userData => {
        $("#profileUsername").text(userData.username)
        $("#profileBanner").css("background-image", `url(${userData.profileBanner})`)
        $("#profilePicture").css("background-image", `url(${userData.profilePicture})`)
        
        $(":root").css("--siteBackground", userData.profileColor)

        let hue = getHueFromHEX(userData.profileColor)
        $(":root").css("--greenGradient", `linear-gradient(9deg, hsl(${hue},23.1%,10.2%), hsl(${hue},90.6%,16.7%))`)
    })

    let listInfo = {user: "336373548526469120", searchQuery: "", page: 0, startID: 999999, sort: 0, fetchAmount: 10}
    $.get("../php/getLists.php", listInfo, data => {
        changeUsernames(data, 4)
        homeCards(data[0], "#pLists", 4, 10)
    })
}