import * as React from "react";
import f18N from "../contexts/f18N";
const Field = ({ fieldId, label, fieldChanged, value, placeholder, hasError = false, errors = [] }) => {
    const { t } = React.useContext(f18N);
    // React.useEffect(()=>{
    //     console.log('f18NContext', f18NContext);
    // },[]);
    return (React.createElement("div", { key: fieldId, className: `input-row${hasError ? ' input-error' : ''}` },
        React.createElement("label", { htmlFor: `${fieldId}-input` }, label),
        React.createElement("input", Object.assign({ id: `${fieldId}-input`, type: "text", value: value, onChange: (e) => {
                fieldChanged(fieldId, e.target.value);
            } }, (placeholder !== undefined ? { placeholder } : null))),
        errors.length > 0 && (React.createElement("div", { className: 'errors-row' }, errors.map((e, edx) => { return (React.createElement("div", { key: `${fieldId}-error=${edx}` }, t(`error.${e}`))); })))));
};
export default Field;
