const DEFAULT_SATURATION = "100%";
const DEFAULT_LIGHTNESS = "32%";
const DEFAULT_DARK = "28%";

function HEXtoRGB(color, subtract = 0) {
  // Returns an array with RGB values: [255, 128, 59]

  // Is "hexColor" a hex color?
  if (color.length != 7) {
    color = fixHEX(color);
    if (!color) console.log("Parameter is not a hex color code");
  }
  let rgb = [];
  for (i = 1; i < 6; i += 2) {
    rgb.push(parseInt("0x" + color.slice(i, i + 2)) - subtract);
  }

  return rgb;
}

function fixHEX(hexColor) {
  // If the code ends with a number, hex code is sometimes broken (completely random lmao)

  if (hexColor.length == 7) return hexColor; // No need for fix

  let fixed = hexColor.slice(0, -1) + "0" + hexColor.slice(-1);
  if (fixed.length != 7) return false;
  else return fixed;
}

function RGBtoHEX(rgbArray) {
  if (rgbArray.length != 3) {
    throw "RGB array does not have a valid length";
  }

  var hex = [];

  rgbArray.forEach((element) => {
    let inHex = element.toString(16);
    if (inHex.length == 1) {
      inHex = "0" + inHex;
    }
    hex.push(inHex);
  });

  return "#" + hex.join("");
}

function randomColor(darken = false) {
  // Returns an array with HSL values: [255, 128, 59]
  let hsl = [];
  hsl.push(parseInt(Math.random() * 360));
  hsl.push(DEFAULT_SATURATION);
  hsl.push(darken ? DEFAULT_DARK : DEFAULT_LIGHTNESS);
  return HSLtoHEX(...hsl);
}

function getHueFromHEX(color) {
  // Returns a hex color's hue: 54

  // Is "color" a hex color?
  if (color.length != 7) {
    color = fixHEX(color);
    if (!color) console.log("Parameter is not a hex color code");
  }

  let rgb = [];
  for (i = 1; i < 6; i += 2) {
    rgb.push(parseInt("0x" + color.slice(i, i + 2)) / 255);
  }
  var maxCol = Math.max(...rgb);
  var minCol = Math.min(...rgb);

  if (maxCol-minCol == 0) return 0

  if (rgb.indexOf(maxCol) == 0) {
    var hue = (rgb[1] - rgb[2]) / (maxCol - minCol); // Red
  } else if (rgb.indexOf(maxCol) == 1) {
    var hue = 2 + (rgb[2] - rgb[0]) / (maxCol - minCol); // Blue
  } else if (rgb.indexOf(maxCol) == 2) {
    var hue = 4 + (rgb[0] - rgb[1]) / (maxCol - minCol); // Green
  }
  if (hue < 0) {
    hue += 360;
  }
  hue *= 60;

  return hue;
}

function getLightnessFromHEX(color) {
  // Is "color" a hex color?
  if (color.length != 7) {
    color = fixHEX(color);
    if (!color) console.log("Parameter is not a hex color code");
  }

  let rgb = [];
  for (i = 1; i < 6; i += 2) {
    rgb.push(parseInt("0x" + color.slice(i, i + 2)) / 255);
  }

  let max = Math.max(rgb[0], rgb[1], rgb[2]);
  let min = Math.min(rgb[0], rgb[1], rgb[2]);
  let l = (max + min) / 2;

  return Math.round(l * 100);
}

function HSLtoHEX(h, s, l) {
  s = parseInt(s.slice(0, -1));
  l = parseInt(l.slice(0, -1));
  h = parseInt(h);

  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function makeColorElement(startHue, startVal) {
  return $(`
  <div class="colorPicker">
    <img id="sliderImg" src="images/rgb.webp">
    <input type="range" min="0" max="360" value="${startHue}" id="slider">

    <img id="sliderImg" class="hueChanger" src="images/value.webp">
    <input type="range" min="1" max="${DEFAULT_LIGHTNESS.slice(0,2)}" value="${startVal}" id="slider">
  </div>
    `);
}
