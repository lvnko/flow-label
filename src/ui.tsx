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
  const directionOptionsDataList: IOptionsData = [{
    name: "back", label: "Backward",
    value: -1
  },{
    name: "divert", label: "Diverted",
    value: 2
  },{
    name: "forth", label: "Forward",
    value: 1
  }]; 
  const destTypeOptionsDataList: IOptionsData = [{
    name: "section", label: "Section",
    value: 0
  },{
    name: "screen", label: "Screen",
    value: 1
  }];
  const defaultResponse: IFlowResponse = {
    response: "",
    // withCondition: false,
    condition: "",
    direction: 1,
    destinationLabel: "",
    destinationType: 0
  };


  // const [triggerEvent, setTriggerEvent] = React.useState<string>();
  const [responses, setResponses] = React.useState<IFlowResponse[]>([{
    ...defaultResponse
  }]);

  const fieldChanged = (fieldId, value) => {
    const responseFieldKeys = fieldId.split(':');
    const responseIdx = +responseFieldKeys[0];
    const fieldIdx = responseFieldKeys[1];
    let newResponses = [...responses];
    newResponses[responseIdx][fieldIdx] = value;
    setResponses(newResponses);
  }

  const addBlankResponseRecord = () => {
    let newResponses = [...responses, { ...defaultResponse }];
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
      <section className={'pb-1'}>
        <div className={'input-row ph-hf1'}>
          <label htmlFor="triggerEvent">Event / Action</label>
          <input id="triggerEvent" type="text" ref={inputRef} placeholder="ie. Tap on Submit" />
        </div>
        {responses.map((r, index) => {
          return (
            <div key={`response-${index}`} className={'response-row ph-hf1'}>
              <div className={'ctrl-row pv-hf1'}>
                <span>{index+1}</span>
                <a className={'tappable-icon'}>
                  <img src={require("./assets/icon-trash-invert.svg")} />
                </a>
              </div>
              <Field
                fieldId={`${index}:condition`}
                label={'Condition'}
                placeholder={'ie. if...'}
                value={r.response}
                fieldChanged={fieldChanged}
              />
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
                optionList={directionOptionsDataList}
                selectedValue={r.direction}
                fieldChanged={fieldChanged}
              />
              {r.direction === 2 && [
                <Field
                  key={`${index}:destinationLabel`}
                  fieldId={`${index}:destinationLabel`}
                  label={'Destination Label'}
                  placeholder={'ie. A1.2.?'}
                  value={r.destinationLabel}
                  fieldChanged={fieldChanged}
                />,
                <Options
                  key={`${index}:destinationType`}
                  fieldId={`${index}:destinationType`}
                  label={'Destination Type'}
                  optionList={destTypeOptionsDataList}
                  selectedValue={r.destinationType}
                  fieldChanged={fieldChanged}
                />
              ]}
            </div>
          )
        })}
        {responses.length < 5 && (
          <a className={'tappable-row ph-hf1 pv-hf1'} onClick={addBlankResponseRecord}>
            <span>+ Add Response</span>
          </a>
        )}
      </section>
      <footer>
        <button onClick={onCancel}>Cancel</button>
        <button className="brand" onClick={onCreate}>
          Create
        </button>
      </footer>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("react-page")).render(<App />);
