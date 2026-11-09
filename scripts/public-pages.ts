import type {Plugin} from 'vite';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {publicSeoPages} from '../src/lib/publicSeo';
const escape=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export function publicPages():Plugin{let outDir:string;return {name:'spotera-public-pages',apply:'build',configResolved(config){outDir=path.resolve(config.root,config.build.outDir)},async closeBundle(){
 const source=await readFile(path.join(outDir,'index.html'),'utf8');
 for(const [route,meta] of Object.entries(publicSeoPages)){
  let html=source.replace(/<title>[\s\S]*?<\/title>/,`<title>${escape(meta.title)}</title>`);
  for(const name of ['description','og:description','twitter:description'])html=html.replace(new RegExp(`(<meta (?:name|property)="${name}" content=")[^"]*("[^>]*>)`),`$1${escape(meta.description)}$2`);
  for(const name of ['og:title','twitter:title'])html=html.replace(new RegExp(`(<meta (?:name|property)="${name}" content=")[^"]*("[^>]*>)`),`$1${escape(meta.title)}$2`);
  html=html.replace(/(<link rel="canonical" href=")[^"]*"/,`$1https://spoteradeals.com${route}"`).replace(/(<meta property="og:url" content=")[^"]*"/,`$1https://spoteradeals.com${route}"`);
  const content=`<div id="root"><main id="spotera-initial-loader" style="max-width:860px;margin:0 auto;padding:32px 20px;color:#123469;background:#fff;font:16px/1.6 Arial,sans-serif"><p style="font-size:25px;font-weight:800">Spotera<span style="color:#ff7417">Deals</span></p><h1>${escape(meta.heading)}</h1><p>${escape(meta.description)}</p><p>Plan your next family day out. Browse offers as a guest and review each venue’s availability, pricing and booking terms.</p><nav aria-label="SpoteraDeals public pages" style="display:flex;flex-wrap:wrap;gap:16px"><a href="/">Home</a><a href="/explore">Explore experiences</a><a href="/about">About SpoteraDeals</a><a href="/faq">Help &amp; FAQs</a><a href="/contact">Contact</a></nav><p role="status">Loading SpoteraDeals…</p><noscript><p>Enable JavaScript for search, filters, sign-in and bookings.</p></noscript></main></div>`;
  html=html.replace(/<!-- PUBLIC-CONTENT-START -->[\s\S]*?<!-- PUBLIC-CONTENT-END -->/,`<!-- PUBLIC-CONTENT-START -->${content}<!-- PUBLIC-CONTENT-END -->`);
  const destination=route==='/'?outDir:path.join(outDir,route.slice(1));await mkdir(destination,{recursive:true});await writeFile(path.join(destination,'index.html'),html);
 }
 const urls=Object.keys(publicSeoPages).map(route=>`<url><loc>https://spoteradeals.com${route}</loc></url>`).join('');
 await writeFile(path.join(outDir,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>\n`);
}}}
