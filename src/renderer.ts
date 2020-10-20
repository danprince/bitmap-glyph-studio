import { State, RenderableGlyph } from "./reducer";

export function resize(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  resolution: number = window.devicePixelRatio,
) {
  ctx.canvas.width = width * resolution;
  ctx.canvas.height = height * resolution;
  ctx.canvas.style.width = `${width}px`;
  ctx.canvas.style.height = `${height}px`;
  ctx.scale(resolution, resolution);
}

export function clear(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

interface DrawingOptions {
  boundingBoxes?: boolean,
}

export function drawGlyphs(
  ctx: CanvasRenderingContext2D,
  glyphs: RenderableGlyph[],
  state: State,
  options: DrawingOptions,
) {
  let { font, fontSize, fill, stroke, strokeWidth, alphabet, selectedGlyphIndex } = state;

  ctx.save();

  for (let glyph of glyphs) {
    let path = font.getPath(
      glyph.char,
      glyph.x - glyph.offsetX,
      glyph.y + glyph.offsetY + glyph.h,
      fontSize,
    );

    ctx.save();
    // Prevent OpenType automatically filling with black
    path.fill = null;
    path.draw(ctx);

    if (state.shadowEnabled) {
      ctx.shadowColor = state.shadowColor;
      ctx.shadowBlur = state.shadowBlur;
      ctx.shadowOffsetX = state.shadowOffsetX;
      ctx.shadowOffsetY = state.shadowOffsetY;
    }

    ctx.fillStyle = fill;
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
    ctx.restore();

    if (options.boundingBoxes) {
      let selected = glyph.char === alphabet[selectedGlyphIndex];
      ctx.save();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "black";
      ctx.strokeRect(glyph.x, glyph.y, glyph.w, glyph.h);
      ctx.restore();
    }
  }

  ctx.restore();
}
