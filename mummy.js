// Left-bush entrance, caught bandage, release, greeting, and return.
const mummyBush=document.createElement('img');mummyBush.src='assets/scene-mummy.png';mummyBush.className='mummy-bush';mummyBush.alt='';mummyBush.setAttribute('aria-hidden','true');$('scene').append(mummyBush);
// Restore the painted lantern in front of the moving character, including its roof and base.
const mummyLantern=document.createElement('img');mummyLantern.src='assets/scene-bats-clean.png';mummyLantern.className='mummy-lantern-foreground';mummyLantern.alt='';mummyLantern.setAttribute('aria-hidden','true');$('scene').append(mummyLantern);
const mummyBandage=document.createElementNS('http://www.w3.org/2000/svg','svg');
mummyBandage.setAttribute('viewBox','0 0 1672 941');mummyBandage.setAttribute('aria-hidden','true');mummyBandage.classList.add('mummy-bandage');
const bandagePath=document.createElementNS('http://www.w3.org/2000/svg','path');mummyBandage.append(bandagePath);$('scene').append(mummyBandage);
function mummyPoseAt(age){
  const t=Math.max(0,Math.min(age,16000));
  // Follow the marked stair edge with the feet, then curve gently down to the centre.
  // Stay above the foreground lantern base instead of dipping to the screen bottom.
  const smooth=p=>p*p*(3-2*p);
  const pathTop=left=>left<=27?62:left<32?62-5*smooth((left-27)/5):left<41?57+2*smooth((left-32)/9):59+9*smooth(Math.min(1,(left-41)/8));
  let left=18,top=62,y=0,rotation=0,opacity=1,frame=0,flip=false,clip=0,phase='peek';
  if(t<1300){opacity=Math.min(1,t/350);y=(1-t/1300)*35;clip=(1-t/1300)*72;rotation=Math.sin(t/180)*2;}
  else if(t<4000){const p=(t-1300)/2700;left=18+p*7;y=-Math.abs(Math.sin(p*Math.PI*6))*2;frame=Math.floor(t/260)%2;phase='walk';}
  else if(t<5500){left=25+Math.sin((t-4000)/150)*.25;frame=2;rotation=-3-Math.sin((t-4000)/180)*2;phase='snag';}
  else if(t<6200){const p=(t-5500)/700;left=25+p*2;y=-Math.sin(p*Math.PI)*11;rotation=(1-p)*5;frame=3;phase='release';}
  else if(t<9300){const p=(t-6200)/3100;left=27+p*22;top=pathTop(left);frame=Math.floor(t/260)%2;y=-Math.abs(Math.sin(t/150))*1.5;phase='walk-center';}
  else if(t<11500){left=49;top=68;frame=3;rotation=Math.sin((t-9300)/650)*1.5;phase='greet';}
  else {const p=(t-11500)/4500;left=49-p*31;top=pathTop(left);frame=Math.floor(t/260)%2;flip=true;y=-Math.abs(Math.sin(t/150))*1.5;opacity=1-Math.max(0,(p-.9)/.1);clip=Math.max(0,(p-.85)/.15)*72;phase='leave';}
  return {left,top,y,rotation,opacity,frame,flip,clip,phase};
}
function renderMummy(button,age){
  const p=mummyPoseAt(age);
  button.style.left=p.left+'%';button.style.top=p.top+'%';button.style.width='12%';button.style.height='26%';
  // Never jump in front of bushes, fence, or lantern while crossing their silhouettes.
  button.style.setProperty('z-index','3','important');
  button.style.opacity=String(p.opacity);button.style.transformOrigin='50% 90%';
  button.style.transform=`translateY(${p.y}%) rotate(${p.rotation}deg)`;
  button.style.clipPath=`inset(0 0 ${p.clip}% 0)`;button.dataset.phase=p.phase;
  const frame=button.firstElementChild;frame.style.backgroundPosition=`${p.frame%2*100}% ${Math.floor(p.frame/2)*100}%`;frame.style.transform=p.flip?'scaleX(-1)':'none';
  mummyBush.classList.toggle('rustling',age<1300||age>14500);
  if(age>=3400&&age<6000){
    const x=(p.left+3)*16.72,endY=710+p.y*2.45;
    const sag=age<4000?16:age<5500?2:32;
    bandagePath.setAttribute('d',`M 370 713 Q ${(370+x)/2} ${713+sag} ${x} ${endY}`);
    mummyBandage.style.opacity=String(age>5500?1-(age-5500)/500:Math.min(1,(age-3400)/250));
  }
}
