let selectedMood  = '';
let selectedColor = '';

/* ── Stars ── */
document.querySelectorAll('.stars-row').forEach(row => {
  const labels = row.querySelectorAll('label');
  const inputs = row.querySelectorAll('input[type=radio]');
  inputs.forEach((inp, i) => {
    inp.addEventListener('change', () => {
      labels.forEach((l, j) => l.classList.toggle('lit', j <= i));
    });
  });
  labels.forEach((lbl, i) => {
    lbl.addEventListener('mouseover', () => {
      labels.forEach((l, j) => l.style.color = j <= i ? '#f59e0b' : '#e2e2e2');
    });
    lbl.addEventListener('mouseout', () => {
      const checked = row.querySelector('input:checked');
      const ci = checked ? parseInt(checked.value) - 1 : -1;
      labels.forEach((l, j) => l.style.color = j <= ci ? '#f59e0b' : '#e2e2e2');
    });
  });
});

/* ── Mood ── */
function selectMood(btn, mood) {
  document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
  selectedMood = mood;
}

/* ── Color ── */
function selectColor(dot) {
  document.querySelectorAll('.cp-dot').forEach(d => d.classList.remove('sel'));
  dot.classList.add('sel');
  selectedColor = dot.dataset.color;
}

/* ── Tags ── */
function toggleTag(el) { el.classList.toggle('sel'); }

/* ── Stress bar ── */
function updateStress(val) {
  document.getElementById('st-val').textContent = val;
  document.getElementById('stressBar').style.width = ((val - 1) / 9 * 100) + '%';
}

/* ── Get star value ── */
function getStarVal(name) {
  const c = document.querySelector(`input[name="${name}"]:checked`);
  return c ? parseInt(c.value) : 0;
}

/* ── Submit ── */
function submitForm() {
  const academic    = getStarVal('academic');
  const social      = getStarVal('social');
  const mental      = getStarVal('mental');
  const balance     = getStarVal('balance');
  const prof        = getStarVal('prof');
  const allnighters = parseInt(document.getElementById('allnighters').value);
  const sleep       = parseInt(document.getElementById('sleep').value);
  const syllabus    = parseInt(document.getElementById('syllabus').value);
  const attendance  = parseInt(document.getElementById('attendance').value);
  const stress      = parseInt(document.getElementById('stress').value);
  const name        = document.getElementById('name').value.trim() || 'you';
  const tags        = Array.from(document.querySelectorAll('.tag.sel')).map(t => t.textContent.trim());

  const starAvg       = (academic + social + mental + balance + prof) / 5;
  const sleepScore    = Math.min((sleep - 2) / 10 * 5, 5);
  const syllabusScore = syllabus / 100 * 5;
  const attendScore   = attendance / 100 * 5;
  const stressPenalty = ((stress - 1) / 9) * 1.5;
  const nightPenalty  = Math.min(allnighters * 0.1, 2);

  const raw   = starAvg * 0.4 + sleepScore * 0.15 + syllabusScore * 0.15 + attendScore * 0.15 - stressPenalty * 0.15 - nightPenalty;
  const score = Math.min(Math.max(parseFloat(raw.toFixed(1)), 0), 10);
  const pct   = Math.round((score / 10) * 100);

  const emojis = score >= 8 ? '🏆' : score >= 6 ? '🎉' : score >= 4 ? '😅' : score >= 2 ? '😬' : '💀';
  const titles = score >= 8 ? 'Absolutely crushed it!'
               : score >= 6 ? 'Pretty solid semester!'
               : score >= 4 ? 'Survived — barely!'
               : score >= 2 ? 'Rough one, champ.'
               :              'Legendary disaster.';
  const subs   = score >= 8 ? `${name} had an exceptional semester. Respect.`
               : score >= 6 ? `${name} got through it with dignity intact.`
               : score >= 4 ? `${name} made it — and that counts.`
               : score >= 2 ? `${name} endured. That's something.`
               :              `${name} achieved chaos. Legendary.`;

  document.getElementById('resultEmoji').textContent = emojis;
  document.getElementById('resultTitle').textContent = titles;
  document.getElementById('resultSub').textContent   = subs;

  setTimeout(() => {
    document.getElementById('scoreBar').style.width  = pct + '%';
    document.getElementById('scoreNum').textContent  = score.toFixed(1) + '/10';
  }, 200);

  const cols = [
    { label: 'Academics',  val: academic, color: '#7c3aed' },
    { label: 'Social',     val: social,   color: '#059669' },
    { label: 'Wellbeing',  val: mental,   color: '#db2777' },
    { label: 'Balance',    val: balance,  color: '#ea580c' },
    { label: 'Professors', val: prof,     color: '#2563eb' },
  ];

  document.getElementById('miniScores').innerHTML = cols.map(c => `
    <div class="mini-score-card">
      <div class="mini-score-label">${c.label}</div>
      <div class="mini-score-stars" style="color:${c.color}">
        ${'★'.repeat(c.val || 0)}${'☆'.repeat(5 - (c.val || 0))}
      </div>
    </div>
  `).join('');

  let summary = '';
  if (selectedColor) summary += `Semester colour: <strong>${selectedColor}</strong>. `;
  if (selectedMood)  summary += `Feeling: <strong>${selectedMood}</strong>. `;
  if (stress >= 8)   summary += `Stress at ${stress}/10 — please rest. `;
  if (allnighters > 5) summary += `${allnighters} all-nighters — iconic. `;
  if (sleep <= 5)    summary += `Only ${sleep}h sleep — rest up! `;
  if (syllabus < 30) summary += `${syllabus}% syllabus read — bold. `;
  if (tags.length)   summary += `Tagged: ${tags.join(', ')}.`;
  if (!summary)      summary  = 'A semester for the history books. 📖';

  document.getElementById('summaryBox').innerHTML = summary;

  document.getElementById('formSection').style.display  = 'none';
  document.querySelector('.submit-wrap').style.display  = 'none';
  document.getElementById('resultSection').style.display = 'flex';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Reset ── */
function resetForm() {
  ['name','major','university','favCourse','worstCourse','best','worst','differently','note']
    .forEach(id => { document.getElementById(id).value = ''; });

  document.getElementById('semester').value   = '';
  document.getElementById('courses').value    = '';
  document.getElementById('allnighters').value = 0;  document.getElementById('an-val').textContent = '0';
  document.getElementById('sleep').value       = 7;  document.getElementById('sl-val').textContent = '7h';
  document.getElementById('syllabus').value    = 50; document.getElementById('sy-val').textContent = '50%';
  document.getElementById('attendance').value  = 80; document.getElementById('at-val').textContent = '80%';
  document.getElementById('ontime').value      = 70; document.getElementById('ot-val').textContent = '70%';
  document.getElementById('stress').value      = 5;  document.getElementById('st-val').textContent = '5';
  document.getElementById('stressBar').style.width = '44%';

  document.querySelectorAll('input[type=radio]').forEach(r => r.checked = false);
  document.querySelectorAll('.stars-row label').forEach(l => {
    l.style.color = '#e2e2e2';
    l.classList.remove('lit');
  });
  document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('sel'));
  document.querySelectorAll('.cp-dot').forEach(d => d.classList.remove('sel'));
  document.querySelectorAll('.tag').forEach(t => t.classList.remove('sel'));
  document.getElementById('scoreBar').style.width = '0%';

  selectedMood  = '';
  selectedColor = '';

  document.getElementById('resultSection').style.display  = 'none';
  document.getElementById('formSection').style.display    = 'grid';
  document.querySelector('.submit-wrap').style.display    = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}