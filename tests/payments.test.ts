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
