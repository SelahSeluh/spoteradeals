import {test} from 'node:test';
import assert from 'node:assert/strict';
import {hashPassword,verifyPassword,sessionIsValid} from '../src/server/security';
import {expeditionCatalog,safeImageUrl} from '../src/utils/expeditionImages';
import handler from '../api/chat';

test('passwords have random salts and reject incorrect, malformed and legacy credentials',()=>{
 const one=hashPassword('test-password-that-is-long');
 assert.notEqual(one,hashPassword('test-password-that-is-long'));
 assert.equal(verifyPassword('test-password-that-is-long',one),true);
 assert.equal(verifyPassword('wrong-password',one),false);
 for(const value of ['plaintext','scrypt$x$y',undefined]) assert.equal(verifyPassword('password',value),false);
});
test('sessions expire, reject future timestamps and reject predictable legacy tokens',()=>{
 const now=Date.now(), token='spt_sess_'+'ab'.repeat(32);
 assert.equal(sessionIsValid({createdAt:now},token,now),true);
 assert.equal(sessionIsValid({createdAt:now-12*60*60*1000},token,now),false);
 assert.equal(sessionIsValid({createdAt:now+1},token,now),false);
 assert.equal(sessionIsValid({createdAt:now},'spt_sess_123_guess',now),false);
});
test('catalog preserves venue photos and rejects executable image schemes',()=>{
 const input={title:'Venue',imageUrl:'https://example.com/real.jpg',images:['https://example.com/second.jpg']};
 assert.deepEqual(expeditionCatalog([input])[0],input);
 assert.equal(safeImageUrl('javascript:alert(1)'),undefined);
 assert.equal(safeImageUrl('//untrusted.example/a'),undefined);
});
async function request(body:unknown,headers:Record<string,string>={}){
 const out={statusCode:200,body:'',setHeader(){},end(value:string){this.body=value;}};
 await handler({method:'POST',headers:{host:'spoteradeals.com',origin:'https://spoteradeals.com','content-type':'application/json',...headers},body} as any,out as any);
 return out;
}
test('chat rejects oversized, invalid and cross-origin requests before model invocation',async()=>{
 assert.equal((await request({messages:[{role:'system',content:'bad'}]})).statusCode,400);
 assert.equal((await request({messages:[{role:'user',content:'x'.repeat(8001)}]})).statusCode,413);
 assert.equal((await request({}, {origin:'https://other.example'})).statusCode,403);
 assert.equal((await request({}, {'content-type':'text/plain'})).statusCode,415);
});
