import {readFile, writeFile} from 'node:fs/promises';

const tag='<script async src="https://www.googletagmanager.com/gtag/js?id=G-JHT4G7FD48"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","G-JHT4G7FD48");</script><script defer src="/assets/analytics.js"></script>';
const pages=JSON.parse(await readFile('.local/pages.json','utf8'));
const routes=[...pages.map(({route})=>route==='/'?'index.html':route.slice(1)+'index.html'),'404.html'];
for(const file of routes){
  let html=await readFile(file,'utf8');
  if(!html.includes('G-JHT4G7FD48')) html=html.replace('<head>','<head>'+tag);
  else if(!html.includes('/assets/analytics.js')) html=html.replace('</head>','<script defer src="/assets/analytics.js"></script></head>');
  if(file==='privacy/index.html') html=html.replace('does not include advertising trackers or an added analytics script.','does not include advertising trackers or advertising cookies. Google Analytics is used to understand aggregate website traffic.');
  await writeFile(file,html);
}
console.log(`Added Google Analytics tag to ${routes.length} pages.`);
