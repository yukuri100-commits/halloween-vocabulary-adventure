// Foot positions follow the painted path; all motion uses the encounter clock.
function werewolfPoseAt(age) {
  const stops = [
    [0, 53, 125, 1.18], [2300, 59, 84, .88],
    [7300, 59, 84, .88], [7900, 59, 84, .88], [8800, 61, 81, .78],
    [10200, 71, 73, .59], [11300, 72, 65, .46],
    [12400, 68.5, 58, .34], [13700, 72.5, 50, .24],
    [14500, 73.2, 48.5, .18]
  ];
  const t = Math.max(0, Math.min(age, 14500));
  let i = 1;
  while (i < stops.length - 1 && t > stops[i][0]) i++;
  const a = stops[i - 1], b = stops[i];
  let p = (t - a[0]) / (b[0] - a[0]);
  if (i === 1) p = 1 - Math.pow(1 - p, 2);
  const mix = index => a[index] + (b[index] - a[index]) * p;
  const running = t < 2300 || t >= 7900;
  const stride = Math.sin(t / 90);
  const phase = t < 2300 ? 'run-in' : t < 7300 ? 'howl' : t < 7900 ? 'turn' : 'run-home';
  const frame = phase === 'run-in' ? Math.floor(t / 140) % 2 : phase === 'howl' ? 2 : phase === 'turn' ? 3 : 4 + Math.floor((t - 7900) / 120) % 2;
  return { x: mix(1), y: mix(2), scale: mix(3),
    bounce: running ? -Math.abs(stride) * 3 : Math.sin((t - 2300) / 500) * .4,
    tilt: running ? stride * 2 + 3 : Math.sin((t - 2300) / 650) * 2,
    stretch: phase === 'howl' ? 1 + Math.sin((t - 2300) / 330) * .025 : 1,
    opacity: Math.min(1, Math.max(0, (14500 - t) / 700)),
    phase, frame };
}
function renderWerewolf(button, age) {
  const p = werewolfPoseAt(age);
  button.style.left = p.x + '%';
  button.style.top = p.y + '%';
  button.style.opacity = String(p.opacity);
  button.style.clipPath = 'none';
  button.style.transform = `translate(-50%,-100%) scale(${p.scale})`;
  button.dataset.phase = p.phase;
  const sprite = button.firstElementChild;
  if (!sprite.classList.contains('wolf-frames')) {
    sprite.classList.add('wolf-frames');
    sprite.replaceChildren();
  }
  sprite.style.backgroundPosition = `${p.frame % 3 * 50}% ${Math.floor(p.frame / 3) * 100}%`;
  sprite.style.transform = `translateY(${p.bounce}%) rotate(${p.tilt}deg) scaleY(${p.stretch})`;
}
