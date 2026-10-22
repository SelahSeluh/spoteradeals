import type {IncomingMessage,ServerResponse} from 'node:http';
import {get,put} from '@vercel/blob';
import {randomUUID} from 'node:crypto';
import {hashPassword,verifyPassword} from '../src/server/security.js';
import {CMS_SCOPES,adminPasswordHash,consumeLoginAttempt,issueAdminSession,verifyAdminSession,readContent,writeContent,readPublished,writeContents,safeContent} from '../src/server/cms.js';

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
  if(path==='/api/health')return send(200,{status:'ok',release:'postcard-promotions',adminConfigured:configured,accountsConfigured:false});
  if(path==='/api/auth/status')return send(200,{adminConfigured:configured,accountsConfigured:false});
  if(path==='/api/auth/logout' && req.method==='POST'){res.setHeader('Set-Cookie','spotera_admin=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0');return send(200,{success:true})}
  try{
    if(path==='/api/auth/me')return send(200,(await session(req))?{authenticated:true,user:user()}:{authenticated:false});
    if(path==='/api/auth/login'&&req.method==='POST'){
      if(!configured)return send(503,{error:'ADMIN_NOT_CONFIGURED'});
      const input=await body(req);
      if(typeof input.email!=='string'||typeof input.password!=='string'||input.password.length>1024)return send(400,{error:'INVALID_INPUT'});
      const ip=String(req.headers['x-vercel-forwarded-for']||req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0].trim();
      if(!await consumeLoginAttempt(ip)){res.setHeader('Retry-After','900');return send(429,{error:'TOO_MANY_ATTEMPTS',message:'Please wait 15 minutes before trying again.'})}
      const hash=await adminPasswordHash();
      const valid=verifyPassword(input.password,hash);
      if(!valid||input.email.trim().toLowerCase()!==process.env.ADMIN_EMAIL)return send(401,{error:'INVALID_CREDENTIALS',message:'Incorrect email or password.'});
      res.setHeader('Set-Cookie',`spotera_admin=${issueAdminSession(process.env.ADMIN_EMAIL!,Date.now(),hash)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800`);
      return send(200,{success:true,token:'cookie-session',user:user()});
    }
    if(path==='/api/auth/change-password'&&req.method==='POST'){
      if(!await session(req))return send(401,{error:'AUTHENTICATION_REQUIRED'});
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
      if(!await session(req)){delete data.media;if(Array.isArray(data.deals))data.deals=data.deals.filter((d:any)=>d.isPublished!==false)}
      return send(200,{success:true,...data});
    }
    if(path.startsWith('/api/admin/')){
      if(!await session(req))return send(401,{error:'AUTHENTICATION_REQUIRED'});
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
      if(path==='/api/admin/overview')return send(200,{success:true,adminSubRole:'SUPER_ADMIN',stats:{totalUsers:1,activeVouchers:0,redeemedVouchers:0,totalBookings:0,totalBackups:0},users:[user()],vouchers:[],bookings:[],auditLogs:[],backups:[]});
      return send(501,{error:'SERVICE_NOT_CONFIGURED',message:'This account feature is not configured.'});
    }
    return send(503,{success:false,error:'Account services are not configured yet. Please continue as a guest.'});
  }catch(error){console.error('CMS request failed',error instanceof Error?error.name:'unknown');return send(error instanceof Error&&error.message==='TOO_LARGE'?413:503,{success:false,error:'SERVICE_UNAVAILABLE',message:'Could not complete the request. Please try again.'})}
}
