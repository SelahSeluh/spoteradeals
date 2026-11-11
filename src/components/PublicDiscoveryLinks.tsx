import React from 'react';
import {useApp} from '../context/AppContext';
import {publicNavigation} from '../lib/publicSeo';
export function PublicDiscoveryLinks(){const {language}=useApp();return <nav className="pp-discovery-links" aria-label={language==='ar'?'اكتشف سبوتيرا ديلز':'Discover SpoteraDeals'}>{publicNavigation.map(link=><a key={link.path} href={link.path}>{language==='ar'?link.ar:link.label}</a>)}</nav>}
