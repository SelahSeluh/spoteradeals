import {get, put, BlobPreconditionFailedError} from '@vercel/blob';
import {createHmac, timingSafeEqual} from 'node:crypto';

export const CMS_SCOPES = ['homepage','branding','footer','intro','deals','categories','locations','media','businesses','holidays','loyaltyRules','loyaltyTiers'] as const;
export type CmsScope = typeof CMS_SCOPES[number];
// CDN compression can prefix a storage ETag with W/. Conditional writes need the strong tag.
export function strongEtag(etag:string){return etag.replace(/^W\//,'')}
export async function readPublished() {
  const file=await get('cms/published.json',{access:'private',useCache:false});
  if(!file || file.statusCode!==200)return {data:{},etag:undefined};
  const data=JSON.parse(await new Response(file.stream).text());data.businesses=completeBusinessProfiles(data.businesses,data.deals);
  return {data,etag:strongEtag(file.blob.etag)};
}
export async function readContent(scope:string) { return (await readPublished()).data[scope] ?? null; }
export async function writeContents(patch:Record<string,unknown>) {
  for(let attempt=0;attempt<4;attempt++){
    const current=await readPublished();
    try{
      await put('cms/published.json',JSON.stringify({...current.data,...patch}),{access:'private',allowOverwrite:!!current.etag,addRandomSuffix:false,contentType:'application/json',cacheControlMaxAge:0,...(current.etag?{ifMatch:current.etag}:{})});return;
    }catch(error){ if(attempt===3)throw error; if(!(error instanceof BlobPreconditionFailedError) && current.etag)throw error; }
  }
}
export async function writeContent(scope:string,data:unknown) { await writeContents({[scope]:data}); }
export async function adminPasswordHash(){
  // An explicit recovery override allows the owner to recover access using a
  // freshly generated Vercel hash without deleting the persisted credentials.
  // Remove ADMIN_PASSWORD_RECOVERY_HASH after changing the password in the CMS.
  const recovery=process.env.ADMIN_PASSWORD_RECOVERY_HASH;
  if(recovery && /^scrypt\$[a-f0-9]{32}\$[a-f0-9]{128}$/.test(recovery))return recovery;
  const file=await get('auth/password.json',{access:'private',useCache:false});
  if(!file||file.statusCode!==200)return process.env.ADMIN_PASSWORD_HASH!;
  const stored=JSON.parse(await new Response(file.stream).text()).hash;
  return typeof stored==='string' ? stored : process.env.ADMIN_PASSWORD_HASH!;
}
function signingKey(hash=process.env.ADMIN_PASSWORD_HASH){return `${process.env.ADMIN_SESSION_SECRET}:${hash}`}
export function issueAdminSession(email:string,now=Date.now(),hash?:string){
  const body=Buffer.from(JSON.stringify({email,exp:now+8*60*60*1000})).toString('base64url');
  return `${body}.${createHmac('sha256',signingKey(hash)).update(body).digest('base64url')}`;
}
export function verifyAdminSession(token:string|undefined,now=Date.now(),hash?:string):boolean{
  if(!token || token.length>2048 || !process.env.ADMIN_SESSION_SECRET || !process.env.ADMIN_PASSWORD_HASH)return false;
  try{
    const [body,sig,...extra]=token.split('.');if(extra.length || !body || !sig)return false;
    const expected=createHmac('sha256',signingKey(hash)).update(body).digest();
    const actual=Buffer.from(sig,'base64url');if(actual.length!==expected.length||!timingSafeEqual(actual,expected))return false;
    const data=JSON.parse(Buffer.from(body,'base64url').toString());
    return data.email===process.env.ADMIN_EMAIL && data.exp>now && data.exp<=now+8*60*60*1000;
  }catch{return false}
}
// Atomic create-only slots: concurrent requests cannot evade the five-attempt limit.
export async function consumeLoginAttempt(ip:string,now=Date.now()){
  const fingerprint=createHmac('sha256',signingKey()).update(ip).digest('hex').slice(0,32);
  for(let slot=0;slot<5;slot++){
    const name=`auth-attempts/${Math.floor(now/900000)}/${fingerprint}-${slot}`;
    try{await put(name,'1',{access:'private',addRandomSuffix:false,allowOverwrite:false,contentType:'text/plain'});return true}
    catch(error){const existing=await get(name,{access:'private',useCache:false});if(!existing)throw error}
  }
  return false;
}
export function safeContent(data:unknown,depth=0):boolean{
  if(depth>25)return false;
  if(!data||typeof data!=='object')return true;
  return Object.entries(data).every(([key,val])=>!['__proto__','constructor','prototype'].includes(key)&&safeContent(val,depth+1));
}

// Every administrator-managed venue needs a profile, including imported legacy offers.
export function completeBusinessProfiles(businesses:any[]=[],deals:any[]=[]){
 const profiles=Array.isArray(businesses)?[...businesses]:[];for(const deal of (Array.isArray(deals)?deals:[])){if(!deal.businessId||profiles.some(b=>b.id===deal.businessId))continue;profiles.push({id:deal.businessId,name:deal.businessName,category:deal.category,city:deal.city,district:deal.district,address:deal.location||deal.district||deal.city,coordinates:{lat:0,lng:0},description:`Explore the latest offers at ${deal.businessName}.`,images:deal.images?.length?deal.images:deal.imageUrl?[deal.imageUrl]:[],videoUrl:deal.videoUrl||'',openingHours:deal.openingHours||'Contact the venue for opening hours',phone:'',email:'',rating:0,reviewCount:0,status:'approved',verified:false,isFeatured:false})}return profiles;
}
