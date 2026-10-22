import React,{useState} from 'react';
import {useApp} from '../../context/AppContext';
import {safeMediaUrl} from '../../utils/postcardSlides';
import type {HeroSlide} from '../../types';

export function AdminHeroManager(){
 const {homepageConfig:config,updateHomepageConfig,deals,cmsSaveStatus,retryCmsSave}=useApp();
 const [editing,setEditing]=useState<HeroSlide|null>(null),[error,setError]=useState(''),[uploading,setUploading]=useState(false);
 const slides=config.heroSlides||[];
 const saveSlide=()=>{
  if(!editing)return;
  if(!editing.title.trim()||!safeMediaUrl(editing.imageUrl)|| (editing.mediaType==='video'&&!safeMediaUrl(editing.videoUrl))){setError('Add a title and a valid HTTPS or uploaded image. Video slides also need a valid video URL.');return}
  updateHomepageConfig({heroSlides:slides.some(s=>s.id===editing.id)?slides.map(s=>s.id===editing.id?editing:s):[...slides,editing]});setEditing(null);setError('');
 };
 async function upload(file:File|undefined){
  if(!file||!editing)return;
  if(file.size>2500000){setError('Maximum upload is 2.5 MB. Use an HTTPS link for larger videos.');return}
  setUploading(true);setError('');
  try{
   const base64=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]);reader.onerror=reject;reader.readAsDataURL(file)});
   const response=await fetch('/api/admin/upload-media',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({base64,contentType:file.type})});const data=await response.json();
   if(!response.ok||!data.success)throw new Error(data.message||'Upload failed');
   setEditing(prev=>prev?{...prev,...(file.type.startsWith('video/')?{mediaType:'video',videoUrl:data.url}:{imageUrl:data.url})}:prev);
  }catch(e){setError(e instanceof Error?e.message:'Upload failed')}finally{setUploading(false)}
 }
 function move(index:number,step:number){const items=[...slides],target=index+step;if(target<0||target>=items.length)return;[items[index],items[target]]=[items[target],items[index]];updateHomepageConfig({heroSlides:items.map((s,i)=>({...s,order:i}))})}
 const field='w-full rounded-lg border border-slate-300 bg-white p-3 text-sm';
 return <div className="space-y-6">
  <div><h2 className="text-2xl">Homepage postcard promotions</h2><p className="text-sm text-slate-600">Keep the postcard design. Rotate up to 10 promoted places and offers. Sponsored slides come first; automatic offers use the latest deal details.</p></div>
  <p role="status" className="rounded-lg border bg-white p-3 text-sm">{cmsSaveStatus} <button type="button" onClick={retryCmsSave} className="underline ml-2">Retry publishing</button></p>
  <div className="grid sm:grid-cols-2 gap-4 rounded-xl border bg-white p-4">
   <label>Postcard format<select aria-label="Postcard format" className={field} value={config.heroPostcardMode||'slideshow'} onChange={e=>updateHomepageConfig({heroPostcardMode:e.target.value as any})}><option value="slideshow">Slideshow — promotions + top offers</option><option value="image">Single photo</option><option value="video">Single video</option></select></label>
   <label>Seconds per slide<input className={field} type="number" min="3" max="30" value={config.heroAutoPlaySpeedSeconds||6} onChange={e=>updateHomepageConfig({heroAutoPlaySpeedSeconds:Math.max(3,Math.min(30,Number(e.target.value)||6))})}/></label>
   <label>Postcard caption<input className={field} value={config.heroPostcardCaption||'Explore. Play. Discover. Together.'} onChange={e=>updateHomepageConfig({heroPostcardCaption:e.target.value})}/></label>
   <label>Single photo / video poster URL<input className={field} value={config.heroImageUrl||''} placeholder="/places/skyline.jpg or https://…" onChange={e=>updateHomepageConfig({heroImageUrl:e.target.value})}/></label>
   {config.heroPostcardMode==='video'&&<label>Video URL (MP4 / WebM)<input className={field} value={config.heroVideoUrl||''} placeholder="https://…/promotion.mp4" onChange={e=>updateHomepageConfig({heroVideoUrl:e.target.value})}/></label>}
   <label className="flex gap-3 items-center"><input type="checkbox" checked={config.heroIncludeTopOffers!==false} onChange={e=>updateHomepageConfig({heroIncludeTopOffers:e.target.checked})}/>Fill remaining slideshow spaces with top offers automatically</label>
  </div>
  <button type="button" className="rounded-lg bg-blue-700 text-white p-3" disabled={slides.length>=10} onClick={()=>{setError('');setEditing({id:crypto.randomUUID(),title:'',subtitle:'',imageUrl:'',enabled:true,order:slides.length,sponsored:true,mediaType:'image',buttonText:'View offer'})}}>+ Add promoted place or offer</button>
  {editing&&<div className="grid sm:grid-cols-2 gap-4 rounded-xl border bg-white p-4">
   <label>Title<input className={field} value={editing.title} onChange={e=>setEditing({...editing,title:e.target.value})}/></label>
   <label>Link to an offer<select className={field} value={editing.dealId||''} onChange={e=>{const d=deals.find(d=>d.id===e.target.value);setEditing({...editing,dealId:d?.id,title:d?.title||editing.title,imageUrl:d?.imageUrl||d?.images?.[0]||editing.imageUrl})}}><option value="">Place promotion → Explore</option>{deals.map(d=><option key={d.id} value={d.id}>{d.title}</option>)}</select></label>
   <label>Media type<select className={field} value={editing.mediaType||'image'} onChange={e=>setEditing({...editing,mediaType:e.target.value as any})}><option value="image">Photo</option><option value="video">Video</option></select></label>
   <label>Image / poster URL<input className={field} value={editing.imageUrl} onChange={e=>setEditing({...editing,imageUrl:e.target.value})}/></label>
   {editing.mediaType==='video'&&<label>Video URL (MP4 / WebM)<input className={field} value={editing.videoUrl||''} onChange={e=>setEditing({...editing,videoUrl:e.target.value})}/></label>}
   <label>Upload a photo or short video (up to 2.5 MB)<input className={field} type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm" disabled={uploading} onChange={e=>void upload(e.target.files?.[0])}/></label>
   <label className="flex items-center gap-2"><input type="checkbox" checked={!!editing.sponsored} onChange={e=>setEditing({...editing,sponsored:e.target.checked})}/>Paid promotion — display Sponsored label</label>
   <div className="flex gap-3 items-center"><button type="button" disabled={uploading} onClick={saveSlide} className="bg-blue-700 text-white rounded-lg p-3">{uploading?'Uploading…':'Save slide'}</button><button type="button" onClick={()=>setEditing(null)}>Cancel</button></div>
  </div>}
  {error&&<p role="alert" className="text-red-700">{error}</p>}
  <div className="space-y-3">{slides.map((slide,i)=><div key={slide.id} className="rounded-xl border bg-white p-4 flex flex-wrap gap-4 items-center">
   <img src={safeMediaUrl(slide.imageUrl)||'/places/skyline.jpg'} alt="" className="w-24 h-16 object-cover rounded"/><div className="flex-1 min-w-40"><strong>{slide.title}</strong><p className="text-xs">{slide.sponsored?'Sponsored':'Editorial'} · {slide.enabled?'Visible':'Hidden'} · {slide.mediaType==='video'?'Video':'Photo'}</p></div>
   <button type="button" aria-label={`Move ${slide.title} up`} disabled={i===0} onClick={()=>move(i,-1)}>↑</button><button type="button" aria-label={`Move ${slide.title} down`} disabled={i===slides.length-1} onClick={()=>move(i,1)}>↓</button><button type="button" onClick={()=>setEditing({...slide})}>Edit</button><button type="button" onClick={()=>updateHomepageConfig({heroSlides:slides.map(s=>s.id===slide.id?{...s,enabled:!s.enabled}:s)})}>{slide.enabled?'Hide':'Show'}</button><button type="button" onClick={()=>updateHomepageConfig({heroSlides:slides.filter(s=>s.id!==slide.id)})}>Remove</button>
  </div>)}</div>
 </div>
}
