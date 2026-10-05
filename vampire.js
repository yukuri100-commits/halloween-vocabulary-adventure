// The coffin stays in the scene; its lid and visitor share the encounter clock.
const coffin = document.createElement('div');
coffin.className='vampire-coffin';coffin.setAttribute('aria-hidden','true');
coffin.innerHTML='<span class="coffin-interior"></span><span class="coffin-door"></span>';
$('scene').append(coffin);
const coffinDoor=coffin.querySelector('.coffin-door');
function vampirePoseAt(age){
  const t=Math.max(0,Math.min(age,14000));
  const ease=p=>p*p*(3-2*p);
  const part=(a,b)=>ease(Math.max(0,Math.min(1,(t-a)/(b-a))));
  const out=part(1600,4200), back=part(9000,12000);
  const distance=out*(1-back);
  const walking=t>=1600&&t<4200||t>=9000&&t<12000;
  const phase=t<1600?'open':t<4200?'walk-out':t<8500?'greet':t<9000?'turn':t<12000?'walk-in':'close';
  return {phase,distance,door:part(0,1600)*(1-part(12200,14000)),
    frame:phase==='greet'?4:phase==='turn'||phase==='walk-in'?5:2+Math.floor(t/240)%2,
    bounce:walking?-Math.abs(Math.sin(t/140))*1.7:0,
    tilt:walking?Math.sin(t/140)*1.8:phase==='greet'?Math.sin(t/650)*1.5:0,
    opacity:t<200?0:1};
}
function renderVampire(button,age){
  const p=vampirePoseAt(age);
  coffinDoor.style.transform=`perspective(600px) rotateY(${-112*p.door}deg)`;
  button.style.left=(35+p.distance*5)+'%';button.style.top=(48+p.distance*9)+'%';
  button.style.width='15%';button.style.height='auto';button.style.aspectRatio='1';
  button.style.opacity=String(p.opacity);button.style.clipPath='none';
  button.style.transform=`scale(${.78+p.distance*.22})`;
  button.style.zIndex=p.distance>.15?'5':'3';button.dataset.phase=p.phase;
  const sprite=button.firstElementChild;
  if(!sprite.classList.contains('vampire-frames')){sprite.className='visitor-pose vampire-frames';sprite.replaceChildren();}
  sprite.style.backgroundPosition=`${p.frame%3*50}% ${Math.floor(p.frame/3)*100}%`;
  sprite.style.transform=`translateY(${p.bounce}%) rotate(${p.tilt}deg)`;
}
