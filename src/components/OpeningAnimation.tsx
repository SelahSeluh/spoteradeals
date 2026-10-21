import React,{useEffect,useRef} from 'react';
import {useApp} from '../context/AppContext';
import {IntroAnimationConfig} from '../types';
import {PaperWordmark} from './Navbar';
import {ExpeditionSkyline} from './ExpeditionScenery';
interface OpeningAnimationProps{previewConfig?:IntroAnimationConfig;onPreviewClose?:()=>void}
export const OpeningAnimation:React.FC<OpeningAnimationProps>=({previewConfig,onPreviewClose})=>{
 const {dismissOpeningAnimation}=useApp();const close=useRef(dismissOpeningAnimation);close.current=previewConfig&&onPreviewClose?onPreviewClose:dismissOpeningAnimation;
 useEffect(()=>{const timer=setTimeout(()=>close.current(),2500);return()=>clearTimeout(timer)},[]);
 return <div className="expedition-intro" aria-label="SpoteraDeals introduction"><button className="expedition-skip" onClick={()=>close.current()}>Skip intro →</button><img className="expedition-intro-compass" src="/expedition/compass.svg" alt=""/><PaperWordmark/><h1>Small expeditions.<br/><span>Big family moments.</span></h1><p>Explore · Play · Make memories</p><div className="expedition-intro-map" role="img" aria-label="Illustrated adventure map with no people"/><ExpeditionSkyline/></div>;
};
