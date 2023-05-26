import * as React from "react";
const Field = ({ fieldId, label, fieldChanged, value, placeholder }) => {
    return (React.createElement("div", { key: fieldId, className: 'input-row' },
        React.createElement("label", { htmlFor: `${fieldId}-input` }, label),
        React.createElement("input", Object.assign({ id: `${fieldId}-input`, type: "text", value: value, onChange: (e) => {
                fieldChanged(fieldId, e.target.value);
            } }, (placeholder !== undefined ? { placeholder } : null)))));
};
export default Field;
