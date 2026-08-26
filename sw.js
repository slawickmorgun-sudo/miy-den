const CACHE='miy-den-v18';
function fixHtml(html){
  return html
    .replace("function allWeekTasks(){return weekDates().flatMap(d=>loadDay(localDateStr(d)).map(t=>({...t,date:localDateStr(d)}))}","function allWeekTasks(){return weekDates().flatMap(d=>loadDay(localDateStr(d)).map(t=>({...t,date:localDateStr(d)})))}")
    .replace('.sub{font-size:12px;color:var(--muted)}','.sub{font-size:12px;color:#aeb8cc}');
}
async function freshNavigation(req){
  try{
    const r=await fetch(req,{cache:'no-store'});
    if(!r.ok)return r;
    const h=new Headers(r.headers);h.delete('content-length');h.delete('content-encoding');
    return new Response(fixHtml(await r.text()),{status:r.status,statusText:r.statusText,headers:h});
  }catch(err){
    const r=await caches.match('./index.html');
    if(!r)return Response.error();
    const h=new Headers(r.headers);h.delete('content-length');h.delete('content-encoding');
    return new Response(fixHtml(await r.text()),{status:r.status,statusText:r.statusText,headers:h});
  }
}
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html','./manifest.webmanifest'])))});
self.addEventListener('activate',e=>e.waitUntil(Promise.all([clients.claim(),caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))])));
self.addEventListener('fetch',e=>{
  if(e.request.mode==='navigate'){e.respondWith(freshNavigation(e.request));return;}
  e.respondWith(fetch(e.request,{cache:'no-store'}).catch(()=>caches.match(e.request)));
});