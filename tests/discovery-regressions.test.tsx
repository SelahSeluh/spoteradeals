import test from 'node:test';
import assert from 'node:assert/strict';
import React,{act} from 'react';
import {createRoot} from 'react-dom/client';
import {renderToStaticMarkup} from 'react-dom/server';
import {JSDOM} from 'jsdom';
import {SUPPORTED_LANGUAGES} from '../src/utils/i18nHelper';
import {translateLiteral} from '../src/components/LocaleText';
import {discoveryTranslations} from '../src/lib/discoveryTranslations';
import {AppProvider,useApp} from '../src/context/AppContext';
import {ToastProvider} from '../src/context/ToastContext';
import {DateRangeFilter} from '../src/components/DateRangeFilter';
import {getUaeWeekendRange} from '../src/lib/loyaltyAndHolidayDefaults';
import {Navbar} from '../src/components/Navbar';

test('language names are professional and every new interface label has all six translations',()=>{
 assert.equal(SUPPORTED_LANGUAGES.find(l=>l.code==='en')?.nativeName,'English');
 assert.equal(SUPPORTED_LANGUAGES.find(l=>l.code==='ar')?.nativeName,'العربية');
 for(const [source,values] of Object.entries(discoveryTranslations))for(const {code} of SUPPORTED_LANGUAGES.filter(l=>l.code!=='en')){
  assert.ok(values[code]?.trim(),`${source}: ${code}`);assert.equal(translateLiteral(source,code),values[code]);
 }
});

test('date filters and city picker render in all seven languages',()=>{
 for(const {code} of SUPPORTED_LANGUAGES){const dom=new JSDOM('',{url:'https://spoteradeals.com'});Object.assign(globalThis,{window:dom.window,document:dom.window.document});dom.window.localStorage.setItem('spotera_lang',code);
 try{const html=renderToStaticMarkup(<ToastProvider><AppProvider><Navbar/><DateRangeFilter startDate="" endDate="" preset="all" holidays={[]} onApplyFilter={()=>{}} onClearFilter={()=>{}}/></AppProvider></ToastProvider>);const doc=new JSDOM(html).window.document;
  assert.ok(doc.body.textContent?.includes(translateLiteral('This Weekend',code)));
  assert.ok(doc.body.textContent?.includes(translateLiteral('Custom Range',code)));
  assert.ok(doc.querySelector(`select[aria-label="${translateLiteral('Choose city',code)}"]`));
  assert.ok(doc.body.textContent?.includes(translateLiteral('Dubai',code)));
 }finally{dom.window.close()}}
});

test('weekend uses the UAE Saturday/Sunday even at time-zone and year boundaries',()=>{
 assert.deepEqual(getUaeWeekendRange(0,new Date('2026-11-05T22:00:00Z')),{startDate:'2026-11-07',endDate:'2026-11-08'});
 assert.deepEqual(getUaeWeekendRange(0,new Date('2026-11-07T22:00:00Z')),{startDate:'2026-11-07',endDate:'2026-11-08'});
 assert.deepEqual(getUaeWeekendRange(1,new Date('2026-11-07T22:00:00Z')),{startDate:'2026-11-14',endDate:'2026-11-15'});
 assert.deepEqual(getUaeWeekendRange(0,new Date('2026-12-31T22:00:00Z')),{startDate:'2027-01-02',endDate:'2027-01-03'});
});

test('reset filters clears an impossible search, city, category and date range and restores results',async()=>{
 const dom=new JSDOM('<div id="app"></div>',{url:'https://spoteradeals.com/#explore',pretendToBeVisual:true});
 Object.assign(globalThis,{window:dom.window,document:dom.window.document,IS_REACT_ACT_ENVIRONMENT:true});
 const originalFetch=globalThis.fetch;globalThis.fetch=async()=>Response.json({success:true,configured:false});
 const {ExplorePage}=await import('../src/pages/ExplorePage');let app:any;
 function Harness(){app=useApp();return <ExplorePage onClaimCoupon={()=>{}} onBookNow={()=>{}}/>}
 const root=createRoot(document.getElementById('app')!);
 try{await act(async()=>{root.render(<ToastProvider><AppProvider><Harness/></AppProvider></ToastProvider>)});
  const initial=document.querySelectorAll('[role="link"]').length;assert.ok(initial>0);
  await act(async()=>{app.setSelectedCity('Ajman');app.setSelectedCategory('Parks')});
  const input=document.querySelector('.fn-explore-search input') as HTMLInputElement;
  await act(async()=>{Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype,'value')!.set!.call(input,'Impossible search');input.dispatchEvent(new dom.window.Event('input',{bubbles:true}));});
  const custom=[...document.querySelectorAll('button')].find(b=>b.textContent==='Custom Range')!;await act(async()=>custom.click());
  assert.equal(document.querySelectorAll('input[type="date"]').length,2);
  const reset=[...document.querySelectorAll('button')].find(b=>b.textContent==='Reset All Filters')!;assert.ok(reset);
  await act(async()=>reset.click());assert.equal(app.selectedCity,'All');assert.equal(app.selectedCategory,'All');assert.equal(input.value,'');assert.equal(document.querySelectorAll('input[type="date"]').length,0);assert.equal(document.querySelectorAll('[role="link"]').length,initial);
  await act(async()=>app.setLanguage('ar'));assert.equal(document.documentElement.dir,'rtl');assert.equal(document.documentElement.lang,'ar');
  await act(async()=>app.setLanguage('ur'));assert.equal(document.documentElement.dir,'rtl');
  await act(async()=>app.setLanguage('fr'));assert.equal(document.documentElement.dir,'ltr');
 }finally{await act(async()=>root.unmount());globalThis.fetch=originalFetch;dom.window.close()}
});

test('main customer pages render without crashing in every supported language',async()=>{
 const dom=new JSDOM('',{url:'https://spoteradeals.com/#home'});Object.assign(globalThis,{window:dom.window,document:dom.window.document});
 const {HomePage}=await import('../src/pages/HomePage');const {ProfilePage}=await import('../src/pages/ProfilePage');const {SettingsPage}=await import('../src/pages/SettingsPage');const {RewardsPage}=await import('../src/pages/RewardsPage');const {BookingsPage}=await import('../src/pages/BookingsPage');const {FavoritesPage}=await import('../src/pages/FavoritesPage');const {AboutPage,PrivacyPage,TermsPage}=await import('../src/pages/ContentPages');const {DiscoveryHelpPage,DiscoveryContactPage}=await import('../src/pages/DiscoveryHelpPage');
 try{for(const {code} of SUPPORTED_LANGUAGES){dom.window.localStorage.setItem('spotera_lang',code);
  for(const Page of [HomePage,ProfilePage,SettingsPage,RewardsPage,BookingsPage,FavoritesPage,AboutPage,PrivacyPage,TermsPage,DiscoveryHelpPage,DiscoveryContactPage]){
   const html=renderToStaticMarkup(<ToastProvider><AppProvider>{React.createElement(Page as React.ComponentType<any>,{onClaimCoupon:()=>{},onBookNow:()=>{}})}</AppProvider></ToastProvider>);assert.ok(html.length>100,`${code} ${Page.name}`);assert.doesNotMatch(html,/undefined|\[object Object\]/,`${code} ${Page.name}`);
  }
 }}finally{dom.window.close()}
});
