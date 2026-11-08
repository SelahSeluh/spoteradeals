import {WebDiscoverySections,SocialLinks,StoreLinks} from './WebDiscoverySections';
import {LocaleText} from './LocaleText';
import React from 'react';
import {useApp} from '../context/AppContext';
import {PaperWordmark} from './Navbar';
import {useDesignText} from './DesignPrimitives';
export const Footer:React.FC=()=>{const {setActiveView,replaySplashAnimation}=useApp();const d=useDesignText();return <footer className="fn-footer"><WebDiscoverySections/><PaperWordmark/><p>{d('tagline')}</p><div><button onClick={()=>setActiveView('about')}>{d('about')}</button><button onClick={()=>setActiveView('faq')}>{d('help')}</button><button onClick={()=>setActiveView('privacy')}>{d('privacy')}</button><button onClick={()=>setActiveView('terms')}>{d('terms')}</button><button onClick={()=>setActiveView('partners')}>{d('partner')}</button><button onClick={replaySplashAnimation}>{d('replay')}</button></div><div className="spotera-footer-extras"><SocialLinks/><StoreLinks/></div><small>© {new Date().getFullYear()}<LocaleText value={"SpoteraDeals · UAE"}/></small></footer>};
