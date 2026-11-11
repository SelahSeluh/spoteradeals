import {PublicDiscoveryLinks} from './PublicDiscoveryLinks';
import {WebDiscoverySections,SocialLinks,StoreLinks} from './WebDiscoverySections';
import {LocaleText} from './LocaleText';
import React from 'react';
import {useApp} from '../context/AppContext';
import {PaperWordmark} from './Navbar';
import {useDesignText} from './DesignPrimitives';
export const Footer:React.FC=()=>{const {setActiveView,replaySplashAnimation}=useApp();const d=useDesignText();return <footer className="fn-footer"><WebDiscoverySections/><PublicDiscoveryLinks/><PaperWordmark/><p>{d('tagline')}</p><div className="fn-public-footer-links"><a href="/about">{d('about')}</a><a href="/faq">{d('help')}</a><a href="/privacy">{d('privacy')}</a><a href="/terms">{d('terms')}</a><button onClick={()=>setActiveView('partners')}>{d('partner')}</button><button onClick={replaySplashAnimation}>{d('replay')}</button></div><div className="spotera-footer-extras"><SocialLinks/><StoreLinks/></div><small>© {new Date().getFullYear()}<LocaleText value={"SpoteraDeals · UAE"}/></small></footer>};
