import { Font, Glyph } from "opentype.js";
import potpack from "potpack";

export type State = {
  font: Font | null,
  alphabet: string,
  fill: Color,
  stroke: Color,
  strokeWidth: number,
  padding: number,
  fontSize: number,
  resolution: number,
  selectedGlyphIndex: number,
  shadowEnabled: boolean,
  shadowOffsetX: number,
  shadowOffsetY: number,
  shadowColor: string,
  shadowBlur: number,
}

// TODO: Support color union with gradient/pattern
type Color = string;

export type Action =
  | { type: "set-font", font: Font }
  | { type: "set-alphabet", alphabet: string }
  | { type: "set-padding", padding: number }
  | { type: "set-fill", fill: Color }
  | { type: "set-stroke", stroke: Color }
  | { type: "set-stroke-width", strokeWidth: number }
  | { type: "set-font-size", fontSize: number }
  | { type: "select-glyph", index: number }
  | { type: "set-shadow-enabled", enabled: boolean }
  | { type: "set-shadow-color", color: string }
  | { type: "set-shadow-blur", blur: number }
  | { type: "set-shadow-offset", x: number, y: number }

export let initialState: State = {
  font: null,
  alphabet: `abcdefghijklmnopqrstuvwxyz_=<>1234`,
  fill: "#ff00ff",
  stroke: "#000000",
  padding: 12,
  strokeWidth: 1,
  fontSize: 72,
  resolution: devicePixelRatio,
  selectedGlyphIndex: 5,
  shadowEnabled: true,
  shadowColor: "rgba(0, 0, 0, 0.1)",
  shadowBlur: 5,
  shadowOffsetX: 1,
  shadowOffsetY: 2,
};

export function reducer(state: State, action: Action): State {
  console.debug(action)

  switch (action.type) {
    case "set-font":
      return { ...state, font: action.font };

    case "set-alphabet":
      return { ...state, alphabet: action.alphabet };

    case "set-fill":
      return { ...state, fill: action.fill };

    case "set-stroke":
      return { ...state, stroke: action.stroke };

    case "set-stroke-width":
      return { ...state, strokeWidth: action.strokeWidth };

    case "set-font-size":
      return { ...state, fontSize: action.fontSize };

    case "set-padding":
      return { ...state, padding: action.padding };

    case "select-glyph":
      return { ...state, selectedGlyphIndex: action.index };

    case "set-shadow-enabled":
      return { ...state, shadowEnabled: action.enabled };

    case "set-shadow-color":
      return { ...state, shadowColor: action.color };

    case "set-shadow-blur":
      return { ...state, shadowBlur: action.blur };

    case "set-shadow-offset":
      return { ...state, shadowOffsetX: action.x, shadowOffsetY: action.y };

    default:
      return state;
  }
}

export interface RenderableGlyph {
  glyph: Glyph,
  char: string,
  x: number,
  y: number,
  w: number,
  h: number,
  offsetX: number,
  offsetY: number,
}

export interface PackedGlyphs {
  width: number,
  height: number,
  glyphs: RenderableGlyph[],
}

export function getRenderableGlyphs(state: State): PackedGlyphs {
  let scale = 1 / state.font.unitsPerEm * state.fontSize;

  let glyphs = state.alphabet.split("").map(char => {
    let glyph = state.font.charToGlyph(char);
    let { x1, y1, x2, y2 } = glyph.getBoundingBox();

    let width = Math.ceil((x2 - x1) * scale) + state.padding * 2;
    let height = Math.ceil((y2 - y1) * scale) + state.padding * 2;
    let offsetX = Math.ceil(x1 * scale) - state.padding;
    let offsetY = Math.ceil(y1 * scale) - state.padding;

    return {
      glyph,
      char,
      x: 0,
      y: 0,
      w: width,
      h: height,
      offsetX,
      offsetY,
    };
  });

  let { w, h } = potpack(glyphs);

  return {
    width: w,
    height: h,
    glyphs
  };
}
