'use strict';
const words = [
  {id:'vampire',word:'VAMPIRE',ipa:'/ˈvæm.paɪr/',zh:'吸血鬼',icon:'🧛',sentence:'A vampire sleeps during the day.',translation:'吸血鬼白天睡覺。',box:[21,48,15,29]},
  {id:'bat',word:'BAT',ipa:'/bæt/',zh:'蝙蝠',icon:'🦇',sentence:'A bat flies in the night sky.',translation:'蝙蝠在夜空中飛翔。',box:[28,10,10,10],extra:[[8,9,9,14]]},
  {id:'mummy',word:'MUMMY',ipa:'/ˈmʌm.i/',zh:'木乃伊',icon:'🤕',sentence:'The mummy is wrapped in bandages.',translation:'木乃伊身上纏著繃帶。',box:[36,57,15,28]},
  {id:'spider',word:'SPIDER',ipa:'/ˈspaɪ.dɚ/',zh:'蜘蛛',icon:'🕷️',sentence:'A spider has eight legs.',translation:'蜘蛛有八隻腳。',box:[89,21,9,12]},
  {id:'witch',word:'WITCH',ipa:'/wɪtʃ/',zh:'女巫',icon:'🧙‍♀️',sentence:'The witch rides a broomstick.',translation:'女巫騎著掃帚。',box:[49,3,15,27]},
  {id:'ghost',word:'GHOST',ipa:'/ɡoʊst/',zh:'幽靈',icon:'👻',sentence:'The ghost floats in the air.',translation:'幽靈漂浮在空中。',box:[14.5,35,13.5,21]},
  {id:'skeleton',word:'SKELETON',ipa:'/ˈskel.ə.tən/',zh:'骷髏',icon:'💀',sentence:'The skeleton dances at night.',translation:'骷髏在夜裡跳舞。',box:[70,48,13.5,31]},
  {id:'black-cat',word:'BLACK CAT',zh:'黑貓',icon:'🐈‍⬛'},
  {id:'jack-o-lantern',word:'JACK-O’-LANTERN',ipa:'/ˌdʒæk.əˈlæntɚn/',zh:'南瓜燈',icon:'🎃',sentence:'The jack-o’-lantern glows in the dark.',translation:'南瓜燈在黑暗中發光。',box:[83.5,59,16,25],extra:[[1,72,16,23]]},
  {id:'werewolf',word:'WEREWOLF',ipa:'/ˈwer.wʊlf/',zh:'狼人',icon:'🐺',sentence:'The werewolf howls at the moon.',translation:'狼人對著月亮嚎叫。',box:[52,49,14,31]},
  {id:'haunted-house',word:'HAUNTED HOUSE',zh:'鬼屋',icon:'🏚️',box:[60,7,30,49]},
  {id:'owl',word:'OWL',zh:'貓頭鷹',icon:'🦉'}
];
const $ = id => document.getElementById(id);
const found = new Set();
const card = $('card'), celebration = $('celebration');
let current = null, celebrated = false, lastTrigger = null;
function position(el, box){['left','top','width','height'].forEach((key,i)=>el.style[key]=box[i]+'%');}
words.forEach((item,index)=>{
  (item.box ? [item.box,...(item.extra||[])] : []).forEach(box=>{
    const button=document.createElement('button');button.className='hotspot';button.dataset.id=item.id;
    button.setAttribute('aria-label',`探索神秘角色 ${index+1}`);position(button,box);
    if(['ghost','mummy','vampire','werewolf','skeleton'].includes(item.id)){
      button.classList.add('visitor','visitor-'+item.id);button.hidden=true;
      button.innerHTML='<span class="visitor-pose"><img src="assets/'+item.id+'.png" alt="" draggable="false"></span>';
    }
    if(item.id==='mummy'){
      button.innerHTML='<span class="mummy-frame" aria-hidden="true"></span>';
    }
    if(item.id==='witch'){
      button.classList.add('witch-rider');
      button.style.cssText='';
      button.innerHTML='<span class="witch-rig"><img class="witch-base" src="assets/witch-cat.png" alt="" draggable="false"><span class="witch-head"><img src="assets/witch-cat.png" alt="" draggable="false"></span><i class="witch-lid witch-lid-left"></i><i class="witch-lid witch-lid-right"></i><i class="broom-cat-lid cat-lid-left"></i><i class="broom-cat-lid cat-lid-right"></i><i class="wand-spark" aria-hidden="true"></i></span>';
    }
    if(item.id==='bat' && box===item.box){
      button.classList.add('living-bat');position(button,[28,8,11,13]);
      button.innerHTML='<span class="bat-rig"><img class="bat-wing left-wing" src="assets/bat.png" alt="" draggable="false"><img class="bat-wing right-wing" src="assets/bat.png" alt="" draggable="false"><img class="bat-body" src="assets/bat.png" alt="" draggable="false"><i class="bat-eye eye-left"></i><i class="bat-eye eye-right"></i></span>';
    }
    if(item.id==='bat' && box!==item.box){
      button.classList.add('perched-bat');position(button,[7.2,7,9.5,15]);
      button.innerHTML='<span class="perched-bat-rig"><img class="perched-wing perched-left" src="assets/bat.png" alt="" draggable="false"><img class="perched-wing perched-right" src="assets/bat.png" alt="" draggable="false"><img class="perched-body" src="assets/bat.png" alt="" draggable="false"></span>';
    }
    button.addEventListener('click',()=>openWord(item,button));$('hotspots').append(button);
  });
});
function updateProgress(){
  words.forEach((item,i)=>{
    const discovered=found.has(item.id);
    document.querySelectorAll(`[data-id="${item.id}"]`).forEach(b=>{b.classList.toggle('found',discovered);b.setAttribute('aria-label',discovered?`複習 ${item.word}`:`探索神秘角色 ${i+1}`);});
  });
}
function stopAudio(){
  if('speechSynthesis' in window)window.speechSynthesis.cancel();
}
function openWord(item,trigger){
  stopAudio();current=item;lastTrigger=trigger;const isNew=!found.has(item.id);found.add(item.id);updateProgress();
  $('word').textContent=item.word;
  const filename=({'black-cat':'black.png','jack-o-lantern':"Jack-o'-lantern.png",'haunted-house':'haunted house.png'})[item.id] || item.id+'.png';
  $('card-image').src='assets/cards/'+encodeURIComponent(filename);
  $('card-image').alt=item.word+'（'+item.zh+'）圖文單字卡';
  $('speech-status').textContent='按 Listen 聆聽單字發音。';
  if(!card.open)card.showModal();$('listen').focus();
}
function closeCard(){card.close();}
card.addEventListener('close',()=>{stopAudio();if(found.size===words.length&&!celebrated){celebrated=true;celebration.showModal();confetti();}else lastTrigger?.focus();});
$('close').addEventListener('click',closeCard);$('continue').addEventListener('click',closeCard);
for(const dialog of [card,celebration])dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
function listen(){
  if(!current)return;
  stopAudio();
  if(!('speechSynthesis' in window)){$('speech-status').textContent='這個瀏覽器不支援朗讀，可以請老師帶你念。';return;}
  const utterance=new SpeechSynthesisUtterance(current.word.toLowerCase().replaceAll('’',"'"));
  utterance.lang='en-US';utterance.rate=.82;
  const voices=speechSynthesis.getVoices();utterance.voice=voices.find(v=>v.lang==='en-US')||voices.find(v=>v.lang.startsWith('en'))||null;
  utterance.onstart=()=>{$('speech-status').textContent='正在播放單字發音…';};
  utterance.onend=()=>{$('speech-status').textContent='按 Listen 可以再聽一次。';};
  utterance.onerror=e=>{if(e.error!=='interrupted'&&e.error!=='canceled')$('speech-status').textContent='朗讀暫時無法播放，請檢查裝置音量後再試一次。';};
  speechSynthesis.speak(utterance);
}
$('listen').addEventListener('click',listen);
function reset(){stopAudio();celebrated=false;found.clear();updateProgress();if(card.open)card.close();if(celebration.open)celebration.close();document.querySelector('.hotspot').focus();}
$('reset')?.addEventListener('click',reset);$('explore-again').addEventListener('click',reset);$('review').addEventListener('click',()=>celebration.close());
const motionQuery=matchMedia('(prefers-reduced-motion: reduce)');let paused=motionQuery.matches;
function updateMotion(){document.body.classList.toggle('paused',paused);}
updateMotion();
const atmosphere=$('atmosphere');
// Slow background motion keeps the painted scene alive without becoming a game overlay.
const backgroundLife=document.createElement('div');backgroundLife.className='background-life';
backgroundLife.innerHTML=`<svg viewBox="0 0 1672 941" aria-hidden="true">
  <defs>
    <radialGradient id="moon-halo"><stop offset="0" stop-color="#fff7c4" stop-opacity=".24"/><stop offset=".48" stop-color="#ffe58a" stop-opacity=".1"/><stop offset="1" stop-color="#d8dbff" stop-opacity="0"/></radialGradient>
    <linearGradient id="lake-glow" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff3b0" stop-opacity=".7"/><stop offset="1" stop-color="#ffc155" stop-opacity="0"/></linearGradient>
    <filter id="soft-light"><feGaussianBlur stdDeviation="5"/></filter>
    <filter id="cloud-soft"><feGaussianBlur stdDeviation="7"/></filter>
  </defs>
  <circle class="moon-aura" cx="982" cy="158" r="270" fill="url(#moon-halo)"/>
  <g class="cloud-bank cloud-one" filter="url(#cloud-soft)"><path d="M-560 118 C-500 69-425 77-390 119 C-350 66-252 76-222 126 C-166 93-76 111-45 165 C5 143 59 164 81 207 L-590 207 Z"/></g>
  <g class="cloud-bank cloud-two" filter="url(#cloud-soft)"><path d="M-470 249 C-412 205-337 209-306 250 C-260 197-168 208-139 257 C-80 225 10 248 40 301 L-500 301 Z"/></g>
  <g class="cloud-bank cloud-moon" filter="url(#cloud-soft)"><path d="M-650 137 C-590 91-520 97-486 139 C-445 87-350 91-314 143 C-257 107-160 121-125 174 C-72 143 10 161 45 210 L-680 210 Z"/></g>
  <g class="town-lights">
    <rect x="430" y="361" width="7" height="12"/><rect x="456" y="371" width="6" height="10"/><rect x="492" y="347" width="7" height="13"/><rect x="525" y="383" width="7" height="11"/><rect x="558" y="365" width="8" height="13"/><rect x="592" y="387" width="7" height="10"/><rect x="626" y="350" width="7" height="13"/><rect x="661" y="374" width="8" height="12"/><rect x="696" y="358" width="7" height="12"/><rect x="730" y="389" width="6" height="10"/><rect x="765" y="365" width="8" height="13"/>
  </g>
  <g class="haunted-lights">
    <path d="M1271 116 h13 v23 h-13z"/><path d="M1383 159 h13 v24 h-13z"/><path d="M1468 188 h13 v22 h-13z"/><path d="M1210 271 h14 v25 h-14z"/><path d="M1307 253 h14 v28 h-14z"/><path d="M1423 298 h16 v27 h-16z"/><path d="M1130 351 h15 v27 h-15z"/><path d="M1375 358 h17 v29 h-17z"/><path d="M1492 344 h13 v25 h-13z"/>
  </g>
  <g class="lake-shimmer" stroke="url(#lake-glow)" stroke-linecap="round">
    <path d="M338 479 h75 M450 471 h55 M528 486 h88 M642 475 h43"/><path d="M309 501 h112 M461 511 h77 M571 505 h115 M702 493 h48"/><path d="M360 529 h74 M482 539 h101 M619 526 h82"/><path d="M401 558 h87 M526 567 h68 M638 552 h55"/>
  </g>
</svg>`;
atmosphere.append(backgroundLife);
// Eye apertures follow the 1672 x 941 background coordinates.
const pumpkinEyes=document.createElement('div');pumpkinEyes.className='pumpkin-eyes';
pumpkinEyes.innerHTML='<svg viewBox="0 0 1672 941" aria-hidden="true"><defs><filter id="pumpkin-eye-bloom" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="8"/></filter></defs><g class="lantern-eyes lantern-left"><g class="eye-bloom" filter="url(#pumpkin-eye-bloom)"><path d="M130 758 L146 775 L126 778 Z M228 749 L240 758 L228 764 Z"/></g><path class="eye-flame" d="M130 758 L146 775 L126 778 Z M228 749 L240 758 L228 764 Z"/></g><g class="lantern-eyes lantern-right"><g class="eye-bloom" filter="url(#pumpkin-eye-bloom)"><path d="M1472 655 L1478 671 L1462 666 Z M1560 657 L1568 673 L1547 670 Z"/></g><path class="eye-flame" d="M1472 655 L1478 671 L1462 666 Z M1560 657 L1568 673 L1547 670 Z"/></g></svg>';
atmosphere.append(pumpkinEyes);

[[0,71,18,26],[83,60,17,27],[65,75,9,16],[11,40,4,9],[82,40,5,10],[54,38,5,10],[75,15,5,15]].forEach((box,i)=>{const el=document.createElement('div');el.className='glow';position(el,box);el.style.animationDelay=`-${i*.6}s`;atmosphere.append(el);});
// Ghost light travels with the ghost sprite rather than its former position.
// Eyelids sit on the existing owl; the background and silhouette stay intact.
const owl=document.createElement('div');owl.className='owl-detail';
owl.innerHTML='<svg viewBox="0 0 1672 941" aria-hidden="true"><defs><filter id="feather-grain"><feTurbulence type="fractalNoise" baseFrequency=".38" numOctaves="2" seed="8" result="grain"/><feComposite in="grain" in2="SourceGraphic" operator="in" result="texture"/><feBlend in="SourceGraphic" in2="texture" mode="soft-light"/></filter><clipPath id="owl-left"><ellipse cx="178" cy="240" rx="15.5" ry="18" transform="rotate(20 178 240)"/></clipPath><clipPath id="owl-right"><ellipse cx="210" cy="251" rx="11.5" ry="14.5" transform="rotate(20 210 251)"/></clipPath></defs><g clip-path="url(#owl-left)"><g class="owl-lid"><ellipse cx="178" cy="240" rx="19" ry="23" fill="#c59348" filter="url(#feather-grain)"/><path d="M162 239 Q176 254 192 242" fill="none" stroke="#39271c" stroke-width="3" stroke-linecap="round"/></g></g><g clip-path="url(#owl-right)"><g class="owl-lid"><ellipse cx="210" cy="251" rx="16" ry="20" fill="#d6aa60" filter="url(#feather-grain)"/><path d="M198 250 Q209 262 222 254" fill="none" stroke="#39271c" stroke-width="2.7" stroke-linecap="round"/></g></g></svg>';
atmosphere.append(owl);
let owlTimer;
function blinkOwl(){
  if(paused||motionQuery.matches||document.hidden||card.open||celebration.open)return;
  owl.classList.remove('is-blinking');
  void owl.offsetWidth;
  owl.classList.add('is-blinking');
}
function scheduleOwl(){clearTimeout(owlTimer);owlTimer=setTimeout(()=>{blinkOwl();scheduleOwl();},4000+Math.random()*4500);}
scheduleOwl();
const owlTarget=document.createElement('button');owlTarget.className='owl-target';owlTarget.dataset.id='owl';owlTarget.setAttribute('aria-label','探索神秘角色 12');position(owlTarget,[6,22,9,12]);
owlTarget.addEventListener('pointerenter',blinkOwl);owlTarget.addEventListener('click',()=>{blinkOwl();openWord(words.find(item=>item.id==='owl'),owlTarget);});owlTarget.addEventListener('focus',blinkOwl);$('scene').append(owlTarget);
motionQuery.addEventListener('change',()=>{paused=motionQuery.matches;updateMotion();owl.classList.remove('is-blinking');});
for(let i=0;i<11;i++){const leaf=document.createElement('span');leaf.className='leaf';leaf.textContent='🍂';leaf.style.left=(i*9+3)+'%';leaf.style.animationDelay=(-i*2.7)+'s';leaf.style.animationDuration=15+i%4*3+'s';atmosphere.append(leaf);}
function confetti(){if(paused||motionQuery.matches)return;for(let i=0;i<35;i++){const el=document.createElement('i');el.className='confetti';el.style.left=Math.random()*100+'%';el.style.background=['#e99b31','#884faa','#f7cf66','#f36e33'][i%4];el.style.setProperty('--drift',(Math.random()-.5)*220+'px');el.style.animationDelay=Math.random()*.7+'s';celebration.firstElementChild.append(el);setTimeout(()=>el.remove(),4000);}}
if(document.modelContext?.registerTool){try{Promise.resolve(document.modelContext.registerTool({name:'read_adventure_progress',description:'Read the current number of discovered Halloween vocabulary words.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute(input){if(input&&Object.keys(input).length)throw new Error('No arguments accepted');return {found:found.size,total:words.length,words:words.filter(w=>found.has(w.id)).map(w=>w.word)};}})).catch(()=>{});}catch{}}
