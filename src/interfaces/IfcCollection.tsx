export interface IFlowResponse {
    response: string,
    // withCondition: boolean,
    condition: string,
    direction: number,
    destinationLabel: string,
    destinationType: number,
    errors: string[]
}

export interface IOptionData {
    name: string,
    label: string,
    value: number
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

export interface TextDisplayLib {
    condition: TextNode,
    response: TextNode,
    tagNum: TextNode
}

export interface If18NContext {
    dict: any,
    setDict: (dict: any) => void,
    locale: string,
    setLocale: (locale: string) => void,
    t: (key: string) => any
    // setLocale: React.Dispatch<React.SetStateAction<string>>
}