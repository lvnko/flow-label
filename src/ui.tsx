import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { IFlowResponse, IOptionData } from './interfaces/IfcCollection';
import Field from "./components/Field";
import Options from "./components/Options";
import "./ui.css";

declare function require(path: string): any;
type IOptionsData = IOptionData[]

function App() {

  const inputRef = React.useRef<HTMLInputElement>(null);
  const optionsDataList: IOptionsData = [{
    name: "forth", label: "Forward",
    value: 1, checked: true
  },{
    name: "divert", label: "Diverted",
    value: 2, checked: false
  },{
    name: "back", label: "Backward",
    value: -1, checked: false
  }]; 


  // const [triggerEvent, setTriggerEvent] = React.useState<string>();
  const [responses, setResponses] = React.useState<IFlowResponse[]>([{
    response: "",
    // withCondition: false,
    condition: "",
    direction: 1,
    destinationLabel: "",
    destinationType: 0
  }]);

  const fieldChanged = (fieldId, value) => {
    const responseFieldKeys = fieldId.split(':');
    const responseIdx = +responseFieldKeys[0];
    const fieldIdx = responseFieldKeys[1];
    let newResponses = [...responses];
    newResponses[responseIdx][fieldIdx] = value;
    setResponses(newResponses);
  }

  React.useEffect(()=>{
    console.log('Init response list : ', responses);
  },[responses]);

  const onCreate = () => {
    console.log("Before Submit Check... ", responses);
    // const count = Number(inputRef.current?.value || 0);
    // parent.postMessage(
    //   { pluginMessage: { type: "create-rectangles", count } },
    //   "*"
    // );
  };

  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  };

  return (
    <main>
      <header>
        {/* <img src={require("./logo.svg")} /> */}
        <h2>Flow Label Generator</h2>
      </header>
      <section>
        <label htmlFor="triggerEvent">Event / Action</label>
        <input id="triggerEvent" type="text" ref={inputRef} />
        {responses.map((r, index) => {
          return (
            <div key={`response-${index}`}>
              {/* <p>Response</p> */}
              <Field
                fieldId={`${index}:response`}
                label={'Response'}
                placeholder={'ie. Direct to Login page...'}
                value={r.response}
                fieldChanged={fieldChanged}
              />
              <Options
                fieldId={`${index}:direction`}
                label={'Direction'}
                optionList={optionsDataList}
                selectedValue={r.direction}
                fieldChanged={fieldChanged}
              />
            </div>
          )
        })}
      </section>
      <footer>
        <button className="brand" onClick={onCreate}>
          Create
        </button>
        <button onClick={onCancel}>Cancel</button>
      </footer>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("react-page")).render(<App />);
