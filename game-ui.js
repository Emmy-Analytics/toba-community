/* TOBA COURT — Hybrid game UI (uses game.js engine & i18n) */
const tcBtn=(k,group)=>`<button class="tc-btn" data-tac="${k}" data-group="${group}"><strong>${t(group==='off'?'tac.'+k:'def.'+k)}</strong><small>${t(group==='off'?'tac.'+k+'.d':'def.'+k+'.d')}</small></button>`;
function gameLobby(){
 const s=SAVE;
 return `<section class="section-wrap page-hero game-hero"><div><p class="eyebrow">TOBA COURT</p><h1>${t('game.title')}<br><span class="accent-pink">${t('game.subtitle').toUpperCase()}</span></h1><p class="lede">${t('game.lobby.lede')}</p><p class="tag orange">${t('game.demo.roster')}</p><p class="season-note">${t('game.save.note')}</p></div><div class="hero-art"><img class="mascot" src="assets/crocodile-head.png" alt="${t('ui.alt.mascot')}"></div></section>
 <section class="section-wrap"><div class="game-lobby">
  ${s?`<div class="dynasty-strip"><div><p class="eyebrow">THE DYNASTY</p><h3>${s.teamName}</h3><p class="meta">${t('game.season.week')} ${s.season.week} · ${s.season.wins}W – ${s.season.losses}L · ${s.roster.length} ${t('game.roster.players')}</p></div><button class="pill" id="resumeDynasty">${t('game.dynasty.resume')}</button></div>`
   :`<div class="dynasty-strip"><div><p class="eyebrow">THE DYNASTY</p><p class="lede">${t('game.dynasty.none')}</p></div><button class="pill" id="newDynasty">${t('game.dynasty.create')}</button></div>`}
  <div class="mode-pick"><h2>MODE</h2>
   <div class="lobby-grid">
    <button class="lobby-card mode" data-mode="live"><strong>${t('game.mode.live')}</strong><span>${t('game.mode.live.d')}</span></button>
    <button class="lobby-card mode" data-mode="iq"><strong>${t('game.mode.iq')}</strong><span>${t('game.mode.iq.d')}</span></button>
    <button class="lobby-card mode" data-mode="season"><strong>${t('game.mode.championship')}</strong><span>${t('game.mode.championship.d')}</span></button>
    <button class="lobby-card mode" data-mode="lab"><strong>${t('game.mode.lab')}</strong><span>${t('game.mode.lab.d')}</span></button>
   </div>
  </div>
  <div class="game-start-row"><button class="pill" id="gameStart" disabled>${t('game.start')}</button><button class="pill" id="gameBack">${t('game.back')}</button></div>
 </div></section>`;
}
function dynastyCreateUI(){
 return `<section class="section-wrap game-arena"><div class="panel-head"><h2>${t('game.dynasty.create')}</h2></div>
 <form class="form-card" id="dynastyForm">
  <div class="form-grid">
   <div class="field"><label for="tName">${t('game.dynasty.teamname')}</label><input id="tName" required maxlength="24" placeholder="${t('game.dynasty.teamname.ph')}"></div>
   <div class="field"><label for="tComm">${t('game.dynasty.community')}</label><select id="tComm"><option value="tobaladies">Tobaladies</option><option value="tobadeli">Tobadeli</option></select></div>
  </div>
  <p class="eyebrow" style="margin-top:22px">${t('game.dynasty.pickfive')}</p>
  <table class="roster-table"><thead><tr><th></th><th>${t('game.stats.col.name')}</th><th>POS</th>${ATTR_KEYS.map(k=>`<th>${ATTR_LABEL[k].slice(0,3).toUpperCase()}</th>`).join('')}</tr></thead>
  <tbody>${DEMO_POOL.map((p,i)=>`<tr><td><input type="checkbox" data-i="${i}"></td><td>${p.n}</td><td>${p.pos}</td>${ATTR_KEYS.map(k=>`<td>${p[k]}</td>`).join('')}</tr>`).join('')}</tbody></table>
  <p class="season-note" id="dynMsg">${t('game.dynasty.picknote')}</p>
  <button class="pill" type="submit">${t('game.dynasty.confirm')}</button>
 </form></section>`;
}
function dynastyViewUI(){
 const s=SAVE;
 return `<section class="section-wrap game-arena"><div class="panel-head"><div><p class="eyebrow">THE DYNASTY</p><h2>${s.teamName}</h2></div><button class="pill" id="resetDynasty">${t('game.dynasty.reset')}</button></div>
 <p class="meta">${t('game.dynasty.chemistry')}: ${s.chemistry} · ${t('game.season.week')} ${s.season.week} · ${s.season.wins}W–${s.season.losses}L</p>
 <table class="roster-table" style="margin-top:16px"><thead><tr><th>${t('game.stats.col.name')}</th><th>POS</th>${ATTR_KEYS.map(k=>`<th>${ATTR_LABEL[k].slice(0,3).toUpperCase()}</th>`).join('')}</tr></thead>
 <tbody>${s.roster.map(p=>`<tr><td>${p.n}</td><td>${p.pos}</td>${ATTR_KEYS.map(k=>`<td>${p[k]}${SAVE.lab[k]?`<small style="color:var(--accent)"> +${Math.min(SAVE.lab[k],4)}</small>`:''}</td>`).join('')}</tr>`).join('')}</tbody></table>
 <p class="season-note">${t('game.lab.note')}</p></section>`;
}
function liveCourtUI(){
 return `<section class="section-wrap game-arena"><div class="panel-head"><h2>${t('game.mode.live')}</h2></div>
 <div class="scoreboard"><div class="sb-team ladies">Tobaladies<strong id="lcL">0</strong></div><div class="sb-mid"><strong id="lcClock">2:00</strong><span id="lcHint">${t('game.live.controls')}</span></div><div class="sb-team deli">Tobadeli<strong id="lcR">0</strong></div></div>
 <div class="court-wrap"><canvas id="lcCanvas" width="520" height="300" style="width:100%;display:block"></canvas></div>
 <div class="game-actions"><button class="pill" id="lcShoot">${t('game.live.shoot')}</button><button class="pill" id="lcPass">${t('game.live.pass')}</button><button class="pill" id="lcSteal">${t('game.live.steal')}</button><button class="pill" id="lcRestart">${t('game.reset')}</button><button class="pill" id="gameBack">${t('game.back')}</button></div>
 <p class="season-note" id="lcFeedback"></p>
 <div class="log-card"><h4>${t('game.log')}</h4><ul id="lcLog"></ul></div></section>`;
}
function iqUI(){
 return `<section class="section-wrap game-arena"><div class="panel-head"><h2>${t('game.mode.iq')}</h2><p class="lede">${t('game.iq.lede')}</p></div>
 <div class="tac-panels"><div class="tac-panel"><h4>${t('game.offense')}</h4><div class="tac-list">${OFFENSE.map(k=>tcBtn(k,'off')).join('')}</div></div>
 <div class="tac-panel"><h4>${t('game.defense')}</h4><div class="tac-list">${DEFENSE.map(k=>tcBtn(k,'def')).join('')}</div></div></div>
 <div class="game-actions"><button class="pill" id="iqSim">${t('game.iq.sim')}</button><button class="pill" id="gameBack">${t('game.back')}</button></div>
 <div class="log-card"><h4>${t('game.log')}</h4><ul id="iqLog"></ul></div></section>`;
}
function seasonUI(){
 const s=SAVE;
 if(!s)return `<section class="section-wrap"><div class="callout"><div><p class="eyebrow">ROAD TO CHAMPIONSHIP</p><h3>${t('game.season.need')}</h3></div><button class="pill" id="goCreate">${t('game.dynasty.create')}</button></div></section>`;
 return `<section class="section-wrap game-arena"><div class="panel-head"><div><p class="eyebrow">ROAD TO CHAMPIONSHIP</p><h2>${s.teamName}</h2></div><span class="tag">${s.season.wins}W – ${s.season.losses}L</span></div>
 <table class="standings"><thead><tr><th>${t('game.season.week')}</th><th>${t('game.season.opp')}</th><th>${t('game.season.result')}</th></tr></thead>
 <tbody>${s.season.schedule.map((m,i)=>`<tr class="${s.season.champion&&i===3?'champ':''}"><td>${i+1}</td><td>${m.opp}</td><td>${m.done?(m.result==='W'?`<b>W</b> ${m.sf}–${m.sa}`:`<b>L</b> ${m.sf}–${m.sa}`):m.done===false?'<button class="pill tc-play" data-i="'+i+'" style="padding:7px 16px;font-size:11px">'+t('game.season.play')+'</button>':'—'}</td></tr>`).join('')}</tbody></table>
 ${s.season.champion?`<div class="callout" style="margin-top:22px"><div><p class="eyebrow">🏆 CHAMPION</p><h3>${t('game.season.trophy')}</h3></div><button class="pill" id="seasonReset">${t('game.season.new')}</button></div>`:''}
 <p class="season-note">${t('game.season.demo')}</p>
 <div class="game-actions"><button class="pill" id="gameBack">${t('game.back')}</button></div></section>`;
}
function labUI(){
 const labels=LAB_DRILLS.map((d,i)=>`<button class="filter-btn ${i===0?'active':''}" data-drill="${i}">${t(d.key)}</button>`).join('');
 return `<section class="section-wrap game-arena"><div class="practice-head"><h2>${t('game.mode.lab')}</h2><div class="filters" id="labTabs">${labels}</div><p class="lede">${t('game.practice.lede')}</p></div>
 <div class="court-wrap practice-wrap"><div class="practice-track"><div class="practice-zone" id="pZone"></div><div class="practice-marker" id="pMarker"></div></div></div>
 <div class="practice-score"><span id="pScore">0 / 10</span><span id="pFeedback"></span></div>
 <div class="game-actions"><button class="pill" id="pShoot">${t('game.lab.attempt')}</button><button class="pill" id="pRestart">${t('game.again')}</button><button class="pill" id="gameBack">${t('game.back')}</button></div>
 <p class="season-note">${t('game.lab.note')}</p></section>`;
}
/* ---------- state & wiring ---------- */
let pickedMode=null,LC=null,LCraf=null,LABraf=null,labTimer=null,KEYS={};
function app(){return document.getElementById('app')}
function show(html){app().innerHTML=html}
function gameStartAction(){
 if(!pickedMode)return;
 if(pickedMode==='live'){if(!SAVE&&confirm(t('game.live.needdynasty'))===null)return;show(liveCourtUI());startLive();return;}
 if(pickedMode==='iq'){show(iqUI());return;}
 if(pickedMode==='season'){show(seasonUI());return;}
 if(pickedMode==='lab'){show(labUI());startLab(0);return;}
}
function startLive(){
 LC=newLiveCourt(SAVE?(SAVE.community):'tobaladies');
 const cv=document.getElementById('lcCanvas'),ctx=cv.getContext('2d');
 const keys={};
 const kd=e=>{KEYS[e.key.toLowerCase()]=true},ku=e=>{KEYS[e.key.toLowerCase()]=false};
 document.addEventListener('keydown',kd);document.addEventListener('keyup',ku);
 const input=()=>({up:KEYS.w||KEYS.arrowup,down:KEYS.s||KEYS.arrowdown,left:KEYS.a||KEYS.arrowleft,right:KEYS.d||KEYS.arrowright});
 let last=performance.now();
 function draw(){
  ctx.clearRect(0,0,COURT_W,COURT_H);
  ctx.strokeStyle='#c9c4b4';ctx.lineWidth=1.4;
  ctx.strokeRect(8,8,COURT_W-16,COURT_H-16);
  ctx.beginPath();ctx.moveTo(COURT_W/2,8);ctx.lineTo(COURT_W/2,COURT_H-8);ctx.stroke();
  ctx.beginPath();ctx.arc(COURT_W/2,COURT_H/2,34,0,7);ctx.stroke();
  ctx.strokeRect(8,COURT_H/2-40,52,80);ctx.strokeRect(COURT_W-60,COURT_H/2-40,52,80);
  LC.players.forEach(p=>{
   ctx.beginPath();ctx.arc(p.x,p.y,7,0,7);
   ctx.fillStyle=p.team==='tobaladies'?'#C77D91':'#C96532';ctx.fill();
   ctx.strokeStyle=p===LC.players[LC.userIdx]?'#242722':'transparent';ctx.lineWidth=2;ctx.stroke();
  });
  const b=LC.ball;ctx.beginPath();ctx.arc(b.x,b.y,5,0,7);ctx.fillStyle='#E47B3D';ctx.fill();
 }
 function frame(now){
  const dt=Math.min(.05,(now-last)/1000);last=now;
  liveCourtTick(LC,input(),dt);liveAIpossessions(LC,dt);
  draw();
  document.getElementById('lcL').textContent=LC.score.tobaladies;
  document.getElementById('lcR').textContent=LC.score.tobadeli;
  document.getElementById('lcClock').textContent=fmtClock(LC.clock);
  document.getElementById('lcLog').innerHTML=LC.log.slice(0,12).map(l=>`<li>${l}</li>`).join('');
  if(!LC.over)LCraf=requestAnimationFrame(frame);else{LC.log.unshift('🏁 '+finalLine(LC));document.getElementById('lcLog').innerHTML=LC.log.slice(0,12).map(l=>`<li>${l}</li>`).join('');document.removeEventListener('keydown',kd);document.removeEventListener('keyup',ku);}
 }
 LCraf=requestAnimationFrame(frame);
 document.getElementById('lcShoot').addEventListener('click',()=>{const r=liveShoot(LC,Math.random()*.6+.4);fb(`${r?t('game.hit'):t('game.miss')}`)});
 document.getElementById('lcPass').addEventListener('click',()=>{livePass(LC)&&fb(t('game.live.passed'))});
 document.getElementById('lcSteal').addEventListener('click',()=>{liveSteal(LC)});
 document.getElementById('lcRestart').addEventListener('click',()=>{cancelAnimationFrame(LCraf);startLive()});
}
function fb(msg){const el=document.getElementById('lcFeedback');if(el)el.textContent=msg}
function finalLine(LC){const a=LC.score.tobaladies,b=LC.score.tobadeli;return a===b?t('game.draw'):(a>b?t('game.ladies'):t('game.deli'))+' '+t('game.win')+' '+a+'–'+b}
function fmtClock(s){s=Math.max(0,Math.round(s));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}
function startLab(idx){
 clearInterval(labTimer);cancelAnimationFrame(LABraf);
 newLab(idx);
 const zone=document.getElementById('pZone'),mark=document.getElementById('pMarker');
 if(!zone)return;
 labTimer=setInterval(()=>{labTick();mark.style.left=LAB.pos+'%';zone.style.left=LAB.zone[0]+'%';zone.style.width=(LAB.zone[1]-LAB.zone[0])+'%'},30);
 document.querySelectorAll('#labTabs .filter-btn').forEach(b=>b.classList.toggle('active',Number(b.dataset.drill)===idx));
}
function bindLab(){
 document.getElementById('labTabs')?.addEventListener('click',e=>{const b=e.target.closest('[data-drill]');if(b)startLab(Number(b.dataset.drill))});
 document.getElementById('pShoot')?.addEventListener('click',()=>{if(!LAB)return;const hit=labAttempt();document.getElementById('pScore').textContent=LAB.hits+' / '+LAB.total;document.getElementById('pFeedback').textContent=hit?t('game.hit'):t('game.miss');if(!LAB.running){clearInterval(labTimer);document.getElementById('pFeedback').textContent=t('game.result')+' '+LAB.hits+'/'+LAB.total}});
 document.getElementById('pRestart')?.addEventListener('click',()=>startLab(LAB?LAB.idx:0));
}
document.addEventListener('click',e=>{
 const card=e.target.closest('.lobby-card.mode');
 if(card){pickedMode=card.dataset.mode;document.querySelectorAll('.lobby-card.mode').forEach(c=>c.classList.toggle('picked',c===card));const st=document.getElementById('gameStart');if(st)st.disabled=false;return;}
 if(e.target.closest('#gameStart')){gameStartAction();return;}
 if(e.target.closest('#gameBack')){pickedMode=null;cancelAnimationFrame(LCraf);clearInterval(labTimer);show(gameLobby());return;}
 if(e.target.closest('#newDynasty')||e.target.closest('#goCreate')){show(dynastyCreateUI());return;}
 if(e.target.closest('#resumeDynasty')){show(dynastyViewUI());return;}
 if(e.target.closest('#resetDynasty')){clearSave();SAVE=null;show(gameLobby());return;}
 if(e.target.closest('#seasonReset')){if(SAVE){SAVE.season={week:1,schedule:[0,1,2,3].map(i=>({opp:OPPONENTS[i],done:false,result:null,sf:0,sa:0})),wins:0,losses:0,bracket:null,champion:false};SAVE.results=[];writeSave(SAVE);show(seasonUI())}return;}
 const play=e.target.closest('.tc-play');
 if(play){const i=Number(play.dataset.i);const m=SAVE.season.schedule[i];
  const res=simMatchIQ(SAVE.roster,m.opp,SAVE.settings.off||'team',SAVE.settings.def||'man','team','man');
  m.done=true;m.result=res.win?'W':'L';m.sf=res.myS;m.sa=res.opS;
  SAVE.season.week=Math.min(4,i+2);
  if(res.win){SAVE.season.wins++;if(i===3){SAVE.season.champion=true}}else SAVE.season.losses++;
  SAVE.results.unshift(res);SAVE.settings.off=SAVE.settings.off||'team';writeSave(SAVE);
  show(seasonUI());return;}
});
document.addEventListener('submit',e=>{
 if(e.target.id!=='dynastyForm')return;e.preventDefault();
 const checks=[...document.querySelectorAll('#dynastyForm input[type=checkbox]:checked')];
 if(checks.length!==5){document.getElementById('dynMsg').textContent=t('game.dynasty.pickerr');return}
 const idx=checks.map(c=>Number(c.dataset.i));
 SAVE=defaultSave(document.getElementById('tName').value,document.getElementById('tComm').value,idx);
 writeSave(SAVE);show(dynastyViewUI());
});
document.addEventListener('DOMContentLoaded',()=>{
 if(document.body.dataset.page!=='game')return;
 show(gameLobby());
});
