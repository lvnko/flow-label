import * as React from "react";
import { FunctionComponent, ReactElement } from 'react';
import { IOptionData } from '../interfaces/IfcCollection';

type OptionsProps = {
    fieldId: string,
    selectedValue?: number,
    label: string,
    fieldChanged(fieldId: string, value: number): any,
    optionList: IOptionData[] 
}

const Options: FunctionComponent<OptionsProps> = ({ fieldId, label, optionList, fieldChanged, selectedValue }): ReactElement => { 

    React.useEffect(()=>{
        console.log("optionList : ", optionList);
    },[])
    /* function body */ 
    return (
        <div key={fieldId}>
            <p>{label}</p>
            {optionList.map((opt, index) => {
                return [
                    <input
                        key={`${fieldId}-${opt.name}-radio`}
                        id={`${fieldId}-${opt.name}`} name={`${fieldId}-flow-direction`}
                        type="radio"
                        value={opt.value}
                        onChange={(e) => {
                            fieldChanged(fieldId, +e.target.value);
                        }}
                        checked={selectedValue === opt.value}
                    />,
                    <label
                        key={`${opt.name}-radio-label`}
                        htmlFor={`${fieldId}-${opt.name}`}
                    >{opt.label}</label>
                ]
            })}
            {/* <p>Click: {click}</p>
            <button onClick={() => setClick(click + 1)}>Click Me!</button> */}
        </div>
    )
};

export default Options;