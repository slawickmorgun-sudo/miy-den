const CACHE='miy-den-v17';
const PATCH_STYLE=`<style data-v17-patch>
/* v17: intro may never block controls after it is dismissed */
.intro.hide{display:none!important;pointer-events:none!important;visibility:hidden!important}
.intro.hide *{pointer-events:none!important}
.introPhone::before,.introPhone::after,.introPhone .armorGlow,.introPhone .embers,.introPhone .embers::before,.introPhone .embers::after{pointer-events:none!important}
/* cover the baked-in old title, then draw the clean bright HTML title */
.introPhone:after{z-index:2!important;background:linear-gradient(180deg,rgba(2,4,10,.96) 0%,rgba(2,4,10,.92) 23%,rgba(2,4,10,.55) 35%,rgba(2,4,10,.10) 50%,rgba(2,4,10,.18) 70%,rgba(2,4,10,.82) 88%,rgba(2,4,10,.96) 100%)!important}
.introCopy{z-index:50!important;pointer-events:none!important}
.introCopy>div{display:block!important;visibility:visible!important;opacity:1!important}
.introCopy h1{color:#d28cff!important;opacity:1!important;text-shadow:0 0 18px rgba(166,82,255,.75),0 2px 8px #000!important}
.introCopy p{color:#fff!important;opacity:1!important;text-shadow:0 2px 10px #000!important}
#startBtn{position:relative!important;z-index:100!important;pointer-events:auto!important;touch-action:manipulation!important;opacity:1!important;background:linear-gradient(90deg,#7427e8,#3b155f)!important;color:#fff!important;box-shadow:0 0 28px rgba(142,65,255,.38)!important}
/* app itself must always receive taps */
.app,header,.screen,.card,nav,.fab,.btn,button,input,select{pointer-events:auto!important}
.brand{color:#fff!important}.sub{color:#aab4c8!important}
</style>`;
const PATCH_SCRIPT=`<script data-v17-patch>(()=>{const i=document.getElementById('intro'),b=document.getElementById('startBtn');if(!i||!b)return;const go=()=>{i.classList.add('hide');i.style.display='none';i.style.pointerEvents='none'};b.addEventListener('click',go);b.addEventListener('pointerup',go);})();<\/script>`;
function clean(html){return html.replace(/<style data-v1[0-9]-patch>[\s\S]*?<\/style>/g,'').replace(/<script data-v1[0-9]-patch>[\s\S]*?<\\\/script>/g,'')}
function patched(html){html=clean(html);html=html.replace('</head>',PATCH_STYLE+'</head>');html=html.replace('</body>',PATCH_SCRIPT+'</body>');return html}
async function navResponse(req){try{const r=await fetch(req,{cache:'no-store'});if(!r.ok)return r;const h=new Headers(r.headers);h.delete('content-length');h.delete('content-encoding');return new Response(patched(await r.text()),{status:r.status,statusText:r.statusText,headers:h})}catch(err){const r=await caches.match('./index.html');if(!r)return Response.error();const h=new Headers(r.headers);h.delete('content-length');h.delete('content-encoding');return new Response(patched(await r.text()),{status:r.status,statusText:r.statusText,headers:h})}}
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html','./manifest.webmanifest'])))})
self.addEventListener('activate',e=>e.waitUntil(Promise.all([self.clients.claim(),caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))])))
self.addEventListener('fetch',e=>{const req=e.request;if(req.mode==='navigate'){e.respondWith(navResponse(req));return}e.respondWith((async()=>{try{return await fetch(req,{cache:'no-store'})}catch(err){return (await caches.match(req))||Response.error()}})())})