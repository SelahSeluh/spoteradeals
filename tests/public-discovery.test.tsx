import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {JSDOM} from 'jsdom';
import {AppProvider,useApp} from '../src/context/AppContext';
import {PublicIntro} from '../src/components/PublicIntro';
import {publicPathForView,publicSeoPages,initialDiscoveryFilters,discoveryPathForFilters} from '../src/lib/publicSeo';
function RouteProbe(){const {activeView,isLoggedIn}=useApp();return <span data-view={activeView} data-authenticated={String(isLoggedIn)}/>}
test('explicit public pages open for guests while account pages retain the sign-in gate',()=>{
 for(const [path,view] of [['/','auth'],['/explore','explore'],['/dubai','explore'],['/abu-dhabi','explore'],['/dining','explore'],['/about','about'],['/faq','faq'],['/contact','contact'],['/deal/example','deal-detail'],['/bookings','auth'],['/settings','auth'],['/rewards','auth'],['/partners','auth']]){
  const dom=new JSDOM('',{url:`https://spoteradeals.com${path}`});Object.assign(globalThis,{window:dom.window,document:dom.window.document});
  try{const html=renderToStaticMarkup(<AppProvider><RouteProbe/></AppProvider>);assert.match(html,new RegExp(`data-view="${view}"`));assert.match(html,/data-authenticated="false"/)}finally{dom.window.close()}
 }
});
test('brand information exposes real public href links and public metadata excludes private views',()=>{
 const dom=new JSDOM('',{url:'https://spoteradeals.com/'});Object.assign(globalThis,{window:dom.window,document:dom.window.document});
 try{const doc=new JSDOM(renderToStaticMarkup(<AppProvider><PublicIntro/></AppProvider>)).window.document;assert.match(doc.querySelector('h2')!.textContent!,/SpoteraDeals/);assert.deepEqual([...doc.querySelectorAll('a')].map(a=>a.getAttribute('href')),['/explore','/dubai','/abu-dhabi','/dining','/about','/contact']);for(const privateView of ['auth','admin','partners','bookings','profile','settings'])assert.equal(publicPathForView(privateView),null);for(const meta of Object.values(publicSeoPages)){assert.match(meta.title,/SpoteraDeals/);assert.ok(meta.description.length>50)}}finally{dom.window.close()}
});

test('public city and dining URLs initialise real catalog filters, including trailing slashes',()=>{
 assert.deepEqual(initialDiscoveryFilters('/dubai'),{city:'Dubai',category:'All'});
 assert.deepEqual(initialDiscoveryFilters('/abu-dhabi/'),{city:'Abu Dhabi',category:'All'});
 assert.deepEqual(initialDiscoveryFilters('/dining'),{city:'All',category:'Restaurants'});
 assert.deepEqual(initialDiscoveryFilters('/explore'),{city:'All',category:'All'});
 assert.equal(discoveryPathForFilters('Dubai','All'),'/dubai');
 assert.equal(discoveryPathForFilters('Abu Dhabi','All'),'/abu-dhabi');
 assert.equal(discoveryPathForFilters('All','Restaurants'),'/dining');
 assert.equal(discoveryPathForFilters('Dubai','Restaurants'),'/explore');
});
test('public discovery routes render the corresponding context filters without signing in',()=>{
 function Filters(){const {selectedCity,selectedCategory,isLoggedIn}=useApp();return <p>{selectedCity}|{selectedCategory}|{String(isLoggedIn)}</p>}
 for(const [path,expected] of [['/dubai','Dubai|All|false'],['/abu-dhabi','Abu Dhabi|All|false'],['/dining','All|Restaurants|false']]){
  const dom=new JSDOM('',{url:`https://spoteradeals.com${path}`});Object.assign(globalThis,{window:dom.window,document:dom.window.document});
  try{assert.equal(new JSDOM(renderToStaticMarkup(<AppProvider><Filters/></AppProvider>)).window.document.body.textContent,expected)}finally{dom.window.close()}
 }
});
