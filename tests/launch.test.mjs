import assert from 'node:assert/strict';
import {Run,LEVELS,COURSE_LIMIT,surfaceHeight,surfaceRoll,trackBank} from '../dist/engine.mjs';
import {createProfile,settleRun} from '../dist/profile.mjs';
const prepare=i=>{const r=new Run(i);assert(r.prepareLaunch());return r;};
{
 const r=prepare(0);r.pullLaunch(1);r.step(10);assert.equal(r.distance,0);assert.equal(r.time,0);assert.equal(r.active,false);assert.equal(r.coins,0);assert.equal(r.speed,0);assert.equal(settleRun(createProfile(),r).coins,0,'no idle rewards');
 r.cancelLaunch();assert.equal(r.launchPower,0);assert.equal(r.launch(),false);r.pullLaunch(.11);assert.equal(r.launch(),false,'a tap cannot accidentally launch');r.pullLaunch(Infinity);assert.equal(r.launchPower,0);r.pullLaunch(5);assert.equal(r.launchPower,1);
 const previewY=surfaceHeight(0,-4.5,r.level);assert(r.launch());assert.equal(r.distance,-4.5);assert.equal(r.verticalY,previewY,'release starts exactly where the stretched sled was');assert.equal(r.launch(),false,'release is single-use');assert.equal(r.speed,29);r.step(.1);assert(r.speed>r.level.speed);assert.equal(r.prepareLaunch(),false,'cannot reset an active run');
 for(let n=0;n<9;n++)r.step(.1);assert(r.distance>0);assert(r.score>0);assert(r.speed<29,'launch impulse decays');
}
// All production courses must remain finishable after weak, quick, and full launches.
let routes=0;
for(let li=0;li<LEVELS.length;li++)for(const power of [.12,.75,1]){
 const r=prepare(li);r.pullLaunch(power);assert(r.launch());const cues=[...r.rows,...r.flights.flatMap(f=>[{z:f.z+2,safe:0},{z:f.end-12,safe:0}])].sort((a,b)=>a.z-b.z);let cue=0;
 for(let frame=0;frame<9000&&r.alive;frame++){while(cue<cues.length-1&&r.distance>cues[cue].z+2)cue++;r.target=cues[cue].safe;r.step(1/60);}
 assert.equal(r.status,'finished',`level ${li+1}, launch ${power}, stopped at ${r.distance}`);routes++;
 for(const side of [-1,1]){const edge=prepare(li);edge.pullLaunch(power);edge.launch();for(let frame=0;frame<1200&&edge.alive;frame++)edge.step(1/60,side);assert.equal(edge.status,'crashed','launch cannot restore the edge exploit');}
}
// Raised banks meet the surrounding surface without height or slope discontinuities.
let sections=0;
for(const level of LEVELS)for(let i=0;i<level.sequence.length;i++)if(['ice','chicane'].includes(level.sequence[i])){
 const start=i*level.length/level.sequence.length,end=(i+1)*level.length/level.sequence.length,mid=(start+end)/2;assert(trackBank(mid,level)>3);assert(surfaceHeight(COURSE_LIMIT,mid,level)-surfaceHeight(0,mid,level)>2);assert(surfaceRoll(7,mid,level)>.4);assert(surfaceRoll(-7,mid,level)<-.4);
 for(const boundary of [start,end]){const a=surfaceHeight(7,boundary-.001,level),b=surfaceHeight(7,boundary+.001,level);assert(Math.abs(a-b)<.001,'no step between sections');}sections++;
}
console.log(`PASS: launch gating, cancellation, continuous release, impulse decay, ${routes} production route completions, ${routes*2} edge checks, ${sections} smooth halfpipe sections.`);
