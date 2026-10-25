import {test} from 'node:test';
import assert from 'node:assert/strict';
import {postcardSlides,safeMediaUrl} from '../src/utils/postcardSlides';
import {issueAdminSession,verifyAdminSession,safeContent,strongEtag} from '../src/server/cms';
import handler from '../api/status';
import type {Deal,HomepageConfig} from '../src/types';
import {isOfferAvailable} from '../src/utils/offerAvailability';
const deal=(i:number,patch:Partial<Deal>={}):Deal=>({id:String(i),title:`Offer ${i}`,imageUrl:`https://example.com/${i}.jpg`,isPublished:true,isFeatured:false,expiryDate:'2030-12-31',rating:i,discountPrice:29,...patch} as Deal);
const config=(patch:Partial<HomepageConfig>={}):HomepageConfig=>({heroSlides:[],...patch} as HomepageConfig);
test('top ten excludes expired and hidden offers, ranks featured first and deduplicates sponsored links',()=>{
 const deals=Array.from({length:14},(_,i)=>deal(i));deals.push(deal(99,{isPublished:false}),deal(98,{expiryDate:'2020-01-01'}));deals[0].isFeatured=true;
 const result=postcardSlides(config({heroSlides:[{id:'s',dealId:'2',title:'Old title',imageUrl:'https://example.com/old.jpg',sponsored:true,enabled:true,order:2,subtitle:''}]}),deals);
 assert.equal(result.length,10);assert.equal(result[0].sponsored,true);assert.equal(result[0].title,'Offer 2');assert.equal(result[0].imageUrl,'https://example.com/2.jpg');assert.equal(result[1].dealId,'0');assert.equal(new Set(result.map(s=>s.dealId)).size,10);
 assert.ok(!result.some(s=>['98','99'].includes(s.dealId||'')));
});
test('manual only supports zero slides, hidden promotions and removal of linked offers',()=>{
 assert.deepEqual(postcardSlides(config({heroIncludeTopOffers:false}),[]),[]);
 const slides=[{id:'s',dealId:'missing',title:'Removed',imageUrl:'/places/skyline.jpg',enabled:true,order:0,subtitle:''}];
 assert.deepEqual(postcardSlides(config({heroSlides:slides}),[]),[]);
});
test('media URL guard rejects executable, relative-host and credentialed sources',()=>{
 for(const url of ['javascript:alert(1)','//other.example/x','http://example.com/x','https://user:pass@example.com/x','/\\evil.example/x'])assert.equal(safeMediaUrl(url),undefined);
 assert.equal(safeMediaUrl('/api/media?name=test'),'/api/media?name=test');
});
test('admin place promotions do not require a city name in their title',()=>{
 const slide={id:'cafe',title:'Coffee together',subtitle:'Weekend special',imageUrl:'/places/skyline.jpg',enabled:true,order:0};
 assert.equal(postcardSlides(config({heroSlides:[slide],heroIncludeTopOffers:false}),[])[0]?.id,'cafe');
});
test('homepage promotions exclude future and unavailable offers using UAE calendar boundaries',()=>{
 const now=Date.parse('2026-10-25T20:00:00Z');
 assert.equal(isOfferAvailable(deal(1,{expiryDate:'2026-10-25'}),now),false);
 assert.equal(isOfferAvailable(deal(1,{expiryDate:'2026-10-26'}),now),true);
 for(const patch of [{startDate:'2026-10-27'},{flashDealExpiresAt:'2026-10-25T19:59:59Z'},{flashDealStartsAt:'2026-10-25T20:00:01Z'},{availability:'fully-booked' as const},{availability:'not-available' as const},{isPublished:false}]){
  assert.equal(isOfferAvailable(deal(1,patch),now),false);
  assert.equal(postcardSlides(config(),[deal(1,patch)],now).length,0);
 }
});
test('signed admin sessions expire, reject tampering and revoke on password changes',()=>{
 process.env.ADMIN_EMAIL='owner@example.com';process.env.ADMIN_SESSION_SECRET='test-only-session-key';process.env.ADMIN_PASSWORD_HASH='test-only-hash';
 const now=Date.now(),token=issueAdminSession('owner@example.com',now);
 assert.equal(verifyAdminSession(token,now),true);assert.equal(verifyAdminSession(token+'x',now),false);assert.equal(verifyAdminSession(token,now+8*3600000),false);
 assert.equal(verifyAdminSession(token,now,'changed-hash'),false);assert.equal(verifyAdminSession('fake',now),false);
});
test('reject dangerous content keys and excessive object nesting',()=>{
 assert.equal(safeContent(JSON.parse('{"__proto__":{"admin":true}}')),false);
 let value:any={};for(let i=0;i<30;i++)value={a:value};assert.equal(safeContent(value),false);
});
async function request(path:string,method='GET',body?:any,headers:Record<string,string>={}){
 const response={statusCode:200,headers:{} as any,body:'',setHeader(k:string,v:string){this.headers[k]=v},end(v:string){this.body=v}};
 await handler({url:path,method,body,headers:{host:'spoteradeals.com',...headers}} as any,response as any);return response;
}
test('public cannot write content, upload files, reset passwords, or choose arbitrary scopes',async()=>{
 assert.equal((await request('/api/admin/content','POST',{data:{}},{'content-type':'application/json'})).statusCode,401);
 assert.equal((await request('/api/admin/upload-media','POST',{}, {'content-type':'application/json'})).statusCode,401);
 assert.equal((await request('/api/auth/change-password','POST',{}, {'content-type':'application/json'})).statusCode,401);
 assert.equal((await request('/api/admin/content','POST',{}, {'content-type':'application/json',origin:'https://attacker.example'})).statusCode,403);
 assert.equal((await request('/api/admin/content','DELETE')).statusCode,405);
 assert.equal((await request('/api/admin/content','POST',{}, {'content-type':'text/plain'})).statusCode,415);
});

test('conditional writes normalize compressed CDN ETags',()=>{
 assert.equal(strongEtag('W/"abc123"'),'"abc123"');assert.equal(strongEtag('"abc123"'),'"abc123"');
});
