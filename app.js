const video = document.querySelector('#hero-video');
const motionToggle = document.querySelector('#motion-toggle');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let motionPausedByVisitor = false;
let heroVisible = true;
function updateMotion() {
  const paused = reducedMotion.matches || motionPausedByVisitor || document.hidden || !heroVisible;
  if (paused) video.pause(); else video.play().catch(() => {});
  motionToggle.setAttribute('aria-label', motionPausedByVisitor ? 'Play animation' : 'Pause animation');
  motionToggle.querySelector('use').setAttribute('href', motionPausedByVisitor ? '#play-symbol' : '#pause-symbol');
}
motionToggle.addEventListener('click', () => { motionPausedByVisitor = !motionPausedByVisitor; updateMotion(); });
reducedMotion.addEventListener('change', updateMotion);
document.addEventListener('visibilitychange', updateMotion);
updateMotion();

const phases = {
  breathe: { image: 'assets/app-breathe.jpg', alt: 'The actual Amaterasu iPhone session: inhale guidance and a partially forged sun crest' },
  stillness: { image: 'assets/app-stillness.jpg', alt: 'The actual Amaterasu iPhone session: a total eclipse during the exhaled retention phase' },
  return: { image: 'assets/app-return.jpg', alt: 'The actual Amaterasu iPhone session: the radiant sun crest during a recovery hold' }
};
const tabs = [...document.querySelectorAll('.phase-option')];
const mobileLayout = window.matchMedia('(max-width: 760px)');
function updateTabOrientation() {
  document.querySelector('.phase-options').setAttribute('aria-orientation', mobileLayout.matches ? 'horizontal' : 'vertical');
}
mobileLayout.addEventListener('change', updateTabOrientation);
updateTabOrientation();
const phaseImage = document.querySelector('#phase-image');
const phasePanel = document.querySelector('#phase-panel');
function selectPhase(tab, moveFocus = false) {
  tabs.forEach(item => {
    const selected = item === tab;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  const phase = phases[tab.dataset.phase];
  phaseImage.src = phase.image;
  phaseImage.alt = phase.alt;
  phasePanel.setAttribute('aria-labelledby', tab.id);
  if (moveFocus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectPhase(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (['ArrowDown', 'ArrowRight'].includes(event.key)) next = (index + 1) % tabs.length;
    if (['ArrowUp', 'ArrowLeft'].includes(event.key)) next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); selectPhase(tabs[next], true); }
  });
});

const audio = document.querySelector('#guidance-audio');
const audioToggle = document.querySelector('#audio-toggle');
const audioCaption = document.querySelector('#audio-caption');
function updateAudio() {
  const playing = !audio.paused;
  audioToggle.setAttribute('aria-pressed', String(playing));
  audioToggle.querySelector('span').textContent = playing ? 'Pause the guidance' : 'Hear the guidance';
  audioToggle.classList.toggle('playing', playing);
}
audioToggle.addEventListener('click', async () => {
  if (audio.paused) {
    try { await audio.play(); audioCaption.textContent = 'A short sample of the narrator'; }
    catch { audioCaption.textContent = 'Audio unavailable. Please try again.'; }
  } else audio.pause();
  updateAudio();
});
audio.addEventListener('ended', updateAudio);
audio.addEventListener('pause', updateAudio);
audio.addEventListener('play', updateAudio);
document.addEventListener('visibilitychange', () => { if (document.hidden) audio.pause(); });
audio.volume = 0.8;

const qrTrigger = document.querySelector('#qr-trigger');
const qrPanel = document.querySelector('#qr-panel');
qrTrigger.addEventListener('click', () => {
  const open = qrPanel.hidden;
  qrPanel.hidden = !open;
  qrTrigger.setAttribute('aria-expanded', String(open));
  qrTrigger.textContent = open ? 'Close download code' : 'On your computer? Scan to download';
});

const phaseObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.target === document.querySelector('.hero-art')) {
      heroVisible = entry.isIntersecting;
      updateMotion();
    }
  });
}, { threshold: 0.1 });
phaseObserver.observe(document.querySelector('.hero-art'));
