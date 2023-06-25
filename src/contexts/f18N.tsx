import * as React from "react";
import { FunctionComponent, ReactElement } from 'react';
import { If18NContext } from "../interfaces/IfcCollection";
import { promises as fsPromises } from 'fs';
import * as path from 'path';

// interface If18NContext {
//     dict: any,
//     locale: string
//     // setLocale: React.Dispatch<React.SetStateAction<string>>
// }

// export const f18N = React.createContext<f18NContext>({} as f18NContext);

const f18NContext: If18NContext = {
  dict: {},
  locale: 'en',
  setLocale: ()=>{},
  setDict: ()=>{},
  t: ()=> {return '';}
};

const f18N = React.createContext<If18NContext | null>(null);

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

export const getLangPreference = ()=> {
    const langPref = navigator.language;
    for (var prop in langNames) {
        if (Object.prototype.hasOwnProperty.call(langNames, prop)) {
          if (langNames[prop].indexOf(langPref) >= 0)
          return prop;
        }
    }
    return 'en';
}

export const getLangPack = async (_langName) => {

}


// class AppProvider extends React.Component {
//   // const f18N = React.useContext(f18N);
//   render() {
//     // const { children, path } = this.props;
//     return (
//         <f18N.Provider value={f18NContext}></f18N.Provider>
//     )
//   }
// }

interface Props {
  children: React.ReactNode;
}

export const AppProvider: React.FunctionComponent<Props> = ({children}) => {
  // const [todos, setTodos] = React.useState<ITodo[]>([{title: 'loading', body: 'loading', id: 0, completed: false}])

  const [locale, setLocale] = React.useState<string>(getLangPreference());
  const [dict, setDict] = React.useState<any>({});

  const loadDict = async (langName) => {
    var json = require(`locales/${langName}.json`);
    console.log('josn', json);
    setDict(json);
  }

  const useTranslate = () => {
    
    return React.useCallback((key) => {
      return key.split('.').reduce((o, i) => {
        if (o && o[i] !== undefined) return o[i];
        return key;
      }, dict);
    }, [dict]);

  }

  React.useEffect(()=> {
    // console.log('f18N.tsx : dict', dict);
  }, [dict]);

  React.useEffect(()=> {
    // console.log('f18N.tsx : locale', locale);
    loadDict(locale);
  }, [locale]);

  return (
      <f18N.Provider value={{
        ...f18NContext,
        dict: dict,
        setDict: setDict,
        locale: locale,
        setLocale: setLocale,
        t: useTranslate()
      }}>
          {children}
      </f18N.Provider>
  )
}

export default f18N;