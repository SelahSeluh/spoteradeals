import React,{useEffect,useRef} from 'react';
import {useApp} from '../context/AppContext';
import {IntroAnimationConfig} from '../types';
import {PaperWordmark} from './Navbar';
import {Sun,Heart} from 'lucide-react';
interface OpeningAnimationProps{previewConfig?:IntroAnimationConfig;onPreviewClose?:()=>void}
export const OpeningAnimation:React.FC<OpeningAnimationProps>=({previewConfig,onPreviewClose})=>{const {dismissOpeningAnimation}=useApp();const close=useRef(dismissOpeningAnimation);close.current=previewConfig&&onPreviewClose?onPreviewClose:dismissOpeningAnimation;useEffect(()=>{const t=setTimeout(()=>close.current(),2500);return()=>clearTimeout(t)},[]);return <div className="paper-intro" aria-label="SpoteraDeals introduction"><button className="paper-skip" onClick={()=>close.current()}>Skip intro →</button><div className="paper-intro-collage"><span className="paper-photo paper-photo-waterpark" role="img" aria-label="Family waterpark adventure"/><Sun size={55}/></div><PaperWordmark/><p>More play<br/>for brighter<br/>tomorrows <Heart size={21}/></p><div className="paper-intro-postcard"><span className="paper-photo paper-photo-splash" role="img" aria-label="Splashing together at the waterpark"/></div><span className="paper-intro-trail" aria-hidden="true">〰 ♡</span></div>};
