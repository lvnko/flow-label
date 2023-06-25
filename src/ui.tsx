import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { IFlowResponse, IOptionData, If18NContext } from './interfaces/IfcCollection';
import Field from "./components/Field";
import Options from "./components/Options";
import { AppProvider } from "./contexts/f18N";
import f18N from "./contexts/f18N";
import "./ui.css";

declare function require(path: string): any;
type IOptionsData = IOptionData[];
type IErrorsCol = string[];

function App() {

  const inputEventActRef = React.useRef<HTMLInputElement>(null);

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
    destinationType: 0,
    errors: []
  };

  // const [triggerEvent, setTriggerEvent] = React.useState<string>();
  const [responses, setResponses] = React.useState<IFlowResponse[]>([{
    ...defaultResponse
  }]);

  const [errors, setErrors] = React.useState<IErrorsCol>([]);

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

  const deleteResponseRecordAt = (idx) => {
    let newResponses = [ ...responses.filter((itm, index) => index !== idx) ];
    setResponses(newResponses);
  }

  const validateData = (_data) => {
    let results = [];
    const { eventAct, responses} = _data;
    console.log('What the fuck !!!', _data);
    console.log('What the eventAct !!!', eventAct);
    console.log('What the responses !!!', responses);
    if (eventAct === '') {
      results.push('eventAct:empyt');
    }
    let resultsOnResponses = responses.reduce((accum, curVal, curIdx)=>{
      console.log('accum, curVal, curIdx',accum, curVal, curIdx);
      const curResults = [...accum];
      let thisResults = [];
      if (curVal.response === '') {
        thisResults.push(`response-${curIdx}:response:empty`);
      }
      if (responses.length > 1) {
        if (curVal.condition === '') {
          thisResults.push(`response-${curIdx}:condition:empty`);
        }
      }
      if (curVal.direction > 1 && curVal.destinationLabel === '') {
        thisResults.push(`response-${curIdx}:destinationLabel:empty`);
      }
      return [
        ...curResults,
        ...thisResults
      ];
    },[]);
    results.push(...resultsOnResponses);
    return results;
  }

  React.useEffect(()=>{
    console.log('Response list data updated : ', responses);
  },[responses]);

  React.useEffect(()=>{
    console.log('Error Reported : ', responses, errors);
    const validatedResponses = [...responses.map((r, idx)=>{
      return {
        ...r,
        errors: [
          ...errors.filter(e=>e.indexOf(`response-${idx}:`)>=0).map(e=>e.substring(e.indexOf(':')+1))
        ]
      }
    })];
    setResponses(validatedResponses);
  },[errors]);

  const onCreate = () => {
    console.log("Before Submit Check... ", responses);
    const eventAct = inputEventActRef.current?.value || '';
    const submitData = {
      eventAct, responses
    };
    console.log('submitData', submitData);
    const errors = validateData(submitData);
    setErrors(errors);
    if (errors.length < 1) {
      parent.postMessage(
        {
          pluginMessage: submitData
        },
        "*"
      );
    }
  };

  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  };

  return (
    <AppProvider>
      <f18N.Consumer>
        {f18N => {
          return (
            <main>
              <header>
                {/* <img src={require("./logo.svg")} /> */}
                <h2>{f18N.t("title")}</h2>
              </header>
              <section className={'pb-1'}>
                <div className={'input-row ph-hf1'}>
                  <label htmlFor="triggerEvent">{f18N.t("label.eventAction")}</label>
                  <input id="triggerEvent" type="text" ref={inputEventActRef} placeholder={f18N.t("placeholder.eventAction")} />
                </div>
                {responses.map((r, index) => {
                  return (
                    <div key={`response-${index}`} className={'response-row ph-hf1'}>
                      
                      <div className={'ctrl-row pv-hf1 mt-hf1'}>
                        <span className={'tag-bubble'}>{index+1}</span>
                        {responses.length > 1 ? (
                          <a className={'tappable-icon'} onClick={e => deleteResponseRecordAt(index)}>
                            <img src={require("./assets/icon-trash-invert.svg")} />
                          </a>
                        ) : (
                          <div></div>
                        )}
                      </div>
                      <Field
                        fieldId={`${index}:condition`}
                        label={f18N.t("label.condition")}
                        placeholder={f18N.t("placeholder.condition")}
                        value={r.condition}
                        fieldChanged={fieldChanged}
                        hasError={r.errors.filter(e=>e.indexOf('condition')>=0).length > 0}
                        errors={r.errors.filter(e=>e.indexOf('condition')>=0).map(e=>e.split(":")[1])}
                      />
                      <Field
                        fieldId={`${index}:response`}
                        label={f18N.t("label.response")}
                        placeholder={f18N.t("placeholder.response")}
                        value={r.response}
                        fieldChanged={fieldChanged}
                        hasError={r.errors.filter(e=>e.indexOf('response')>=0).length > 0}
                        errors={r.errors.filter(e=>e.indexOf('response')>=0).map(e=>e.split(":")[1])}
                      />
                      <Options
                        fieldId={`${index}:direction`}
                        label={f18N.t("label.direction")}
                        optionList={directionOptionsDataList}
                        selectedValue={r.direction}
                        fieldChanged={fieldChanged}
                      />
                      {r.direction === 2 && [
                        <Field
                          key={`${index}:destinationLabel`}
                          fieldId={`${index}:destinationLabel`}
                          label={f18N.t("label.destinationLabel")}
                          placeholder={f18N.t("placeholder.destinationLabel")}
                          value={r.destinationLabel}
                          fieldChanged={fieldChanged}
                          hasError={r.errors.filter(e=>e.indexOf('destinationLabel')>=0).length > 0}
                          errors={r.errors.filter(e=>e.indexOf('destinationLabel')>=0).map(e=>e.split(":")[1])}
                        />,
                        <Options
                          key={`${index}:destinationType`}
                          fieldId={`${index}:destinationType`}
                          label={f18N.t("label.destinationType")}
                          optionList={destTypeOptionsDataList}
                          selectedValue={r.destinationType}
                          fieldChanged={fieldChanged}
                        />
                      ]}
                    </div>
                  )
                })}
                {responses.length < 5 && (
                  <a className={'tappable-row ph-hf1 pv-hf1 mt-hf1'} onClick={addBlankResponseRecord}>
                    <span>{f18N.t("common.addResponse")}</span>
                  </a>
                )}
              </section>
              <footer>
                <button onClick={onCancel}>
                  {f18N.t("common.cancel")}
                </button>
                <button className="brand" onClick={onCreate}>
                  {f18N.t("common.create")}
                </button>
              </footer>
            </main>
          )
        }}
      </f18N.Consumer>
    </AppProvider>
  );
}

ReactDOM.createRoot(document.getElementById("react-page")).render(<App />);
