import test from 'node:test';
import assert from 'node:assert/strict';
import {readStoredJson} from '../src/server/storedJson';
import {bookingTimeSlots,OPEN_HOURS_SLOT,offerBoundary,validBookingSchedule} from '../src/utils/bookingSchedule';
import {getFlashDealStatus} from '../src/utils/dealTiming';

test('storage failures and invalid records cannot become empty replacement databases',async()=>{
 const read=(value:any)=>async()=>value;
 assert.deepEqual(await readStoredJson('test',()=>({users:[]}),read(null) as any),{data:{users:[]},etag:undefined});
 for(const value of [{statusCode:304},{statusCode:200,stream:new Blob(['null']).stream(),blob:{etag:'"v1"'}},{statusCode:200,stream:new Blob(['{broken']).stream(),blob:{etag:'"v1"'}}]){
  await assert.rejects(readStoredJson('test',()=>({}),read(value) as any));
 }
 const value={statusCode:200,stream:new Blob(['{"bookings":[1]}']).stream(),blob:{etag:'W/"v1"'}};
 assert.deepEqual(await readStoredJson('test',()=>({}),read(value) as any),{data:{bookings:[1]},etag:'"v1"'});
});
test('date-only offers stay valid through their last UAE day',()=>{
 const deal={expiryDate:'2026-11-04'} as any;
 assert.equal(getFlashDealStatus(deal,Date.parse('2026-11-04T19:59:59Z')).isExpired,false);
 assert.equal(getFlashDealStatus(deal,Date.parse('2026-11-04T20:00:00Z')).isExpired,true);
 assert.equal(offerBoundary('2026-11-04T15:00:00Z',true),Date.parse('2026-11-04T15:00:00Z'));
});
test('only venue-published slots appear, with an explicit open-hours fallback',()=>{
 assert.deepEqual(bookingTimeSlots({}),[OPEN_HOURS_SLOT]);
 assert.deepEqual(bookingTimeSlots({bookingTimeSlots:['12:30','16:30']}),['12:30','16:30']);
 assert.equal(validBookingSchedule({bookingTimeSlots:['12:30'],bookingWeekdays:[5,6]},'2026-11-06','12:30'),true);
 assert.equal(validBookingSchedule({bookingTimeSlots:['12:30'],bookingWeekdays:[5,6]},'2026-11-04','12:30'),false);
 assert.equal(validBookingSchedule({bookingTimeSlots:['12:30']},'2026-11-06','10:00'),false);
});
