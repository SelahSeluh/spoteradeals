import React,{useEffect,useRef} from 'react';
import {useApp} from '../context/AppContext';
import {IntroAnimationConfig} from '../types';
import {PaperWordmark} from './Navbar';
import {ExpeditionSkyline} from './ExpeditionScenery';
import {safeMediaUrl} from '../utils/postcardSlides';
interface OpeningAnimationProps{previewConfig?:IntroAnimationConfig;onPreviewClose?:()=>void}
export const OpeningAnimation:React.FC<OpeningAnimationProps>=({previewConfig,onPreviewClose})=>{
 const {dismissOpeningAnimation,introConfig}=useApp();const config=previewConfig||introConfig;const close=useRef(dismissOpeningAnimation);close.current=previewConfig&&onPreviewClose?onPreviewClose:dismissOpeningAnimation;
 useEffect(()=>{const timer=setTimeout(()=>close.current(),config.enabled===false?0:Math.max(1,Math.min(15,config.durationSeconds||2.5))*1000);return()=>clearTimeout(timer)},[config.enabled,config.durationSeconds]);
 const video=config.backgroundType==='video'?safeMediaUrl(config.videoUrl):'';const photo=config.backgroundType==='image'?safeMediaUrl(config.backgroundImageUrl):config.backgroundType==='slideshow'?safeMediaUrl(config.slideshowImages?.[0]):'';
 return <div className="expedition-intro" aria-label="SpoteraDeals introduction">{video?<video className="intro-custom-media" src={video} poster={safeMediaUrl(config.backgroundImageUrl)} muted playsInline autoPlay loop preload="metadata"/>:photo?<img className="intro-custom-media" src={photo} alt=""/>:null}{(video||photo)&&<div className="intro-media-shade"/>}<button className="expedition-skip" onClick={()=>close.current()}>Skip intro →</button><PaperWordmark/><h1 style={{color:config.textColor,fontFamily:config.fontFamily}}>{config.text||'More discovery. More together.'}</h1><p>Explore · Play · Make memories</p>{!video&&!photo&&<><div className="expedition-intro-map" role="img" aria-label="Illustrated adventure map"/><ExpeditionSkyline/></>}</div>;
};
