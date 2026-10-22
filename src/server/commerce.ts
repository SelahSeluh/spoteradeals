import {get,put,BlobPreconditionFailedError} from '@vercel/blob';
import {randomBytes,randomUUID,createHmac,timingSafeEqual} from 'node:crypto';
import {strongEtag} from './cms.js';
export type Account={id:string;email:string;name:string;role:'CUSTOMER'|'PARTNER';businessId?:string;hash:string;phone?:string;disabled?:boolean};
export type Commerce={users:Account[];bookings:any[];auditLogs:any[]};
export const emptyCommerce=():Commerce=>({users:[],bookings:[],auditLogs:[]});
export function publicAccount(account:Account){const {hash,...safe}=account;return {...safe,membership:'Free'}}
export async function readCommerce(){const file=await get('operations/state.json',{access:'private',useCache:false});return !file||file.statusCode!==200?{data:emptyCommerce(),etag:undefined}:{data:JSON.parse(await new Response(file.stream).text()) as Commerce,etag:strongEtag(file.blob.etag)}}
// Each mutation rereads after a conflict. A failed write never reports a successful redemption.
export async function transact<T>(change:(state:Commerce)=>T){for(let attempt=0;attempt<6;attempt++){const current=await readCommerce();const result=change(current.data);try{await put('operations/state.json',JSON.stringify(current.data),{access:'private',addRandomSuffix:false,allowOverwrite:!!current.etag,contentType:'application/json',cacheControlMaxAge:0,...(current.etag?{ifMatch:current.etag}:{})});return result}catch(error){if(attempt===5||(!(error instanceof BlobPreconditionFailedError)&&current.etag))throw error}}throw new Error('CONFLICT')}
export class CommerceError extends Error{constructor(public status:number,message:string){super(message)}}
export function accountCookie(account:Account,now=Date.now()){const payload=Buffer.from(JSON.stringify({id:account.id,exp:now+28800000})).toString('base64url');return `${payload}.${createHmac('sha256',`${process.env.ADMIN_SESSION_SECRET}:${account.hash}`).update(payload).digest('base64url')}`}
export function verifyAccountCookie(token:string,users:Account[],now=Date.now()){try{if(token.length>2048)return null;const [payload,sig,...extra]=token.split('.');if(extra.length||!sig)return null;const data=JSON.parse(Buffer.from(payload,'base64url').toString());const account=users.find(u=>u.id===data.id&&!u.disabled);if(!account||data.exp<=now||data.exp>now+28800000)return null;const expected=accountCookie(account,data.exp-28800000).split('.')[1];const a=Buffer.from(sig),b=Buffer.from(expected);return a.length===b.length&&timingSafeEqual(a,b)?account:null}catch{return null}}
export function visibleBookings(state:Commerce,actor:{id:string;role:string;businessId?:string}){return state.bookings.filter(b=>actor.role==='ADMIN'||actor.role==='PARTNER'&&b.businessId===actor.businessId||actor.role==='CUSTOMER'&&b.userId===actor.id)}
export function reserve(state:Commerce,actor:Account,deal:any,input:any,now=Date.now()){
 if(actor.role!=='CUSTOMER')throw new CommerceError(403,'Only customers can reserve an offer.');
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Dubai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(now));
 if(!deal||deal.isPublished===false||deal.expiryDate?.slice(0,10)<today||deal.startDate?.slice(0,10)>today||['fully-booked','not-available'].includes(deal.availability))throw new CommerceError(409,'This offer is unavailable.');
 if(typeof input.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(input.date)||Number.isNaN(Date.parse(input.date))||input.date<today||input.date>deal.expiryDate?.slice(0,10))throw new CommerceError(400,'Choose an available booking date.');
 const guests=Number(input.childrenCount);if(!Number.isInteger(guests)||guests<1||guests>50)throw new CommerceError(400,'Choose between 1 and 50 guests.');
 if(typeof input.timeSlot!=='string'||input.timeSlot.length>80)throw new CommerceError(400,'Choose a booking time.');
 if(!Number.isFinite(deal.discountPrice)||deal.discountPrice<0)throw new CommerceError(409,'Offer price unavailable.');
 const id=randomUUID(),code=`SP-${randomBytes(18).toString('base64url')}`;
 const booking={id,dealId:deal.id,businessId:deal.businessId,dealTitle:deal.title,businessName:deal.businessName,userId:actor.id,userName:actor.name,userEmail:actor.email,userPhone:actor.phone||'',date:input.date,timeSlot:input.timeSlot,childrenCount:guests,packageSelected:deal.title,totalPrice:Math.round(deal.discountPrice*guests*100)/100,status:'confirmed',bookingCode:code,qrCodeData:code,createdAt:new Date(now).toISOString(),paymentStatus:'pay_at_venue'};
 state.bookings.unshift(booking);state.auditLogs.unshift({id:randomUUID(),action:'BOOKING_CREATED',actorId:actor.id,bookingId:id,at:booking.createdAt});return booking;
}
export function redeem(state:Commerce,actor:{id:string;role:string;businessId?:string},code:unknown,now=Date.now()){
 if(!['ADMIN','PARTNER'].includes(actor.role))throw new CommerceError(403,'Only an admin or the assigned business can redeem.');
 const booking=state.bookings.find(b=>b.bookingCode===code);if(!booking||actor.role==='PARTNER'&&(!actor.businessId||booking.businessId!==actor.businessId))throw new CommerceError(404,'Voucher not found for your business.');
 if(booking.status!=='confirmed')throw new CommerceError(409,`Voucher is ${booking.status}. It cannot be redeemed.`);
 const today=new Date(now+4*3600000).toISOString().slice(0,10);if(booking.date<today)throw new CommerceError(409,'Voucher has expired.');
 if(booking.date>today)throw new CommerceError(409,'This voucher is for a future date.');
 booking.status='redeemed';booking.redeemedAt=new Date(now).toISOString();booking.redeemedByBusiness=actor.id;
 state.auditLogs.unshift({id:randomUUID(),action:'VOUCHER_REDEEMED',actorId:actor.id,bookingId:booking.id,at:booking.redeemedAt});return booking;
}
export function cancel(state:Commerce,actor:{id:string;role:string},id:unknown){const booking=state.bookings.find(b=>b.id===id);if(!booking||actor.role!=='ADMIN'&&(actor.role!=='CUSTOMER'||booking.userId!==actor.id))throw new CommerceError(403,'You cannot cancel this booking.');if(booking.status!=='confirmed')throw new CommerceError(409,'Only a confirmed booking can be cancelled.');booking.status='cancelled';state.auditLogs.unshift({id:randomUUID(),action:'BOOKING_CANCELLED',actorId:actor.id,bookingId:id,at:new Date().toISOString()});return booking}
