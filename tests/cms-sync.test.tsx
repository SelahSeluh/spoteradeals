import {test} from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import React,{act,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {useCmsSync} from '../src/hooks/useCmsSync';

test('admin edits publish centrally, initial loads do not write, and failed saves are reported',async()=>{
 const dom=new JSDOM('<div id="app"></div>',{url:'https://spoteradeals.com'});
 Object.assign(globalThis,{window:dom.window,document:dom.window.document,IS_REACT_ACT_ENVIRONMENT:true});
 let published:any={homepage:{caption:'original'}},writes=0,fail=false,update:any;
 const originalFetch=globalThis.fetch;
 globalThis.fetch=async(_url:any,options:any)=>{
  if(options?.method==='POST'){writes++;if(fail)return new Response('{}',{status:503});published={...published,...JSON.parse(options.body).data};return Response.json({success:true})}
  return Response.json({success:true,...published});
 };
 function Harness(){const [homepage,setHomepage]=useState({caption:'local'});update=setHomepage;const {cmsSaveStatus}=useCmsSync({homepage},{homepage:setHomepage},true);return <div>{homepage.caption}|{cmsSaveStatus}</div>}
 const root=createRoot(document.getElementById('app')!);
 try{
  await act(async()=>{root.render(<Harness/>)});assert.match(document.body.textContent||'',/original/);assert.equal(writes,0);
  await act(async()=>{update({caption:'changed'})});await act(async()=>{await new Promise(r=>setTimeout(r,1050))});
  assert.equal(published.homepage.caption,'changed');assert.equal(writes,1);assert.match(document.body.textContent||'',/Saved everywhere/);
  fail=true;await act(async()=>{update({caption:'not saved'})});await act(async()=>{await new Promise(r=>setTimeout(r,1050))});
  assert.equal(published.homepage.caption,'changed');assert.match(document.body.textContent||'',/Save failed/);
 }finally{await act(async()=>root.unmount());globalThis.fetch=originalFetch;dom.window.close()}
});
