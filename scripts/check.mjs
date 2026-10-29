import assert from 'node:assert/strict';
import {readFile,stat,writeFile} from 'node:fs/promises';
const pages=JSON.parse(await readFile('.local/pages.json','utf8'));
const analyticsScript=await readFile('assets/analytics.js','utf8');
for(const eventName of ['click_to_call','click_to_text','click_to_email','open_scheduling','open_booking_calendar','jump_to_booking_calendar','view_schedule_prices','open_contact_form','click_review_link','click_maps_listing'])assert(analyticsScript.includes(eventName),`analytics event ${eventName}`);
const portrait=await stat('assets/josh-story-portrait.jpg');assert(portrait.isFile()&&portrait.size<200000,'optimized Josh portrait');
const titles=new Set(),descriptions=new Set();let links=0,schemas=0;const docs=new Map();
for(const p of pages){const file=p.route==='/'?'index.html':p.route.slice(1)+'index.html';const html=await readFile(file,'utf8');docs.set(p.route,html);assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`${file}: one H1`);assert(!/noindex|localhost|TODO|placeholder testimonial/i.test(html),`${file}: production readiness`);assert(html.includes('G-JHT4G7FD48'),`${file}: GA4 tag`);assert(html.includes('src="/assets/analytics.js"'),`${file}: analytics events`);assert(!titles.has(p.title),`${file}: duplicate title`);titles.add(p.title);assert(!descriptions.has(p.description),`${file}: duplicate description`);descriptions.add(p.description);assert(html.includes(`rel="canonical" href="https://tech-stuff.tech${p.route}"`),`${file}: canonical`);for(const s of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)){const data=JSON.parse(s[1]);assert.equal(data['@context'],'https://schema.org');const business=data['@graph'].find(x=>x['@type']==='LocalBusiness');assert.equal(business.telephone,'+15036622669');assert(!business.address,'No private address');assert.equal(business.openingHoursSpecification[0].closes,'21:00');assert(!business.aggregateRating,'No invented ratings');schemas++;}for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){const url=m[1];if(!url.startsWith('/'))continue;const [path,hash]=url.split('#');if(path==='/'||path.endsWith('/')){assert(pages.some(p=>p.route===path),`${file}: missing page ${path}`);if(hash){const dest=await readFile(path==='/'?'index.html':path.slice(1)+'index.html','utf8');assert(dest.includes(`id="${hash}"`),`${file}: broken anchor ${url}`)}}else assert((await stat(path.slice(1))).isFile(),`${file}: missing asset ${path}`);links++;}}
const sitemap=await readFile('sitemap.xml','utf8');assert.equal((sitemap.match(/<loc>/g)||[]).length,pages.length);for(const p of pages)assert(sitemap.includes('https://tech-stuff.tech'+p.route));assert(!(await readFile('robots.txt','utf8')).includes('Disallow: /\n'));assert((await readFile('404.html','utf8')).includes('noindex,follow'));
assert(docs.get('/about/').includes('alt="Josh Story, owner of Tech-Stuff"'),'About portrait and alt text');
assert(docs.get('/privacy/').includes('Google Analytics'),'privacy page discloses analytics');
const schedule=docs.get('/schedule/');
assert(schedule.includes('href="#calendar"'),'schedule page lets visitors go straight to the calendar');
assert(schedule.includes('Josh will call'),'schedule page explains phone confirmation');
for(const price of ['$60/hour','$100','$120','$150','$160'])assert(schedule.includes(price),`schedule page includes ${price}`);
assert(!schedule.includes('data-booking-service='),'service details are entered in Google, without a disconnected website picker');
assert(schedule.includes('does not reserve three hours'),'three-hour service does not promise a one-hour reservation covers the full job');
assert(schedule.includes('timezone shown inside the calendar'),'calendar times explain the visitor timezone');
assert(!/Busy times are removed automatically|hides conflicts already/.test(schedule),'unverified conflict rules are not promised');
assert(schedule.includes('calendar.google.com/calendar/appointments/schedules/'),'schedule page embeds the live Google appointment calendar');
assert(schedule.includes('calendar.app.google/'),'schedule page has a direct booking fallback link');
const home=docs.get('/');
assert(home.includes('Tech help across the Portland metro.'),'homepage explains the broader service area');
for(const area of ['Portland, Oregon','Southeast Portland, Oregon','Beaverton, Oregon'])assert(home.includes(`"name":"${area}"`),`homepage LocalBusiness schema includes ${area}`);
const staticOnly=process.argv.includes('--static-only');
const base=process.argv.slice(2).find(arg=>!arg.startsWith('--'))||'http://localhost:4321';const http=[];
if(!staticOnly){
for(const p of pages){const res=await fetch(base+p.route);assert.equal(res.status,200,`${p.route}: HTTP status`);const html=await res.text();assert.equal(html,docs.get(p.route),`${p.route}: served page differs from the generated build`);http.push({route:p.route,status:res.status,bytes:Buffer.byteLength(html)});}
const missing=await fetch(base+'/this-page-does-not-exist-20260909/');assert.equal(missing.status,404,'Unknown path must return 404');assert((await missing.text()).includes('That page isn’t here.'),'Custom 404 page');
}
const scope=staticOnly?'static':'static-and-http';
const result={checkedAt:new Date().toISOString(),scope,base:staticOnly?null:base,pages:pages.length,internalLinksAndAssets:links,jsonLdDocuments:schemas,uniqueTitles:titles.size,uniqueDescriptions:descriptions.size,http};await writeFile('.local/validation-'+(staticOnly?'static':new URL(base).hostname==='tech-stuff.tech'?'production':'local')+'.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
