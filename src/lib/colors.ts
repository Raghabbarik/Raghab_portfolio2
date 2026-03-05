
export const colorPalette = [
  // Blues
  { name: "Navy", hex: "#000080" },
  { name: "Dark Blue", hex: "#00008B" },
  { name: "Medium Blue", hex: "#0000CD" },
  { name: "Blue", hex: "#0000FF" },
  { name: "Royal Blue", hex: "#4169E1" },
  { name: "Light Sky Blue", hex: "#87CEFA" },

  // Purples
  { name: "Indigo", hex: "#4B0082" },
  { name: "Blue Violet", hex: "#8A2BE2" },
  { name: "Dark Violet", hex: "#9400D3" },
  { name: "Medium Orchid", hex: "#BA55D3" },
  { name: "Purple", hex: "#A020F0" },
  { name: "Plum", hex: "#DDA0DD" },

  // Pinks & Magentas
  { name: "Medium Violet Red", hex: "#C71585" },
  { name: "Deep Pink", hex: "#FF1493" },
  { name: "Hot Pink", hex: "#FF69B4" },
  { name: "Light Pink", hex: "#FFB6C1" },
  { name: "Pink", hex: "#FFC0CB" },
  { name: "Misty Rose", hex: "#FFE4E1" },

  // Reds
  { name: "Dark Red", hex: "#8B0000" },
  { name: "Firebrick", hex: "#B22222" },
  { name: "Crimson", hex: "#DC143C" },
  { name: "Red", hex: "#FF0000" },
  { name: "Tomato", hex: "#FF6347" },
  { name: "Salmon", hex: "#FA8072" },

  // Oranges
  { name: "Orange Red", hex: "#FF4500" },
  { name: "Coral", hex: "#FF7F50" },
  { name: "Dark Orange", hex: "#FF8C00" },
  { name: "Orange", hex: "#FFA500" },
  { name: "Sandy Brown", hex: "#F4A460" },
  { name: "Light Salmon", hex: "#FFA07A" },
  
  // Yellows
  { name: "Gold", hex: "#FFD700" },
  { name: "Yellow", hex: "#FFFF00" },
  { name: "Light Yellow", hex: "#FFFFE0" },
  { name: "Khaki", hex: "#F0E68C" },
  { name: "Pale Goldenrod", hex: "#EEE8AA" },
  { name: "Moccasin", hex: "#FFE4B5" },

  // Greens
  { name: "Dark Olive Green", hex: "#556B2F" },
  { name: "Olive Drab", hex: "#6B8E23" },
  { name: "Yellow Green", hex: "#9ACD32" },
  { name: "Lime Green", hex: "#32CD32" },
  { name: "Spring Green", hex: "#00FF7F" },
  { name: "Light Green", hex: "#90EE90" },
  
  // Cyans
  { name: "Teal", hex: "#008080" },
  { name: "Dark Cyan", hex: "#008B8B" },
  { name: "Light Sea Green", hex: "#20B2AA" },
  { name: "Cyan", hex: "#00FFFF" },
  { name: "Aquamarine", hex: "#7FFFD4" },
  { name: "Pale Turquoise", hex: "#AFEEEE" },
  
  // Grays
  { name: "Black", hex: "#000000" },
  { name: "Dim Gray", hex: "#696969" },
  { name: "Gray", hex: "#808080" },
  { name: "Dark Gray", hex: "#A9A9A9" },
  { name: "Silver", hex: "#C0C0C0" },
  { name: "White", hex: "#FFFFFF" },
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
