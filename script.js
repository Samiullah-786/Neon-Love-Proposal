/* Personalize these two names. Keep the MP3 beside index.html. */
const SETTINGS = { lovedOne: 'Jaan', sender: 'Sami' };
const QUESTIONS = [
  { label: 'Imagine this…', title: 'Aaj ki shaam sirf hum dono ke naam ho—kahan chalogi?', sub: 'Pick the little plan that feels most like you.', answers: ['Chai, long drive aur favourite gaane', 'Rooftop dinner, fairy lights ke saath', 'Moonlight walk aur dil ki baatein'], replies: ['Chai aur tum—perfect plan ♡', 'Okay, that sounds like a movie ✨', 'Bas yehi shaam yaad reh jayegi ♡'] },
  { label: 'A little daydream', title: 'Agar ek perfect memory choose karni ho, kya choose karogi?', sub: 'There is no wrong answer—just a little daydream.', answers: ['Itni hasi ke waqt ka pata na chale', 'Ek unexpected sa cute surprise', 'Sukoon se saath baith kar baatein'], replies: ['Tumhari hasi meri favourite hai ♡', 'Surprises noted… shayad ek aa bhi raha ho 👀', 'Simple moments hi sabse khaas hote hain ✨'] },
  { label: 'One last little question', title: 'Aur agar humari kahani ka ek song ho…?', sub: 'I might already have picked one for us.', answers: ['“Yaad Hai Na” — obviously 🎶', 'Koi soft sa romantic song', 'Hum apna song khud choose karein'], replies: ['Tumne title bhi pakar liya 🎶', 'Already setting the mood ♡', 'Deal. Humara song, humari choice ✨'] }
];

const $ = (s, root = document) => root.querySelector(s);
const screens = [...document.querySelectorAll('.view')];
const audio = $('#proposalAudio');
const musicToggle = $('#musicToggle');
const musicLabel = $('#musicLabel');
const question = $('#question');
const options = $('#options');
const progress = $('#progress');
const stepText = $('#stepText');
const questionLabel = $('#questionLabel');
const feedback = $('#feedback');
let current = 0;
let advanceTimer = 0;
let toastTimer = 0;
let petalTimer = 0;

$('#lovedOne').textContent = SETTINGS.lovedOne;
$('#sender').textContent = SETTINGS.sender;
$('#sender2').textContent = SETTINGS.sender;

function show(id) {
  screens.forEach(screen => {
    const active = screen.id === id;
    screen.hidden = !active;
    screen.classList.toggle('show', active);
  });
}

function toast(message) {
  const box = $('#toast');
  box.textContent = message;
  box.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => box.classList.remove('visible'), 2800);
}

function setMusic(playing) {
  musicToggle.setAttribute('aria-pressed', String(playing));
  musicToggle.setAttribute('aria-label', playing ? 'Pause the song' : 'Play the song');
  musicLabel.textContent = playing ? 'Song playing' : 'Play our song';
}

async function startMusic() {
  if (!audio.paused) return;
  audio.volume = 0.58;
  try {
    await audio.play();
    setMusic(true);
  } catch (error) {
    setMusic(false);
    toast('Music start nahi hui—upar “Play our song” tap karein.');
    console.warn('Audio could not start:', error?.message || error);
  }
}

function makePetal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const el = document.createElement('span');
  el.className = 'petal';
  el.textContent = Math.random() > .55 ? '✿' : '·';
  el.style.left = `${Math.random() * 100}%`;
  el.style.fontSize = `${12 + Math.random() * 16}px`;
  el.style.setProperty('--drift', `${Math.random() * 130 - 65}px`);
  const duration = 9 + Math.random() * 9;
  el.style.animationDuration = `${duration}s`;
  $('#petals').appendChild(el);
  setTimeout(() => el.remove(), duration * 1000 + 200);
}
for (let i = 0; i < 7; i++) setTimeout(makePetal, i * 550);
petalTimer = setInterval(makePetal, 1900);

function renderQuestion() {
  const item = QUESTIONS[current];
  questionLabel.textContent = item.label;
  question.textContent = item.title;
  $('#subquestion').textContent = item.sub;
  stepText.textContent = `OUR LITTLE STORY · ${String(current + 1).padStart(2, '0')} / ${String(QUESTIONS.length).padStart(2, '0')}`;
  progress.style.width = `${current / QUESTIONS.length * 100}%`;
  $('#view-quiz .progress').setAttribute('role', 'progressbar');
  $('#view-quiz .progress').setAttribute('aria-valuemin', '0');
  $('#view-quiz .progress').setAttribute('aria-valuemax', String(QUESTIONS.length));
  $('#view-quiz .progress').setAttribute('aria-valuenow', String(current));
  feedback.textContent = 'Choose your favourite ♡';
  options.replaceChildren();
  item.answers.forEach((answer, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'option';
    const number = document.createElement('span');
    number.className = 'option-number';
    number.setAttribute('aria-hidden', 'true');
    number.textContent = String.fromCharCode(65 + index);
    const text = document.createElement('span');
    text.textContent = answer;
    button.append(number, text);
    button.addEventListener('click', () => choose(button, index));
    options.append(button);
  });
  $('#back').hidden = current === 0;
}

function choose(button, index) {
  if (button.disabled) return;
  clearTimeout(advanceTimer);
  options.querySelectorAll('button').forEach(b => { b.disabled = true; });
  button.classList.add('picked');
  feedback.textContent = QUESTIONS[current].replies[index];
  progress.style.width = `${(current + 1) / QUESTIONS.length * 100}%`;
  $('#view-quiz .progress').setAttribute('aria-valuenow', String(current + 1));
  advanceTimer = setTimeout(() => {
    current++;
    if (current < QUESTIONS.length) {
      renderQuestion();
      question.focus({ preventScroll: true });
    } else show('view-proposal');
  }, 900);
}

$('#begin').addEventListener('click', () => {
  startMusic(); // the first deliberate tap is a browser-approved audio gesture
  current = 0;
  renderQuestion();
  show('view-quiz');
  question.focus({ preventScroll: true });
});
$('#back').addEventListener('click', () => {
  clearTimeout(advanceTimer);
  if (current > 0) current--;
  else { show('view-intro'); return; }
  renderQuestion();
  question.focus({ preventScroll: true });
});
$('#yes').addEventListener('click', () => {
  show('view-yes');
  startMusic();
  celebration();
});
$('#time').addEventListener('click', () => show('view-time'));
document.querySelectorAll('[data-restart]').forEach(button => button.addEventListener('click', () => {
  clearTimeout(advanceTimer);
  current = 0;
  progress.style.width = '0%';
  show('view-intro');
}));

musicToggle.addEventListener('click', async () => {
  if (audio.paused) await startMusic();
  else { audio.pause(); setMusic(false); }
});
audio.addEventListener('play', () => setMusic(true));
audio.addEventListener('pause', () => setMusic(false));
audio.addEventListener('error', () => {
  setMusic(false);
  toast('Song file nahi mili—“YAAD HAI NA.mp3” ko index.html ke saath rakhein.');
});

function celebration() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (let i = 0; i < 34; i++) setTimeout(makePetal, i * 55);
}
window.addEventListener('pagehide', () => {
  audio.pause();
  clearInterval(petalTimer);
  clearTimeout(advanceTimer);
});

// Subtle parallax tilt makes the glass letter feel dimensional on touch and desktop.
const card = $('.panel');
card.addEventListener('pointermove', event => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const rect = card.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - .5;
  const y = (event.clientY - rect.top) / rect.height - .5;
  const factor = event.pointerType === 'mouse' ? 7 : 2.5;
  card.style.setProperty('--tilt-y', `${(x * factor).toFixed(2)}deg`);
  card.style.setProperty('--tilt-x', `${(-y * factor).toFixed(2)}deg`);
});
card.addEventListener('pointerleave', () => {
  card.style.setProperty('--tilt-x', '0deg');
  card.style.setProperty('--tilt-y', '0deg');
});
