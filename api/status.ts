import type {IncomingMessage,ServerResponse} from 'node:http';
import {get,put} from '@vercel/blob';
import {createHash,randomBytes} from 'node:crypto';
import {randomUUID} from 'node:crypto';
import {hashPassword,verifyPassword} from '../src/server/security.js';
import {CMS_SCOPES,adminPasswordHash,consumeLoginAttempt,issueAdminSession,verifyAdminSession,readContent,writeContent,readPublished,writeContents,safeContent} from '../src/server/cms.js';

import {readCommerce,transact,publicAccount,accountCookie,verifyAccountCookie,reserve,redeem,cancel,visibleBookings,CommerceError} from '../src/server/commerce.js';

type Request=IncomingMessage & {body?:any};
const user=()=>({id:'spotera-owner',name:'SpoteraDeals Owner',email:process.env.ADMIN_EMAIL,role:'ADMIN',adminSubRole:'SUPER_ADMIN',membership:'Free'});
async function session(req:Request){const cookie=req.headers.cookie?.split(';').map(c=>c.trim()).find(c=>c.startsWith('spotera_admin='));return cookie?verifyAdminSession(cookie.slice('spotera_admin='.length),Date.now(),await adminPasswordHash()):false}
async function body(req:Request){
  if(req.body!==undefined){const value=typeof req.body==='string'?JSON.parse(req.body):req.body;if(Buffer.byteLength(JSON.stringify(value))>3_500_000)throw new Error('TOO_LARGE');return value}
  let raw='';for await(const chunk of req){raw+=chunk;if(Buffer.byteLength(raw)>3_500_000)throw new Error('TOO_LARGE')}return raw?JSON.parse(raw):{};
}
export default async function handler(req:Request,res:ServerResponse){
  res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');
  const send=(status:number,data:unknown)=>{res.statusCode=status;res.end(JSON.stringify(data))};
  const url=new URL(req.url||'/','https://spoteradeals.com');
  const path=url.searchParams.has('route')?'/api/'+url.searchParams.get('route'):url.pathname;
  const configured=Boolean(process.env.ADMIN_EMAIL&&process.env.ADMIN_PASSWORD_HASH&&process.env.ADMIN_SESSION_SECRET&&process.env.BLOB_READ_WRITE_TOKEN);
  if(!['GET','POST'].includes(req.method||'')){res.setHeader('Allow','GET, POST');return send(405,{error:'METHOD_NOT_ALLOWED'})}
  if(req.method==='POST'){
    const origin=req.headers.origin, host=req.headers.host;
    if(origin && origin!==`https://${host}` && !(host?.startsWith('localhost:')&&origin===`http://${host}`))return send(403,{error:'CROSS_ORIGIN_REQUEST'});
    if(!req.headers['content-type']?.startsWith('application/json'))return send(415,{error:'JSON_REQUIRED'});
  }
  if(path==='/api/health')return send(200,{status:'ok',release:'postcard-promotions',adminConfigured:configured,accountsConfigured:configured});
  if(path==='/api/auth/status')return send(200,{adminConfigured:configured,accountsConfigured:configured});
  if(path==='/api/auth/logout' && req.method==='POST'){res.setHeader('Set-Cookie',['spotera_admin=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0','spotera_account=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0']);return send(200,{success:true})}
  try{
    const owner=await session(req);
    const accountToken=req.headers.cookie?.split(';').map(c=>c.trim()).find(c=>c.startsWith('spotera_account='))?.slice(16);
    const account=accountToken?verifyAccountCookie(accountToken,(await readCommerce()).data.users):null;
    const actor=owner?user():account;
    if(path==='/api/auth/me')return send(200,actor?{authenticated:true,user:owner?actor:publicAccount(account!)}:{authenticated:false});
    if(path==='/api/auth/register'&&req.method==='POST'){
      const input=await body(req);const email=String(input.email||'').trim().toLowerCase();
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254||typeof input.password!=='string'||input.password.length<12||input.password.length>128||typeof input.name!=='string'||!input.name.trim()||input.name.length>120)return send(400,{message:'Use a valid email, name, and a password of 12–128 characters.'});
      const ip=String(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown');if(!await consumeLoginAttempt(ip))return send(429,{message:'Please wait 15 minutes before trying again.'});
      const created=await transact(state=>{if(state.users.some(u=>u.email===email)||email===process.env.ADMIN_EMAIL)throw new CommerceError(409,'This email is already registered.');const a={id:randomUUID(),email,name:input.name.trim(),phone:String(input.phone||'').slice(0,40),hash:hashPassword(input.password),role:'CUSTOMER' as const};state.users.push(a);return a});
      res.setHeader('Set-Cookie',`spotera_account=${accountCookie(created)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800`);return send(200,{success:true,token:'cookie-session',user:publicAccount(created)});
    }
    if(path==='/api/bookings'&&req.method==='GET'){
      if(!actor)return send(401,{message:'Sign in first.'});return send(200,{success:true,bookings:visibleBookings((await readCommerce()).data,actor)});
    }
    if(path==='/api/bookings'&&req.method==='POST'){
      if(!account)return send(401,{message:'Sign in as a customer to book.'});const input=await body(req);const {data}=await readPublished();const deal=data.deals?.find((d:any)=>d.id===input.dealId);const booking=await transact(state=>reserve(state,account,deal,input));return send(200,{success:true,booking});
    }
    if(path==='/api/bookings/cancel'&&req.method==='POST'){
      if(!actor)return send(401,{message:'Sign in first.'});const input=await body(req);const booking=await transact(state=>cancel(state,actor,input.id));return send(200,{success:true,booking});
    }
    if(path==='/api/vouchers/redeem'&&req.method==='POST'){
      if(!actor)return send(401,{message:'Sign in first.'});const input=await body(req);const booking=await transact(state=>redeem(state,actor,input.code));return send(200,{success:true,type:'booking',title:booking.dealTitle,customerName:booking.userName,code:booking.bookingCode,message:'Voucher redeemed successfully.',booking});
    }
    if(path==='/api/partner/overview'){
      if(!account||account.role!=='PARTNER')return send(403,{message:'Business sign-in required.'});const state=(await readCommerce()).data;const {data}=await readPublished();return send(200,{success:true,business:data.businesses?.find((b:any)=>b.id===account.businessId),bookings:visibleBookings(state,account),deals:data.deals?.filter((d:any)=>d.businessId===account.businessId)||[]});
    }
    if(path==='/api/auth/forgot-password'&&req.method==='POST'){
      const input=await body(req);
      if(typeof input.email!=='string'||input.email.length>254)return send(400,{message:'Enter a valid email address.'});
      const email=input.email.trim().toLowerCase();
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return send(400,{message:'Enter a valid email address.'});
      const generic='If this address has an account, a reset link will be sent.';
      const ip=String(req.headers['x-vercel-forwarded-for']||req.headers['x-forwarded-for']||'unknown').split(',')[0].trim();
      if(!await consumeLoginAttempt(ip))return send(429,{message:'Too many attempts. Please try again later.'});
      const eligible=email===process.env.ADMIN_EMAIL||(await readCommerce()).data.users.some(u=>u.email===email&&!u.disabled);
      if(!eligible)return send(200,{success:true,message:generic});
      if(!process.env.RESEND_API_KEY||!process.env.PASSWORD_RESET_FROM)return send(503,{message:'Password recovery email delivery is not configured yet.'});
      const token=randomBytes(32).toString('hex'),id=createHash('sha256').update(token).digest('hex');
      await put('auth/resets/'+id+'.json',JSON.stringify({email,expires:Date.now()+15*60*1000,used:false}),{access:'private',addRandomSuffix:false,allowOverwrite:false,contentType:'application/json',cacheControlMaxAge:0});
      const link='https://www.spoteradeals.com/?reset_token='+encodeURIComponent(token)+'#auth';
      const sent=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({from:process.env.PASSWORD_RESET_FROM,to:[email],subject:'Reset your SpoteraDeals password',text:'Use this link to reset your password. It expires in 15 minutes: '+link})});
      if(!sent.ok){console.error('Password reset email delivery failed',sent.status);return send(503,{message:'Email delivery is temporarily unavailable. Please try again.'})}
      return send(200,{success:true,message:generic});
    }
    if(path==='/api/auth/reset-password'&&req.method==='POST'){
      const input=await body(req);
      if(typeof input.token!=='string'||!/^[a-f0-9]{64}$/.test(input.token)||typeof input.password!=='string'||input.password.length<12||input.password.length>128)return send(400,{message:'Invalid reset link or password. Use 12–128 characters.'});
      const id=createHash('sha256').update(input.token).digest('hex');
      const record=await get('auth/resets/'+id+'.json',{access:'private',useCache:false});
      if(!record||record.statusCode!==200)return send(400,{message:'This reset link is invalid or expired.'});
      const data=JSON.parse(await new Response(record.stream).text());
      if(data.used||data.expires<Date.now()||typeof data.email!=='string')return send(400,{message:'This reset link is invalid or expired.'});
      // Conditional write ensures only one concurrent request can consume a token.
      try{await put('auth/resets/'+id+'.json',JSON.stringify({...data,used:true}),{access:'private',addRandomSuffix:false,allowOverwrite:true,ifMatch:record.blob.etag.replace(/^W\//,''),contentType:'application/json',cacheControlMaxAge:0})}
      catch{return send(400,{message:'This reset link has already been used.'})}
      const hash=hashPassword(input.password);
      if(data.email===process.env.ADMIN_EMAIL){
        await put('auth/password.json',JSON.stringify({hash}),{access:'private',addRandomSuffix:false,allowOverwrite:true,contentType:'application/json',cacheControlMaxAge:0});
        // An explicit emergency override must be removed after recovery.
      }else{
        await transact(state=>{const account=state.users.find(u=>u.email===data.email&&!u.disabled);if(!account)throw new CommerceError(404,'Account unavailable.');account.hash=hash;return true});
      }
      return send(200,{success:true,message:'Password updated. You can now sign in.'});
    }
    if(path==='/api/auth/login'&&req.method==='POST'){
      if(!configured)return send(503,{error:'ADMIN_NOT_CONFIGURED'});
      const input=await body(req);
      if(typeof input.email!=='string'||typeof input.password!=='string'||input.password.length>1024)return send(400,{error:'INVALID_INPUT'});
      const ip=String(req.headers['x-vercel-forwarded-for']||req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0].trim();
      if(!await consumeLoginAttempt(ip)){res.setHeader('Retry-After','900');return send(429,{error:'TOO_MANY_ATTEMPTS',message:'Please wait 15 minutes before trying again.'})}
      if(input.email.trim().toLowerCase()!==process.env.ADMIN_EMAIL){
        const a=(await readCommerce()).data.users.find(u=>u.email===input.email.trim().toLowerCase()&&!u.disabled);
        if(!a||!verifyPassword(input.password,a.hash))return send(401,{message:'Incorrect email or password.'});
        res.setHeader('Set-Cookie',[`spotera_account=${accountCookie(a)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800`,'spotera_admin=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0']);return send(200,{success:true,token:'cookie-session',user:publicAccount(a)});
      }
      const hash=await adminPasswordHash();
      const valid=verifyPassword(input.password,hash);
      if(!valid||input.email.trim().toLowerCase()!==process.env.ADMIN_EMAIL)return send(401,{error:'INVALID_CREDENTIALS',message:'Incorrect email or password.'});
      res.setHeader('Set-Cookie',`spotera_admin=${issueAdminSession(process.env.ADMIN_EMAIL!,Date.now(),hash)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800`);
      return send(200,{success:true,token:'cookie-session',user:user()});
    }
    if(path==='/api/auth/change-password'&&req.method==='POST'){
      if(!owner)return send(401,{error:'AUTHENTICATION_REQUIRED'});
      const input=await body(req);if(typeof input.newPassword!=='string'||input.newPassword.length<12||input.newPassword.length>128)return send(400,{message:'Use a password between 12 and 128 characters.'});
      const hash=hashPassword(input.newPassword);
      await put('auth/password.json',JSON.stringify({hash}),{access:'private',addRandomSuffix:false,allowOverwrite:true,contentType:'application/json',cacheControlMaxAge:0});
      res.setHeader('Set-Cookie',`spotera_admin=${issueAdminSession(process.env.ADMIN_EMAIL!,Date.now(),hash)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800`);
      return send(200,{success:true});
    }
    if(path==='/api/media'  && req.method==='GET'){
      const name=url.searchParams.get('name')||'';if(!/^[a-f0-9-]{36}\.(jpg|png|webp|mp4|webm)$/.test(name))return send(404,{error:'NOT_FOUND'});
      const file=await get(`media/${name}`,{access:'private'});if(!file||file.statusCode!==200)return send(404,{error:'NOT_FOUND'});
      res.setHeader('Content-Type',file.blob.contentType);res.setHeader('Cache-Control','public, max-age=3600');res.end(Buffer.from(await new Response(file.stream).arrayBuffer()));return;
    }
    if(path==='/api/app-config'&&req.method==='GET'){
      if(!process.env.BLOB_READ_WRITE_TOKEN)return send(503,{success:false,error:'CONTENT_STORE_UNAVAILABLE'});
      const {data}=await readPublished();
      if(!owner){delete data.media;if(Array.isArray(data.deals))data.deals=data.deals.filter((d:any)=>d.isPublished!==false)}
      return send(200,{success:true,...data});
    }
    if(path.startsWith('/api/admin/')){
      if(!owner)return send(401,{error:'AUTHENTICATION_REQUIRED'});
      if(path==='/api/admin/users'&&req.method==='GET'){
        const state=(await readCommerce()).data;
        return send(200,{success:true,roleManagement:false,users:[user(),...state.users.map(publicAccount)]});
      }
      if(path==='/api/admin/audit-logs'&&req.method==='GET'){
        const state=(await readCommerce()).data;
        let logs=state.auditLogs.map(event=>{const account=state.users.find(a=>a.id===event.actorId);return {...event,timestamp:event.at,actorEmail:event.actorId==='spotera-owner'?process.env.ADMIN_EMAIL:account?.email||event.actorId,role:account?.role||'ADMIN',status:'SUCCESS',resource:event.bookingId?'booking':undefined,resourceId:event.bookingId}});
        const status=url.searchParams.get('status'),action=url.searchParams.get('action'),actor=url.searchParams.get('actor')?.toLowerCase();
        if(status)logs=logs.filter(l=>l.status===status);if(action)logs=logs.filter(l=>l.action===action);if(actor)logs=logs.filter(l=>String(l.actorEmail).toLowerCase().includes(actor));
        return send(200,{success:true,logs:logs.slice(0,Math.max(1,Math.min(200,Number(url.searchParams.get('limit'))||200)))});
      }
      if(path==='/api/admin/upload-media'&&req.method==='POST'){
        const input=await body(req);const ext:Record<string,string>={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','video/mp4':'mp4','video/webm':'webm'};
        if(!ext[input.contentType]||typeof input.base64!=='string'||!/^[A-Za-z0-9+/]*={0,2}$/.test(input.base64))return send(400,{error:'INVALID_MEDIA'});
        const bytes=Buffer.from(input.base64,'base64');if(bytes.length>2_500_000)return send(413,{error:'FILE_TOO_LARGE',message:'Maximum file size is 2.5 MB. Use an HTTPS link for larger videos.'});
        const name=`${randomUUID()}.${ext[input.contentType]}`;await put(`media/${name}`,bytes,{access:'private',addRandomSuffix:false,contentType:input.contentType});
        return send(200,{success:true,url:`/api/media?name=${name}`});
      }
      if(path==='/api/admin/content'&&req.method==='POST'){
        const input=await body(req);const patch=input.data;
        if(!patch||typeof patch!=='object'||Array.isArray(patch)||!Object.keys(patch).every(k=>(CMS_SCOPES as readonly string[]).includes(k))||!safeContent(patch))return send(400,{error:'INVALID_CONTENT'});
        await writeContents(patch);return send(200,{success:true});
      }
      if(path.startsWith('/api/admin/content/')){
        const scope=path.slice('/api/admin/content/'.length);if(!(CMS_SCOPES as readonly string[]).includes(scope))return send(400,{error:'INVALID_SCOPE'});
        if(req.method==='GET')return send(200,{success:true,data:await readContent(scope)});
        const input=await body(req);if(input.data===undefined||!safeContent(input.data))return send(400,{error:'INVALID_CONTENT'});
        await writeContent(scope,input.data);return send(200,{success:true,scope});
      }
      if(path==='/api/admin/business-access'&&req.method==='POST'){
        const input=await body(req);if(typeof input.disabled!=='boolean')return send(400,{message:'Choose an access state.'});await transact(state=>{const account=state.users.find(u=>u.id===input.id&&u.role==='PARTNER');if(!account)throw new CommerceError(404,'Business account not found.');account.disabled=input.disabled;return true});return send(200,{success:true});
      }
      if(path==='/api/admin/business-account'&&req.method==='POST'){
        const input=await body(req);const email=String(input.email||'').trim().toLowerCase();const {data}=await readPublished();
        if(!data.businesses?.some((b:any)=>b.id===input.businessId)||!/^\S+@\S+\.\S+$/.test(email)||email===process.env.ADMIN_EMAIL||typeof input.password!=='string'||input.password.length<12||input.password.length>128)return send(400,{message:'Select a business, valid email, and a password of 12–128 characters.'});
        const a=await transact(state=>{const existing=state.users.find(u=>u.email===email);if(existing&&existing.role!=='PARTNER')throw new CommerceError(409,'That email belongs to a customer.');if(existing){existing.hash=hashPassword(input.password);existing.businessId=input.businessId;existing.disabled=false;return existing}const created={id:randomUUID(),email,name:data.businesses.find((b:any)=>b.id===input.businessId).name,hash:hashPassword(input.password),role:'PARTNER' as const,businessId:input.businessId};state.users.push(created);return created});return send(200,{success:true,user:publicAccount(a)});
      }
      if(path==='/api/admin/overview'){const state=(await readCommerce()).data;return send(200,{success:true,adminSubRole:'SUPER_ADMIN',stats:{totalUsers:state.users.length+1,activeVouchers:state.bookings.filter(b=>b.status==='confirmed').length,redeemedVouchers:state.bookings.filter(b=>b.status==='redeemed').length,totalBookings:state.bookings.length,totalBackups:0},users:[user(),...state.users.map(publicAccount)],vouchers:[],bookings:state.bookings,auditLogs:state.auditLogs,backups:[]})}
      return send(501,{error:'SERVICE_NOT_CONFIGURED',message:'This account feature is not configured.'});
    }
    return send(503,{success:false,error:'Account services are not configured yet. Please continue as a guest.'});
  }catch(error){if(error instanceof CommerceError)return send(error.status,{success:false,message:error.message});console.error('CMS request failed',error instanceof Error?error.name:'unknown');return send(error instanceof Error&&error.message==='TOO_LARGE'?413:503,{success:false,error:'SERVICE_UNAVAILABLE',message:'Could not complete the request. Please try again.'})}
}
