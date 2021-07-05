//Holba buenas hyperhackeře :D. Nyní sleduješ můj hrozný kód :).

function checkJson(data) {
    $(".errorBox").css("padding", "1% 0.5%");
    try {
        // Kontrola názvů atd.
        let invalidNames = ["Gamingas", "GamingasCZ"];

        let listName = $("#listnm").val();
        let listCreator = $("#creatornm").val();

        if (listName.length < 3) { throw ("Jméno tvého seznamu by mělo být delší :)."); }
        if (listName.length > 40) { throw ("Jméno tvého seznamu je delší, než doba, kterou mi trvá zeditovat video :D."); }

        if (listCreator.length < 3) { throw ("Tvé jméno by mělo být delší :)."); }
        if (listCreator.length > 20) { throw ("Lidi musí psat slohovky, aby tě oslovili :D?"); }
        if (listCreator.toLowerCase().includes("gamingas")) { throw ("Nikdy nebudeš Gamingasem :)."); }

        // 1/3 Je to vůbec JSON?
        var parsedData = JSON.parse(data);
        $(".errorBox").text("Všechno je v pořádku!");
        $(".errorBox").css("background-color", "rgba(73, 255, 103, 0.8)");

        // 2/3 Neobsahuje prázdné jméno/tvůrce
        for (i = 1; i < Object.keys(parsedData).length; i++) {
            if (parsedData[i] == undefined) {
                throw (i + ". místo neexistuje. Bug mi nahlaš (nebo si nehrej s JSONem :D).")
            }
            if (parsedData[i]["levelName"] == "") {
                throw ("Level na " + i + ". místě nemá JMÉNO!")
            }
            if (parsedData[i]["creator"] == "") {
                throw ("Level na " + i + ". místě nemá TVŮRCE!")
            }
        }
        return true;
    }
    catch (error) {
        $(".errorBox").css("background-color", "rgba(255, 73, 73, 0.8)");

        if (data == "") {
            $(".errorBox").text("Nic jsi nezadal... :D");
        }
        else {
            $(".errorBox").text(error);
        }
        return false
    }
}

var page = 0;
var maxPage = 0;
function displayComLists(data) {
    // Zbavení se line breaku
    data = data.slice(0, -2);

    $(".customLists").children().remove()

    try {
        if (data.match(/\|/g).length > 0) {
            let listsArray = data.split("|");
            maxPage = listsArray.length/4;
            $("#maxPage").text("/" + maxPage);
            if (sorting) {
                listsArray.reverse()
            }

            for (i = 4 * page; i < 4 * page + 4; i++) {
                let listData = (listsArray[i]).split(";");
                let listColor = JSON.parse(listData[2])["1"]["color"]
                let rgb = [];
                for (j = 1; j < 6; j += 2) {
                    rgb.push(parseInt("0x" + listColor.slice(j, j + 2)) - 40);
                }
                $(".customLists").append(`
        <a style="text-decoration: none;" href="http://www.gamingas.wz.cz/lofttop10/index.html?id=${listData[3]}">
            <div id="listPreview" class="button" style="background-color: ${listColor}; border-color: rgb(${rgb.join(",")})">
                <div class="uploadText">${listData[1]}</div>
                <div class="uploadText">Od: ${listData[0]}</div>
            </div>
        </a>
                `);
            }
        }
        else {
            throw ("ok");
        }
    }

    catch (error) {
        if (data.match(/\|/g) == null || data.endsWith("|\n")) {
            let listData = (data).split(";");
            $(".customLists").append(`
        <a style="text-decoration: none;" href="http://www.gamingas.wz.cz/lofttop10/index.html?id=${listData[3]}">
        <div id="listPreview" class="button">
            <div class="uploadText">${listData[1]}</div>
            <div class="uploadText">Od: ${listData[0]}</div>
        </div>
    </a>
                `);
        }

    }
}

function uploadList() {
    let isValid = checkJson(JSON.stringify(levelList));
    if (isValid) {
        $("#listData").attr("value", JSON.stringify(levelList));
        $("#levelUpload").submit();
    }
}
function updateList() {
    let isValid = checkJson(JSON.stringify(levelList));
    if (isValid) {
        // will later also update uploadList()
        let data = location.search.slice(1).split(/[=&]/g);
        let postData = {
            "listData": JSON.stringify(levelList),
            "id": data[1],
            "pwdEntered": data[3]
        }
        $.post("./php/updateList.php", postData, function (data) {
            let updateData = data.split(";")
            window.location.replace(`http://www.gamingas.wz.cz/lofttop10/upload.html?update=1`);
        })
    }
}

var deeta = 'GamingasCZ;Nejtezsi Harder levely (test);{"1":{"levelName":"GoodDeath","creator":"Sangrado","levelID":"13406180","video":"gRN2rZoyW_w","color":"#e9848f"},"2":{"levelName":"Skyless epic","creator":"Glittershroom","levelID":"3660426","video":"qF8a5j17pos","color":"#d98600"},"3":{"levelName":"Choleric","creator":"Reddmi","levelID":"10978740","video":"4Byhuz4Prxk","color":"#3be88e"},"4":{"levelName":"The Three pillars","creator":"Renato","levelID":"13610020","video":"v9P6OfZsmL8","color":"#ddda3"},"5":{"levelName":"Hazy Blood","creator":"LunarSimg","levelID":"4098621","video":"dEF2cKsdX18","color":"#9f5969"},"6":{"levelName":"Graveyard","creator":"Oskux","levelID":"9658095","video":"R6BpbOt914E","color":"#e9ce7"},"7":{"levelName":"Greetech","creator":"Ellixium","levelID":"14878613","video":"v_JKUEOcQhM","color":"#333250"},"8":{"levelName":"Superior Sequence","creator":"Pennutoh","levelID":"16638282","video":"LO_YbqBZXAI","color":"#8a16cf"},"9":{"levelName":"Factory Realm X","creator":"HelpegasuS","levelID":"37792861","video":"uf9J5LLywFM","color":"#fa886"},"10":{"levelName":"Overture","creator":"Fault","levelID":"28200611","video":"jUweQ2MyssQ","color":"#3b63d8"},"11":{"levelName":"Meowterdash","creator":"Elias1277","levelID":"29708611","video":"u3o4RooKEvU","color":"#e0959b"},"12":{"levelName":"Cant Hold On","creator":"OmegaFalcon","levelID":"9286121","video":"BwuGiPIATm8","color":"#2946b9"},"13":{"levelName":"Eighto Circles","creator":"Bamkii","levelID":"10155484","video":"IlgqFcl2q1o","color":"#c59bd0"},"14":{"levelName":"i love cereal copy","creator":"eh79m7pmpifv","levelID":"27095916","video":"dC-ar_kOIHY","color":"#2d383b"},"15":{"levelName":"Invisible Castle","creator":"LazerBlitz","levelID":"8103488","video":"SA3S5-TB4kI","color":"#f9d72"},"16":{"levelName":"Cosmic Ray","creator":"Rabbitical","levelID":"9197882","video":"sLsiL11U9nA","color":"#39539"},"17":{"levelName":"Sacred Sanctuary","creator":"LunarSimg","levelID":"4496570","video":"15FS3pJKUl0","color":"#8ece8"},"18":{"levelName":"Moonlights","creator":"Alkatraz","levelID":"40149755","video":"o9BmI2hOOCI","color":"#1fde61"},"19":{"levelName":"Monsterbreaks","creator":"Sandstorm","levelID":"5558081","video":"TgOxjbEvehg","color":"#4211c2"},"20":{"levelName":"BuTiTi II","creator":"JonathanGD","levelID":"37259527","video":"nfPPM6ntKdk","color":"#10e028"},"21":{"levelName":"Color Swing","creator":"Mazl","levelID":"13561388","video":"MDAIxdkCswA","color":"#8e743"},"22":{"levelName":"Summer Ends","creator":"Noriega","levelID":"10983188","video":"jl4W9bDR0o8","color":"#b1f46"},"23":{"levelName":"Flock","creator":"Usermatt18","levelID":"25602300","video":"Eefy9LAUR5c","color":"#602172"},"24":{"levelName":"deception time ","creator":"Zafkiel7","levelID":"34283857","video":"EhUmFjcxRdk","color":"#dc964d"},"25":{"levelName":"Veld","creator":"Dorami","levelID":"40786246","video":"rSxOJUcmTEM","color":"#bd9d31"},"titleImg":"https://i.imgur.com/7GEIEF5.png"};45;10|Geo;Nejlepší Geo Levely - fixed;{"1":{"levelName":"Calm Blue","creator":"PlayerGeoCZ","levelID":"70205309","video":null,"color":"#47dee1"},"2":{"levelName":"D e s e r t","creator":"PlayerGeoCZ","levelID":"56179232","video":"OJl6WIf-qGA&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=33","color":"#eaec65"},"3":{"levelName":"danzboi","creator":"PlayerGeoCZ","levelID":"65325988","video":"-aYFb6mtrvY&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=6","color":"#4973c1"},"4":{"levelName":"soul knight","creator":"PlayerGeoCZ","levelID":"56520384","video":"jWRDza771Kc&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=24","color":"#8a775c"},"5":{"levelName":"One","creator":"playergeoCZ","levelID":"59969231","video":"MuyBrgYun28&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=19","color":"#73afd4"},"6":{"levelName":"three","creator":"playergeoCZ","levelID":"59969237","video":"MuyBrgYun28&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=19","color":"#ababab"},"7":{"levelName":"Two","creator":"playergeoCZ","levelID":"59969235","video":"MuyBrgYun28&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=19","color":"#2df072"},"8":{"levelName":"four","creator":"playergeoCZ","levelID":"59969241","video":"MuyBrgYun28&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=19","color":"#d541d8"},"9":{"levelName":"rainbow travel","creator":"playergeoCZ","levelID":"55029144","video":"2aTjl_8T9Fw&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=41","color":"#d3cfcf"},"10":{"levelName":"future funk","creator":"playergeoCZ","levelID":"52823230","video":"ljaAtxqcngg&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=48","color":"#ff05d5"},"titleImg":""};57;1624884163|Geo;Nejlepší Geo Levely - fixed;{"1":{"levelName":"Calm Blue","creator":"PlayerGeoCZ","levelID":"70205309","video":null,"color":"#47dee1"},"2":{"levelName":"D e s e r t","creator":"PlayerGeoCZ","levelID":"56179232","video":"OJl6WIf-qGA&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=33","color":"#eaec65"},"3":{"levelName":"danzboi","creator":"PlayerGeoCZ","levelID":"65325988","video":"-aYFb6mtrvY&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=6","color":"#4973c1"},"4":{"levelName":"soul knight","creator":"PlayerGeoCZ","levelID":"56520384","video":"jWRDza771Kc&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=24","color":"#8a775c"},"5":{"levelName":"One","creator":"playergeoCZ","levelID":"59969231","video":"MuyBrgYun28&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=19","color":"#73afd4"},"6":{"levelName":"three","creator":"playergeoCZ","levelID":"59969237","video":"MuyBrgYun28&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=19","color":"#ababab"},"7":{"levelName":"Two","creator":"playergeoCZ","levelID":"59969235","video":"MuyBrgYun28&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=19","color":"#2df072"},"8":{"levelName":"four","creator":"playergeoCZ","levelID":"59969241","video":"MuyBrgYun28&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=19","color":"#d541d8"},"9":{"levelName":"rainbow travel","creator":"playergeoCZ","levelID":"55029144","video":"2aTjl_8T9Fw&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=41","color":"#d3cfcf"},"10":{"levelName":"future funk","creator":"playergeoCZ","levelID":"52823230","video":"ljaAtxqcngg&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=48","color":"#ff05d5"},"titleImg":""};57;1624884163|Geo;Nejlepší Geo Levely - fixed;{"1":{"levelName":"Calm Blue","creator":"PlayerGeoCZ","levelID":"70205309","video":null,"color":"#47dee1"},"2":{"levelName":"D e s e r t","creator":"PlayerGeoCZ","levelID":"56179232","video":"OJl6WIf-qGA&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=33","color":"#eaec65"},"3":{"levelName":"danzboi","creator":"PlayerGeoCZ","levelID":"65325988","video":"-aYFb6mtrvY&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=6","color":"#4973c1"},"4":{"levelName":"soul knight","creator":"PlayerGeoCZ","levelID":"56520384","video":"jWRDza771Kc&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=24","color":"#8a775c"},"5":{"levelName":"One","creator":"playergeoCZ","levelID":"59969231","video":"MuyBrgYun28&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=19","color":"#73afd4"},"6":{"levelName":"three","creator":"playergeoCZ","levelID":"59969237","video":"MuyBrgYun28&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=19","color":"#ababab"},"7":{"levelName":"Two","creator":"playergeoCZ","levelID":"59969235","video":"MuyBrgYun28&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=19","color":"#2df072"},"8":{"levelName":"four","creator":"playergeoCZ","levelID":"59969241","video":"MuyBrgYun28&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=19","color":"#d541d8"},"9":{"levelName":"rainbow travel","creator":"playergeoCZ","levelID":"55029144","video":"2aTjl_8T9Fw&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=41","color":"#d3cfcf"},"10":{"levelName":"future funk","creator":"playergeoCZ","levelID":"52823230","video":"ljaAtxqcngg&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=48","color":"#ff05d5"},"titleImg":""};57;1624884163|Geo;Nejlepší Geo Levely - fixed;{"1":{"levelName":"Calm Blue","creator":"PlayerGeoCZ","levelID":"70205309","video":null,"color":"#47dee1"},"2":{"levelName":"D e s e r t","creator":"PlayerGeoCZ","levelID":"56179232","video":"OJl6WIf-qGA&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=33","color":"#eaec65"},"3":{"levelName":"danzboi","creator":"PlayerGeoCZ","levelID":"65325988","video":"-aYFb6mtrvY&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=6","color":"#4973c1"},"4":{"levelName":"soul knight","creator":"PlayerGeoCZ","levelID":"56520384","video":"jWRDza771Kc&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=24","color":"#8a775c"},"5":{"levelName":"One","creator":"playergeoCZ","levelID":"59969231","video":"MuyBrgYun28&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=19","color":"#73afd4"},"6":{"levelName":"three","creator":"playergeoCZ","levelID":"59969237","video":"MuyBrgYun28&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=19","color":"#ababab"},"7":{"levelName":"Two","creator":"playergeoCZ","levelID":"59969235","video":"MuyBrgYun28&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=19","color":"#2df072"},"8":{"levelName":"four","creator":"playergeoCZ","levelID":"59969241","video":"MuyBrgYun28&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=19","color":"#d541d8"},"9":{"levelName":"rainbow travel","creator":"playergeoCZ","levelID":"55029144","video":"2aTjl_8T9Fw&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=41","color":"#d3cfcf"},"10":{"levelName":"future funk","creator":"playergeoCZ","levelID":"52823230","video":"ljaAtxqcngg&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=48","color":"#ff05d5"},"titleImg":""};57;1624884163|Geo;Nejlepší Geo Levely - fixed;{"1":{"levelName":"Calm Blue","creator":"PlayerGeoCZ","levelID":"70205309","video":null,"color":"#47dee1"},"2":{"levelName":"D e s e r t","creator":"PlayerGeoCZ","levelID":"56179232","video":"OJl6WIf-qGA&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=33","color":"#eaec65"},"3":{"levelName":"danzboi","creator":"PlayerGeoCZ","levelID":"65325988","video":"-aYFb6mtrvY&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=6","color":"#4973c1"},"4":{"levelName":"soul knight","creator":"PlayerGeoCZ","levelID":"56520384","video":"jWRDza771Kc&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=24","color":"#8a775c"},"5":{"levelName":"One","creator":"playergeoCZ","levelID":"59969231","video":"MuyBrgYun28&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=19","color":"#73afd4"},"6":{"levelName":"three","creator":"playergeoCZ","levelID":"59969237","video":"MuyBrgYun28&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=19","color":"#ababab"},"7":{"levelName":"Two","creator":"playergeoCZ","levelID":"59969235","video":"MuyBrgYun28&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=19","color":"#2df072"},"8":{"levelName":"four","creator":"playergeoCZ","levelID":"59969241","video":"MuyBrgYun28&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=19","color":"#d541d8"},"9":{"levelName":"rainbow travel","creator":"playergeoCZ","levelID":"55029144","video":"2aTjl_8T9Fw&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=41","color":"#d3cfcf"},"10":{"levelName":"future funk","creator":"playergeoCZ","levelID":"52823230","video":"ljaAtxqcngg&list=PLZbWLxzXxPi7AkZbd1EQ8w2Yp-YOb0B5d&index=48","color":"#ff05d5"},"titleImg":""};57;1624884163|GamingasCZ;Recent levely;{"1":{"levelName":"sky","creator":"GamingX54E30C4F","levelID":null,"video":null,"color":"#d9e55f"},"2":{"levelName":"unnamed 1","creator":"Tortic123","levelID":null,"video":null,"color":"#86d34e"},"3":{"levelName":"Wait What","creator":"itzCobraGD","levelID":null,"video":null,"color":"#c10a04"},"4":{"levelName":"retro way","creator":"Tem4ikggrp228","levelID":null,"video":null,"color":"#7ad841"},"5":{"levelName":"easy challenge","creator":"SmOkeF1re","levelID":null,"video":null,"color":"#6fbda6"},"6":{"levelName":"Dok","creator":"BeanBoii","levelID":null,"video":null,"color":"#4d74d4"},"7":{"levelName":"coins","creator":"Atom1222","levelID":null,"video":null,"color":"#d70219"},"8":{"levelName":"just a test","creator":"AvaneeshJ","levelID":null,"video":null,"color":"#67df44"},"9":{"levelName":"eto ne bloodbath","creator":"nnBeNZInnn","levelID":null,"video":null,"color":"#d421b5"},"10":{"levelName":"my test level 1","creator":"pippisika228","levelID":null,"video":null,"color":"#a34e25"},"11":{"levelName":"The Nightauto LVL","creator":"Norton7c","levelID":null,"video":null,"color":"#66a816"},"12":{"levelName":"chellenge fan","creator":"piterskiy1","levelID":"","video":null,"color":"#0b6bd4"},"13":{"levelName":"pro","creator":"LaiderGames","levelID":null,"video":null,"color":"#f03d6f"},"14":{"levelName":"gg you","creator":"Trustyyyyy","levelID":null,"video":null,"color":"#913e8e"},"15":{"levelName":"unnamed 1","creator":"kokichi31","levelID":null,"video":null,"color":"#7f9ce1"},"16":{"levelName":"jump jump","creator":"killpitalih","levelID":"","video":null,"color":"#74eb08"},"17":{"levelName":"Tartarus","creator":"Freedom33310","levelID":null,"video":null,"color":"#ce3b13"},"18":{"levelName":"hard challenge","creator":"Reyzer32012","levelID":null,"video":null,"color":"#87f47f"},"19":{"levelName":"loh","creator":"Sosikab0ss","levelID":null,"video":null,"color":"#c700df"},"20":{"levelName":"michigun challenge2","creator":"dim0chkaGD","levelID":null,"video":null,"color":"#3d5140"},"titleImg":""};61;1625129628|Adamo CZ;Vysoce epické levely;{"1":{"levelName":"vvvvvv","creator":"zejoant","levelID":"70205233","video":null,"color":"#a3a938"},"2":{"levelName":"ReTraY","creator":"DiMaViKuLov26","levelID":"6508283","video":null,"color":"#6a0a84"},"3":{"levelName":"OuterSpace","creator":"Nicki1202","levelID":"27732941","video":null,"color":"#4b2a47"},"4":{"levelName":"Shock","creator":"danolex","levelID":"28225110","video":null,"color":"#c501d7"},"5":{"levelName":"Slozhno LVL","creator":"MaFFaKa","levelID":"70305729","video":null,"color":"#cef1a0"},"6":{"levelName":"Believe","creator":"AceVict","levelID":"28879542","video":null,"color":"#caec18"},"7":{"levelName":"Colorblind","creator":"danolex","levelID":"27961648","video":null,"color":"#8250b7"},"8":{"levelName":"The Creator","creator":"caio2000","levelID":"50007109","video":null,"color":"#a288ab"},"9":{"levelName":"Secrets","creator":"AceVict","levelID":"28648621","video":null,"color":"#31f49d"},"titleImg":""};64;1625235086|'
var sorting = false;
$(function () {
    // Sort button action
    $("#sortBut").on("click", function () {
        if (sorting) {
            $("#sortBut").css("transform", "scaleY(1)");
            $("#sortBut").attr("title", "Nejnovější")
        }
        else {
            $("#sortBut").css("transform", "scaleY(-1)");
            $("#sortBut").attr("title", "Nejstarší")
        }
        sorting = !sorting

        var commLists = $(".customLists").children()
        for (i = 0; i < commLists.length; i++) {
            $(commLists[i]).before(commLists[i + 1]);
        }
        commLists = $(".customLists").children()
    })

    if (location.search != "") {
        let password = location.search.slice(1).split(/[=&]/g);

        if (password[0] == "edit" & password[2] == "pass") {
            generateFromJSON()
        }
        else if (password[0] == "update") {

            $(".uploaderDialog").html(`
            <img style="padding-left: 3%" src=./images/check.png>
            <p class="uploadText" style="padding: 0 3% 0 3%">Seznam byl aktualizovan!</p>

            </div>
            </div>
            
            `);
        }
        else {
            // Change depending on your website
            let currWebsite = `http://gamingas.wz.cz/lofttop10/?id=${password[3]}`;

            if (isNaN(parseInt(password[1]))) {
                var pstr = `Tvé heslo je ale hypergay. <b style="color: tomato;">Nehraj si se stránkou >:(</b>.`;
            }
            else {
                var pstr = `Schovej si heslo, protože pomocí neho mužeš upravit/smazat seznam!: <b style="color: lime;">${password[1]}</b>`;
            }

            $(".uploaderDialog").html(`
<img style="padding-left: 3%" src=./images/check.png>
<p class="uploadText" style="padding: 0 3% 0 3%">Seznam byl nahran! ${pstr}</p>

<div style="margin-top: 5%;">
<h6 class="shareTitle uploadText">Sdílet</h6>
<div class="shareBG uploadText" style="float: none;">${currWebsite}
<img class="button shareBut" src="./images/openList.png" onclick="window.open('${currWebsite}','_blank')">
</div>
</div>

`);
        }
    }

    $(".smallUploaderDialog").hide();

    //Get rid of this!!! testing :D
    displayComLists(deeta);
    $.get("./php/getLists.php", function (data) {
        displayComLists(data);
    });

    // Mobile optimzations
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        $(".uploadBG").css("margin", "0")
        $(".uploadBG").css("border", "none")
        $("body").css("margin", "0")
    }
})

function hideUploader() {
    $(".uploaderDialog").hide();
    $(".smallUploaderDialog").show();
}
function showUploader() {
    $(".uploaderDialog").show()
    $(".smallUploaderDialog").hide();
}


function closeRmScreen() {
    $(".removeScreen").fadeOut(100)
    $(".boom").animate({ "opacity": 0 }, 500, function () {
        $(".boom").css("background-color", "white")
        $(".boom").css("display", "none")
        $(".removeScreen").remove()
    })
}
function confirmDelete() {
    closeRmScreen()
    setInterval(function () {
        let data = location.search.slice(1).split(/[=&]/g);
        let postData = {
            "id": data[1],
            "pwdEntered": data[3]
        }
        murderList();
        $.post("./php/removeList.php", postData, function (data) {
            murderList();
        })
    }, 600)
}

function removeList() {
    // Confirm remove
    $(".boom").append(`<div class="uploadText removeScreen">
    <img id="rmimg1" class="removeImg" style="width: 23%;" src="./images/szn2.png"><br />
    <img id="rmimg2" class="removeImg" style="width: 23%; margin-top: -1.64em;" src="./images/szn1.png">
    <p id="removeText" style="display: none; text-align: center; font-size: 4vw;">Opravdu chces smazat svuj seznam?</p>
    <div style="display:flex; flex-direction: row; justify-content: center; opacity:0" class="rmButSet">
        <img id="rmbutton" onclick="confirmDelete()" class="button" src="./images/yeees.png">
        <img id="rmbutton" onclick="closeRmScreen()" class="button" src="./images/ne.png">
    <div>
    </div>`);

    $(".boom").css("background-color", "black");
    $(".boom").css("display", "initial");
    $(".boom").animate({ "opacity": 1 }, 500, function () {
        $("#removeText").fadeIn(2000);
        $(".rmButSet").animate({ "opacity": 1 }, 2000);
    })

    $("#rmbutton").on("mouseover", function () {
        $("#rmimg1").css("transform", "translateY(-10%)");
        $("#rmimg2").css("transform", "translateY(10%)");
        $(".boom").css("background-color", "rgb(11, 0, 0)");
    })
    $("#rmbutton").on("mouseout", function () {
        $("#rmimg1").css("transform", "translateY(0%)");
        $("#rmimg2").css("transform", "translateY(0%)");
        $(".boom").css("background-color", "rgb(0, 0, 0)");
    })
}
function murderList() {
    $(".boom").css("display", "initial");

    $(".boom").animate({ "opacity": 1 }, 2000, () => window.location.replace("./upload.html"));
    $("#levelUpload").addClass("killList");
}

function pageSwitch(num) {
    if (page + num < 0) {
        page = 0
    }
    else if (page + num > maxPage - 1) {
        page = maxPage-1;
    }
    else {
        page += num;
        $("#pageSwitcher").val(page+1);
        displayComLists(deeta);
    }
}

function search() {
    let query = $("#searchBar").val()
    if (query == "") {
        // Reset stuff
        $.get("./php/getLists.php", function (data) {
            displayComLists(data);
        });
    }
    else {
        // Searching
        $.get(`./php/getLists.php?search=${query}`, function (data) {
            displayComLists(data)
        })
    }
}