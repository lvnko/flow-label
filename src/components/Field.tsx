import * as React from "react";
import { FunctionComponent, ReactElement } from 'react';

type FieldProps = {
    fieldId: string,
    label: string,
    placeholder?: string,
    value: string,
    fieldChanged(fieldId: string, value: string): any,
}

const Field: FunctionComponent<FieldProps> = ({ fieldId, label, fieldChanged, value, placeholder }): ReactElement => {
    
    return (
        <div key={fieldId} className={'input-row'}>
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
        </div>
    )
};

export default Field;