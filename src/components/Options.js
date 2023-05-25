import * as React from "react";
const Options = ({ fieldId, label, optionList, fieldChanged, selectedValue }) => {
    React.useEffect(() => {
        console.log("optionList : ", optionList);
    }, []);
    /* function body */
    return (React.createElement("div", { key: fieldId },
        React.createElement("p", null, label),
        optionList.map((opt, index) => {
            return [
                React.createElement("input", { key: `${fieldId}-${opt.name}-radio`, id: `${fieldId}-${opt.name}`, name: `${fieldId}-flow-direction`, type: "radio", value: opt.value, onChange: (e) => {
                        fieldChanged(fieldId, +e.target.value);
                    }, checked: selectedValue === opt.value }),
                React.createElement("label", { key: `${opt.name}-radio-label`, htmlFor: `${fieldId}-${opt.name}` }, opt.label)
            ];
        })));
};
export default Options;
