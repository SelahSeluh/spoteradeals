import {get,put,BlobPreconditionFailedError} from '@vercel/blob';
import {randomBytes,randomUUID,createHmac,timingSafeEqual} from 'node:crypto';
import {readStoredJson} from './storedJson.js';
import {validBookingSchedule} from '../utils/bookingSchedule.js';
import {isOfferAvailable} from '../utils/offerAvailability.js';
import type {Booking} from '../types.js';
export type StoredBooking=Booking & {businessId?:string;amountMinor:number;currency:string;refundPolicyVersion:string;refundPolicyAcceptedAt:string;checkoutSessionId?:string};
export type Account={id:string;email:string;name:string;role:'CUSTOMER'|'PARTNER';businessId?:string;hash:string;phone?:string;disabled?:boolean;refundPoints?:number};
export type Commerce={users:Account[];bookings:any[];auditLogs:any[];pointsLedger?:any[]};
export const emptyCommerce=():Commerce=>({users:[],bookings:[],auditLogs:[]});
export function publicAccount(account:Account){const {hash,...safe}=account;return {...safe,membership:'Free'}}
export async function readCommerce(){const current=await readStoredJson<Commerce>('operations/state.json',emptyCommerce);if(!Array.isArray(current.data.users)||!Array.isArray(current.data.bookings)||!Array.isArray(current.data.auditLogs))throw new Error('INVALID_COMMERCE_DATA');return current}
// Each mutation rereads after a conflict. A failed write never reports a successful redemption.
export async function transact<T>(change:(state:Commerce)=>T){for(let attempt=0;attempt<6;attempt++){const current=await readCommerce();const result=change(current.data);try{await put('operations/state.json',JSON.stringify(current.data),{access:'private',addRandomSuffix:false,allowOverwrite:!!current.etag,contentType:'application/json',cacheControlMaxAge:0,...(current.etag?{ifMatch:current.etag}:{})});return result}catch(error){if(attempt===5||(!(error instanceof BlobPreconditionFailedError)&&current.etag))throw error}}throw new Error('CONFLICT')}
export class CommerceError extends Error{constructor(public status:number,message:string){super(message)}}
export function accountCookie(account:Account,now=Date.now()){if(!process.env.ADMIN_SESSION_SECRET||!account.hash)throw new Error('SESSION_NOT_CONFIGURED');const payload=Buffer.from(JSON.stringify({id:account.id,exp:now+28800000})).toString('base64url');return `${payload}.${createHmac('sha256',`${process.env.ADMIN_SESSION_SECRET}:${account.hash}`).update(payload).digest('base64url')}`}
export function verifyAccountCookie(token:string,users:Account[],now=Date.now()){try{if(!process.env.ADMIN_SESSION_SECRET||token.length>2048)return null;const [payload,sig,...extra]=token.split('.');if(extra.length||!sig)return null;const data=JSON.parse(Buffer.from(payload,'base64url').toString());const account=users.find(u=>u.id===data.id&&!u.disabled);if(!account||typeof data.exp!=='number'||!Number.isFinite(data.exp)||data.exp<=now||data.exp>now+28800000)return null;const expected=accountCookie(account,data.exp-28800000).split('.')[1];const a=Buffer.from(sig),b=Buffer.from(expected);return a.length===b.length&&timingSafeEqual(a,b)?account:null}catch{return null}}
export function visibleBookings(state:Commerce,actor:{id:string;role:string;businessId?:string}){return state.bookings.filter(b=>actor.role==='ADMIN'||actor.role==='PARTNER'&&!!actor.businessId&&b.businessId===actor.businessId||actor.role==='CUSTOMER'&&b.userId===actor.id).map(b=>({...b,status:b.status==='confirmed'&&!['paid','paid_points'].includes(b.paymentStatus)?'pending_payment':b.status,...(!['paid','paid_points'].includes(b.paymentStatus)||b.status!=='confirmed'?{bookingCode:'',qrCodeData:''}:{})}))}
export function reserve(state:Commerce,actor:Account,deal:any,input:any,now=Date.now()){
 if(actor.role!=='CUSTOMER')throw new CommerceError(403,'Only customers can reserve an offer.');
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Dubai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(now));
 if(!deal||!isOfferAvailable(deal,now))throw new CommerceError(409,'This offer is unavailable.');
 if(typeof input.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(input.date)||Number.isNaN(Date.parse(input.date))||new Date(input.date).toISOString().slice(0,10)!==input.date||input.date<today||input.date>deal.expiryDate?.slice(0,10))throw new CommerceError(400,'Choose an available booking date.');
 const guests=Number(input.childrenCount);if(!Number.isInteger(guests)||guests<1||guests>50)throw new CommerceError(400,'Choose between 1 and 50 guests.');
 if(typeof input.timeSlot!=='string'||!input.timeSlot.trim()||input.timeSlot.length>80)throw new CommerceError(400,'Choose a booking time.');
 if(!validBookingSchedule(deal,input.date,input.timeSlot))throw new CommerceError(400,'Choose a published venue time and valid day.');
 if(!deal.businessId)throw new CommerceError(409,'This offer has no assigned venue. Please contact support.');
 if(!Number.isFinite(deal.discountPrice)||deal.discountPrice<0)throw new CommerceError(409,'Offer price unavailable.');
 if(input.refundPolicyVersion!=='points-v1')throw new CommerceError(400,'Please accept the points-credit cancellation policy before checkout.');
 const id=randomUUID();
 const amountMinor=Math.round(deal.discountPrice*(deal.priceMode==='guest'?guests:1)*100);
 if(!Number.isSafeInteger(amountMinor)||amountMinor<200||amountMinor>10000000)throw new CommerceError(409,'This offer is not available for online payment.');
 const booking:StoredBooking={id,dealId:deal.id,businessId:deal.businessId,dealTitle:deal.title,businessName:deal.businessName,userId:actor.id,userName:actor.name,userEmail:actor.email,userPhone:actor.phone||'',date:input.date,timeSlot:input.timeSlot,childrenCount:guests,packageSelected:deal.title,totalPrice:amountMinor/100,amountMinor,currency:'aed',status:'pending_payment',bookingCode:'',qrCodeData:'',createdAt:new Date(now).toISOString(),paymentStatus:'unpaid',refundPolicyVersion:'points-v1',refundPolicyAcceptedAt:new Date(now).toISOString()};
 state.bookings.unshift(booking);state.auditLogs.unshift({id:randomUUID(),action:'BOOKING_CREATED',actorId:actor.id,bookingId:id,at:booking.createdAt});return booking;
}
export function redeem(state:Commerce,actor:{id:string;role:string;businessId?:string},code:unknown,now=Date.now()){
 if(!['ADMIN','PARTNER'].includes(actor.role))throw new CommerceError(403,'Only an admin or the assigned business can redeem.');
 const booking=state.bookings.find(b=>b.bookingCode===code);if(!booking||actor.role==='PARTNER'&&(!actor.businessId||booking.businessId!==actor.businessId))throw new CommerceError(404,'Voucher not found for your business.');
 if(booking.status!=='confirmed')throw new CommerceError(409,`Voucher is ${booking.status}. It cannot be redeemed.`);
 if(!['paid','paid_points'].includes(booking.paymentStatus))throw new CommerceError(409,'Payment has not been verified. This voucher cannot be redeemed.');
 const today=new Date(now+4*3600000).toISOString().slice(0,10);if(booking.date<today)throw new CommerceError(409,'Voucher has expired.');
 if(booking.date>today)throw new CommerceError(409,'This voucher is for a future date.');
 booking.status='redeemed';booking.redeemedAt=new Date(now).toISOString();booking.redeemedByBusiness=actor.id;
 state.auditLogs.unshift({id:randomUUID(),action:'VOUCHER_REDEEMED',actorId:actor.id,bookingId:booking.id,at:booking.redeemedAt});return booking;
}
// Refund credit is separate from promotional/loyalty points. 100 points = AED 1.
export function creditRefundPoints(state:Commerce,booking:any){
 if(booking.pointsCredited)return;
 const account=state.users.find(u=>u.id===booking.userId);if(!account)throw new CommerceError(409,'Customer account unavailable.');
 const points=booking.amountMinor;
 if(!Number.isSafeInteger(points)||points<=0)throw new CommerceError(409,'Verified payment amount unavailable.');
 account.refundPoints=(account.refundPoints||0)+points;
 (state.pointsLedger??=[]).unshift({id:randomUUID(),userId:booking.userId,bookingId:booking.id,type:'cancellation_credit',points,at:new Date().toISOString()});
 booking.pointsCredited=points;booking.paymentStatus='refunded_points';
}
export function confirmPaidBooking(state:Commerce,id:string,proof:{sessionId:string;amountMinor:number;currency:string;paymentStatus:string;paymentIntent?:string},now=Date.now()){
 const b=state.bookings.find(b=>b.id===id);if(!b)throw new CommerceError(404,'Booking not found.');
 if(b.checkoutSessionId!==proof.sessionId||b.amountMinor!==proof.amountMinor||proof.currency!=='aed'||proof.paymentStatus!=='paid')throw new CommerceError(409,'Payment verification failed.');
 if(['paid','paid_points','refunded_points'].includes(b.paymentStatus))return b;
 b.paymentStatus='paid';b.paymentIntentId=proof.paymentIntent;b.paidAt=new Date(now).toISOString();
 if(b.status==='cancelled'||b.date<new Date(now+4*3600000).toISOString().slice(0,10)){b.status='cancelled';b.bookingCode='';b.qrCodeData='';creditRefundPoints(state,b);return b}
 if(b.status!=='pending_payment')throw new CommerceError(409,'Booking cannot be confirmed.');
 b.status='confirmed';b.bookingCode=`SP-${randomBytes(18).toString('base64url')}`;b.qrCodeData=b.bookingCode;
 state.auditLogs.unshift({id:randomUUID(),action:'PAYMENT_VERIFIED',actorId:'stripe',bookingId:b.id,at:b.paidAt});return b;
}
export function payWithPoints(state:Commerce,id:string,actor:Account,now=Date.now()){
 const b=state.bookings.find(b=>b.id===id&&b.userId===actor.id);const account=state.users.find(u=>u.id===actor.id);
 if(!b||b.status!=='pending_payment'||b.paymentStatus!=='unpaid'||b.checkoutSessionId)throw new CommerceError(409,'Booking cannot be paid with points.');
 if(!account||(account.refundPoints||0)<b.amountMinor)throw new CommerceError(409,'Not enough refund points to cover this booking. Choose card payment instead.');
 account.refundPoints!-=b.amountMinor;
 (state.pointsLedger??=[]).unshift({id:randomUUID(),userId:actor.id,bookingId:b.id,type:'booking_debit',points:-b.amountMinor,at:new Date(now).toISOString()});
 b.status='confirmed';b.paymentStatus='paid_points';b.paidAt=new Date(now).toISOString();b.bookingCode=`SP-${randomBytes(18).toString('base64url')}`;b.qrCodeData=b.bookingCode;return b;
}
export function cancel(state:Commerce,actor:{id:string;role:string},id:unknown){const booking=state.bookings.find(b=>b.id===id);if(!booking||actor.role!=='ADMIN'&&(actor.role!=='CUSTOMER'||booking.userId!==actor.id))throw new CommerceError(403,'You cannot cancel this booking.');if(booking.status==='cancelled')return booking;if(!['confirmed','pending_payment'].includes(booking.status))throw new CommerceError(409,'Used bookings cannot be cancelled.');booking.status='cancelled';if(['paid','paid_points'].includes(booking.paymentStatus))creditRefundPoints(state,booking);booking.bookingCode='';booking.qrCodeData='';state.auditLogs.unshift({id:randomUUID(),action:'BOOKING_CANCELLED',actorId:actor.id,bookingId:id,at:new Date().toISOString()});return booking}
