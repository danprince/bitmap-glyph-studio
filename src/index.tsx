import "./index.css";
import { parse } from "opentype.js";
import { render } from "preact";
import { useReducer } from "preact/hooks";
import { reducer, initialState } from "./reducer";
import { Preview } from "./components/Preview";
import { Sidebar, SidebarSection, SidebarTabs, SidebarTab, SidebarSectionHeader } from "./components/Sidebar";
import { ColorInput } from "./components/Inputs";
import { ArrowDown } from "./components/Icons";

function App() {
  let [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="app">
      <Sidebar>
        <h2 className="app-title">Glyph Studio</h2>

        <SidebarTabs>
          <SidebarTab>Import</SidebarTab>
          <SidebarTab>Design</SidebarTab>
          <SidebarTab>Export</SidebarTab>
        </SidebarTabs>

        <SidebarSection>
          <SidebarSectionHeader>
            <strong>Font</strong>
            <label for="file">
              {state.font ? state.font.names.fontFamily.en : "Import"}
              <ArrowDown />
            </label>
            <input
              id="file"
              type="file"
              style={{ display: "none" }}
              onChange={(event: InputEvent) => {
                let target = event.target as HTMLInputElement;
                let file = target.files[0];

                let reader = new FileReader();
                reader.addEventListener("load", onReaderLoad);
                reader.readAsArrayBuffer(file);

                function onReaderLoad() {
                  let font = parse(reader.result);
                  dispatch({ type: "set-font", font });
                }
              }}
            />
          </SidebarSectionHeader>
          <div>
            <label for="font-size">Font Size</label>
            <input
              id="font-size"
              type="number"
              value={state.fontSize}
              min={0}
              max={999}
              onInput={(event: InputEvent) => {
                let target = event.target as HTMLInputElement;
                let fontSize = parseInt(target.value) || 24;
                dispatch({ type: "set-font-size", fontSize });
              }}
            />
          </div>
          <div>
            <label for="padding">Padding</label>
            <input
              id="padding"
              type="number"
              min="0"
              max="999"
              value={state.padding}
              onInput={(event: InputEvent) => {
                let target = event.target as HTMLInputElement;
                let padding = parseInt(target.value) || 0;
                dispatch({ type: "set-padding", padding });
              }}
            />
          </div>
          <div>
            <label for="alphabet">Alphabet</label>
            <textarea
              id="alphabet"
              value={state.alphabet}
              style={{ width: "100%", boxSizing: "border-box" }}
              onInput={(event: InputEvent) => {
                let target = event.target as HTMLInputElement;
                let alphabet = target.value;
                dispatch({ type: "set-alphabet", alphabet });
              }}
            />
          </div>
        </SidebarSection>

        <SidebarSection>
          <SidebarSectionHeader>
            <strong>Fill</strong>
            <select>
              <option>Color</option>
              <option>Gradient</option>
            </select>
          </SidebarSectionHeader>
          <label for="fill">Color</label>
          <ColorInput
            id="fill"
            value={state.fill}
            onChange={fill => dispatch({ type: "set-fill", fill })}
          />
        </SidebarSection>

        <SidebarSection title="Stroke">
          <label for="stroke">Color</label>
          <ColorInput
            id="stroke"
            value={state.stroke}
            onChange={stroke => dispatch({ type: "set-stroke", stroke })}
          />

          <label for="stroke-width">Width</label>
          <input
            id="stroke-width"
            type="number"
            value={state.strokeWidth}
            onInput={event => {
              let target = event.target as HTMLInputElement;
              let strokeWidth = parseInt(target.value) || 0;
              dispatch({ type: "set-stroke-width", strokeWidth });
            }}
          />
        </SidebarSection>

        <SidebarSection title="Shadow">
          <label for="shadow-enabled">Enabled?</label>
          <input
            id="shadow-enabled"
            type="checkbox"
            value={state.shadowEnabled}
            onInput={event => {
              let target = event.target as HTMLInputElement;
              let enabled = Boolean(target.value);
              dispatch({ type: "set-shadow-enabled", enabled });
            }}
          />

          <label for="shadow-color">Color</label>
          <ColorInput
            id="shadow-color"
            value={state.shadowColor}
            disabled={!state.shadowEnabled}
            onChange={color => dispatch({ type: "set-shadow-color", color })}
          />

          <label for="shadow-blur">Blur</label>
          <input
            id="shadow-blur"
            type="number"
            value={state.shadowBlur}
            disabled={!state.shadowEnabled}
            onInput={event => {
              let target = event.target as HTMLInputElement;
              let blur = Number(target.value) || 0;
              dispatch({ type: "set-shadow-blur", blur });
            }}
          />

          <label for="shadow-offset-x">Offset X</label>
          <input
            id="shadow-offset-x"
            type="number"
            value={state.shadowOffsetX}
            disabled={!state.shadowEnabled}
            onInput={event => {
              let target = event.target as HTMLInputElement;
              let x = Number(target.value) || 0;
              let y = state.shadowOffsetY;
              dispatch({ type: "set-shadow-offset", x, y });
            }}
          />

          <label for="shadow-offset-y">Offset Y</label>
          <input
            id="shadow-offset-y"
            type="number"
            value={state.shadowOffsetY}
            disabled={!state.shadowEnabled}
            onInput={event => {
              let target = event.target as HTMLInputElement;
              let y = Number(target.value) || 0;
              let x = state.shadowOffsetX;
              dispatch({ type: "set-shadow-offset", x, y });
            }}
          />
        </SidebarSection>
      </Sidebar>

      <Preview
        state={state}
        onClickGlyph={index => {
          dispatch({ type: "select-glyph", index });
        }}
      />
    </div>
  );
}

render(
  <App />,
  document.getElementById("app")
);

