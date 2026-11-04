import React from 'react';
import {useApp} from '../context/AppContext';
import {translations} from '../lib/translations';
import {designCopy} from '../lib/findNextCopy';
import {literalUi} from '../lib/literalUi';
import type {Language} from '../types';
const normalize=(s:string)=>s.toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
const keys=new Map(Object.entries(translations.en).map(([k,v])=>[normalize(v),k]));
const designKeys=new Map(Object.entries(designCopy.en).map(([k,v])=>[normalize(v),k]));
const literalKeys=new Map(Object.keys(literalUi).map(k=>[normalize(k),k]));
export function translateLiteral(value:string,language:Language){
 if(language==='en')return value;
 const normalized=normalize(value);const literal=literalKeys.get(normalized);if(literal)return literalUi[literal]?.[language]||value;
 const designKey=designKeys.get(normalized);if(designKey)return designCopy[language]?.[designKey]||value;
 const key=keys.get(normalized);return key?translations[language]?.[key]||value:value;
}
export function LocaleText({value}:{value:string}){const {language}=useApp();return <>{translateLiteral(value,language)}</>}
