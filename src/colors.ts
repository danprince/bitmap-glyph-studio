export function parseColor(color: string) {
  color = color.toLowerCase();

  let r = 0;
  let g = 0;
  let b = 0;
  let a = 1;

  switch (true) {
    // #RGB
    case color[0] === "#" && color.length === 4: {
      r = parseInt(color[1] + color[1], 16);
      g = parseInt(color[2] + color[2], 16);
      b = parseInt(color[3] + color[3], 16);
      break;
    }

    // #RGBA
    case color[0] === "#" && color.length === 5: {
      r = parseInt(color[1] + color[1], 16);
      g = parseInt(color[2] + color[2], 16);
      b = parseInt(color[3] + color[3], 16);
      a = parseInt(color[4] + color[4], 16);
      break;
    }

    // #RRGGBB
    case color[0] === "#" && color.length === 7: {
      r = parseInt(color[1] + color[2], 16);
      g = parseInt(color[3] + color[4], 16);
      b = parseInt(color[5] + color[6], 16);
      break;
    }

    // #RRGGBBAA
    case color[0] === "#" && color.length === 9: {
      r = parseInt(color[1] + color[2], 16);
      g = parseInt(color[3] + color[4], 16);
      b = parseInt(color[5] + color[6], 16);
      a = parseInt(color[7] + color[7], 16);
      break;
    }

    // rgb(R, G, B) or rgba(R, G, B, A)
    case color.startsWith("rgb"): {
      let matches = color.match(/[\.\d%]+/g) || [];
      [r, g, b, a] = matches.map(parseCSSNumber);
      break;
    }

    default:
      throw new Error(`Invalid color: ${color}`);
  }

  return [r, g, b, a];
}

function parseCSSNumber(num: string) {
  if (num.includes("%")) {
    return parseFloat(num) / 100;
  } else {
    return parseFloat(num);
  }
}

/**
 * @param r Red (0-255)
 * @param g Green (0-255)
 * @param b Blue (0-255)
 */
export function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let delta = max - min;

  let h = 60 * (
    delta === 0 ? 0 :
    max === r ? ((g - b) / delta) % 6 :
    max === g ? ((b - r) / delta) + 2 :
    max === b ? ((r - g) / delta) + 4 :
    0
  );

  if (h < 0) h += 360;

  let s = max === 0 ? 0 : delta / max;
  let v = max / 255;

  return [h / 360, s, v];
}

/**
 * @param h Hue (0-1)
 * @param s Saturation (0-1)
 * @param v Value (0-1)
 */
export function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  if (s === 0) return [v * 255, v * 255, v * 255];
  if (h === 1) h = 0;

  let c = v * s;
  let hh = h * 6;
  let x = c * (1 - Math.abs(hh % 2 - 1));
  let m = v - c;
  let p = Math.floor(hh);

  let [r, g, b] = (
    p === 0 ? [c, x, 0] :
    p === 1 ? [x, c, 0] :
    p === 2 ? [0, c, x] :
    p === 3 ? [0, x, c] :
    p === 4 ? [x, 0, c] :
    p === 5 ? [c, 0, x] :
    [0, 0, 0]
  );

  return [
    (r + m) * 255,
    (g + m) * 255,
    (b + m) * 255,
  ];
}
