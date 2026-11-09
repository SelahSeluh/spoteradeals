import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {JSDOM} from 'jsdom';
import {translations} from '../src/lib/translations';
import {designCopy,designCopyRows,designKeys,designText} from '../src/lib/findNextCopy';
import {SUPPORTED_LANGUAGES,isRtlLang,getLocalizedTitle} from '../src/utils/i18nHelper';
import {AppProvider} from '../src/context/AppContext';
import {ToastProvider} from '../src/context/ToastContext';
import {AuthPage} from '../src/pages/AuthPage';
import {OpeningAnimation} from '../src/components/OpeningAnimation';
import {paymentCopy} from '../src/utils/paymentPolicy';
import {PaymentPolicy} from '../src/components/PaymentPolicy';

test('all seven requested languages have complete base and redesigned interface dictionaries',()=>{
 assert.deepEqual(SUPPORTED_LANGUAGES.map(l=>l.code).sort(),['en','ar','fr','ru','zh','ur','af'].sort());
 for(const {code} of SUPPORTED_LANGUAGES){
  assert.equal(designCopyRows[code].length,designKeys.length,code);
  for(const key of Object.keys(translations.en))assert.ok(translations[code][key]?.trim(),`${code}: ${key}`);
  for(const key of designKeys)assert.ok(designCopy[code][key]?.trim(),`${code}: ${key}`);
 }
 assert.equal(isRtlLang('ur'),true);assert.equal(isRtlLang('ar'),true);
 for(const l of ['en','fr','ru','zh','af'] as const)assert.equal(isRtlLang(l),false);
});
test('sign-in renders a localized heading, safe password fields and no application navigation in every language',()=>{
 for(const {code} of SUPPORTED_LANGUAGES){
  const dom=new JSDOM('',{url:'http://localhost/#auth'});Object.assign(globalThis,{window:dom.window,document:dom.window.document});dom.window.localStorage.setItem('spotera_lang',code);
  try{const html=renderToStaticMarkup(<ToastProvider><AppProvider><AuthPage/></AppProvider></ToastProvider>);const doc=new JSDOM(html).window.document;
   assert.equal(doc.querySelector('h1')?.textContent,designText(code,'welcome'));
   assert.ok(doc.querySelector('input[type="email"][autocomplete="email"]'));
   assert.ok(doc.querySelector('input[type="password"][autocomplete="current-password"]'));
   assert.equal(doc.querySelector('nav'),null);
   assert.equal(doc.querySelectorAll('select option').length,7);
   assert.ok(doc.querySelector('.pp-auth-methods'));assert.ok(doc.querySelector('form[hidden]'));
  }finally{dom.window.close()}
 }
});
test('the Paper Picnic intro keeps text as sharp HTML and has a working skip control in every language',()=>{
 for(const {code} of SUPPORTED_LANGUAGES){
  const dom=new JSDOM('',{url:'http://localhost/'});Object.assign(globalThis,{window:dom.window,document:dom.window.document});dom.window.localStorage.setItem('spotera_lang',code);
  try{const html=renderToStaticMarkup(<ToastProvider><AppProvider><OpeningAnimation/></AppProvider></ToastProvider>);const doc=new JSDOM(html).window.document;
   assert.equal(doc.querySelector('h1')?.textContent,'SpoteraDeals');
   assert.ok(doc.querySelector('.pp-intro-water[role="img"]'));
   assert.ok(doc.querySelector('button')?.textContent?.includes(designText(code,'skip')));
   assert.equal(doc.querySelector('nav'),null);
  }finally{dom.window.close()}
 }
});
test('refund policy is available in all seven languages and Urdu policy is right-to-left',()=>{
 for(const {code} of SUPPORTED_LANGUAGES){const copy=paymentCopy(code);assert.ok(copy.policy.includes('100'));assert.ok(copy.confirm);assert.ok(copy.pay);}
 assert.notEqual(paymentCopy('ur').policy,paymentCopy('en').policy);assert.notEqual(paymentCopy('af').policy,paymentCopy('en').policy);assert.notEqual(paymentCopy('zh').policy,paymentCopy('en').policy);
 assert.match(renderToStaticMarkup(<PaymentPolicy language="ur"/>),/dir="rtl"/);
});
test('merchant copy uses optional Urdu and Afrikaans fields while retaining source text when untranslated',()=>{
 const deal={title:'Source offer',title_ur:'اردو پیشکش',title_af:'Afrikaanse aanbod'} as any;
 assert.equal(getLocalizedTitle(deal,'ur'),'اردو پیشکش');assert.equal(getLocalizedTitle(deal,'af'),'Afrikaanse aanbod');assert.equal(getLocalizedTitle(deal,'zh'),'Source offer');
});
