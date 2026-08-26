(()=>{
  const KEYS=['YouTube','Англійська','3D','Спорт'];
  const DEF={YouTube:600,'Англійська':160,'3D':120,Спорт:180};
  function clean(raw){const out={};KEYS.forEach(k=>{const v=Number(raw&&raw[k]);out[k]=Number.isFinite(v)&&v>0?v:DEF[k]});return out}
  try{
    if(typeof P!=='undefined'){
      goals=clean(goals);
      localStorage.setItem(P+'goals',JSON.stringify(goals));
    }
  }catch(e){}
  if(typeof renderGoals==='function'){
    renderGoals=function(){
      goals=clean(goals);
      let rec=weekRecords(),done=rec.flatMap(r=>r.tasks.filter(t=>t.done));
      document.getElementById('goals').innerHTML=KEYS.map(k=>{
        let v=done.filter(t=>t.cat===k).reduce((s,t)=>s+(+t.dur||0),0),g=Number(goals[k])||DEF[k],p=Math.min(100,Math.round(v/g*100));
        return `<div class="goal"><div class="row"><div><b>${k}</b><div class="sub">${Math.floor(v/60)} год ${v%60} хв / ${Math.floor(g/60)} год ${g%60} хв</div></div><b>${p}%</b></div><div class="bar"><i style="width:${p}%;background:${C[k]}"></i></div></div>`
      }).join('');
    }
  }
  if(typeof openGoals==='function'){
    openGoals=function(){
      goals=clean(goals);localStorage.setItem(P+'goals',JSON.stringify(goals));
      goalInputs.innerHTML=KEYS.map(k=>`<div class="goalEditRow"><div><b>${k}</b><div class="sub">хвилин на тиждень</div></div><input type="number" min="10" step="10" id="g_${k.replace('3D','d3').replace('Англійська','eng')}" value="${goals[k]}"></div>`).join('');
      goalsModal.classList.add('on');
    }
  }
  if(typeof saveGoals==='function'){
    saveGoals=function(){
      const ids={YouTube:'g_YouTube','Англійська':'g_eng','3D':'g_d3',Спорт:'g_Спорт'};
      KEYS.forEach(k=>{let el=document.getElementById(ids[k]);if(el&&+el.value>0)goals[k]=+el.value});
      goals=clean(goals);localStorage.setItem(P+'goals',JSON.stringify(goals));closeGoals();renderGoals();sync('goals_updated',{goals});
    }
  }
  if(typeof show==='function'){
    const originalShow=show;
    show=function(id,b){originalShow(id,b);const f=document.querySelector('.fab');if(f)f.classList.toggle('hotfix-hidden',id!=='home')}
  }
  try{renderGoals();}catch(e){}
})();