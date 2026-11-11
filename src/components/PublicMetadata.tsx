import {useEffect} from 'react';
import {useApp} from '../context/AppContext';
import {publicPathForView,publicSeoPages,discoveryPathForFilters} from '../lib/publicSeo';
export function PublicMetadata(){const {activeView,selectedDealId,deals,selectedCity,selectedCategory}=useApp();useEffect(()=>{
 const path=activeView==='explore'?discoveryPathForFilters(selectedCity,selectedCategory):publicPathForView(activeView);
 const deal=activeView==='deal-detail'?deals.find(d=>d.id===selectedDealId):undefined;
 const rootAuth=activeView==='auth'&&window.location.pathname==='/'&&!window.location.hash;
 const meta=path?publicSeoPages[path]:rootAuth?publicSeoPages['/']:null;
 const canonical=deal?`/deal/${encodeURIComponent(deal.id)}`:path||'/';
 document.title=deal?`${deal.title} | SpoteraDeals`:meta?.title||`${activeView==='auth'?'Sign in':'My account'} | SpoteraDeals`;
 const description=deal?deal.description:meta?.description;
 if(description)document.querySelector('meta[name="description"]')?.setAttribute('content',description);
 document.querySelector('link[rel="canonical"]')?.setAttribute('href',`https://spoteradeals.com${canonical}`);
 const robots=meta||deal?'index, follow, max-image-preview:large':'noindex, follow';
 document.querySelector('meta[name="robots"]')?.setAttribute('content',robots);
 document.querySelector('meta[name="googlebot"]')?.setAttribute('content',robots);
 document.querySelector('meta[property="og:title"]')?.setAttribute('content',document.title);
 document.querySelector('meta[property="og:url"]')?.setAttribute('content',`https://spoteradeals.com${canonical}`);
 if(description)document.querySelector('meta[property="og:description"]')?.setAttribute('content',description);
 document.querySelector('meta[name="twitter:title"]')?.setAttribute('content',document.title);
 if(description)document.querySelector('meta[name="twitter:description"]')?.setAttribute('content',description);
 },[activeView,selectedDealId,deals,selectedCity,selectedCategory]);return null}
