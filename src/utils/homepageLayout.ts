import type {HomepageSection} from '../types';
export const homeSections = [
 {id:'hero',title:'Hero & postcard promotions',enabled:true,order:1},
 {id:'categories',title:'Good places photo categories',enabled:true,order:2},
 {id:'trending',title:'Today’s handpicked deals',enabled:true,order:3},
];
export function homepageLayout(sections:HomepageSection[] = []) {
 return homeSections.map(fallback=>({...fallback,...sections.find(s=>s.id===fallback.id)})).filter(s=>s.enabled).sort((a,b)=>a.order-b.order);
}
