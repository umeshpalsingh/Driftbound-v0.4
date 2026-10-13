import assert from 'node:assert/strict';
import {Run,LEVELS,COURSE_LIMIT,GRAVITY,trackPoint,trackCenter} from '../dist/engine.mjs';
const obstacle=(x,z,type='tree')=>({x,z,type,halfWidth:.65,depth:.6,height:type==='tree'?6:1,passed:false});
const empty=()=>{const r=new Run();r.objects=[];r.pickups=[];return r;};
{
 const r=empty();r.objects=[obstacle(0,1)];r.step(.1);assert.equal(r.status,'crashed');const d=r.distance;r.step(.1);assert.equal(r.distance,d);
 const s=empty();s.shield=15;s.objects=[obstacle(0,1),obstacle(0,40)];s.step(.1);assert(s.alive);assert.equal(s.shield,0);assert(s.events.some(e=>e.type==='save'));for(let i=0;i<200&&s.alive;i++)s.step(.02);assert.equal(s.status,'crashed','shield absorbs one encounter, not all later collisions');
}
{
 const r=empty();r.objects=[obstacle(1.4,1),obstacle(1.4,4),obstacle(1.4,7)];for(let i=0;i<6;i++)r.step(.1);assert(r.alive);assert.equal(r.nearMisses,3);assert(r.boost>0);for(let i=0;i<55;i++)r.step(.1);assert.equal(r.combo,1);assert.equal(r.boost,0);
}
{
 const r=empty();r.objects=[{...obstacle(0,20,'ramp'),depth:1.6,height:1.05,launch:13}];let peak=0,airTime=0,takeoff=false,landed=false,lastY=r.verticalY;
 for(let i=0;i<650;i++){r.step(1/120);assert(Number.isFinite(r.verticalY));assert(Math.abs(r.verticalY-lastY)<.22,'ramp and flight have no vertical teleport');lastY=r.verticalY;peak=Math.max(peak,r.airHeight);if(r.air){takeoff=true;airTime+=1/120;if(r.airTime>.3&&r.trick===0)assert(r.spin());}if(takeoff&&!r.air){landed=true;break;}}
 assert(peak>5&&peak<8,`natural high jump peak ${peak}`);assert(airTime>1.5&&airTime<2.2);assert(landed);assert.equal(r.tricks,1);assert.equal(r.coins,5);assert(r.landing>0);console.log(`Jump: ${peak.toFixed(2)} m peak, ${airTime.toFixed(2)} s airtime, continuous launch/landing, 360 bonus.`);
}
{
 const r=empty();r.objects=[{...obstacle(0,4),depth:2}];r.x=r.target=1.9;r.step(.15);r.target=0;for(let i=0;i<3;i++)r.step(.1);assert.equal(r.status,'crashed','side-entry swept collision');
}
{
 const r=empty();r.magnet=9;r.double=9;r.pickups=[{id:'a',type:'coin',x:3,z:3,y:.85,value:2,collected:false},{id:'b',type:'diamond',x:3,z:3,y:.85,value:1,collected:false}];r.step(.1);assert.equal(r.coins,4,'magnet and 2x stack');assert.equal(r.diamonds,0,'magnet does not trivialize diamonds');for(let i=0;i<20;i++)r.step(.05);assert.equal(r.coins,4,'pickup awarded once');
 const gem=empty();gem.pickups=[{id:'g',type:'diamond',x:0,z:1,y:.85,value:1,collected:false}];gem.step(.1);assert.equal(gem.diamonds,1);assert.deepEqual(gem.gemIds,['g']);
 const p=empty();p.pickups=[{id:'p',type:'nitro',x:0,z:1,y:1,collected:false}];p.step(.1);assert(p.boost>2.9);
}
{
 const r=empty();r.distance=r.level.length-.5;r.step(.1);assert.equal(r.status,'finished');assert.equal(r.progress,1);const score=r.score;r.step(1);assert.equal(r.score,score);
}
let routes=0,total=0,coins=0,jumps=0;
for(let li=0;li<LEVELS.length;li++)for(let seed=1;seed<=8;seed++){
 for(const side of [-1,1]){const e=new Run(li,seed);for(let f=0;f<1200&&e.alive;f++)e.step(1/60,side);assert.equal(e.status,'crashed',`edge ${side}, route ${li}`);assert(e.distance<100);}
 const r=new Run(li,seed),cues=[...r.rows,...r.flights.flatMap(f=>[{z:f.z+2,safe:0},{z:f.end-12,safe:0}])].sort((a,b)=>a.z-b.z);let cue=0;
 for(let frame=0;frame<9000&&r.alive;frame++){while(cue<cues.length-1&&r.distance>cues[cue].z+2)cue++;r.target=cues[cue].safe;r.step(1/60);}
 assert.equal(r.status,'finished',`route ${li+1} seed ${seed} must be reachable; crashed ${r.distance.toFixed(1)}`);assert(r.jumps>0,'route includes an achievable jump');total+=r.distance;routes++;coins+=r.coins;jumps+=r.jumps;
 const p=trackPoint(0,LEVELS[li].length*.6,LEVELS[li]);assert(Number.isFinite(p.x)&&Number.isFinite(p.heading));const bends=Array.from({length:30},(_,i)=>trackCenter(LEVELS[li].length*i/29,LEVELS[li]));assert(Math.max(...bends)-Math.min(...bends)>LEVELS[li].curve,'course has substantial bends');
 if(seed===1)for(let x=-COURSE_LIMIT;x<=COURSE_LIMIT;x+=.5){const idle=new Run(li,seed);idle.x=idle.target=x;for(let f=0;f<9000&&idle.alive;f++)idle.step(1/60);assert.equal(idle.status,'crashed',`stationary line ${x} cannot bypass level ${li}`);}
}
console.log(`PASS: ${routes} full curved routes (${total} m), ${routes*2} corner regressions, ${jumps} jumps. Average collected coins on safe route: ${Math.round(coins/routes)}.`);
for(let i=0;i<LEVELS.length;i++)for(const steer of [false,true]){
 const r=new Run(i),f=r.flights[0],gem=r.pickups.find(p=>p.type==='diamond');r.distance=f.z-8;r.speed=Math.min(r.level.maxSpeed,r.level.speed+r.distance/220);r.objects=r.objects.filter(o=>o.type==='ramp'&&o.z===f.z);r.pickups=[gem];
 for(let n=0;n<500;n++){if(r.air&&steer)r.target=gem.x;r.step(1/120);if(r.diamonds)break;}
 assert.equal(r.diamonds,steer?1:0,`level ${i+1} rare pickup requires deliberate lateral air steering`);
}
console.log('PASS: nine rare aerial pickups are reachable by steering, and missed by a straight jump.');
