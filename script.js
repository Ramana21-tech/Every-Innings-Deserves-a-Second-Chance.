/* Second Innings — single-page app, state persisted in localStorage */
(() => {
  'use strict';

  /* ---------- Data ---------- */
  const SKILLS = ['Cooking','Tailoring','Music','Tuition','Storytelling','Language','Gardening','Crafts'];
  const COLORS = ['#1c5a3e','#b4352b','#8a6d1d','#2f4f7a','#6b3f69','#2d6a6a','#7a4a2a','#4a5d23'];
  const SEED = [
    {id:'m1',name:'Kamala Subramanian',age:74,skill:'Cooking',years:48,city:'Madurai',home:'Anbu Illam',rating:4.9,sessions:132,bio:'Chettinad kitchens taught me everything. I can show you how to grind masalas by hand and balance a kuzhambu without a recipe.'},
    {id:'m2',name:'Rajagopal Iyer',age:79,skill:'Music',years:55,city:'Chennai',home:'Sangeetha Sadan',rating:4.9,sessions:118,bio:'Carnatic vocalist and violinist. Beginners welcome — we start with sarali varisai and build from there.'},
    {id:'m3',name:'Meenakshi Ammal',age:71,skill:'Tailoring',years:42,city:'Coimbatore',home:'Thaai Veedu',rating:4.8,sessions:96,bio:'I stitched blouses for three generations of one family. Learn to measure, cut and finish clean seams.'},
    {id:'m4',name:'Dr. Selvaraj',age:76,skill:'Tuition',years:38,city:'Trichy',home:'Nalam Illam',rating:4.8,sessions:87,bio:'Retired maths teacher. Class 8–12 maths and physics, taught with patience and a lot of chalk.'},
    {id:'m5',name:'Pappathi Paati',age:82,skill:'Storytelling',years:60,city:'Thanjavur',home:'Kadhai Koodam',rating:4.9,sessions:74,bio:'Folk tales, village riddles and stories my grandmother told me. Great for children and for writers.'},
    {id:'m6',name:'Ibrahim Khan',age:73,skill:'Language',years:35,city:'Chennai',home:'Sangeetha Sadan',rating:4.7,sessions:61,bio:'Urdu and Arabic calligraphy teacher. Conversation practice and script, at your pace.'},
    {id:'m7',name:'Lakshmi Narayanan',age:77,skill:'Gardening',years:50,city:'Ooty',home:'Pasumai Illam',rating:4.8,sessions:58,bio:'Kitchen gardens, terrace vegetables and natural pest control. I have never bought a pesticide.'},
    {id:'m8',name:'Saraswathi Devi',age:69,skill:'Crafts',years:33,city:'Madurai',home:'Anbu Illam',rating:4.6,sessions:49,bio:'Kolam, palm-leaf weaving and paper quilling. Bring patience; leave with something you made.'},
    {id:'m9',name:'Gnanasekaran',age:80,skill:'Cooking',years:52,city:'Salem',home:'Amudham Illam',rating:4.7,sessions:44,bio:'Temple-kitchen cooking: pongal, sundal and sweets for a hundred people, scaled down for your home.'},
    {id:'m10',name:'Vasantha Kumari',age:72,skill:'Language',years:40,city:'Trichy',home:'Nalam Illam',rating:4.8,sessions:52,bio:'Tamil literature and spoken English tutor. Good for exam prep and for polishing your writing.'}
  ];
  const KEYS = {added:'si_added',saved:'si_saved',sessions:'si_sessions',msgs:'si_messages',me:'si_me'};

  /* ---------- Storage ---------- */
  const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
  const state = {
    added: load(KEYS.added, []), saved: load(KEYS.saved, []), sessions: load(KEYS.sessions, []),
    msgs: load(KEYS.msgs, []), me: load(KEYS.me, {name:'', email:''}),
    q:'', skill:'All', sort:'featured', savedOnly:false
  };
  const persist = () => { save(KEYS.added,state.added); save(KEYS.saved,state.saved); save(KEYS.sessions,state.sessions); save(KEYS.msgs,state.msgs); save(KEYS.me,state.me); };

  /* ---------- Helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const initials = n => n.replace(/^(Dr\.?|Mr\.?|Mrs\.?)\s+/i,'').split(/\s+/).slice(0,2).map(w => w[0]).join('').toUpperCase();
  const color = id => COLORS[[...id].reduce((a,c) => a + c.charCodeAt(0), 0) % COLORS.length];
  const SLOTS = {morning:'Morning · 9 am–12 pm',afternoon:'Afternoon · 2–5 pm',evening:'Evening · 5–7 pm'};
  const SLOT_TIMES = {morning:[9,12],afternoon:[14,17],evening:[17,19]};
  const todayStr = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0,10); };
  const fmtDate = s => new Date(s + 'T00:00').toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short',year:'numeric'});
  const uid = p => p + Date.now().toString(36) + Math.random().toString(36).slice(2,6);

  const allMentors = () => [...SEED, ...state.added];
  const mentorById = id => allMentors().find(m => m.id === id);
  const bookingsFor = id => state.sessions.filter(s => s.mentorId === id && s.status !== 'cancelled').length;
  const totalSessions = m => m.sessions + bookingsFor(m.id);
  const isUpcoming = s => s.status !== 'cancelled' && s.date >= todayStr();

  function toast(msg) {
    const t = document.createElement('div');
    t.className = 'toast'; t.textContent = msg;
    $('#toast-wrap').appendChild(t);
    setTimeout(() => t.remove(), 3000);
  }

  /* ---------- Rendering: mentors ---------- */
  function mentorCard(m) {
    const saved = state.saved.includes(m.id);
    return `<article class="mentor-card">
      ${m.custom ? '<span class="new-badge">New</span>' : ''}
      <div class="card-top">
        <div class="avatar" style="background:${color(m.id)}" aria-hidden="true">${esc(initials(m.name))}</div>
        <div><h3 class="mentor-name"><a href="#profile/${m.id}" data-nav>${esc(m.name)}</a></h3>
        <p class="mentor-meta">${esc(m.city)} · ${esc(m.home)}</p></div>
      </div>
      <span class="skill-tag">${esc(m.skill)}</span>
      <p class="mentor-bio">${esc(m.bio)}</p>
      <div class="mentor-stats"><span><span class="star">★</span> ${m.rating.toFixed(1)}</span><span>${m.years} yrs</span><span>${totalSessions(m)} sessions</span></div>
      <div class="card-actions">
        <button class="btn btn-primary btn-sm" data-book="${m.id}">Book session</button>
        <button class="save-btn" data-save="${m.id}" aria-pressed="${saved}" aria-label="${saved ? 'Remove' : 'Save'} ${esc(m.name)} ${saved ? 'from' : 'to'} shortlist">${saved ? '♥' : '♡'}</button>
      </div>
    </article>`;
  }

  const sorters = {
    featured:(a,b) => (b.rating*Math.log(totalSessions(b)+2)) - (a.rating*Math.log(totalSessions(a)+2)),
    rating:(a,b) => b.rating - a.rating || totalSessions(b) - totalSessions(a),
    years:(a,b) => b.years - a.years,
    sessions:(a,b) => totalSessions(b) - totalSessions(a),
    name:(a,b) => a.name.localeCompare(b.name)
  };

  function renderHome() {
    const top = [...allMentors()].sort(sorters.rating).slice(0, 3);
    $('#featured-mentor-grid').innerHTML = top.map(mentorCard).join('');
  }

  function renderChips() {
    const present = SKILLS.filter(s => allMentors().some(m => m.skill === s));
    $('#skill-chips').innerHTML = ['All', ...present].map(s =>
      `<button type="button" class="chip${state.skill === s ? ' active' : ''}" data-chip="${s}" aria-pressed="${state.skill === s}">${s}</button>`).join('');
  }

  function renderExplore() {
    renderChips();
    const q = state.q.trim().toLowerCase();
    let list = allMentors().filter(m =>
      (state.skill === 'All' || m.skill === state.skill) &&
      (!state.savedOnly || state.saved.includes(m.id)) &&
      (!q || [m.name, m.skill, m.city, m.home, m.bio].join(' ').toLowerCase().includes(q)));
    list.sort(sorters[state.sort]);
    $('#explore-mentor-grid').innerHTML = list.map(mentorCard).join('');
    $('#result-count').textContent = `${list.length} mentor${list.length === 1 ? '' : 's'} on the team sheet`;
    $('#saved-count').textContent = state.saved.length ? `(${state.saved.length})` : '';
    const empty = !list.length;
    $('#explore-empty').hidden = !empty;
    $('#explore-mentor-grid').hidden = empty;
    if (empty) $('#explore-empty-text').textContent = state.savedOnly && !state.saved.length
      ? 'You haven\'t saved anyone yet. Tap the heart on a mentor to shortlist them.'
      : 'No one on the team sheet matches that search.';
  }

  function renderProfile(id) {
    const m = mentorById(id), view = $('#profile-view');
    if (!m) { view.innerHTML = `<div class="empty-state"><p>We couldn't find that mentor.</p><a href="#explore" class="btn btn-ghost" data-nav>Back to the squad</a></div>`; return; }
    const saved = state.saved.includes(m.id);
    const mine = state.sessions.filter(s => s.mentorId === m.id && isUpcoming(s));
    view.innerHTML = `<a href="#explore" class="text-link profile-back" data-nav>&larr; Back to the squad</a>
      <div class="profile-card">
        <div class="avatar avatar-lg" style="background:${color(m.id)}" aria-hidden="true">${esc(initials(m.name))}</div>
        <div>
          <span class="skill-tag">${esc(m.skill)}</span>
          <h1 tabindex="-1">${esc(m.name)}</h1>
          <p class="mentor-meta">Age ${m.age} · ${esc(m.city)} · ${esc(m.home)}</p>
          <p>${esc(m.bio)}</p>
          <div class="profile-facts">
            <div class="fact"><b>${m.rating.toFixed(1)} ★</b><span>Rating</span></div>
            <div class="fact"><b>${m.years}</b><span>Years of experience</span></div>
            <div class="fact"><b>${totalSessions(m)}</b><span>Sessions taught</span></div>
          </div>
          <div class="profile-actions">
            <button class="btn btn-primary" data-book="${m.id}">Book a session</button>
            <button class="btn btn-ghost" data-save="${m.id}" aria-pressed="${saved}">${saved ? '♥ Saved' : '♡ Save to shortlist'}</button>
          </div>
          ${mine.length ? `<div class="profile-sessions"><strong>Your upcoming sessions</strong><ul>${mine.map(s => `<li>${fmtDate(s.date)}, ${SLOTS[s.slot]} (${esc(s.mode)})</li>`).join('')}</ul></div>` : ''}
        </div>
      </div>`;
  }

  /* ---------- Rendering: sessions ---------- */
  function renderSessions() {
    const box = $('#sessions-list');
    const all = [...state.sessions].sort((a,b) => a.date.localeCompare(b.date));
    if (!all.length) {
      box.innerHTML = `<div class="empty-state"><p>No sessions booked yet. Pick a mentor and get on the batting order.</p><a href="#explore" class="btn btn-primary" data-nav>Meet the squad</a></div>`;
      return;
    }
    const card = s => {
      const m = mentorById(s.mentorId), cancelled = s.status === 'cancelled', up = isUpcoming(s);
      return `<div class="session-card${up ? '' : ' past'}">
        <div class="avatar" style="background:${color(s.mentorId)}" aria-hidden="true">${esc(initials(s.mentorName))}</div>
        <div class="session-info">
          <h3><a href="#profile/${s.mentorId}" data-nav>${esc(s.mentorName)}</a> · ${esc(m ? m.skill : s.skill)}</h3>
          <p>${fmtDate(s.date)} · ${SLOTS[s.slot]} · ${esc(s.mode)}${cancelled ? ' · <strong>Cancelled</strong>' : ''}</p>
          ${s.note ? `<p>“${esc(s.note)}”</p>` : ''}
        </div>
        <div class="session-actions">
          ${up ? `<button class="btn btn-ghost btn-sm" data-ics="${s.id}">Add to calendar</button><button class="btn btn-ghost btn-sm btn-danger" data-cancel="${s.id}">Cancel</button>` : `<button class="btn btn-ghost btn-sm" data-remove="${s.id}">Remove</button>`}
        </div></div>`;
    };
    const up = all.filter(isUpcoming), past = all.filter(s => !isUpcoming(s));
    box.innerHTML = (up.length ? `<h2 class="session-group-title">Upcoming</h2>${up.map(card).join('')}` : '') +
                    (past.length ? `<h2 class="session-group-title">Past and cancelled</h2>${past.map(card).join('')}` : '');
  }

  /* ---------- Stats ---------- */
  function stats() {
    const ms = allMentors();
    return {
      mentors: ms.length,
      sessions: ms.reduce((n, m) => n + totalSessions(m), 0),
      homes: new Set(ms.map(m => m.home.trim().toLowerCase())).size,
      skills: new Set(ms.map(m => m.skill)).size,
      years: Math.round(ms.reduce((n, m) => n + m.years, 0) / ms.length)
    };
  }
  const shown = new WeakMap();
  function renderStats(animate) {
    const s = stats();
    $$('[data-stat]').forEach(el => {
      const target = s[el.dataset.stat], suffix = el.dataset.suffix || '';
      const from = shown.get(el) ?? 0;
      shown.set(el, target);
      if (!animate || from === target || matchMedia('(prefers-reduced-motion:reduce)').matches) { el.textContent = target + suffix; return; }
      const t0 = performance.now(), dur = 900;
      const tick = now => {
        const p = Math.min((now - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(from + (target - from) * e) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  function renderBadge() {
    const n = state.sessions.filter(isUpcoming).length;
    const b = $('#nav-badge'); b.textContent = n; b.hidden = !n;
  }

  /* One call refreshes every view so changes show up everywhere */
  function renderAll(animate = false) {
    renderHome(); renderExplore(); renderSessions(); renderBadge(); renderStats(animate);
    const r = route(); if (r.page === 'profile') renderProfile(r.id);
  }

  /* ---------- Router ---------- */
  function route() {
    const h = location.hash.replace(/^#/, '') || 'home';
    const [page, id] = h.split('/');
    const valid = ['home','explore','profile','sessions','register','about','contact'];
    return {page: valid.includes(page) ? page : 'home', id};
  }
  function show() {
    const {page, id} = route();
    $$('.page').forEach(p => p.classList.toggle('active', p.dataset.page === page));
    $$('.nav-link').forEach(a => { const on = a.dataset.route === page || (page === 'profile' && a.dataset.route === 'explore'); a.classList.toggle('active', on); on ? a.setAttribute('aria-current','page') : a.removeAttribute('aria-current'); });
    if (page === 'profile') renderProfile(id);
    if (page === 'sessions') renderSessions();
    if (page === 'explore') renderExplore();
    if (page === 'home' || page === 'about') renderStats(true);
    closeNav();
    window.scrollTo(0, 0);
    const h = $(`#page-${page} h1`); if (h) h.focus({preventScroll:true});
    document.title = (page === 'home' ? '' : page[0].toUpperCase() + page.slice(1) + ' — ') + 'Second Innings';
  }
  function closeNav() { $('#main-nav').classList.remove('open'); $('#nav-toggle').setAttribute('aria-expanded','false'); }

  /* ---------- Validation ---------- */
  function setErr(input, msg) {
    const row = input.closest('.form-row') || input.parentElement;
    row.classList.toggle('has-error', !!msg);
    let e = row.querySelector('.field-error');
    if (msg) {
      if (!e) { e = document.createElement('p'); e.className = 'field-error'; e.setAttribute('role','alert'); row.appendChild(e); }
      e.textContent = msg; input.setAttribute('aria-invalid','true');
    } else { if (e) e.remove(); input.removeAttribute('aria-invalid'); }
  }
  function validate(form, rules) {
    let first = null;
    for (const [id, check] of Object.entries(rules)) {
      const el = $('#' + id), msg = check(el.value.trim(), el);
      setErr(el, msg || '');
      if (msg && !first) first = el;
    }
    if (first) first.focus();
    return !first;
  }
  const req = label => v => v ? '' : `Enter ${label}.`;
  const email = v => !v ? 'Enter your email.' : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email, like name@example.com.';
  const num = (label, min, max) => v => !v ? `Enter ${label}.` : (+v < min || +v > max) ? `${label[0].toUpperCase() + label.slice(1)} must be between ${min} and ${max}.` : '';

  /* ---------- Booking modal ---------- */
  let lastFocus = null;
  function openBooking(id) {
    const m = mentorById(id); if (!m) return;
    lastFocus = document.activeElement;
    $('#bookingMentorId').value = id;
    $('#booking-mentor-name').textContent = m.name;
    $('#booking-form').reset();
    $$('#booking-form .has-error').forEach(r => setErr($('input,select,textarea', r), ''));
    $('#bookingName').value = state.me.name; $('#bookingEmail').value = state.me.email;
    $('#bookingDate').min = todayStr();
    $('#booking-form-view').hidden = false; $('#booking-confirm-view').hidden = true;
    $('#booking-modal').hidden = false; document.body.style.overflow = 'hidden';
    $('#bookingName').focus();
  }
  function closeBooking() {
    $('#booking-modal').hidden = true; document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  let lastBooking = null;
  function submitBooking(e) {
    e.preventDefault();
    const ok = validate(e.target, {
      bookingName: req('your name'), bookingEmail: email,
      bookingDate: v => !v ? 'Pick a date.' : v < todayStr() ? 'Pick today or a future date.' : '',
      bookingSlot: v => v ? '' : 'Choose a time slot.'
    });
    if (!ok) return;
    const m = mentorById($('#bookingMentorId').value);
    const s = {id: uid('s'), mentorId: m.id, mentorName: m.name, skill: m.skill, name: $('#bookingName').value.trim(), email: $('#bookingEmail').value.trim(),
      date: $('#bookingDate').value, slot: $('#bookingSlot').value, mode: $('#bookingMode').value, note: $('#bookingNote').value.trim(), status: 'booked'};
    if (state.sessions.some(x => x.status !== 'cancelled' && x.date === s.date && x.slot === s.slot)) { setErr($('#bookingSlot'), 'You already have a session in that slot. Pick another.'); return; }
    state.me = {name: s.name, email: s.email};
    state.sessions.push(s); persist(); lastBooking = s;
    $('#booking-confirm-text').textContent = `${m.name} will see you on ${fmtDate(s.date)}, ${SLOTS[s.slot]} (${s.mode}). A confirmation has been sent to ${s.email}.`;
    $('#booking-form-view').hidden = true; $('#booking-confirm-view').hidden = false;
    renderAll(true);
  }

  /* ---------- Calendar (.ics) ---------- */
  function downloadIcs(s) {
    const [a, b] = SLOT_TIMES[s.slot], d = s.date.replace(/-/g,'');
    const p = n => String(n).padStart(2,'0'), now = new Date().toISOString().replace(/[-:]|\.\d{3}/g,'');
    const ics = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Second Innings//EN','BEGIN:VEVENT',`UID:${s.id}@secondinnings`,`DTSTAMP:${now}`,
      `DTSTART:${d}T${p(a)}0000`,`DTEND:${d}T${p(b)}0000`,`SUMMARY:${s.skill} session with ${s.mentorName}`,
      `DESCRIPTION:Second Innings session (${s.mode}). ${s.note || ''}`.replace(/\n/g,' '),'END:VEVENT','END:VCALENDAR'].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], {type:'text/calendar'}));
    const a2 = Object.assign(document.createElement('a'), {href:url, download:`second-innings-${s.date}.ics`});
    document.body.appendChild(a2); a2.click(); a2.remove(); URL.revokeObjectURL(url);
    toast('Calendar file downloaded');
  }

  /* ---------- Forms ---------- */
  function submitRegister(e) {
    e.preventDefault();
    const ok = validate(e.target, {
      homeName: req('the home name'), contactPerson: req('a contact person'),
      contactPhone: v => !v ? 'Enter a contact phone.' : v.replace(/\D/g,'').length < 10 ? 'Enter a phone number with at least 10 digits.' : '',
      homeCity: req('the city'), residentName: req('the resident\'s name'), residentAge: num('the resident\'s age', 50, 110),
      residentSkill: v => v ? '' : 'Select a skill.', residentYears: num('years of experience', 1, 80),
      residentBio: v => v.length < 20 ? 'Write at least 20 characters about them.' : ''
    });
    if (!ok) return;
    const g = id => $('#' + id).value.trim();
    const m = {id: uid('n'), custom: true, name: g('residentName'), age: +g('residentAge'), skill: g('residentSkill'), years: +g('residentYears'),
      city: g('homeCity'), home: g('homeName'), rating: 5.0, sessions: 0, bio: g('residentBio'), contact: g('contactPerson'), phone: g('contactPhone')};
    state.added.push(m); persist(); e.target.reset(); $('#bio-count').textContent = '0';
    $('#register-success-text').textContent = `${m.name} is now on the squad as a ${m.skill.toLowerCase()} mentor. We'll call ${m.contact} to finish their profile.`;
    $('#register-success').hidden = false; $('#register-success').scrollIntoView({block:'nearest'});
    renderAll(true); toast(`${m.name} added to the team sheet`);
  }
  function submitContact(e) {
    e.preventDefault();
    if (!validate(e.target, {contactName: req('your name'), contactEmail: email, contactMessage: v => v.length < 10 ? 'Write a message of at least 10 characters.' : ''})) return;
    state.msgs.push({id: uid('c'), name: $('#contactName').value.trim(), email: $('#contactEmail').value.trim(), message: $('#contactMessage').value.trim(), at: new Date().toISOString()});
    persist(); e.target.reset(); $('#contact-success').hidden = false; toast('Message sent');
  }

  /* ---------- Events ---------- */
  document.addEventListener('click', e => {
    const t = e.target.closest('button, a'); if (!t) return;
    if (t.dataset.book) return openBooking(t.dataset.book);
    if (t.dataset.save) {
      const id = t.dataset.save, i = state.saved.indexOf(id), m = mentorById(id);
      i < 0 ? state.saved.push(id) : state.saved.splice(i, 1);
      persist(); renderAll(); toast(i < 0 ? `${m.name} saved to shortlist` : `${m.name} removed from shortlist`); return;
    }
    if (t.dataset.chip) { state.skill = t.dataset.chip; return renderExplore(); }
    if (t.dataset.ics) { const s = state.sessions.find(x => x.id === t.dataset.ics); if (s) downloadIcs(s); return; }
    if (t.dataset.cancel) {
      const s = state.sessions.find(x => x.id === t.dataset.cancel);
      if (s && confirm(`Cancel your session with ${s.mentorName} on ${fmtDate(s.date)}?`)) { s.status = 'cancelled'; persist(); renderAll(); toast('Session cancelled'); }
      return;
    }
    if (t.dataset.remove) { state.sessions = state.sessions.filter(x => x.id !== t.dataset.remove); persist(); renderAll(); return; }
    if (t.id === 'booking-ics-btn' && lastBooking) return downloadIcs(lastBooking);
    if (t.id === 'booking-done-btn') { lastFocus = null; return closeBooking(); }
    if (t.id === 'clear-filters') { Object.assign(state, {q:'', skill:'All', savedOnly:false, sort:'featured'}); $('#mentor-search').value = ''; $('#saved-only').checked = false; $('#mentor-sort').value = 'featured'; return renderExplore(); }
    if (t.id === 'reset-demo') {
      if (confirm('Reset demo data? This clears added mentors, saved mentors, bookings and messages on this device.')) { Object.values(KEYS).forEach(k => localStorage.removeItem(k)); Object.assign(state, {added:[], saved:[], sessions:[], msgs:[], me:{name:'',email:''}}); renderAll(true); toast('Demo data reset'); }
    }
  });
  $('#modal-close').addEventListener('click', closeBooking);
  $('#booking-modal').addEventListener('mousedown', e => { if (e.target.id === 'booking-modal') closeBooking(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !$('#booking-modal').hidden) closeBooking();
    if (e.key === 'Tab' && !$('#booking-modal').hidden) {
      const f = $$('#booking-modal button:not([hidden]), #booking-modal input, #booking-modal select, #booking-modal textarea, #booking-modal a[href]').filter(x => x.offsetParent);
      if (!f.length) return; const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  $('#mentor-search').addEventListener('input', e => { state.q = e.target.value; renderExplore(); });
  $('#mentor-sort').addEventListener('change', e => { state.sort = e.target.value; renderExplore(); });
  $('#saved-only').addEventListener('change', e => { state.savedOnly = e.target.checked; renderExplore(); });
  $('#nav-toggle').addEventListener('click', () => { const o = $('#main-nav').classList.toggle('open'); $('#nav-toggle').setAttribute('aria-expanded', o); });
  $('#booking-form').addEventListener('submit', submitBooking);
  $('#register-form').addEventListener('submit', submitRegister);
  $('#contact-form').addEventListener('submit', submitContact);
  $('#residentBio').addEventListener('input', e => { $('#bio-count').textContent = e.target.value.length; });
  $$('form').forEach(f => f.addEventListener('input', e => { if (e.target.closest('.has-error')) setErr(e.target, ''); }));
  $('#register-form').addEventListener('input', () => { $('#register-success').hidden = true; });
  $('#contact-form').addEventListener('input', () => { $('#contact-success').hidden = true; });
  window.addEventListener('hashchange', show);

  /* Keep other tabs in sync */
  window.addEventListener('storage', e => {
    if (!Object.values(KEYS).includes(e.key)) return;
    state.added = load(KEYS.added, []); state.saved = load(KEYS.saved, []); state.sessions = load(KEYS.sessions, []); state.me = load(KEYS.me, {name:'',email:''});
    renderAll();
  });

  /* ---------- Init ---------- */
  renderAll(false);
  $$('[data-stat]').forEach(el => shown.delete(el)); // so the scoreboard counts up on first view
  show();
})();
