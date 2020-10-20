import "./Inputs.css";
import { useRef, useState } from "preact/hooks";
import { ColorPicker, Swatch } from "./ColorPicker";
import { Modal } from "./Modal";

export function ColorInput({ id, value, onChange, disabled = false }) {
  let elementRef = useRef<HTMLElement>();
  let [active, setActive] = useState(false);

  return (
    <button ref={elementRef} className="color-input" id={id} onClick={() => setActive(true)} disabled={disabled}>
      <Swatch color={value} />
      {active && (
        <Modal anchor={elementRef.current} onRequestClose={() => setActive(false)}>
          <ColorPicker
            value={value}
            onChange={onChange}
          />
        </Modal>
      )}
    </button>
  );
}

