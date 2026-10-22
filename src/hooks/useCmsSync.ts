import {useEffect,useRef,useState} from 'react';

export function useCmsSync(content:Record<string,any>,setters:Record<string,(value:any)=>void>,isAdmin:boolean){
  const [status,setStatus]=useState('Loading shared content…');
  const [retry,setRetry]=useState(0);
  const current=useRef(content);current.current=content;
  const settersRef=useRef(setters);settersRef.current=setters;
  const baseline=useRef<Record<string,string>>({});
  const ready=useRef(false), saving=useRef(false);
  const serialized=JSON.stringify(content);
  useEffect(()=>{
    let cancelled=false,reading=false;ready.current=false;
    async function load(){
      if(reading||saving.current)return;reading=true;
      try{
        const response=await fetch('/api/app-config',{cache:'no-store'});const data=await response.json();
        if(!response.ok||!data.success)throw new Error();if(cancelled)return;
        for(const key of Object.keys(current.current)){
          const value=data[key]??current.current[key];
          baseline.current[key]=JSON.stringify(value);
          if(data[key]!==undefined&&data[key]!==null)settersRef.current[key](value);
        }
        ready.current=true;setStatus('Saved to shared content');
      }catch{if(!cancelled)setStatus('Shared content unavailable. Changes have not been published.')}finally{reading=false}
    }
    void load();
    const id=isAdmin?undefined:window.setInterval(()=>{if(!document.hidden)void load()},30000);
    const focus=()=>{if(!isAdmin)void load()};window.addEventListener('focus',focus);
    return ()=>{cancelled=true;window.clearInterval(id);window.removeEventListener('focus',focus)};
  },[isAdmin]);
  useEffect(()=>{
    if(!isAdmin||!ready.current)return;
    const patch=Object.fromEntries(Object.entries(content).filter(([key,value])=>JSON.stringify(value)!==baseline.current[key]));
    if(!Object.keys(patch).length)return;
    setStatus('Saving shared content…');
    const timer=window.setTimeout(async()=>{
      if(saving.current){setRetry(i=>i+1);return}saving.current=true;
      try{
        const response=await fetch('/api/admin/content',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({data:patch})});
        const data=await response.json();if(!response.ok||!data.success)throw new Error();
        for(const [key,value] of Object.entries(patch))baseline.current[key]=JSON.stringify(value);
        setStatus('Saved everywhere · visitors update within 30 seconds');
      }catch{setStatus('Save failed. Changes are only on this device. Retry publishing.')}finally{saving.current=false}
    },900);
    return ()=>window.clearTimeout(timer);
  },[serialized,isAdmin,retry,status==='Saved to shared content']);
  return {cmsSaveStatus:status,retryCmsSave:()=>setRetry(i=>i+1)};
}
