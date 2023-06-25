import * as React from "react";
import * as ReactDOM from "react-dom/client";
import Field from "./components/Field";
import Options from "./components/Options";
import { AppProvider } from "./contexts/f18N";
import f18N from "./contexts/f18N";
import "./ui.css";
function App() {
    const inputEventActRef = React.useRef(null);
    const directionOptionsDataList = [{
            name: "back", label: "Backward",
            value: -1
        }, {
            name: "divert", label: "Diverted",
            value: 2
        }, {
            name: "forth", label: "Forward",
            value: 1
        }];
    const destTypeOptionsDataList = [{
            name: "section", label: "Section",
            value: 0
        }, {
            name: "screen", label: "Screen",
            value: 1
        }];
    const defaultResponse = {
        response: "",
        // withCondition: false,
        condition: "",
        direction: 1,
        destinationLabel: "",
        destinationType: 0,
        errors: []
    };
    // const [triggerEvent, setTriggerEvent] = React.useState<string>();
    const [responses, setResponses] = React.useState([Object.assign({}, defaultResponse)]);
    const [errors, setErrors] = React.useState([]);
    const fieldChanged = (fieldId, value) => {
        const responseFieldKeys = fieldId.split(':');
        const responseIdx = +responseFieldKeys[0];
        const fieldIdx = responseFieldKeys[1];
        let newResponses = [...responses];
        newResponses[responseIdx][fieldIdx] = value;
        setResponses(newResponses);
    };
    const addBlankResponseRecord = () => {
        let newResponses = [...responses, Object.assign({}, defaultResponse)];
        setResponses(newResponses);
    };
    const deleteResponseRecordAt = (idx) => {
        let newResponses = [...responses.filter((itm, index) => index !== idx)];
        setResponses(newResponses);
    };
    const validateData = (_data) => {
        let results = [];
        const { eventAct, responses } = _data;
        console.log('What the fuck !!!', _data);
        console.log('What the eventAct !!!', eventAct);
        console.log('What the responses !!!', responses);
        if (eventAct === '') {
            results.push('eventAct:empyt');
        }
        let resultsOnResponses = responses.reduce((accum, curVal, curIdx) => {
            console.log('accum, curVal, curIdx', accum, curVal, curIdx);
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
        }, []);
        results.push(...resultsOnResponses);
        return results;
    };
    React.useEffect(() => {
        console.log('Response list data updated : ', responses);
    }, [responses]);
    React.useEffect(() => {
        console.log('Error Reported : ', responses, errors);
        const validatedResponses = [...responses.map((r, idx) => {
                return Object.assign(Object.assign({}, r), { errors: [
                        ...errors.filter(e => e.indexOf(`response-${idx}:`) >= 0).map(e => e.substring(e.indexOf(':') + 1))
                    ] });
            })];
        setResponses(validatedResponses);
    }, [errors]);
    const onCreate = () => {
        var _a;
        console.log("Before Submit Check... ", responses);
        const eventAct = ((_a = inputEventActRef.current) === null || _a === void 0 ? void 0 : _a.value) || '';
        const submitData = {
            eventAct, responses
        };
        console.log('submitData', submitData);
        const errors = validateData(submitData);
        setErrors(errors);
        if (errors.length < 1) {
            parent.postMessage({
                pluginMessage: submitData
            }, "*");
        }
    };
    const onCancel = () => {
        parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
    };
    return (React.createElement(AppProvider, null,
        React.createElement(f18N.Consumer, null, f18N => {
            return (React.createElement("main", null,
                React.createElement("header", null,
                    React.createElement("h2", null, f18N.t("title"))),
                React.createElement("section", { className: 'pb-1' },
                    React.createElement("div", { className: 'input-row ph-hf1' },
                        React.createElement("label", { htmlFor: "triggerEvent" }, f18N.t("label.eventAction")),
                        React.createElement("input", { id: "triggerEvent", type: "text", ref: inputEventActRef, placeholder: f18N.t("placeholder.eventAction") })),
                    responses.map((r, index) => {
                        return (React.createElement("div", { key: `response-${index}`, className: 'response-row ph-hf1' },
                            React.createElement("div", { className: 'ctrl-row pv-hf1 mt-hf1' },
                                React.createElement("span", { className: 'tag-bubble' }, index + 1),
                                responses.length > 1 ? (React.createElement("a", { className: 'tappable-icon', onClick: e => deleteResponseRecordAt(index) },
                                    React.createElement("img", { src: require("./assets/icon-trash-invert.svg") }))) : (React.createElement("div", null))),
                            React.createElement(Field, { fieldId: `${index}:condition`, label: f18N.t("label.condition"), placeholder: f18N.t("placeholder.condition"), value: r.condition, fieldChanged: fieldChanged, hasError: r.errors.filter(e => e.indexOf('condition') >= 0).length > 0, errors: r.errors.filter(e => e.indexOf('condition') >= 0).map(e => e.split(":")[1]) }),
                            React.createElement(Field, { fieldId: `${index}:response`, label: f18N.t("label.response"), placeholder: f18N.t("placeholder.response"), value: r.response, fieldChanged: fieldChanged, hasError: r.errors.filter(e => e.indexOf('response') >= 0).length > 0, errors: r.errors.filter(e => e.indexOf('response') >= 0).map(e => e.split(":")[1]) }),
                            React.createElement(Options, { fieldId: `${index}:direction`, label: f18N.t("label.direction"), optionList: directionOptionsDataList, selectedValue: r.direction, fieldChanged: fieldChanged }),
                            r.direction === 2 && [
                                React.createElement(Field, { key: `${index}:destinationLabel`, fieldId: `${index}:destinationLabel`, label: f18N.t("label.destinationLabel"), placeholder: f18N.t("placeholder.destinationLabel"), value: r.destinationLabel, fieldChanged: fieldChanged, hasError: r.errors.filter(e => e.indexOf('destinationLabel') >= 0).length > 0, errors: r.errors.filter(e => e.indexOf('destinationLabel') >= 0).map(e => e.split(":")[1]) }),
                                React.createElement(Options, { key: `${index}:destinationType`, fieldId: `${index}:destinationType`, label: f18N.t("label.destinationType"), optionList: destTypeOptionsDataList, selectedValue: r.destinationType, fieldChanged: fieldChanged })
                            ]));
                    }),
                    responses.length < 5 && (React.createElement("a", { className: 'tappable-row ph-hf1 pv-hf1 mt-hf1', onClick: addBlankResponseRecord },
                        React.createElement("span", null, f18N.t("common.addResponse"))))),
                React.createElement("footer", null,
                    React.createElement("button", { onClick: onCancel }, f18N.t("common.cancel")),
                    React.createElement("button", { className: "brand", onClick: onCreate }, f18N.t("common.create")))));
        })));
}
ReactDOM.createRoot(document.getElementById("react-page")).render(React.createElement(App, null));
