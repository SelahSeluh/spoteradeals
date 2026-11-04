import {get} from '@vercel/blob';
// A failed/conditional read must never be treated as a new, empty database.
export async function readStoredJson<T>(path:string,empty:()=>T,read:typeof get=get){
 const file=await read(path,{access:'private',useCache:false});
 if(!file)return {data:empty(),etag:undefined};
 if(file.statusCode!==200)throw new Error('STORAGE_READ_UNAVAILABLE');
 const data=JSON.parse(await new Response(file.stream).text());
 if(!data||typeof data!=='object'||Array.isArray(data))throw new Error('INVALID_STORED_DATA');
 const etag=file.blob.etag?.replace(/^W\//,'');
 if(!etag)throw new Error('MISSING_STORAGE_VERSION');
 return {data:data as T,etag};
}
