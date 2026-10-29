import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {parseArgs} from 'node:util';
const {values}=parseArgs({options:{host:{type:'string'},port:{type:'string'},strictPort:{type:'boolean'}}});
const root=process.cwd();const port=Number(values.port||process.env.PORT||4321);const host=values.host||'127.0.0.1';
if(!Number.isInteger(port)||port<1||port>65535)throw new Error('Port must be an integer from 1 to 65535');
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.xml':'application/xml','.txt':'text/plain','.svg':'image/svg+xml','.woff2':'font/woff2','.png':'image/png'};
http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');let p=decodeURIComponent(url.pathname);if(p.split('/').some(x=>x.startsWith('.'))||p.startsWith('/scripts/'))throw Error();let f=path.resolve(root,'.'+p);if(!f.startsWith(root+path.sep)&&f!==root)throw Error();const s=await stat(f);if(s.isDirectory()){if(!p.endsWith('/')){res.writeHead(301,{Location:p+'/'+url.search});return res.end()}f=path.join(f,'index.html')}const data=await readFile(f);res.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream','X-Robots-Tag':'noindex, nofollow'});res.end(data)}catch{res.writeHead(404,{'Content-Type':'text/html; charset=utf-8','X-Robots-Tag':'noindex'});res.end(await readFile('404.html').catch(()=>Buffer.from('Not found')))}}).listen(port,host,()=>console.log(`Local: http://${host}:${port}`));
