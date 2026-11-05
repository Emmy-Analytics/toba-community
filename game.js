/* TOBA COURT — Hybrid Basketball Game engine (MVP)
   Modules: save system, dynasty (roster/attributes), live court 3v3 canvas sim,
   court IQ tactical sim, championship season, player lab drills.
   All game data is demo/fictional. Save is localStorage only (no multiplayer). */
const SAVE_KEY='toba-court-save-v1';
const SAVE_LIMITS='Progress is stored only in this browser (localStorage). Clearing browser data or using another device will not carry your save. No multiplayer or cloud sync in this MVP.';

/* ---------- attribute pool (demo, fictional) ---------- */
const ATTR_KEYS=['sh','hb','pa','df','rb','sp','st','iq'];
const ATTR_LABEL={sh:'Shooting',hb:'Ball Handling',pa:'Passing',df:'Defense',rb:'Rebounding',sp:'Speed',st:'Stamina',iq:'Basketball IQ'};
const DEMO_POOL=[
 {n:'A. Prameswari',pos:'PG',sh:70,hb:76,pa:78,df:62,rb:48,sp:80,st:78,iq:74},
 {n:'B. Kusuma',pos:'SG',sh:82,hb:70,pa:64,df:60,rb:52,sp:76,st:78,iq:70},
 {n:'C. Andini',pos:'SF',sh:74,hb:72,pa:70,df:68,rb:64,sp:78,st:82,iq:76},
 {n:'D. Maharani',pos:'PF',sh:66,hb:60,pa:60,df:74,rb:78,sp:70,st:84,iq:72},
 {n:'E. Saputri',pos:'C',sh:60,hb:52,pa:55,df:80,rb:86,sp:58,st:86,iq:74},
 {n:'F. Wicaksono',pos:'PG',sh:72,hb:78,pa:80,df:64,rb:50,sp:82,st:79,iq:78},
 {n:'G. Simatupang',pos:'SG',sh:84,hb:72,pa:62,df:58,rb:54,sp:80,st:80,iq:70},
 {n:'H. Tamba',pos:'SF',sh:76,hb:70,pa:68,df:70,rb:66,sp:76,st:83,iq:74},
 {n:'I. Hutagalung',pos:'PF',sh:64,hb:58,pa:58,df:76,rb:80,sp:68,st:88,iq:70},
 {n:'J. Siregar',pos:'C',sh:58,hb:50,pa:52,df:82,rb:88,sp:56,st:90,iq:72}
];
const OPPONENTS=['Kota Raya Runners','Simatupang Five','Menteng Ballers','Depok Court Kings'];

/* ---------- save system ---------- */
function loadSave(){try{const s=JSON.parse(localStorage.getItem(SAVE_KEY));if(s&&s.roster)return s;}catch(e){}return null;}
function writeSave(s){try{localStorage.setItem(SAVE_KEY,JSON.stringify(s));return true}catch(e){return false}}
function clearSave(){localStorage.removeItem(SAVE_KEY)}
let SAVE=loadSave();

function defaultSave(name,comm,startingFive){
 const pool=[...DEMO_POOL];
 const roster=startingFive.map(i=>({...pool[i]}));
 return {teamName:name,community:comm,roster,chemistry:70,
   season:{week:1,schedule:[0,1,2,3].map(i=>({opp:OPPONENTS[i],done:false,result:null,sf:0,sa:0})),wins:0,losses:0,bracket:null,champion:false},
   lab:{sh:0,hb:0,pa:0,df:0,rb:0,sp:0,st:0},
   results:[],settings:{langPref:null}};
}

/* ---------- Court IQ tactical sim (reused by season & quick sim) ---------- */
const OFFENSE=['fast','pnr','iso','team'],DEFENSE=['man','zone','press'];
const OFF_FACTOR={fast:{speed:1.25,turn:.05,assist:-.1},pnr:{speed:1,turn:.02,assist:.1},iso:{speed:.9,turn:.04,assist:-.25},team:{speed:.85,turn:-.05,assist:.3}};
const DEF_FACTOR={man:{fg:.95,turn:1},zone:{fg:.9,turn:1.05,driveStop:.9},press:{fg:1,turn:1.35,pace:1.3}};
function teamRating(roster){const pick=roster.slice(0,5);const a=k=>pick.reduce((s,p)=>s+p[k],0)/pick.length;return{sh:a('sh'),pa:a('pa'),df:a('df'),st:a('st'),iq:a('iq')}}
function simPossessionIQ(oR,dR,off,def){
 const of=OFF_FACTOR[off]||OFF_FACTOR.team,df=DEF_FACTOR[def]||DEF_FACTOR.man;
 const staminaPen=1-(100-oR.st)/400;
 const turnoverP=Math.max(.05,.12+of.turn*df.turn-(oR.pa-70)/500);
 let fgp=((oR.sh/100)*df.fg*(df.driveStop||1)+(oR.pa-65)/400)*(of.assist>0?1.08:1)*staminaPen*(1+(oR.iq-70)/600);
 fgp=Math.min(.72,Math.max(.3,fgp));
 if(Math.random()<turnoverP)return{to:true};
 const made=Math.random()<fgp;
 return {to:false,made,pts:Math.random()<.32?3:2};
}
function simMatchIQ(myRoster,oppName,myOff,myDef,oppOff,oppDef,quarters=4){
 const my=teamRating(myRoster);
 const opp=teamRating(DEMO_POOL.slice(0,5)); // demo opponent squad
 let myS=0,opS=0,log=[];
 for(let q=0;q<quarters;q++){
  let myP=0,opP=0;
  for(let p=0;p<10;p++){
   const r1=simPossessionIQ(my,opp,myOff,oppDef);if(!r1.to)myP+=r1.pts;
   const r2=simPossessionIQ(opp,my,oppOff,myDef);if(!r2.to)opP+=r2.pts;
  }
  myS+=myP;opS+=opP;
  log.push(`Q${q+1}: ${myS}–${opS}`);
 }
 return{myS,opS,log,win:myS>opS};
}

/* ---------- Live Court: 3v3 canvas simulation ---------- */
const COURT_W=520,COURT_H=300;
function makeCourtPlayer(p,team,x,y){return{...p,team,x,y,vx:0,vy:0,stamina:100}}
function newLiveCourt(comm){
 const oppName=comm==='tobaladies'?'tobadeli':'tobaladies';
 const mine=(SAVE?SAVE.roster:DEMO_POOL.slice(0,5)).slice(0,3).map((p,i)=>makeCourtPlayer(p,comm,120+((i*40)%160),90+(i*70)));
 const theirs=DEMO_POOL.filter(p=>p.pos!==mine[0].pos).slice(0,3).map((p,i)=>makeCourtPlayer(p,oppName,300+(i*40),90+(i*70)));
 return {comm,oppName,players:[...mine,...theirs],ball:{x:COURT_W/2,y:COURT_H/2,vx:0,vy:0,holder:null},
   score:{[comm]:0,[oppName]:0},clock:120,over:false,log:[],userIdx:0,
   off:'team',def:'man',stats:{shots:0,makes:0,passes:0,steals:0,tov:0}};
}
function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}
function movePlayer(pl,tx,ty,speed,dt){
 const dx=tx-pl.x,dy=ty-pl.y,d=Math.hypot(dx,dy)||1;
 const eff=speed*(0.55+pl.sp/220)*(0.6+pl.stamina/250);
 pl.x=Math.max(10,Math.min(COURT_W-10,pl.x+dx/d*eff*dt*60));
 pl.y=Math.max(10,Math.min(COURT_H-10,pl.y+dy/d*eff*dt*60));
 pl.stamina=Math.max(20,pl.stamina-dt*2.2);
}
function liveCourtTick(LC,input,dt){
 if(LC.over)return;
 const me=LC.players[LC.userIdx];
 const ball=LC.ball;
 /* user movement */
 if(input.up)me.y-=me.sp/9*dt*60;if(input.down)me.y+=me.sp/9*dt*60;
 if(input.left)me.x-=me.sp/9*dt*60;if(input.right)me.x+=me.sp/9*dt*60;
 me.x=Math.max(10,Math.min(COURT_W-10,me.x));me.y=Math.max(10,Math.min(COURT_H-10,me.y));
 me.stamina=Math.max(20,me.stamina-dt*1.5);
 /* AI for others: move toward ball or their assigned spots */
 LC.players.forEach((p,i)=>{
  if(i===LC.userIdx)return;
  const isTeam=p.team===me.team;
  let tx,ty;
  if(ball.holder===p){tx=p.team===commGoal(LC)?COURT_W-40:40;ty=COURT_H/2;}
  else if(isTeam){tx=ball.x+(i<3?-60:60);ty=ball.y+((i%3)-1)*60;}
  else{tx=ball.x-40;ty=ball.y;}
  movePlayer(p,Math.max(12,Math.min(COURT_W-12,tx)),Math.max(12,Math.min(COURT_H-12,ty)),1.4,dt);
 });
 /* ball pickup */
 if(!ball.holder){
  const near=LC.players.reduce((a,p)=>dist(p,ball)<dist(a,ball)?p:a,LC.players[0]);
  if(dist(near,ball)<14){ball.holder=near;}
  else{ball.x+=ball.vx*dt*60;ball.y+=ball.vy*dt*60;ball.vx*=.96;ball.vy*=.96;ball.x=Math.max(8,Math.min(COURT_W-8,ball.x));ball.y=Math.max(8,Math.min(COURT_H-8,ball.y));}
 }else{
  ball.x=ball.holder.x+6;ball.y=ball.holder.y+2;
 }
 LC.clock-=dt;
 if(LC.clock<=0){LC.clock=0;LC.over=true;}
}
function commGoal(LC){return LC.oppName} // attack right hoop vs opp side
function liveShoot(LC,thr){ /* thr 0..1 timing quality */
 const me=LC.players[LC.userIdx];const ball=LC.ball;
 if(ball.holder!==me||LC.over)return false;
 ball.holder=null;
 const hoopX=COURT_W-14,hoopY=COURT_H/2;
 const quality=Math.min(1,thr*(me.sh/80))*(me.stamina/100*.4+.6);
 const chance=.18+quality*.55;
 LC.stats.shots++;
 const made=Math.random()<chance;
 if(made){LC.stats.makes++;const pts=Math.random()<.3?3:2;LC.score[me.team]+=pts;LC.log.unshift(`🏀 ${me.n} scores +${pts}`);}
 else{LC.log.unshift(`✗ ${me.n} misses`);}
 ball.vx=(hoopX-ball.x)/(made?6:14);ball.vy=(hoopY-ball.y)/(made?6:14)+(made?0:(Math.random()-.5)*4);
 me.stamina=Math.max(20,me.stamina-6);
 return made;
}
function livePass(LC){
 const me=LC.players[LC.userIdx];const ball=LC.ball;
 if(ball.holder!==me||LC.over)return false;
 const mates=LC.players.filter((p,i)=>p.team===me.team&&i!==LC.userIdx);
 if(!mates.length)return false;
 const open=mates.sort((a,b)=>dist(b,ball)-dist(a,ball))[0];
 ball.holder=null;ball.vx=(open.x-ball.x)/10;ball.vy=(open.y-ball.y)/10;
 LC.stats.passes++;
 setTimeout(()=>{if(!LC.ball.holder&&dist(open,LC.ball)<30)LC.ball.holder=open},260);
 return true;
}
function liveSteal(LC){
 const me=LC.players[LC.userIdx];const ball=LC.ball;
 if(!ball.holder||ball.holder.team===me.team||LC.over)return false;
 const chance=.06+me.df/900;
 if(Math.random()<chance){ball.holder=me;LC.stats.steals++;LC.log.unshift(`⚡ ${me.n} steals the ball`);return true}
 LC.log.unshift(`✗ steal attempt failed`);return false;
}
function liveAIpossessions(LC,dt){
 /* simple AI shot attempts for ball holders that are not the user */
 if(LC.ball.holder&&LC.players.indexOf(LC.ball.holder)!==LC.userIdx){
  const h=LC.ball.holder;
  h.aiT=(h.aiT||0)+dt;
  if(h.aiT>1.2){h.aiT=0;
   const nearHoop=h.team===LC.oppName;
   const qx=Math.random();
   const rating=(h.sh/100)*(nearHoop?1:.8);
   if(qx<.5+rating*.3){
    const made=Math.random()<(.28+rating*.35);
    LC.stats.aiShots=(LC.stats.aiShots||0)+1;
    if(made){const pts=Math.random()<.3?3:2;LC.score[h.team]+=pts;LC.log.unshift(`🏀 ${h.n} (${h.team}) scores +${pts}`);}
    else LC.log.unshift(`✗ ${h.n} (${h.team}) misses`);
    LC.ball.holder=null;LC.ball.vx=(nearHoop?-6:6)*(Math.random()*.5+.7);LC.ball.vy=(Math.random()-.5)*6;
   }
  }
 }
}

/* ---------- Player Lab drills ---------- */
const LAB_DRILLS=[
 {k:'sh',key:'game.practice.shoot',speed:3.4,zoneW:20},
 {k:'hb',key:'game.practice.dribble',speed:4.2,zoneW:16},
 {k:'pa',key:'game.practice.pass',speed:2.8,zoneW:18},
 {k:'df',key:'game.practice.defense',speed:3.8,zoneW:15},
 {k:'rb',key:'game.practice.rebound',speed:3.2,zoneW:17},
 {k:'sp',key:'game.practice.speed',speed:4.6,zoneW:14},
 {k:'st',key:'game.practice.stamina',speed:2.4,zoneW:22}
];
let LAB=null;
function newLab(drillIdx){
 const d=LAB_DRILLS[drillIdx];
 LAB={d,idx:drillIdx,attempt:0,total:10,hits:0,pos:0,dir:1,running:true,zone:[0,0]};
 newLabZone();return LAB;
}
function newLabZone(){LAB.zone[0]=Math.random()*(100-LAB.d.zoneW);LAB.zone[1]=LAB.zone[0]+LAB.d.zoneW;}
function labTick(){if(!LAB||!LAB.running)return;LAB.pos+=LAB.d.dir*LAB.d.speed;if(LAB.pos>100){LAB.pos=100;LAB.dir=-1}if(LAB.pos<0){LAB.pos=0;LAB.dir=1}}
function labAttempt(){
 if(!LAB||!LAB.running||LAB.attempt>=LAB.total)return null;
 LAB.attempt++;const hit=LAB.pos>=LAB.zone[0]&&LAB.pos<=LAB.zone[1];
 if(hit)LAB.hits++;
 if(LAB.attempt>=LAB.total){LAB.running=false;applyLabProgress();}
 else newLabZone();
 return hit;
}
function applyLabProgress(){
 if(!SAVE){return}
 const k=LAB.d.k;SAVE.lab[k]=(SAVE.lab[k]||0)+LAB.hits;
 const player=SAVE.roster[0];
 if(player&&player[k]!==undefined)player[k]=Math.min(99,player[k]+(LAB.hits>=7?1:0));
 writeSave(SAVE);
}
