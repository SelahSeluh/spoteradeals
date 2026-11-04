import React,{useEffect} from 'react';
import {useApp} from '../context/AppContext';
import {useDesignText} from './DesignPrimitives';
import {SUPPORTED_LANGUAGES} from '../utils/i18nHelper';
export const isDesignReview=(import.meta.env?.DEV||import.meta.env?.MODE==='design-review')&&import.meta.env?.VITE_DESIGN_REVIEW==='true';
const screens=['auth','home','explore','search','deal-detail','wishlist','bookings','booking-confirm','rewards','profile','settings','faq','contact','about','privacy','terms','partners','admin'];
export function DesignReview(){const {setActiveView,replaySplashAnimation,setLanguage}=useApp();const d=useDesignText();useEffect(()=>{if(!isDesignReview)return;const listener=(event:MessageEvent)=>{if(event.origin!==window.location.origin||event.data?.type!=='spotera-design-review')return;const {screen,language}=event.data;if(screen==='intro')replaySplashAnimation();else if(screens.includes(screen))setActiveView(screen as any);if(SUPPORTED_LANGUAGES.some(l=>l.code===language))setLanguage(language)};window.addEventListener('message',listener);return()=>window.removeEventListener('message',listener)},[setActiveView,setLanguage,replaySplashAnimation]);if(!isDesignReview)return null;return <div className="fn-review-banner">{d('preview')} · {d('sample')}</div>}
