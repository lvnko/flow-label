export interface IFlowResponse {
    response: string,
    // withCondition: boolean,
    condition: string,
    direction: number,
    destinationLabel: string,
    destinationType: number
}

export interface IOptionData {
    name: string,
    label: string,
    value: number,
    checked: boolean
}

export interface IOptionsData extends Array<IOptionData>{}

export interface ISwitchData {
    id: string,
    label: string,
    checked: boolean
}

export interface IInputData {
    id: string,
    label: string,
    value: boolean
}