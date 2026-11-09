import {useEffect} from 'react';

// The approved design board is stored as eight ordered WebP chunks.
// Use only the photographic regions; all interface text stays real HTML.
export function PaperArtwork(){
 useEffect(()=>{
  const controller=new AbortController();let objectUrl:string|undefined;
  Promise.all(Array.from({length:8},(_,i)=>fetch(`/paper-reference-${i}.bin`,{signal:controller.signal}).then(r=>{if(!r.ok)throw new Error('Artwork unavailable');return r.arrayBuffer()}))).then(parts=>{
   if(controller.signal.aborted)return;
   objectUrl=URL.createObjectURL(new Blob(parts,{type:'image/webp'}));
   document.documentElement.style.setProperty('--paper-photo',`url("${objectUrl}")`);
  }).catch(()=>{/* Local photographic fallbacks remain visible. */});
  return()=>{controller.abort();document.documentElement.style.removeProperty('--paper-photo');if(objectUrl)URL.revokeObjectURL(objectUrl)};
 },[]);return null;
}
