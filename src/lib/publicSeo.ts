export const publicSeoPages = {
 '/': {title:'SpoteraDeals — UAE Family Deals & Experiences', heading:'SpoteraDeals — family days out across the UAE', description:'Discover family experiences, kids play areas, waterparks and dining deals across Dubai, Abu Dhabi and the UAE with SpoteraDeals.'},
 '/explore': {title:'Explore UAE Family Experiences & Deals | SpoteraDeals',heading:'Explore family experiences across the UAE',description:'Browse family activities, kids play areas, waterparks, attractions and dining offers. Filter SpoteraDeals experiences by city, category and date.'},
 '/about': {title:'About SpoteraDeals | UAE Family Experiences',heading:'About SpoteraDeals',description:'SpoteraDeals helps families discover activities, attractions, kids play areas, waterparks and dining offers across Dubai, Abu Dhabi and the UAE.'},
 '/faq': {title:'Help & Frequently Asked Questions | SpoteraDeals',heading:'SpoteraDeals help and frequently asked questions',description:'Find help with SpoteraDeals accounts, bookings, digital passes, payment status and cancellation points. Check each offer’s venue terms before booking.'},
 '/contact': {title:'Contact & Support | SpoteraDeals',heading:'Contact SpoteraDeals support',description:'Find support for SpoteraDeals bookings, account access, digital passes and cancellation points, or contact the venue about an experience.'},
 '/privacy': {title:'Privacy Policy | SpoteraDeals',heading:'SpoteraDeals privacy policy',description:'Read how SpoteraDeals handles account information and personal data when you browse UAE experiences and manage bookings.'},
 '/terms': {title:'Terms & Conditions | SpoteraDeals',heading:'SpoteraDeals terms and conditions',description:'Read SpoteraDeals terms, booking conditions and information about digital passes, payments and cancellation points.'}
} as const;
export type PublicSeoPath=keyof typeof publicSeoPages;
export function publicPathForView(view:string):PublicSeoPath|null{if(view==='home'||view==='deals')return '/';const path=`/${view}`;return path in publicSeoPages?path as PublicSeoPath:null}
