import React, {useEffect, useRef} from 'react';
import {useApp} from '../context/AppContext';
import {IntroAnimationConfig} from '../types';
import {PaperWordmark} from './Navbar';
interface OpeningAnimationProps{previewConfig?:IntroAnimationConfig;onPreviewClose?:()=>void}
/** Single static UAE coastal scene; never rotate intro images or autoplay video. */
export const OpeningAnimation:React.FC<OpeningAnimationProps>=({previewConfig,onPreviewClose})=>{
 const {dismissOpeningAnimation,introConfig}=useApp();
 const config=previewConfig||introConfig;
 const close=useRef(dismissOpeningAnimation);
 close.current=previewConfig&&onPreviewClose?onPreviewClose:dismissOpeningAnimation;
 useEffect(()=>{const timer=window.setTimeout(()=>close.current(),config.enabled===false?0:Math.max(1,Math.min(4,config.durationSeconds||2.5))*1000);return()=>window.clearTimeout(timer)},[config.enabled,config.durationSeconds]);
 return <div className="expedition-intro ocean-single-intro" aria-label="SpoteraDeals introduction">
  <div className="ocean-intro-scene" role="img" aria-label="UAE coastal skyline and ocean"/>
  <div className="ocean-intro-content"><PaperWordmark/><p>Discover more of the UAE, together.</p></div>
  <button type="button" className="expedition-skip" onClick={()=>close.current()}>Skip intro →</button>
 </div>;
};
