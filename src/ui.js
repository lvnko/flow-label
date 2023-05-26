import * as React from "react";
import * as ReactDOM from "react-dom/client";
import Field from "./components/Field";
import Options from "./components/Options";
import "./ui.css";
function App() {
    const inputRef = React.useRef(null);
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
        destinationType: 0
    };
    // const [triggerEvent, setTriggerEvent] = React.useState<string>();
    const [responses, setResponses] = React.useState([Object.assign({}, defaultResponse)]);
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
    React.useEffect(() => {
        console.log('Init response list : ', responses);
    }, [responses]);
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
    return (React.createElement("main", null,
        React.createElement("header", null,
            React.createElement("h2", null, "Flow Label Generator")),
        React.createElement("section", { className: 'pb-1' },
            React.createElement("div", { className: 'input-row ph-hf1' },
                React.createElement("label", { htmlFor: "triggerEvent" }, "Event / Action"),
                React.createElement("input", { id: "triggerEvent", type: "text", ref: inputRef, placeholder: "ie. Tap on Submit" })),
            responses.map((r, index) => {
                return (React.createElement("div", { key: `response-${index}`, className: 'response-row ph-hf1' },
                    React.createElement("div", { className: 'ctrl-row pv-hf1' },
                        React.createElement("span", null, index + 1),
                        React.createElement("a", { className: 'tappable-icon' },
                            React.createElement("img", { src: require("./assets/icon-trash-invert.svg") }))),
                    React.createElement(Field, { fieldId: `${index}:condition`, label: 'Condition', placeholder: 'ie. if...', value: r.response, fieldChanged: fieldChanged }),
                    React.createElement(Field, { fieldId: `${index}:response`, label: 'Response', placeholder: 'ie. Direct to Login page...', value: r.response, fieldChanged: fieldChanged }),
                    React.createElement(Options, { fieldId: `${index}:direction`, label: 'Direction', optionList: directionOptionsDataList, selectedValue: r.direction, fieldChanged: fieldChanged }),
                    r.direction === 2 && [
                        React.createElement(Field, { key: `${index}:destinationLabel`, fieldId: `${index}:destinationLabel`, label: 'Destination Label', placeholder: 'ie. A1.2.?', value: r.destinationLabel, fieldChanged: fieldChanged }),
                        React.createElement(Options, { key: `${index}:destinationType`, fieldId: `${index}:destinationType`, label: 'Destination Type', optionList: destTypeOptionsDataList, selectedValue: r.destinationType, fieldChanged: fieldChanged })
                    ]));
            }),
            responses.length < 5 && (React.createElement("a", { className: 'tappable-row ph-hf1 pv-hf1', onClick: addBlankResponseRecord },
                React.createElement("span", null, "+ Add Response")))),
        React.createElement("footer", null,
            React.createElement("button", { onClick: onCancel }, "Cancel"),
            React.createElement("button", { className: "brand", onClick: onCreate }, "Create"))));
}
ReactDOM.createRoot(document.getElementById("react-page")).render(React.createElement(App, null));
