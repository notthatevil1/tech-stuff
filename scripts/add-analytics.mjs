import {readdir, readFile, writeFile} from 'node:fs/promises';

const tag='<script async src="https://www.googletagmanager.com/gtag/js?id=G-JHT4G7FD48"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","G-JHT4G7FD48");</script>';
const routes=['index.html','404.html','about/index.html','business-it-support/index.html','computer-repair/index.html','computer-tune-up/index.html','contact/index.html','new-computer-setup/index.html','patient-tech-help/index.html','privacy/index.html','security-help/index.html','services/index.html','smart-home/index.html','tv-mounting/index.html','wifi-network-help/index.html','windows-11-upgrade/index.html'];
for(const file of routes){
  let html=await readFile(file,'utf8');
  if(!html.includes('G-JHT4G7FD48')) html=html.replace('<head>','<head>'+tag);
  if(file==='privacy/index.html') html=html.replace('does not include advertising trackers or an added analytics script.','does not include advertising trackers or advertising cookies. Google Analytics is used to understand aggregate website traffic.');
  await writeFile(file,html);
}
console.log(`Added Google Analytics tag to ${routes.length} pages.`);
