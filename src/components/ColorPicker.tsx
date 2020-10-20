import "./ColorPicker.css";
import { useState, useRef, useEffect } from "preact/hooks";
import { RefObject } from "preact";
import { parseColor, hsvToRgb, rgbToHsv } from "../colors";

export function ColorPicker({
  value,
  onChange,
}: {
  value: string,
  onChange: (value: string) => any,
}) {
  let [initR, initG, initB, initA] = parseColor(value);
  let [initH, initS, initV] = rgbToHsv(initR, initG, initB);

  let [H, setH] = useState(initH);
  let [S, setS] = useState(initS);
  let [V, setV] = useState(initV);
  let [A, setA] = useState(initA);
  let [R, G, B] = hsvToRgb(H, S, V);

  useEffect(() => {
    onChange(`rgba(${R}, ${G}, ${B}, ${A})`);
  }, [R, G, B, A]);

  let containerRef = useRef<HTMLElement>(null);
  let canvasRefH = useRef<HTMLCanvasElement>(null);
  let canvasRefSV = useRef<HTMLCanvasElement>(null);
  let canvasRefA = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let ctx = canvasRefH.current.getContext("2d");
    renderHueCanvas(ctx);
  }, []);

  useEffect(() => {
    let ctxSV = canvasRefSV.current.getContext("2d");
    renderValueCanvas(ctxSV, H);
  }, [H]);

  useEffect(() => {
    let ctxA = canvasRefA.current.getContext("2d");
    renderAlphaCanvas(ctxA, R, G, B);
  }, [R, G, B]);

  let sliderRefH = useRef<HTMLDivElement>(null);
  let sliderRefSV = useRef<HTMLDivElement>(null);
  let sliderRefA = useRef<HTMLDivElement>(null);

  useSlider(sliderRefH, H, setH);
  useSlider(sliderRefSV, S, setS, V, setV);
  useSlider(sliderRefA, A, setA);

  return (
    <div className="color-picker" ref={containerRef}>
      <div className="color-picker-axis-slider">
        <canvas ref={canvasRefSV} width={200} height={160} />
        <button ref={sliderRefSV} className="color-picker-handle" />
      </div>

      <div className="color-picker-slider color-picker-hue-slider">
        <canvas ref={canvasRefH} width={200} height={10} />
        <button ref={sliderRefH} className="color-picker-handle" />
      </div>

      <div className="color-picker-slider color-picker-alpha-slider">
        <canvas ref={canvasRefA} width={200} height={10} />
        <button ref={sliderRefA} className="color-picker-handle" />
      </div>

      <Swatch color={`rgba(${R}, ${G}, ${B}, ${A})`} />
    </div>
  );
}

function renderHueCanvas(ctx: CanvasRenderingContext2D) {
  let { width, height } = ctx.canvas;
  ctx.clearRect(0, 0, width, height);

  for (let x = 0; x < width; x++) {
    let hue = (x / width) * 360;
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.fillRect(x, 0, 1, height);
  }
}

function renderAlphaCanvas(ctx: CanvasRenderingContext2D, r: number, g: number, b: number) {
  let { width, height } = ctx.canvas;
  ctx.clearRect(0, 0, width, height);

  for (let x = 0; x < width; x++) {
    let a = (x / width);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
    ctx.fillRect(x, 0, 1, height);
  }
}

function renderValueCanvas(ctx: CanvasRenderingContext2D, hue: number) {
  let { width, height } = ctx.canvas;
  let imageData = ctx.getImageData(0, 0, width, height);

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let i = (x + y * width) * 4;
      let s = (x / width);
      let v = (1 - y / height);
      let [r, g, b] = hsvToRgb(hue, s, v);
      imageData.data[i + 0] = r;
      imageData.data[i + 1] = g;
      imageData.data[i + 2] = b;
      imageData.data[i + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * TODO: Support focus and keyboard controls
 */
function useSlider(
  elementRef: RefObject<HTMLElement>,
  x: number,
  setX: (x: number) => any,
  y?: number,
  setY?: (y: number) => any,
) {
  let isEditingRef = useRef(false);

  useEffect(() => {
    let element = elementRef.current;
    element.style.left = `${x * 100}%`;
    element.style.top = `${100 - y * 100}%`;
  }, [elementRef, x, y]);

  useEffect(() => {
    let element = elementRef.current;
    let parent = element.parentElement;

    function update(x: number, y: number) {
      x = Math.max(0, Math.min(x, 1));
      y = 1 - Math.max(0, Math.min(y, 1));
      if (setX) setX(x);
      if (setY) setY(y);
    }

    function updateFromMouse(event: MouseEvent) {
      let rect = parent.getBoundingClientRect();
      let x = (event.clientX - rect.left) / rect.width;
      let y = (event.clientY - rect.top) / rect.height;
      update(x, y);
    }

    function handleMouseDown(event: MouseEvent) {
      isEditingRef.current = true;
      updateFromMouse(event);

      // Need to wait for the next frame, otherwise the body element
      // steals the focus.
      requestAnimationFrame(() => elementRef.current.focus());
    }

    function handleMouseMove(event: MouseEvent) {
      if (isEditingRef.current) {
        updateFromMouse(event);
      }
    }

    function handleMouseUp(event: MouseEvent) {
      if (isEditingRef.current) {
        isEditingRef.current = false;
        updateFromMouse(event);
      }
    }

    parent.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      parent.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [elementRef, x, y, setX, setY]);
}

export function Swatch({ color }) {
  return (
    <div className="color-picker-swatch">
      <div className="color-picker-swatch-color" style={{ backgroundColor: color }} />
    </div>
  );
}
