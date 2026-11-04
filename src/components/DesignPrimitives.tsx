import React from 'react';
import {Globe,ChevronLeft} from 'lucide-react';
import {useApp} from '../context/AppContext';
import {SUPPORTED_LANGUAGES} from '../utils/i18nHelper';
import {designText} from '../lib/findNextCopy';
export function useDesignText(){const {language}=useApp();return (key:Parameters<typeof designText>[1])=>designText(language,key)}
export function LanguagePicker(){const {language,setLanguage}=useApp();const d=useDesignText();return <label className="fn-language"><Globe size={15}/><span className="sr-only">{d('language')}</span><select aria-label={d('language')} value={language} onChange={e=>setLanguage(e.target.value as typeof language)}>{SUPPORTED_LANGUAGES.map(l=><option key={l.code} value={l.code}>{l.nativeName}</option>)}</select></label>}
export function MapArtwork({className=''}:{className?:string}){return <div className={`fn-map-art ${className}`} aria-hidden="true"><img src="/find-your-next/map-4k.webp" srcSet="/find-your-next/map-1920.webp 1920w, /find-your-next/map-4k.webp 3840w" sizes="(max-width:767px) 100vw, 65vw" alt="" decoding="async"/></div>}
export function PageTitle({title,subtitle,back=false}:{title:string;subtitle?:string;back?:boolean}){const {goBack}=useApp();const d=useDesignText();return <div className="fn-page-title">{back&&<button className="fn-icon" aria-label={d('back')} onClick={goBack}><ChevronLeft/></button>}<div><h1>{title}</h1>{subtitle&&<p>{subtitle}</p>}</div><span className="fn-title-skyline" aria-hidden="true"/></div>}
