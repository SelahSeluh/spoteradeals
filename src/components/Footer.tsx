import React from 'react';
import {useApp} from '../context/AppContext';
import {ExpeditionSkyline} from './ExpeditionScenery';
import {PaperWordmark} from './Navbar';
export const Footer:React.FC=()=>{const {setActiveView,replaySplashAnimation}=useApp();return <footer className="paper-footer"><ExpeditionSkyline/><PaperWordmark/><p>More fun. More together.</p><div><button onClick={()=>setActiveView('about')}>About</button><button onClick={()=>setActiveView('contact')}>Help & support</button><button onClick={()=>setActiveView('privacy')}>Privacy</button><button onClick={()=>setActiveView('terms')}>Terms</button><button onClick={()=>setActiveView('partners')}>Partner portal</button><button onClick={replaySplashAnimation}>Replay intro</button></div><small>© {new Date().getFullYear()} SpoteraDeals · UAE</small></footer>};
