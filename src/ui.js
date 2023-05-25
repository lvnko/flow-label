import * as React from "react";
import * as ReactDOM from "react-dom/client";
import Field from "./components/Field";
import Options from "./components/Options";
import "./ui.css";
function App() {
    const inputRef = React.useRef(null);
    const optionsDataList = [{
            name: "forth", label: "Forward",
            value: 1, checked: true
        }, {
            name: "divert", label: "Diverted",
            value: 2, checked: false
        }, {
            name: "back", label: "Backward",
            value: -1, checked: false
        }];
    // const [triggerEvent, setTriggerEvent] = React.useState<string>();
    const [responses, setResponses] = React.useState([{
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
        React.createElement("section", null,
            React.createElement("label", { htmlFor: "triggerEvent" }, "Event / Action"),
            React.createElement("input", { id: "triggerEvent", type: "text", ref: inputRef }),
            responses.map((r, index) => {
                return (React.createElement("div", { key: `response-${index}` },
                    React.createElement(Field, { fieldId: `${index}:response`, label: 'Response', placeholder: 'ie. Direct to Login page...', value: r.response, fieldChanged: fieldChanged }),
                    React.createElement(Options, { fieldId: `${index}:direction`, label: 'Direction', optionList: optionsDataList, selectedValue: r.direction, fieldChanged: fieldChanged })));
            })),
        React.createElement("footer", null,
            React.createElement("button", { className: "brand", onClick: onCreate }, "Create"),
            React.createElement("button", { onClick: onCancel }, "Cancel"))));
}
ReactDOM.createRoot(document.getElementById("react-page")).render(React.createElement(App, null));
