import type { IncomingMessage, ServerResponse } from 'node:http';
const handler = (req: IncomingMessage, res: ServerResponse) => {
 res.setHeader('Content-Type','application/json'); res.setHeader('Cache-Control','no-store');
 const url=new URL(req.url||'/', 'https://spoteradeals.com');
 const path=url.searchParams.has('route') ? '/api/'+url.searchParams.get('route') : url.pathname;
 if(path==='/api/health') return res.end(JSON.stringify({status:'ok',release:'sunshine-playbook',accountsConfigured:false}));
 if(path==='/api/auth/status') return res.end(JSON.stringify({adminConfigured:false,accountsConfigured:false}));
 if(path==='/api/auth/me') return res.end(JSON.stringify({authenticated:false}));
 if(path==='/api/app-config') return res.end(JSON.stringify({}));
 if(path==='/api/auth/logout') return res.end(JSON.stringify({success:true}));
 res.statusCode=503;
 return res.end(JSON.stringify({success:false,error:'Account services are not configured yet. Please continue as a guest.'}));
};
export default handler;
