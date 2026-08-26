const CACHE='miy-den-v12';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html','./manifest.webmanifest','./hotfix-v12.css','./hotfix-v12.js'])))});
self.addEventListener('activate',e=>e.waitUntil(Promise.all([clients.claim(),caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))])));
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.mode==='navigate'){
    e.respondWith((async()=>{
      try{
        const r=await fetch(req,{cache:'no-store'});let t=await r.text();
        if(!t.includes('hotfix-v12.css'))t=t.replace('</head>','<link rel="stylesheet" href="hotfix-v12.css?v=12"></head>');
        if(!t.includes('hotfix-v12.js'))t=t.replace('</body>','<script src="hotfix-v12.js?v=12"></script></body>');
        return new Response(t,{status:r.status,statusText:r.statusText,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}})
      }catch(err){return (await caches.match('./index.html'))||Response.error()}
    })());return;
  }
  e.respondWith((async()=>{try{const r=await fetch(req);const c=r.clone();(await caches.open(CACHE)).put(req,c);return r}catch(err){return (await caches.match(req))||Response.error()}})())
});