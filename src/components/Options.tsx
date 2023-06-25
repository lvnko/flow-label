import * as React from "react";
import { FunctionComponent, ReactElement } from 'react';
import { IOptionData } from '../interfaces/IfcCollection';
import f18N from "../contexts/f18N";

type OptionsProps = {
    fieldId: string,
    selectedValue?: number,
    label: string,
    fieldChanged(fieldId: string, value: number): any,
    optionList: IOptionData[] 
}

const Options: FunctionComponent<OptionsProps> = ({
    fieldId, label, optionList,
    fieldChanged, selectedValue
}): ReactElement => { 

    const { t } = React.useContext(f18N);

    React.useEffect(()=>{
        console.log("optionList : ", optionList);
    },[])
    /* function body */ 
    return (
        <div key={fieldId} className={'input-row-radio'}>
            <p className={'label'}>{label}</p>
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
                    >{t(`label.${opt.name}`)}</label>
                ]
            })}
            {/* <p>Click: {click}</p>
            <button onClick={() => setClick(click + 1)}>Click Me!</button> */}
        </div>
    )
};

export default Options;