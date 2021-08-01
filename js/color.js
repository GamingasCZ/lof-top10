function HEXtoRGB(color, subtract = 0) {
    // Returns an array with RGB values: [255, 128, 59]

    // Is "hexColor" a hex color?
    if (color.length != 7) {
        throw "Parameter is not a hex color code";
    }
    let rgb = [];
    for (i = 1; i < 6; i += 2) {
        rgb.push(parseInt("0x" + color.slice(i, i + 2)) - subtract);
    }

    return rgb

}

function RGBtoHEX(rgbArray) {
    if (rgbArray.length != 3) {
        throw "RGB array does not have a valid length";
    }

    var hex = []

    rgbArray.forEach(element => {
        let inHex = (element).toString(16);
        if (inHex.length == 1) {
            inHex = "0"+inHex;
        }
        hex.push(inHex)
    });

    return "#"+hex.join("")
}

function randomColor() {
    // Returns an array with RGB values: [255, 128, 59]
    let rgb = [];
    for (i = 0; i < 3; i++) {
        rgb.push(parseInt(Math.random() * 255));
    }
    return rgb
}

function getHueFromHEX(color) {
    // Returns a hex color's hue: 54

    // Is "color" a hex color?
    if (color.length != 7) {
        throw "Parameter is not a hex color code";
    }

    let rgb = [];
    for (i = 1; i < 6; i += 2) {
        rgb.push(parseInt("0x" + color.slice(i, i + 2))/255);
    }
    var maxCol = Math.max(...rgb);
    var minCol = Math.min(...rgb);

    if (rgb.indexOf(maxCol) == 0) {
        var hue = (rgb[1]-rgb[2])/(maxCol-minCol); // Red
    }
    else if (rgb.indexOf(maxCol) == 1) {
        var hue = 2+(rgb[2]-rgb[0])/(maxCol-minCol); // Blue
    }
    else if (rgb.indexOf(maxCol) == 2) {
        var hue = 4+(rgb[0]-rgb[1])/(maxCol-minCol); // Green
    }
    if (hue < 0) { hue += 360 }
    hue *= 60;

    return hue
}