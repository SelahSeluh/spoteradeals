import React from 'react';
import { Search, ArrowRight, Waves, Compass, Utensils, Trees, Shapes } from 'lucide-react';
import { useApp } from '../context/AppContext';
const categories = [
 {label:'All experiences',value:'All',icon:Compass},
 {label:'Water adventures',value:'Attractions',icon:Waves},
 {label:'Indoor play',value:'Kids Play Areas',icon:Shapes},
 {label:'Parks & outdoors',value:'Family Experiences',icon:Trees},
 {label:'Food & dining',value:'Restaurants',icon:Utensils},
];
export const SpoteraPlayfulHero: React.FC = () => {
 const {searchQuery,setSearchQuery,setSelectedCategory,setActiveView}=useApp();
 return <section className="cutouts-hero" aria-labelledby="cutouts-title">
  <div className="cutouts-photo" role="img" aria-label="Dubai skyline and waterfront gardens"/>
  <div className="cutouts-shape cutouts-turquoise" aria-hidden="true"/>
  <div className="cutouts-shape cutouts-orange" aria-hidden="true"/>
  <div className="cutouts-copy"><span className="cutouts-eyebrow">YOUR NEXT UAE FAMILY DAY OUT</span>
   <h1 id="cutouts-title">Explore more.<br/>Make memories.<br/><em>Together.</em></h1>
   <p>Discover activities, parks and family deals<br/>across the UAE.</p>
   <button className="cutouts-cta" onClick={()=>{setSelectedCategory('All');setActiveView('explore')}}>Explore experiences <ArrowRight size={20}/></button>
  </div>
  <form className="cutouts-search" onSubmit={e=>{e.preventDefault();setActiveView('search')}}>
   <span className="cutouts-location">UAE adventures</span><Search size={20}/><input aria-label="Search activities" placeholder="Search activities, areas or keywords" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}/><button type="submit">Search <ArrowRight size={18}/></button>
  </form>
  <div className="cutouts-categories">{categories.map(({label,value,icon:Icon})=><button key={value} onClick={()=>{setSelectedCategory(value as Parameters<typeof setSelectedCategory>[0]);setActiveView('explore')}}><span><Icon size={25}/></span>{label}</button>)}</div>
 </section>;
};
