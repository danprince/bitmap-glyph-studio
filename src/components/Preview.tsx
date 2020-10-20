import "./Preview.css";
import { useRef, useEffect, useMemo } from "preact/hooks";
import { State, getRenderableGlyphs } from "../reducer";
import { clear, resize, drawGlyphs } from "../renderer";

export function Preview({
  state,
  onClickGlyph,
}: {
  state: State,
  onClickGlyph: (index: number) => any
}) {
  let canvasRef = useRef<HTMLCanvasElement>();
  let ctxRef = useRef<CanvasRenderingContext2D>();

  useEffect(() => {
    ctxRef.current = canvasRef.current.getContext("2d");
  }, [canvasRef.current]);

  let packedGlyphs = useMemo(() => {
    if (state.font) {
      return getRenderableGlyphs(state);
    } else {
      return { width: 0, height: 0, glyphs: [] };
    }
  }, [
    state.font,
    state.fontSize,
    state.padding,
    state.resolution,
  ]);

  useEffect(() => {
    if (packedGlyphs.glyphs.length > 0) {
      resize(ctxRef.current, packedGlyphs.width, packedGlyphs.height)
    } else {
      resize(ctxRef.current, 500, 500);
    }
  }, [packedGlyphs]);

  useEffect(() => {
    let ctx = ctxRef.current;
    let glyphs = packedGlyphs.glyphs;
    clear(ctx);
    drawGlyphs(ctx, glyphs, state, { boundingBoxes: true });
  }, [state, packedGlyphs]);

  function handleMouseDown(event: MouseEvent) {
    if (onClickGlyph == null) return;

    let target = event.target as HTMLCanvasElement;
    let { left, top } = target.getBoundingClientRect();
    let { clientX, clientY } = event;
    let x = clientX - left;
    let y = clientY - top;

    let glyph = packedGlyphs.glyphs.find(glyph => (
      x >= glyph.x &&
      y >= glyph.y &&
      x < glyph.x + glyph.w &&
      y < glyph.y + glyph.h
    ));

    if (glyph) {
      let index = state.alphabet.indexOf(glyph.char);
      onClickGlyph(index);
    }
  }

  return (
    <div className="preview">
      <canvas ref={canvasRef} onMouseDown={handleMouseDown} />
    </div>
  );
}

