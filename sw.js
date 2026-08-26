const CACHE='miy-den-v15';
const PATCH_STYLE=`<style data-v15-patch>
.introCopy>div{display:none!important}
.introPhone::before,.introPhone::after,.introPhone .armorGlow,.introPhone .embers,.introPhone .embers::before,.introPhone .embers::after{pointer-events:none!important}
.introCopy{z-index:50!important;pointer-events:none!important}
#startBtn{position:relative!important;z-index:999!important;pointer-events:auto!important;touch-action:manipulation!important;opacity:0!important}
</style>`;
const PATCH_SCRIPT=`<script data-v15-patch>(()=>{const b=document.getElementById('startBtn'),i=document.getElementById('intro');if(!b||!i)return;const go=e=>{if(e&&e.cancelable)e.preventDefault();i.classList.add('hide')};b.style.pointerEvents='auto';b.style.touchAction='manipulation';b.addEventListener('click',go,true);b.addEventListener('pointerup',go,true);b.addEventListener('touchend',go,{capture:true,passive:false});})();<\/script>`;
function patched(html){if(html.includes('data-v15-patch'))return html;html=html.replace('</head>',PATCH_STYLE+'</head>');html=html.replace('</body>',PATCH_SCRIPT+'</body>');return html}
async function navResponse(req){try{const r=await fetch(req,{cache:'no-store'});if(!r.ok)return r;const h=new Headers(r.headers);h.delete('content-length');h.delete('content-encoding');return new Response(patched(await r.text()),{status:r.status,statusText:r.statusText,headers:h})}catch(err){const r=await caches.match('./index.html');if(!r)return Response.error();const h=new Headers(r.headers);h.delete('content-length');h.delete('content-encoding');return new Response(patched(await r.text()),{status:r.status,statusText:r.statusText,headers:h})}}
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html','./manifest.webmanifest'])))});
self.addEventListener('activate',e=>e.waitUntil(Promise.all([clients.claim(),caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))])));
self.addEventListener('fetch',e=>{const req=e.request;if(req.mode==='navigate'){e.respondWith(navResponse(req));return}e.respondWith((async()=>{try{const r=await fetch(req,{cache:'no-store'});if(r&&r.ok){const c=r.clone();(await caches.open(CACHE)).put(req,c)}return r}catch(err){return (await caches.match(req))||Response.error()}})())});