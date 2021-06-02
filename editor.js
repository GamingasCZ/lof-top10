
function checkJson(data) {
    try {
        JSON.parse(data);
        $(".errorBox").text("Všechno je v pořádku!");
        $(".errorBox").css("background-color","rgba(73, 255, 103, 0.8)");
    } catch (error) {
        $(".errorBox").css("background-color","rgba(255, 73, 73, 0.8)");

        if (data == "") {
            $(".errorBox").text("Nic jsi nezadal... :D");
        }
        else {
            $(".errorBox").text(error);
        }
    }
}

$(function() {
    $(".smallUploaderDialog").hide();
})

function hideUploader() {
    $(".uploaderDialog").hide();
    $(".smallUploaderDialog").show();
}
function showUploader() {
    $(".uploaderDialog").show();
    $(".smallUploaderDialog").hide();
}