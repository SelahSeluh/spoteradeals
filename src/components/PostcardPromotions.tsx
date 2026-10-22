import React, {useEffect, useMemo, useRef, useState} from 'react';
import {ChevronLeft, ChevronRight, Pause, Play} from 'lucide-react';
import {useApp} from '../context/AppContext';
import {postcardSlides, safeMediaUrl} from '../utils/postcardSlides';

export function PostcardPromotions() {
  const {homepageConfig:config, deals, setSelectedDealId, setActiveView} = useApp();
  const slides = useMemo(() => postcardSlides(config,deals),[config,deals]);
  const [index,setIndex] = useState(0), [paused,setPaused] = useState(false), [hover,setHover] = useState(false);
  const [reduced,setReduced] = useState(false), [hidden,setHidden] = useState(document.hidden);
  const touch = useRef<number|null>(null);
  const videoRef=useRef<HTMLVideoElement>(null);
  const mode = config.heroPostcardMode || 'slideshow';
  const signature = slides.map(s=>s.id).join('|');
  useEffect(()=>{setIndex(0)},[signature,mode]);
  useEffect(()=>{
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');
    const update=()=>setReduced(media.matches), visibility=()=>setHidden(document.hidden);
    update(); media.addEventListener('change',update); document.addEventListener('visibilitychange',visibility);
    return ()=>{media.removeEventListener('change',update);document.removeEventListener('visibilitychange',visibility)};
  },[]);
  const active = slides[index % Math.max(slides.length,1)];
  const next=(step:number)=>setIndex(i=>(i+step+slides.length)%Math.max(slides.length,1));
  useEffect(()=>{
    if(mode!=='slideshow'||slides.length<2||paused||hover||reduced||hidden) return;
    const id=window.setInterval(()=>setIndex(i=>(i+1)%slides.length),Math.max(3,Math.min(30,Number(config.heroAutoPlaySpeedSeconds)||6))*1000);
    return ()=>clearInterval(id);
  },[mode,slides.length,paused,hover,reduced,hidden,config.heroAutoPlaySpeedSeconds]);
  const video=safeMediaUrl(mode==='video'?config.heroVideoUrl:active?.mediaType==='video'?active.videoUrl:undefined);
  useEffect(()=>{const element=videoRef.current;if(!element)return;if(paused||hidden||reduced)element.pause();else void element.play().catch(()=>{});},[paused,hidden,reduced,video]);
  const image = safeMediaUrl(mode==='image'?config.heroImageUrl:active?.imageUrl) || '/places/skyline.jpg';
  return <div className="picnic-postcard" role="region" aria-roledescription="carousel" aria-label="Promoted places and top offers" onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} onFocusCapture={()=>setHover(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setHover(false)}} onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();next(1)}if(e.key==='ArrowLeft'){e.preventDefault();next(-1)}}}>
    <div className="postcard-media" onTouchStart={e=>touch.current=e.touches[0].clientX} onTouchEnd={e=>{if(touch.current!==null){const delta=touch.current-e.changedTouches[0].clientX;if(Math.abs(delta)>45)next(delta>0?1:-1)}touch.current=null}}>
      {video ? <video ref={videoRef} key={video} src={video} poster={image} controls playsInline muted autoPlay={!reduced&&!paused&&!hidden} loop={mode==='video'} preload="metadata" /> : <img key={image} src={image} alt={active?.title || 'Dubai skyline'} onError={e=>{if(!e.currentTarget.src.endsWith('/places/skyline.jpg'))e.currentTarget.src='/places/skyline.jpg'}}/>}
      {active && mode==='slideshow' && <div className="postcard-offer"><small>{active.sponsored?'Sponsored':'Handpicked offer'}</small><strong>{active.title}</strong><button type="button" onClick={()=>{if(active.dealId){setSelectedDealId(active.dealId);setActiveView('deal-detail')}else setActiveView('explore')}}>{active.buttonText || active.ctaText || 'Explore offers'} →</button></div>}
    </div>
    {mode==='slideshow' && slides.length>1 && <div className="postcard-controls"><button type="button" aria-label="Previous offer" onClick={()=>next(-1)}><ChevronLeft size={18}/></button><span aria-live={paused?'polite':'off'}>{index%slides.length+1} / {slides.length}</span><button type="button" aria-label={paused?'Play slideshow':'Pause slideshow'} aria-pressed={paused} onClick={()=>setPaused(p=>!p)}>{paused?<Play size={16}/>:<Pause size={16}/>}</button><button type="button" aria-label="Next offer" onClick={()=>next(1)}><ChevronRight size={18}/></button></div>}
    <span>{config.heroPostcardCaption || 'Explore. Play. Discover. Together.'}</span>
  </div>
}
