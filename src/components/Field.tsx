import * as React from "react";
import { FunctionComponent, ReactElement } from 'react';
import f18N from "../contexts/f18N";

type FieldProps = {
    fieldId: string,
    label: string,
    placeholder?: string,
    value: string,
    fieldChanged(fieldId: string, value: string): any,
    hasError?: boolean,
    errors?: string[]
}

const Field: FunctionComponent<FieldProps> = ({
    fieldId, label,
    fieldChanged, value,
    placeholder,
    hasError=false,
    errors=[]
}): ReactElement => {

    const { t } = React.useContext(f18N);

    // React.useEffect(()=>{
    //     console.log('f18NContext', f18NContext);
    // },[]);

    return (
        <div key={fieldId} className={`input-row${ hasError? ' input-error':'' }`}>
            <label
                htmlFor={`${fieldId}-input`}
            >{label}</label>
            <input
                id={`${fieldId}-input`}
                type="text"
                value={value}
                onChange={(e) => {
                    fieldChanged(fieldId, e.target.value);
                }}
                {...(placeholder !== undefined? {placeholder} : null)}
            />
            {errors.length > 0 && (
                <div className={'errors-row'}>{
                    errors.map((e, edx)=>{ return (<div key={`${fieldId}-error=${edx}`}>{t(`error.${e}`)}</div>) })
                }</div>
            )}
        </div>
    )
};

export default Field;