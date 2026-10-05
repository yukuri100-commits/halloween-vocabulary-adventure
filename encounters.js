/* Five visitors share one active-time clock. Each shuffled round includes everyone. */
class EncounterSequence {
  constructor(random = Math.random) { this.random = random; this.reset(); }
  reset() { this.queue = ['ghost','mummy','vampire','werewolf','skeleton']; this.active = []; this.elapsed = 0; this.next = 900; this.last = null; }
  step(delta) {
    this.elapsed += delta;
    this.active = this.active.filter(v => this.elapsed - v.start < (v.id==='mummy'?16000:v.id==='werewolf'?14500:v.id==='vampire'?14000:9200));
    if (this.elapsed >= this.next) {
      if (!this.queue.length) {
        this.queue = ['ghost','mummy','vampire','werewolf','skeleton'];
        for(let i=this.queue.length-1;i>0;i--){const j=Math.floor(this.random()*(i+1));[this.queue[i],this.queue[j]]=[this.queue[j],this.queue[i]];}
        if(this.queue[0]===this.last)[this.queue[0],this.queue[1]]=[this.queue[1],this.queue[0]];
      }
      const id=this.queue.shift(); this.last=id;
      this.active.push({id,start:this.elapsed}); this.next=this.elapsed+(id==='mummy'?15300:id==='werewolf'?13800:id==='vampire'?14000:8500);
    }
    return this.active.map(v=>({...v,age:this.elapsed-v.start}));
  }
}
const encounterSequence = new EncounterSequence();
const visitorButtons = [...document.querySelectorAll('.visitor')];
const hoverVisitors = new Set();
visitorButtons.forEach(button=>{
  button.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')hoverVisitors.add(button);});
  button.addEventListener('pointerleave',()=>hoverVisitors.delete(button));
});
function encounterHold(){return paused||document.hidden||card.open||celebration.open||hoverVisitors.size>0||visitorButtons.some(b=>b.matches(':focus-visible'));}
function renderVisitors(active){
  // The stair path is in front of the coffin, but behind the foreground lamp and foliage.
  coffin.style.zIndex=active.some(v=>v.id==='mummy')?'2':'';
  mummyBandage.style.opacity='0';
  mummyBush.classList.remove('rustling');
  if(!active.some(v=>v.id==='vampire'))coffinDoor.style.transform='perspective(600px) rotateY(0deg)';
  for(const button of visitorButtons){
    const entry=active.find(v=>v.id===button.dataset.id);
    button.hidden=!entry;
    if(!entry)continue;
    if(button.dataset.id==='mummy'){renderMummy(button,entry.age);continue;}
    if(button.dataset.id==='werewolf'){renderWerewolf(button,entry.age);continue;}
    if(button.dataset.id==='vampire'){renderVampire(button,entry.age);continue;}
    const enter=Math.min(1,entry.age/1200), exit=Math.max(0,(entry.age-8200)/1000);
    const eased=1-Math.pow(1-enter,3), visible=eased*(1-exit);
    const id=button.dataset.id;
    let x=0,y=(1-visible)*65,turn=0;
    if(id==='ghost'){x=(1-visible)*-20;y=(1-visible)*28;turn=(1-visible)*-9;}
    if(id==='skeleton'){x=(1-visible)*25;y=(1-visible)*25;turn=(1-visible)*-10;}
    button.style.opacity=String(Math.min(1,visible*2));
    button.style.transform=`translate(${x}%,${y}%) rotate(${turn}deg)`;
    button.style.clipPath=id==='ghost'?'none':`inset(0 0 ${(1-visible)*95}% 0)`;
    button.dataset.phase=entry.age<1200?'enter':entry.age<8200?'stay':'exit';
  }
}
let encounterPrevious=performance.now();
function encounterFrame(now){
  const delta=Math.min(now-encounterPrevious,100);encounterPrevious=now;
  const held=encounterHold();document.body.classList.toggle('encounters-held',held);
  if(motionQuery.matches||paused){renderVisitors(visitorButtons.map(b=>({id:b.dataset.id,age:b.dataset.id==='mummy'?10000:b.dataset.id==='werewolf'?4000:b.dataset.id==='vampire'?6000:2000})));}
  else if(!held){renderVisitors(encounterSequence.step(delta));}
  requestAnimationFrame(encounterFrame);
}
requestAnimationFrame(encounterFrame);
function restartEncounters(){encounterSequence.reset();hoverVisitors.clear();renderVisitors([]);}
$('reset')?.addEventListener('click',restartEncounters);
$('explore-again').addEventListener('click',restartEncounters);
document.addEventListener('visibilitychange',()=>{hoverVisitors.clear();});

const fencePlate=document.createElement("img");fencePlate.className="visitor-foreground";fencePlate.src="assets/scene-mummy.png";fencePlate.alt="";fencePlate.setAttribute("aria-hidden","true");$("scene").append(fencePlate);
