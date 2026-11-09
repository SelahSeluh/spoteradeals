import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {JSDOM} from 'jsdom';
import {AppProvider,useApp} from '../src/context/AppContext';
import {PublicIntro} from '../src/components/PublicIntro';
import {publicPathForView,publicSeoPages} from '../src/lib/publicSeo';
function RouteProbe(){const {activeView,isLoggedIn}=useApp();return <span data-view={activeView} data-authenticated={String(isLoggedIn)}/>}
test('explicit public pages open for guests while account pages retain the sign-in gate',()=>{
 for(const [path,view] of [['/','auth'],['/explore','explore'],['/about','about'],['/faq','faq'],['/contact','contact'],['/deal/example','deal-detail'],['/bookings','auth'],['/settings','auth'],['/rewards','auth'],['/partners','auth']]){
  const dom=new JSDOM('',{url:`https://spoteradeals.com${path}`});Object.assign(globalThis,{window:dom.window,document:dom.window.document});
  try{const html=renderToStaticMarkup(<AppProvider><RouteProbe/></AppProvider>);assert.match(html,new RegExp(`data-view="${view}"`));assert.match(html,/data-authenticated="false"/)}finally{dom.window.close()}
 }
});
test('brand information exposes real public href links and public metadata excludes private views',()=>{
 const dom=new JSDOM('',{url:'https://spoteradeals.com/'});Object.assign(globalThis,{window:dom.window,document:dom.window.document});
 try{const doc=new JSDOM(renderToStaticMarkup(<AppProvider><PublicIntro/></AppProvider>)).window.document;assert.match(doc.querySelector('h2')!.textContent!,/SpoteraDeals/);assert.deepEqual([...doc.querySelectorAll('a')].map(a=>a.getAttribute('href')),['/explore','/about','/faq','/contact']);for(const privateView of ['auth','admin','partners','bookings','profile','settings'])assert.equal(publicPathForView(privateView),null);for(const meta of Object.values(publicSeoPages)){assert.match(meta.title,/SpoteraDeals/);assert.ok(meta.description.length>50)}}finally{dom.window.close()}
});
