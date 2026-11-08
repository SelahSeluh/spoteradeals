import {WebDiscoverySections} from '../components/WebDiscoverySections';
import {homepageLayout} from '../utils/homepageLayout';
import React,{useState} from 'react';
import {Search,Coffee,Landmark,TreePalm,Utensils,ArrowRight} from 'lucide-react';
import {Deal} from '../types';
import {useApp} from '../context/AppContext';
import {MapArtwork,useDesignText} from '../components/DesignPrimitives';
import {DealCard} from '../components/DealCard';
import {isOfferAvailable} from '../utils/offerAvailability';
export const HomePage:React.FC<{onClaimCoupon:(d:Deal)=>void;onBookNow:(d:Deal)=>void}>=()=>{
 const {homepageConfig,user,isLoggedIn,selectedCity,deals,setActiveView,setSearchQuery,setSelectedCategory}=useApp();const d=useDesignText();const [query,setQuery]=useState('');
 const hour=Number(new Intl.DateTimeFormat('en-GB',{hour:'2-digit',hourCycle:'h23',timeZone:'Asia/Dubai'}).format(new Date()));
 const greeting=d(hour<12?'morning':hour<18?'afternoon':'evening');
 const available=deals.filter(x=>isOfferAvailable(x)&&(selectedCity==='All'||x.city===selectedCity));
 const ordered=[...available.filter(x=>x.isFeatured),...available.filter(x=>!x.isFeatured)];
 const picked:Deal[]=[];for(const pattern of [/restaurant|cafe|café|dining|brunch/i,/attraction|entertainment|snow/i,/outdoor|park|water/i,/kids|play/i]){const next=ordered.find(x=>!picked.includes(x)&&pattern.test(`${x.category} ${x.title}`));if(next)picked.push(next)}
 const featured=[...picked,...ordered.filter(x=>!picked.includes(x))].slice(0,8);
 const layout=homepageLayout(homepageConfig.sections);const sectionStyle=(id:string)=>({order:layout.findIndex(s=>s.id===id)});const enabled=(id:string)=>layout.some(s=>s.id===id);
 const categories=[{label:d('cafes'),value:'Cafe',icon:Coffee},{label:d('attractions'),value:'Attractions',icon:Landmark},{label:d('outdoors'),value:'Parks',icon:TreePalm},{label:d('dining'),value:'Restaurants',icon:Utensils}];
 return <div className="fn-home" style={{display:'flex',flexDirection:'column'}}><section className="fn-hero" hidden={!enabled('hero')} style={sectionStyle('hero')}><div className="fn-hero-copy"><p className="fn-greeting">{greeting}{isLoggedIn&&user.name?`, ${user.name.split(' ')[0]}`:''}</p><h1>{d('headline')}</h1><p className="fn-hero-description">{d('discovery')}</p><form className="fn-search" onSubmit={e=>{e.preventDefault();setSearchQuery(query.trim());setActiveView('search')}}><Search size={21}/><input aria-label={d('search')} placeholder={d('search')} value={query} onChange={e=>setQuery(e.target.value)}/><button aria-label={d('searchAction')}><ArrowRight size={20}/></button></form></div><MapArtwork className="fn-hero-map"/></section><div className="fn-category-grid" hidden={!enabled('categories')} style={sectionStyle('categories')}>{categories.map(({label,value,icon:Icon})=><button key={value} onClick={()=>{setSelectedCategory(value as any);setActiveView('explore')}}><Icon size={27}/><span>{label}</span></button>)}</div><section className="fn-featured" hidden={!enabled('trending')} style={sectionStyle('trending')}><div className="fn-section-heading"><h2>{d('featured')}{selectedCity!=='All'?` · ${selectedCity}`:''}</h2><button onClick={()=>{setSelectedCategory('All');setActiveView('explore')}}>{d('seeAll')}<ArrowRight size={16}/></button></div><div className="fn-deal-grid">{featured.map(deal=><DealCard key={deal.id} deal={deal}/>)}</div>{!featured.length&&<div className="fn-empty"><h3>{d('noResults')}</h3><p>{d('trySearch')}</p><button onClick={()=>setActiveView('explore')}>{d('explore')}</button></div>}</section><WebDiscoverySections/></div>
};
