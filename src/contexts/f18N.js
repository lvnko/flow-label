var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from "react";
// interface If18NContext {
//     dict: any,
//     locale: string
//     // setLocale: React.Dispatch<React.SetStateAction<string>>
// }
// export const f18N = React.createContext<f18NContext>({} as f18NContext);
const f18NContext = {
    dict: {},
    locale: 'en',
    setLocale: () => { },
    setDict: () => { },
    t: () => { return ''; }
};
const f18N = React.createContext(null);
const langNames = {
    en: ['en', 'en-GB', 'en-HK'],
    zh_Hant: ['yue-Hant-HK', 'zh_Hant', 'zh_Hant_TW', 'zh-Hant-HK', 'zh_Hant_MO'],
    zh_Hans: ['zh_Hans', 'zh_Hans_CN', 'zh_Hans_HK', 'zh_Hans_MO', 'zh_Hans_SG']
};
// const useTranslate = () => {
//     const f18nContext = React.useContext(f18N);
//     return React.useCallback((key) => {
//       if (f18nContext === null) return key;
//       return key.split('.').reduce((o, i) => {
//         if (o) return o[i];
//       }, f18nContext.dict);
//     }, [f18nContext]);
// }
export const getLangPreference = () => {
    const langPref = navigator.language;
    for (var prop in langNames) {
        if (Object.prototype.hasOwnProperty.call(langNames, prop)) {
            if (langNames[prop].indexOf(langPref) >= 0)
                return prop;
        }
    }
    return 'en';
};
export const getLangPack = (_langName) => __awaiter(void 0, void 0, void 0, function* () {
});
export const AppProvider = ({ children }) => {
    // const [todos, setTodos] = React.useState<ITodo[]>([{title: 'loading', body: 'loading', id: 0, completed: false}])
    const [locale, setLocale] = React.useState(getLangPreference());
    const [dict, setDict] = React.useState({});
    const loadDict = (langName) => __awaiter(void 0, void 0, void 0, function* () {
        var json = require(`locales/${langName}.json`);
        console.log('josn', json);
        setDict(json);
    });
    const useTranslate = () => {
        return React.useCallback((key) => {
            return key.split('.').reduce((o, i) => {
                if (o && o[i] !== undefined)
                    return o[i];
                return key;
            }, dict);
        }, [dict]);
    };
    React.useEffect(() => {
        // console.log('f18N.tsx : dict', dict);
    }, [dict]);
    React.useEffect(() => {
        // console.log('f18N.tsx : locale', locale);
        loadDict(locale);
    }, [locale]);
    return (React.createElement(f18N.Provider, { value: Object.assign(Object.assign({}, f18NContext), { dict: dict, setDict: setDict, locale: locale, setLocale: setLocale, t: useTranslate() }) }, children));
};
export default f18N;
