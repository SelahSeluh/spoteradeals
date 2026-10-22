import type { IncomingMessage,ServerResponse } from 'node:http';
import {generateText} from 'ai';
const visits=new Map<string,{count:number;until:number}>();
export const config={maxDuration:30};
const handler=async(req:IncomingMessage & {body?:unknown},res:ServerResponse)=>{
 res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');
 const reply=(status:number,data:unknown)=>{res.statusCode=status;res.end(JSON.stringify(data))};
 if(req.method!=='POST')return reply(405,{error:'Please send a message using the chat box.'});
 res.setHeader('Allow','POST');
 if(!String(req.headers['content-type']||'').toLowerCase().startsWith('application/json'))return reply(415,{error:'JSON required.'});
 const origin=req.headers.origin;try{if(origin&&new URL(origin).host!==req.headers.host)return reply(403,{error:'Please open chat on SpoteraDeals.'})}catch{return reply(403,{error:'Please open chat on SpoteraDeals.'})}
 const ip=String(req.headers['x-real-ip']||req.headers['x-forwarded-for']||'unknown').split(',')[0].trim();const now=Date.now();
 for(const[k,v]of visits)if(v.until<now)visits.delete(k);
 if(visits.size>=5000&&!visits.has(ip))return reply(429,{error:'Please try again later.'});let usage=visits.get(ip);if(!usage||usage.until<now){usage={count:0,until:now+60000};visits.set(ip,usage)}if(++usage.count>8)return reply(429,{error:'Please wait a minute before sending more messages.'});
 if(visits.size>5000)for(const[k,v]of visits)if(v.until<now)visits.delete(k);
 try{
  let body=req.body;if(!body){let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>8000)return reply(413,{error:'Please keep your question shorter.'})}body=JSON.parse(raw)}
  if(JSON.stringify(body).length>8000)return reply(413,{error:'Please keep your question shorter.'});
  const input=(body as {messages?:unknown})?.messages;if(!Array.isArray(input)||input.length<1||input.length>6)return reply(400,{error:'Please enter a question.'});
  if(input.some(m=>!m||typeof m!=='object'||!['user','assistant'].includes(m.role)||typeof m.content!=='string'||!m.content.trim()||m.content.length>700))return reply(400,{error:'Invalid message.'});
  const messages=input.map((m:any)=>({role:m.role==='assistant'?'assistant' as const:'user' as const,content:String(m.content||'').slice(0,700)}));
  const {text}=await generateText({model:'openai/gpt-5.4-nano',system:'You are the SpoteraDeals UAE family adventure helper. Respond warmly and briefly, in the language the visitor uses. Help with choosing family activities by emirate, age, budget, indoor/outdoor preference. The design is Paper Picnic. Do not invent current prices, discounts, venue approvals, bookings, payment success, availability, reward balances or business partnerships. Direct users to Explore for the displayed offers and to the venue to confirm details before paying. Never claim you completed a booking or support action. You have no account or booking tools. Ask at most one useful question. Keep replies under 130 words.',messages,maxOutputTokens:600,maxRetries:0,abortSignal:AbortSignal.timeout(22000)});
  if(!text.trim())return reply(503,{error:'The adventure helper could not answer just now. Please try again.'});
  return reply(200,{reply:text});
 }catch(e){console.error('Spotera chat unavailable',e instanceof Error?e.name:'error');return reply(503,{error:'The AI helper is temporarily unavailable. You can still explore activities and offers.'})}
};export default handler;
