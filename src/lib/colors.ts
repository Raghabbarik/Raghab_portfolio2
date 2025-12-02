
export const solidColors = [
  "#000000", "#000080", "#0000FF", "#4169E1", "#87CEFA", "#ADD8E6", "#E0FFFF",
  "#191970", "#483D8B", "#6A5ACD", "#7B68EE", "#9370DB", "#BA55D3", "#DA70D6",
  "#4B0082", "#8A2BE2", "#9400D3", "#9932CC", "#8B008B", "#A020F0", "#DDA0DD",
  "#800080", "#C71585", "#FF1493", "#FF69B4", "#FFB6C1", "#FFC0CB", "#FFE4E1",
  "#8B0000", "#A52A2A", "#B22222", "#CD5C5C", "#F08080", "#FA8072", "#FFA07A",
  "#DC143C", "#FF0000", "#FF4500", "#FF6347", "#FF7F50", "#FF8C00", "#FFA500",
  "#A0522D", "#D2691E", "#CD853F", "#F4A460", "#DEB887", "#FFD700", "#FFFF00",
  "#808000", "#BDB76B", "#ADFF2F", "#7FFF00", "#7CFC00", "#00FF00", "#32CD32",
  "#008000", "#006400", "#2E8B57", "#3CB371", "#66CDAA", "#20B2AA", "#008B8B",
  "#00FFFF", "#00CED1", "#4682B4", "#5F9EA0", "#B0C4DE", "#FFFFFF", "#F5F5F5"
];

/**
 * Converts an HSL color value to HEX. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The HEX representation
 */
function hslToHex(h: number, s: number, l: number) {
  let r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}


/**
 * Converts a hex color string to an HSL string.
 * @param {string} hex - The hex color string (e.g., "#RRGGBB").
 * @returns {string} The HSL color string (e.g., "H S% L%").
 */
export function hexToHslString(hex: string): string {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return "0 0% 0%"; 
  }

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  const hVal = Math.round(h * 360);
  const sVal = Math.round(s * 100);
  const lVal = Math.round(l * 100);
  
  return `${hVal} ${sVal}% ${lVal}%`;
}


/**
 * Converts an HSL string to a hex color string.
 * @param {string} hsl - The HSL color string (e.g., "H S% L%").
 * @returns {string} The hex color string (e.g., "#RRGGBB").
 */
export function hslStringToHex(hsl: string): string {
  const [h, s, l] = hsl.split(" ").map((val, i) => {
    const num = parseFloat(val);
    return i === 0 ? num / 360 : num / 100;
  });

  if (isNaN(h) || isNaN(s) || isNaN(l)) {
    return "#000000";
  }

  return hslToHex(h, s, l);
}
