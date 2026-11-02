import test from 'node:test';
import assert from 'node:assert/strict';
import {emptyCommerce,reserve,redeem,cancel,visibleBookings,accountCookie,verifyAccountCookie,publicAccount,confirmPaidBooking,payWithPoints,type Account,type Commerce} from '../src/server/commerce';
const now=Date.parse('2026-10-22T08:00:00Z');
const customer:Account={id:'c1',name:'Customer',email:'c@example.com',role:'CUSTOMER',hash:'hashed'};
const business={id:'p1',role:'PARTNER',businessId:'b1'},other={id:'p2',role:'PARTNER',businessId:'b2'},admin={id:'admin',role:'ADMIN'};
const deal={id:'d1',businessId:'b1',businessName:'Venue',title:'Offer',discountPrice:50,priceMode:'guest',expiryDate:'2026-12-31',isPublished:true};
const input={date:'2026-10-22',timeSlot:'12:00',childrenCount:2,totalPrice:1,refundPolicyVersion:'points-v1'};
function paid(state:Commerce){if(!state.users.some(u=>u.id===customer.id))state.users.push({...customer});const b=reserve(state,customer,deal,input,now);b.checkoutSessionId='cs_test_verified';return confirmPaidBooking(state,b.id,{sessionId:b.checkoutSessionId,amountMinor:10000,currency:'aed',paymentStatus:'paid'},now)}
test('reservation price comes from server offer and NO QR is issued before payment',()=>{const state=emptyCommerce();const b=reserve(state,customer,deal,input,now);assert.equal(b.totalPrice,100);assert.equal(b.bookingCode,'');assert.equal(b.paymentStatus,'unpaid');assert.equal(b.status,'pending_payment');assert.equal(state.auditLogs.length,1);assert.throws(()=>redeem(state,admin,b.bookingCode,now),/cannot be redeemed/)});
test('customer and another venue cannot redeem, assigned venue can only once',()=>{const state=emptyCommerce(),b=paid(state);assert.throws(()=>redeem(state,customer,b.bookingCode,now),/Only an admin/);assert.throws(()=>redeem(state,other,b.bookingCode,now),/not found/);assert.equal(redeem(state,business,b.bookingCode,now).status,'redeemed');assert.throws(()=>redeem(state,admin,b.bookingCode,now),/cannot be redeemed/)});
test('cancellation invalidates voucher and is scoped to owner or admin',()=>{const state=emptyCommerce(),b=paid(state);const code=b.bookingCode;assert.throws(()=>cancel(state,other,b.id),/cannot cancel/);cancel(state,admin,b.id);assert.throws(()=>redeem(state,business,code,now));assert.equal(b.bookingCode,'');assert.equal(state.users[0].refundPoints,10000)});
test('customer and business records are isolated',()=>{const state=emptyCommerce();reserve(state,customer,deal,input,now);reserve(state,{...customer,id:'c2'},{...deal,businessId:'b2'},input,now);assert.equal(visibleBookings(state,customer).length,1);assert.equal(visibleBookings(state,business).length,1);assert.equal(visibleBookings(state,admin).length,2)});
test('unpublished expired unavailable offers and invalid guests are rejected',()=>{for(const change of [{isPublished:false},{expiryDate:'2026-01-01'},{availability:'fully-booked'}])assert.throws(()=>reserve(emptyCommerce(),customer,{...deal,...change},input,now));assert.throws(()=>reserve(emptyCommerce(),customer,deal,{...input,childrenCount:-1},now));assert.throws(()=>reserve(emptyCommerce(),customer,deal,{...input,date:'2026-10-21'},now));});
test('session signatures cannot be forged and password reset revokes them',()=>{process.env.ADMIN_SESSION_SECRET='test-secret';const token=accountCookie(customer,now);assert.equal(verifyAccountCookie(token,[customer],now)?.id,'c1');assert.equal(verifyAccountCookie(token+'x',[customer],now),null);assert.equal(verifyAccountCookie(token,[{...customer,hash:'new-hash'}],now),null);assert.equal(verifyAccountCookie(token,[customer],now+28800001),null);assert.equal('hash' in publicAccount(customer),false)});
test('generated paid customer QR decodes to the exact server voucher code',async()=>{const QRCode=await import('qrcode');const {PNG}=await import('pngjs');const jsQR=(await import('jsqr')).default;const b=paid(emptyCommerce());const png=PNG.sync.read(await QRCode.toBuffer(b.bookingCode,{width:280,margin:4}));const decoded=jsQR(new Uint8ClampedArray(png.data),png.width,png.height);assert.equal(decoded?.data,b.bookingCode)});

test('package offers retain the listed price regardless of guest count',()=>{const booking=reserve(emptyCommerce(),customer,{...deal,priceMode:'booking'},input,now);assert.equal(booking.totalPrice,50)});
test('expired and future flash prices cannot be booked even when the general offer date is valid',()=>{
 for(const patch of [{flashDealExpiresAt:'2026-10-22T07:59:59Z'},{flashDealStartsAt:'2026-10-22T08:00:01Z'}])assert.throws(()=>reserve(emptyCommerce(),customer,{...deal,...patch},input,now),/unavailable/);
});
test('payment proof validates session, amount, currency and actual paid status',()=>{
 const state=emptyCommerce(),b=reserve(state,customer,deal,input,now);b.checkoutSessionId='cs_test_verified';
 const proof={sessionId:b.checkoutSessionId,amountMinor:10000,currency:'aed',paymentStatus:'paid'};
 for(const patch of [{sessionId:'forged'},{amountMinor:1},{currency:'usd'},{paymentStatus:'unpaid'}])assert.throws(()=>confirmPaidBooking(state,b.id,{...proof,...patch},now),/verification failed/);
 confirmPaidBooking(state,b.id,proof,now);assert.equal(b.status,'confirmed');assert.match(b.bookingCode,/^SP-[\w-]{24}$/);const code=b.bookingCode;
 confirmPaidBooking(state,b.id,proof,now);assert.equal(b.bookingCode,code);assert.equal(state.auditLogs.filter(a=>a.action==='PAYMENT_VERIFIED').length,1);
});
test('cancelling twice credits paid amount only once, spending and re-credit are exact',()=>{
 const state=emptyCommerce(),b=paid(state);cancel(state,customer,b.id);cancel(state,admin,b.id);
 assert.equal(state.users[0].refundPoints,10000);assert.equal(state.pointsLedger?.length,1);
 const next=reserve(state,customer,deal,input,now);payWithPoints(state,next.id,customer,now);assert.equal(next.paymentStatus,'paid_points');assert.equal(state.users[0].refundPoints,0);
 assert.throws(()=>payWithPoints(state,next.id,customer,now));cancel(state,customer,next.id);assert.equal(state.users[0].refundPoints,10000);
});
test('unpaid cancellation never creates credit; late payment credits points without a QR',()=>{
 const state=emptyCommerce();state.users.push({...customer});const b=reserve(state,customer,deal,input,now);b.checkoutSessionId='cs_test_late';cancel(state,customer,b.id);assert.equal(state.users[0].refundPoints,undefined);
 const proof={sessionId:b.checkoutSessionId,amountMinor:10000,currency:'aed',paymentStatus:'paid'};
 confirmPaidBooking(state,b.id,proof,now);confirmPaidBooking(state,b.id,proof,now);assert.equal(state.users[0].refundPoints,10000);assert.equal(b.status,'cancelled');assert.equal(b.bookingCode,'');
});
test('insufficient or forged local points do not pay; legacy unpaid passes cannot redeem',()=>{
 const state=emptyCommerce();state.users.push({...customer});const b=reserve(state,customer,deal,input,now);
 assert.throws(()=>payWithPoints(state,b.id,{...customer,refundPoints:100000},now),/Not enough/);
 b.status='confirmed';b.paymentStatus='pay_at_venue';b.bookingCode='SP-legacy';
 assert.throws(()=>redeem(state,admin,b.bookingCode,now),/not been verified/);assert.equal(visibleBookings(state,admin)[0].bookingCode,'');assert.equal(visibleBookings(state,admin)[0].status,'pending_payment');
});
test('refund policy consent is required and used bookings cannot be cancelled',()=>{
 assert.throws(()=>reserve(emptyCommerce(),customer,deal,{...input,refundPolicyVersion:undefined},now),/accept/);
 const state=emptyCommerce(),b=paid(state);redeem(state,admin,b.bookingCode,now);assert.throws(()=>cancel(state,admin,b.id),/Used bookings/);assert.equal(state.users[0].refundPoints,undefined);
});
