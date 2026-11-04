import type {Deal} from '../types';
export const OPEN_HOURS_SLOT='During advertised opening hours';
export function bookingTimeSlots(deal:Pick<Deal,'bookingTimeSlots'>){
 const slots=deal.bookingTimeSlots;
 const configured=Array.isArray(slots)?slots.filter(s=>typeof s==='string'&&s.trim()&&s.length<=80):[];
 return configured.length?configured:[OPEN_HOURS_SLOT];
}
export function validBookingSchedule(deal:Pick<Deal,'bookingTimeSlots'|'bookingWeekdays'>,date:string,slot:string){
 if(!bookingTimeSlots(deal).includes(slot))return false;
 if(deal.bookingWeekdays!==undefined){
  if(!Array.isArray(deal.bookingWeekdays)||!deal.bookingWeekdays.includes(new Date(date+'T12:00:00Z').getUTCDay()))return false;
 }
 return true;
}
// Date-only offer expiry includes the entire final day in the UAE.
export function offerBoundary(value:string|undefined,end=false):number|null{
 if(!value)return null;
 const dateOnly=/^\d{4}-\d{2}-\d{2}$/.test(value);
 const time=Date.parse(dateOnly?value+'T00:00:00+04:00':value);
 return Number.isFinite(time)?time+(dateOnly&&end?86400000:0):null;
}
