export const publicSeoPages = {
 '/': {title:'SpoteraDeals — UAE Deals, Dining & Things to Do',heading:'SpoteraDeals — discover your next great day out',description:'Discover dining offers, attractions and experiences in Dubai, Abu Dhabi and across the UAE. Great days out for individuals, couples, friends and families.'},
 '/explore': {title:'Explore UAE Deals & Experiences | SpoteraDeals',heading:'Explore deals, dining and things to do across the UAE',description:'Find dining offers, attractions, activities and experiences across the UAE. Browse family-friendly places for a solo outing, a day with friends or a family adventure.'},
 '/dubai': {title:'Dubai Deals, Dining & Things to Do | SpoteraDeals',heading:'Discover Dubai deals and experiences',description:'Explore dining offers, attractions and things to do in Dubai. Browse family-friendly experiences and check each venue’s prices, dates and terms before booking.'},
 '/abu-dhabi': {title:'Abu Dhabi Deals & Experiences | SpoteraDeals',heading:'Discover Abu Dhabi deals and experiences',description:'Find attractions, activities and dining offers in Abu Dhabi. Explore great days out for individuals, couples, friends and families with SpoteraDeals.'},
 '/dining': {title:'Dining Offers, Cafés & Restaurants | SpoteraDeals',heading:'Discover dining offers, cafés and restaurants',description:'Browse dining offers at family-friendly cafés and restaurants across the UAE. Find somewhere new to enjoy a meal with friends, as a couple or with family.'},
 '/about': {title:'About SpoteraDeals | UAE Deals & Experiences',heading:'About SpoteraDeals',description:'SpoteraDeals helps individuals, couples, friends and families discover family-friendly places, dining offers, attractions and experiences across the UAE.'},
 '/faq': {title:'Help & Frequently Asked Questions | SpoteraDeals',heading:'SpoteraDeals help and frequently asked questions',description:'Find help with SpoteraDeals accounts, bookings, digital passes, payment status and cancellation points. Check each offer’s venue terms before booking.'},
 '/contact': {title:'Contact & Support | SpoteraDeals',heading:'Contact SpoteraDeals support',description:'Find support for SpoteraDeals bookings, account access, digital passes and cancellation points, or contact the venue about an experience.'},
 '/privacy': {title:'Privacy Policy | SpoteraDeals',heading:'SpoteraDeals privacy policy',description:'Read how SpoteraDeals handles account information and personal data when you browse UAE experiences and manage bookings.'},
 '/terms': {title:'Terms & Conditions | SpoteraDeals',heading:'SpoteraDeals terms and conditions',description:'Read SpoteraDeals terms, booking conditions and information about digital passes, payments and cancellation points.'}
} as const;
export type PublicSeoPath=keyof typeof publicSeoPages;
export const publicNavigation=[
 {path:'/explore',label:'Explore Experiences',ar:'استكشف التجارب'},
 {path:'/dubai',label:'Dubai Deals',ar:'عروض دبي'},
 {path:'/abu-dhabi',label:'Abu Dhabi Deals',ar:'عروض أبوظبي'},
 {path:'/dining',label:'Dining Offers',ar:'عروض المطاعم'},
 {path:'/about',label:'About SpoteraDeals',ar:'عن سبوتيرا ديلز'},
 {path:'/contact',label:'Contact & Support',ar:'تواصل معنا'}
] as const;
export function initialDiscoveryFilters(path:string):{city:'All'|'Dubai'|'Abu Dhabi';category:'All'|'Restaurants'}{
 const clean=path.replace(/\/+$/,'')||'/';
 return {city:clean==='/dubai'?'Dubai':clean==='/abu-dhabi'?'Abu Dhabi':'All',category:clean==='/dining'?'Restaurants':'All'};
}
export function discoveryPathForFilters(city:string,category:string):PublicSeoPath{
 if(category==='All'&&city==='Dubai')return '/dubai';
 if(category==='All'&&city==='Abu Dhabi')return '/abu-dhabi';
 if(category==='Restaurants'&&city==='All')return '/dining';
 return '/explore';
}
export function publicPathForView(view:string):PublicSeoPath|null{if(view==='home'||view==='deals')return '/';const path=`/${view}`;return path in publicSeoPages?path as PublicSeoPath:null}
