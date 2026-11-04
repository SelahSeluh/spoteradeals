import test from 'node:test';
import assert from 'node:assert/strict';
import Stripe from 'stripe';
import {paymentsConfigured,stripeClient} from '../src/server/payments';
import {paymentCopy} from '../src/utils/paymentPolicy';

test('payments fail closed without key, signing secret and explicit activation',()=>{
 const saved={key:process.env.STRIPE_RESTRICTED_KEY,secret:process.env.STRIPE_WEBHOOK_SECRET,enabled:process.env.STRIPE_PAYMENTS_ENABLED};
 try{delete process.env.STRIPE_RESTRICTED_KEY;delete process.env.STRIPE_WEBHOOK_SECRET;delete process.env.STRIPE_PAYMENTS_ENABLED;
 assert.equal(paymentsConfigured(),false);assert.throws(()=>stripeClient(),/not enabled/);
 process.env.STRIPE_RESTRICTED_KEY='rk_test_fixture';process.env.STRIPE_WEBHOOK_SECRET='whsec_fixture';assert.equal(paymentsConfigured(),false);
 process.env.STRIPE_PAYMENTS_ENABLED='true';assert.equal(paymentsConfigured(),true);
 }finally{for(const [k,v] of Object.entries({STRIPE_RESTRICTED_KEY:saved.key,STRIPE_WEBHOOK_SECRET:saved.secret,STRIPE_PAYMENTS_ENABLED:saved.enabled})){if(v===undefined)delete process.env[k];else process.env[k]=v}}
});
test('Stripe requires valid raw-body signature and rejects modified payloads',()=>{
 const stripe=new Stripe('rk_test_fixture'),secret='whsec_fixture';const payload=JSON.stringify({id:'evt_fixture',type:'checkout.session.completed',data:{object:{payment_status:'paid'}}});
 const header=stripe.webhooks.generateTestHeaderString({payload,secret});assert.equal(stripe.webhooks.constructEvent(payload,header,secret).id,'evt_fixture');
 assert.throws(()=>stripe.webhooks.constructEvent(payload+' ',header,secret));assert.throws(()=>stripe.webhooks.constructEvent(payload,'forged',secret));
});
test('checkout has explicit localized points policy in English, Arabic, French and Russian',()=>{for(const l of ['en','ar','fr','ru']){const copy=paymentCopy(l);assert.ok(copy.policy.includes('100'));assert.ok(copy.pay);assert.ok(copy.confirm);assert.ok(copy.cancel)}});

test('hosted checkout retains the login hostname and trusts only the server price',async()=>{
 const {startCheckout,STRIPE_ACCOUNT,checkoutOrigin}=await import('../src/server/payments');
 let sent:any,options:any;
 const fake={accounts:{retrieve:async()=>({id:STRIPE_ACCOUNT,charges_enabled:true})},checkout:{sessions:{create:async(payload:any,opts:any)=>{sent=payload;options=opts;return {id:'cs_test_fixture',url:'https://checkout.stripe.com/test'}}}}} as any;
 const booking={id:'booking-1',userEmail:'fixture@example.com',amountMinor:9900,dealTitle:'Fixture entry'};
 await startCheckout(booking,checkoutOrigin('spoteradeals.com'),fake);
 assert.match(sent.success_url,/^https:\/\/spoteradeals.com\//);assert.match(sent.cancel_url,/^https:\/\/spoteradeals.com\//);
 assert.equal(sent.line_items[0].price_data.unit_amount,9900);assert.equal(sent.line_items[0].price_data.currency,'aed');
 assert.equal(options.idempotencyKey,'spotera-booking-booking-1');
 assert.throws(()=>checkoutOrigin('attacker.example'));assert.throws(()=>checkoutOrigin(undefined));
 await assert.rejects(startCheckout(booking,'https://spoteradeals.com@attacker.example',fake));
});
test('disabled or wrong Stripe accounts cannot create a checkout session',async()=>{
 const {startCheckout,STRIPE_ACCOUNT}=await import('../src/server/payments');
 for(const account of [{id:STRIPE_ACCOUNT,charges_enabled:false},{id:'acct_wrong',charges_enabled:true}]){
  const fake={accounts:{retrieve:async()=>account},checkout:{sessions:{create:async()=>{throw new Error('must not be called')}}}} as any;
  await assert.rejects(startCheckout({id:'fixture'},undefined,fake),/not ready/);
 }
});
test('unpaid and mismatched Stripe sessions cannot reach booking fulfillment',async()=>{
 const {settleCheckout}=await import('../src/server/payments');let writes=0;
 const persist=(async()=>{writes++;return {}}) as any;
 assert.equal(await settleCheckout({payment_status:'unpaid'} as any,persist),null);
 await assert.rejects(settleCheckout({payment_status:'paid',mode:'payment',client_reference_id:'other',metadata:{bookingId:'booking-1'}} as any,persist),/Invalid payment reference/);
 assert.equal(writes,0);
});
