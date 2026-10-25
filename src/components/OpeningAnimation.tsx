import React,{useEffect,useRef,useState} from 'react';
import {useApp} from '../context/AppContext';
import {IntroAnimationConfig} from '../types';
import {PaperWordmark} from './Navbar';
import {safeMediaUrl} from '../utils/postcardSlides';
interface OpeningAnimationProps{previewConfig?:IntroAnimationConfig;onPreviewClose?:()=>void;embedded?:boolean}
export const OpeningAnimation:React.FC<OpeningAnimationProps>=({previewConfig,onPreviewClose,embedded=false})=>{
 const {dismissOpeningAnimation,introConfig,language}=useApp();
 const config=previewConfig||introConfig;
 const close=useRef(dismissOpeningAnimation);close.current=previewConfig&&onPreviewClose?onPreviewClose:dismissOpeningAnimation;
 const [slide,setSlide]=useState(0);
 const images=(config.slideshowImages||[]).map(safeMediaUrl).filter((url):url is string=>!!url);
 useEffect(()=>{const timer=window.setTimeout(()=>close.current(),config.enabled===false?0:Math.max(1,Math.min(10,config.durationSeconds||2.5))*1000);return()=>window.clearTimeout(timer)},[config.enabled,config.durationSeconds]);
 useEffect(()=>{if(config.backgroundType!=='slideshow'||images.length<2)return;const timer=window.setInterval(()=>setSlide(i=>i+1),Math.max(1,config.slideshowIntervalSeconds||3)*1000);return()=>window.clearInterval(timer)},[config.backgroundType,config.slideshowIntervalSeconds,images.length]);
 const image=config.backgroundType==='slideshow'?images[slide%images.length]:safeMediaUrl(config.backgroundImageUrl);
 const video=config.backgroundType==='video'?safeMediaUrl(config.videoUrl):undefined;
 const logo=safeMediaUrl(config.logoUrl);
 const text=({ar:config.textAr,fr:config.textFr,ru:config.textRu} as Record<string,string|undefined>)[language]||config.text||'Discover more of the UAE, together.';
 const gradient=config.solidGradient;
 const background=config.backgroundType==='solid'&&gradient?`linear-gradient(150deg,${gradient.from},${gradient.via},${gradient.to})`:undefined;
 const fontWeight={normal:400,medium:500,semibold:600,bold:700,extrabold:800,black:900}[config.fontWeight||'bold'];
 return <div className="expedition-intro ocean-single-intro" style={embedded?{position:'absolute',zIndex:1}:undefined} aria-label="SpoteraDeals introduction">
  <div className="ocean-intro-scene" role="img" aria-label="UAE coastal skyline and ocean" style={background?{background}:image?{backgroundImage:`url("${image}")`}:undefined}/>
  {video&&<video key={video} src={video} poster={safeMediaUrl(config.backgroundImageUrl)} autoPlay muted={config.videoMuted!==false} loop={config.videoLoop} playsInline className="absolute inset-0 w-full h-full object-cover" onError={e=>{e.currentTarget.style.display='none'}}/>}
  <div className="ocean-intro-content" style={{position:'relative',maxWidth:'100%',...(config.logoPosition==='top'?{alignSelf:'start',marginTop:32}:config.logoPosition==='upper-third'?{transform:'translateY(-25%)'}:{})}}>
   {logo?<img src={logo} alt="SpoteraDeals logo" style={{width:{small:64,medium:112,large:144,xlarge:192}[config.logoSize]||112,maxWidth:'100%',objectFit:'contain'}}/>:<PaperWordmark/>}
   <p style={{color:config.textColor,fontFamily:config.fontFamily,fontWeight,fontStyle:config.fontStyle,textAlign:config.textAlignment,fontSize:config.fontSizeCustom||{small:14,medium:18,large:24,xlarge:30}[config.textSize]}}>{text}</p>
  </div>
  <button type="button" className="expedition-skip" onClick={()=>close.current()}>Skip intro →</button>
 </div>;
};
