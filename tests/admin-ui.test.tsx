import {test} from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {JSDOM} from 'jsdom';
import {AppProvider} from '../src/context/AppContext';
import {ToastProvider} from '../src/context/ToastContext';
import {AdminLocationsManager} from '../src/components/admin/AdminLocationsManager';
import {OpeningAnimation} from '../src/components/OpeningAnimation';
import type {HomepageSection} from '../src/types';
import {homepageLayout} from '../src/utils/homepageLayout';

test('locations render the published emirate-only shape without crashing',()=>{
 const dom=new JSDOM('',{url:'https://spoteradeals.com'});Object.assign(globalThis,{window:dom.window,document:dom.window.document});
 dom.window.localStorage.setItem('spotera_locations_list',JSON.stringify([{id:'dubai',emirate:'Dubai',enabled:true}]));
 try{const html=renderToStaticMarkup(<ToastProvider><AppProvider><AdminLocationsManager/></AppProvider></ToastProvider>);assert.match(html,/Dubai/);assert.match(html,/UAE Locations/);}finally{dom.window.close()}
});
test('embedded intro stays within the simulator while fullscreen intro retains its normal positioning',()=>{
 const dom=new JSDOM('',{url:'https://spoteradeals.com'});Object.assign(globalThis,{window:dom.window,document:dom.window.document});
 try{const render=(embedded:boolean)=>renderToStaticMarkup(<ToastProvider><AppProvider><OpeningAnimation embedded={embedded}/></AppProvider></ToastProvider>);assert.match(render(true),/position:absolute/);assert.doesNotMatch(render(false),/position:absolute/);}finally{dom.window.close()}
});
test('homepage respects visibility and order without mutating saved section arrays',()=>{
 const sections:HomepageSection[]=[{id:'hero',title:'Hero',enabled:false,order:1},{id:'trending',title:'Deals',enabled:true,order:2},{id:'categories',title:'Places',enabled:true,order:3}];
 const before=JSON.stringify(sections);assert.deepEqual(homepageLayout(sections).map(s=>s.id),['trending','categories']);assert.equal(JSON.stringify(sections),before);
});
