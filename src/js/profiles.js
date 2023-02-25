async function makeProfile() {
    $("title").text(`Profil | ${jsStr["GDLISTS"][LANG]}`)
    await $.get("../parts/profile.html", page => {

        $("#app").append(translateDoc(page, "profiles"))
    })
}