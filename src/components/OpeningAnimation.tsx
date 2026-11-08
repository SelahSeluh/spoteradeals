import {LocaleText} from './LocaleText';
import React,{useEffect,useRef} from 'react';
import {useApp} from '../context/AppContext';
import {IntroAnimationConfig} from '../types';
import {safeMediaUrl} from '../utils/postcardSlides';
import {useDesignText} from './DesignPrimitives';
interface OpeningAnimationProps{previewConfig?:IntroAnimationConfig;onPreviewClose?:()=>void;embedded?:boolean}
export const OpeningAnimation:React.FC<OpeningAnimationProps>=({previewConfig,onPreviewClose,embedded=false})=>{
 const {dismissOpeningAnimation,introConfig}=useApp();const d=useDesignText();const config=previewConfig||introConfig;
 const close=useRef(dismissOpeningAnimation);close.current=previewConfig&&onPreviewClose?onPreviewClose:dismissOpeningAnimation;
 const duration=previewConfig?Math.max(1,Math.min(10,config.durationSeconds||3)):3;
 useEffect(()=>{const id=window.setTimeout(()=>close.current(),config.enabled===false?0:duration*1000);return()=>clearTimeout(id)},[config.enabled,duration]);
 const customVideo=previewConfig&&config.backgroundType==='video'?safeMediaUrl(config.videoUrl):undefined;
 return <section className="fn-intro" style={embedded?{position:'absolute',zIndex:1}:undefined} aria-label="SpoteraDeals introduction">
  <div className="paper-intro-collage" aria-hidden="true"><div className="paper-intro-photo paper-intro-photo-main"/><div className="paper-intro-photo paper-intro-photo-small"/><span className="paper-intro-tape">Family days<br/>make brighter<br/>stories ♡</span></div>
  {customVideo&&<video className="fn-intro-video" src={customVideo} autoPlay muted playsInline/>}
  <div className="paper-intro-sun" aria-hidden="true">☀</div>
  <div className="fn-intro-brand"><img src={safeMediaUrl(config.logoUrl)||'/spoteradeals-logo.png'} alt="SpoteraDeals logo"/><h1>Spotera<span>Deals</span></h1><p>{previewConfig?config.text:"More play for brighter tomorrows"}</p></div>
  <div className="fn-intro-bottom"><div className="fn-intro-progress" aria-hidden="true"><i/><i/><i/></div><button onClick={()=>close.current()}>{d('skip')} <span aria-hidden="true">→</span></button></div>
 </section>
};
