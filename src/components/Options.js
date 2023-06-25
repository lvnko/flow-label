import * as React from "react";
import f18N from "../contexts/f18N";
const Options = ({ fieldId, label, optionList, fieldChanged, selectedValue }) => {
    const { t } = React.useContext(f18N);
    React.useEffect(() => {
        console.log("optionList : ", optionList);
    }, []);
    /* function body */
    return (React.createElement("div", { key: fieldId, className: 'input-row-radio' },
        React.createElement("p", { className: 'label' }, label),
        optionList.map((opt, index) => {
            return [
                React.createElement("input", { key: `${fieldId}-${opt.name}-radio`, id: `${fieldId}-${opt.name}`, name: `${fieldId}-flow-direction`, type: "radio", value: opt.value, onChange: (e) => {
                        fieldChanged(fieldId, +e.target.value);
                    }, checked: selectedValue === opt.value }),
                React.createElement("label", { key: `${opt.name}-radio-label`, htmlFor: `${fieldId}-${opt.name}` }, t(`label.${opt.name}`))
            ];
        })));
};
export default Options;
