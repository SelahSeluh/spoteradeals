import Stripe from 'stripe';
import {CommerceError,confirmPaidBooking,transact} from './commerce.js';

export const STRIPE_ACCOUNT='acct_1TOui83YTRMQpiD2';
export const CHECKOUT_ORIGIN='https://www.spoteradeals.com';
export function paymentsConfigured(){return Boolean(process.env.STRIPE_RESTRICTED_KEY&&process.env.STRIPE_WEBHOOK_SECRET&&process.env.STRIPE_PAYMENTS_ENABLED==='true')}
export function stripeClient(){
 if(!paymentsConfigured())throw new CommerceError(503,'Online payments are not enabled yet. No booking or ticket has been confirmed.');
 return new Stripe(process.env.STRIPE_RESTRICTED_KEY!,{maxNetworkRetries:2,timeout:15000});
}
export async function startCheckout(booking:any){
 const stripe=stripeClient();
 // Verify the server credential belongs to the account explicitly selected by the owner.
 const account=await stripe.accounts.retrieve(null);
 if(account.id!==STRIPE_ACCOUNT||!account.charges_enabled)throw new CommerceError(503,'The payment account is not ready to accept payments.');
 return stripe.checkout.sessions.create({
   mode:'payment',client_reference_id:booking.id,customer_email:booking.userEmail,
   integration_identifier:'spotera_checkout_kmvqznrx',
   metadata:{bookingId:booking.id,refundPolicyVersion:'points-v1'},
   line_items:[{quantity:1,price_data:{currency:'aed',unit_amount:booking.amountMinor,product_data:{name:booking.dealTitle.slice(0,200)}}}],
   success_url:`${CHECKOUT_ORIGIN}/?checkout_session_id={CHECKOUT_SESSION_ID}#bookings`,
   cancel_url:`${CHECKOUT_ORIGIN}/?checkout_cancelled=1#bookings`,
   expires_at:Math.floor(Date.now()/1000)+1800,
   custom_text:{submit:{message:'Eligible cancellations are credited as Spotera refund points, not cash. 100 points = AED 1. Points pay in full for future bookings. Refunds required by law are unaffected.'}},
 },{idempotencyKey:`spotera-booking-${booking.id}`});
}
export async function settleCheckout(session:Stripe.Checkout.Session){
 if(session.payment_status!=='paid')return null;
 if(session.mode!=='payment'||!session.metadata?.bookingId||session.client_reference_id!==session.metadata.bookingId)throw new CommerceError(409,'Invalid payment reference.');
 return transact(state=>confirmPaidBooking(state,session.metadata!.bookingId,{
   sessionId:session.id,amountMinor:session.amount_total!,currency:session.currency!,paymentStatus:session.payment_status,
   paymentIntent:typeof session.payment_intent==='string'?session.payment_intent:session.payment_intent?.id,
 }));
}
