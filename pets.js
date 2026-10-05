// Two painted characters, with separate local motion and a shared pause policy.
const petCat = document.createElement('button');
petCat.className='pet-cat';petCat.dataset.id='black-cat';petCat.setAttribute('aria-label','探索神秘角色 8');
petCat.innerHTML='<span class="cat-rig"><img class="cat-tail" src="assets/cat.png" alt="" draggable="false"><img class="cat-body" src="assets/cat.png" alt="" draggable="false"><img class="cat-head" src="assets/cat.png" alt="" draggable="false"></span>';
$('scene').append(petCat);
petCat.addEventListener('click',()=>{
  if(!paused&&!motionQuery.matches){petCat.classList.remove('greeting');void petCat.offsetWidth;petCat.classList.add('greeting');}
  openWord(words.find(item=>item.id==='black-cat'),petCat);
});
const spiderButton=document.querySelector('[data-id="spider"]');
const spiderHanger=document.createElement('div');spiderHanger.className='spider-hanger';
const silk=document.createElement('span');silk.className='spider-silk';silk.setAttribute('aria-hidden','true');
spiderButton.classList.add('living-spider');spiderButton.style.cssText='';
spiderButton.innerHTML='<span class="spider-rig"><img class="spider-legs left-legs" src="assets/spider.png" alt="" draggable="false"><img class="spider-legs right-legs" src="assets/spider.png" alt="" draggable="false"><img class="spider-body" src="assets/spider.png" alt="" draggable="false"></span>';
spiderHanger.append(silk,spiderButton);$('scene').append(spiderHanger);
// Restore the same fence pixels in front of the cat's paws.
const catFence=document.createElement('img');catFence.className='cat-fence';catFence.src='assets/scene-mummy.png';catFence.alt='';catFence.setAttribute('aria-hidden','true');$('scene').append(catFence);
