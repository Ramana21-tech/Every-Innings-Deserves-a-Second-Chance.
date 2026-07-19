/* ============================================================
   SECOND INNINGS — mock data, routing, rendering
   No real backend yet: bookings / registrations / messages are
   written to localStorage and logged to the console so it's
   obvious what a real API would need to receive.
   ============================================================ */

(function () {
  "use strict";

  /* ---------------- MOCK DATA ---------------- */

  const MENTORS = [
    {
      id: "m1",
      name: "Kamala Devi",
      age: 71,
      skill: "Cooking",
      home: "Shanthi Nivas Elder Care, Trichy",
      years: 40,
      rating: 4.9,
      sessions: 26,
      bio: "Kamala Devi has been cooking Chettinad food since she was twelve, taught by her grandmother in a kitchen with no measuring cups — only instinct. Forty years and three restaurants later, she teaches the dishes that never made it into cookbooks: the exact toast on a fennel seed, the patience a good mutton curry demands, and why every kuzhambu needs a story behind it.",
      reviews: [
        { name: "Priya R.", text: "I've tried a dozen YouTube recipes for pepper chicken. None of them come close to what I learned in ninety minutes with Kamala paati." },
        { name: "Arun K.", text: "She corrected my grinding technique for the masala within the first five minutes. Worth it for that alone." }
      ]
    },
    {
      id: "m2",
      name: "Murugesan Pillai",
      age: 76,
      skill: "Tailoring",
      home: "Snehalaya Old Age Home, Madurai",
      years: 48,
      rating: 4.8,
      sessions: 19,
      bio: "Murugesan ran a tailoring shop near Meenakshi Temple for over four decades, stitching everything from wedding silks to school uniforms. He teaches pattern-cutting the old way — by eye and by hand — along with the finishing touches that separate a home-stitched shirt from a shop-bought one.",
      reviews: [
        { name: "Divya S.", text: "He taught me to set a sleeve properly in one session. I'd been getting it wrong for years." },
        { name: "Ganesh M.", text: "Patient, precise, and full of stories about the shop he used to run. Loved every minute." }
      ]
    },
    {
      id: "m3",
      name: "Lakshmi Narayanan",
      age: 68,
      skill: "Music",
      home: "Amma Illam, Coimbatore",
      years: 55,
      rating: 5.0,
      sessions: 31,
      bio: "A trained Carnatic vocalist and veena player, Lakshmi performed at sabhas across Tamil Nadu before her knees made travel difficult. She now teaches beginners and returning students alike, with a gentle insistence on correct breathing and shruti before anything else.",
      reviews: [
        { name: "Meera V.", text: "I stopped learning veena at fifteen and picked it back up with her at forty. She made it feel possible again." },
        { name: "Karthik B.", text: "Incredibly precise ear for pitch. She'll stop you mid-phrase and you'll know exactly why." }
      ]
    },
    {
      id: "m4",
      name: "Rajagopal Iyer",
      age: 74,
      skill: "Tuition",
      home: "Anbagam Elder Care, Chennai",
      years: 42,
      rating: 4.9,
      sessions: 38,
      bio: "A retired mathematics and Sanskrit teacher, Rajagopal spent over four decades in classrooms across Chennai. He now tutors students one-on-one, from Class 10 board-exam algebra to first-year Sanskrit grammar, with the same chalk-and-patience approach that made him a favourite teacher for generations.",
      reviews: [
        { name: "Swathi N.", text: "My son went from dreading algebra to asking for extra sessions. Rajagopal sir has a gift." },
        { name: "Vignesh R.", text: "Learned more Sanskrit sandhi rules in a month than I did in a year of college." }
      ]
    },
    {
      id: "m5",
      name: "Meenakshi Sundaram",
      age: 70,
      skill: "Storytelling",
      home: "Nala Illam, Thanjavur",
      years: 45,
      rating: 4.8,
      sessions: 22,
      bio: "Meenakshi grew up on a steady diet of her grandmother's folk tales and has spent a lifetime collecting more — from villages across the Thanjavur delta. She teaches oral storytelling: pacing, voice, and the art of holding a room, using stories that rarely make it into books.",
      reviews: [
        { name: "Anitha J.", text: "I run a small library program for children and her sessions completely changed how I tell stories aloud." },
        { name: "Suresh P.", text: "She has a story for every occasion and somehow makes each one feel like it's just for you." }
      ]
    },
    {
      id: "m6",
      name: "Fathima Beevi",
      age: 69,
      skill: "Language",
      home: "Santhome Senior Home, Chennai",
      years: 38,
      rating: 4.7,
      sessions: 24,
      bio: "Fluent in Tamil, Urdu, and English, Fathima taught language classes at a community school for over three decades. She now offers conversational practice and grammar coaching across all three languages, with a particular gift for helping adult learners get past the fear of speaking.",
      reviews: [
        { name: "Rahul D.", text: "I'd been putting off learning Urdu for years. She made the alphabet click in one session." },
        { name: "Farah A.", text: "Warm, funny, and endlessly patient with my terrible grammar." }
      ]
    },
    {
      id: "m7",
      name: "Krishnamurthy Rao",
      age: 78,
      skill: "Gardening",
      home: "Green Haven Old Age Home, Salem",
      years: 50,
      rating: 4.9,
      sessions: 17,
      bio: "Krishnamurthy has kept a working kitchen garden for fifty years, through droughts, transfers, and three different cities. He teaches practical, no-nonsense home gardening — composting, seasonal planting, and how to keep a terrace garden alive on a Tamil Nadu summer.",
      reviews: [
        { name: "Deepa T.", text: "My terrace garden has never looked better. He diagnosed my overwatering problem in five minutes." },
        { name: "Naveen S.", text: "Practical, hands-on, no fancy jargon. Exactly what a beginner needs." }
      ]
    },
    {
      id: "m8",
      name: "Valli Ammal",
      age: 72,
      skill: "Crafts",
      home: "Karunai Illam, Tiruchirappalli",
      years: 44,
      rating: 4.8,
      sessions: 21,
      bio: "Valli Ammal has spent her life between a handloom and a potter's wheel, skills passed down through three generations of her family. She teaches traditional weaving patterns and basic pottery, and insists every student leave with something they made themselves.",
      reviews: [
        { name: "Harini K.", text: "I made my first proper clay pot in her session. She made it look easy, which it very much is not." },
        { name: "Vasanth R.", text: "The weaving patterns she teaches aren't written down anywhere else that I could find." }
      ]
    }
  ];

  const SKILLS = ["Cooking", "Tailoring", "Music", "Tuition", "Storytelling", "Language", "Gardening", "Crafts"];

  const AVATAR_COLORS = ["#2F4B3C", "#B5533C", "#8F3F2D", "#203529", "#D9A441"];

  function initials(name) {
    return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  }
  function avatarColor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
  }
  function avatarHtml(name, size) {
    const cls = size === "lg" ? "avatar avatar-lg" : "avatar";
    return `<div class="${cls}" style="background:${avatarColor(name)}">${initials(name)}</div>`;
  }

  function totalSessions() {
    return MENTORS.reduce((sum, m) => sum + m.sessions, 0);
  }

  /* ---------------- LOCAL STORAGE HELPERS ---------------- */

  function pushToStorage(key, entry) {
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    list.push(entry);
    localStorage.setItem(key, JSON.stringify(list));
    console.log(`[Second Innings mock backend] wrote to localStorage['${key}']:`, entry);
  }

  /* ---------------- MENTOR CARD RENDERING ---------------- */

  function mentorCardHtml(m) {
    return `
      <article class="mentor-card">
        <div class="mentor-card-top">
          ${avatarHtml(m.name)}
          <div>
            <h3 class="mentor-card-name">${m.name}</h3>
            <p class="mentor-card-meta">${m.age} yrs &middot; ${m.home.split(",").pop().trim()}</p>
          </div>
        </div>
        <span class="skill-badge">${m.skill}</span>
        <p class="mentor-card-bio">${m.bio}</p>
        <div class="mentor-card-stats">
          <span><strong>${m.years}</strong> yrs exp</span>
          <span><strong>${m.rating}</strong> rating</span>
          <span><strong>${m.sessions}</strong> sessions</span>
        </div>
        <a href="#profile-${m.id}" class="btn btn-ghost" data-nav>View Profile</a>
      </article>
    `;
  }

  function renderFeatured() {
    const el = document.getElementById("featured-mentor-grid");
    el.innerHTML = MENTORS.slice(0, 3).map(mentorCardHtml).join("");
  }

  /* ---------------- EXPLORE PAGE ---------------- */

  let activeSkillFilter = "All";
  let searchTerm = "";

  function renderChips() {
    const el = document.getElementById("skill-chips");
    const all = ["All", ...SKILLS];
    el.innerHTML = all
      .map(
        (s) =>
          `<button type="button" class="chip${s === activeSkillFilter ? " active" : ""}" data-skill="${s}">${s}</button>`
      )
      .join("");
    el.querySelectorAll(".chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeSkillFilter = btn.dataset.skill;
        renderChips();
        renderExploreGrid();
      });
    });
  }

  function renderExploreGrid() {
    const grid = document.getElementById("explore-mentor-grid");
    const empty = document.getElementById("explore-empty");
    const term = searchTerm.trim().toLowerCase();

    const filtered = MENTORS.filter((m) => {
      const matchesSkill = activeSkillFilter === "All" || m.skill === activeSkillFilter;
      const matchesSearch =
        !term || m.name.toLowerCase().includes(term) || m.skill.toLowerCase().includes(term);
      return matchesSkill && matchesSearch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = "";
      empty.hidden = false;
    } else {
      empty.hidden = true;
      grid.innerHTML = filtered.map(mentorCardHtml).join("");
    }
  }

  /* ---------------- PROFILE PAGE ---------------- */

  function renderProfile(id) {
    const view = document.getElementById("profile-view");
    const m = MENTORS.find((x) => x.id === id);

    if (!m) {
      view.innerHTML = `
        <a href="#explore" class="profile-back" data-nav>&larr; Back to the Squad</a>
        <p>We couldn't find that mentor on the team sheet.</p>
      `;
      bindNavLinks(view);
      return;
    }

    view.innerHTML = `
      <a href="#explore" class="profile-back" data-nav>&larr; Back to the Squad</a>
      <div class="profile-head">
        ${avatarHtml(m.name, "lg")}
        <div class="profile-head-text">
          <h1>${m.name}</h1>
          <p class="profile-head-meta">${m.age} yrs &middot; ${m.home}</p>
          <span class="skill-badge">${m.skill}</span>
        </div>
      </div>

      <div class="profile-stats">
        <div class="profile-stat">
          <span class="profile-stat-num">${m.years}</span>
          <span class="profile-stat-label">Years experience</span>
        </div>
        <div class="profile-stat">
          <span class="profile-stat-num">${m.sessions}</span>
          <span class="profile-stat-label">Sessions taught</span>
        </div>
        <div class="profile-stat">
          <span class="profile-stat-num">${m.rating}</span>
          <span class="profile-stat-label">Rating</span>
        </div>
      </div>

      <div class="profile-grid">
        <div>
          <div class="profile-bio">
            <h3>About ${m.name.split(" ")[0]}</h3>
            <p>${m.bio}</p>
          </div>
          <div class="reviews">
            <h3>What learners say</h3>
            ${m.reviews
              .map(
                (r) => `
              <div class="review-card">
                <span class="review-card-name">${r.name}</span>
                <p>${r.text}</p>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
        <aside class="profile-side">
          <h3>Ready to learn ${m.skill.toLowerCase()}?</h3>
          <p>Book a session with ${m.name.split(" ")[0]} — online or in person, your choice.</p>
          <button type="button" class="btn btn-primary" id="open-booking-btn">Book a Session</button>
        </aside>
      </div>
    `;

    bindNavLinks(view);
    document.getElementById("open-booking-btn").addEventListener("click", () => openBookingModal(m));
  }

  /* ---------------- BOOKING MODAL ---------------- */

  const modal = document.getElementById("booking-modal");
  const bookingFormView = document.getElementById("booking-form-view");
  const bookingConfirmView = document.getElementById("booking-confirm-view");
  const bookingForm = document.getElementById("booking-form");

  function openBookingModal(mentor) {
    bookingFormView.hidden = false;
    bookingConfirmView.hidden = true;
    bookingForm.reset();
    document.getElementById("bookingMentorId").value = mentor.id;
    document.getElementById("booking-mentor-name").textContent = mentor.name;
    document.getElementById("bookingDate").min = new Date().toISOString().split("T")[0];
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeBookingModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  document.getElementById("modal-close").addEventListener("click", closeBookingModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeBookingModal();
  });
  document.getElementById("booking-done-btn").addEventListener("click", closeBookingModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeBookingModal();
  });

  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const mentorId = document.getElementById("bookingMentorId").value;
    const mentor = MENTORS.find((m) => m.id === mentorId);
    const entry = {
      mentorId,
      mentorName: mentor ? mentor.name : "",
      name: document.getElementById("bookingName").value,
      date: document.getElementById("bookingDate").value,
      mode: document.getElementById("bookingMode").value,
      createdAt: new Date().toISOString()
    };
    pushToStorage("si_bookings", entry);

    document.getElementById(
      "booking-confirm-text"
    ).textContent = `You're booked with ${entry.mentorName} on ${entry.date} (${entry.mode}). A confirmation would normally be emailed to you here.`;
    bookingFormView.hidden = true;
    bookingConfirmView.hidden = false;
  });

  /* ---------------- REGISTER FORM ---------------- */

  const registerForm = document.getElementById("register-form");
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const entry = {
      homeName: document.getElementById("homeName").value,
      contactPerson: document.getElementById("contactPerson").value,
      contactPhone: document.getElementById("contactPhone").value,
      homeCity: document.getElementById("homeCity").value,
      residentName: document.getElementById("residentName").value,
      residentAge: document.getElementById("residentAge").value,
      residentSkill: document.getElementById("residentSkill").value,
      residentBio: document.getElementById("residentBio").value,
      createdAt: new Date().toISOString()
    };
    pushToStorage("si_registrations", entry);
    document.getElementById("register-success").hidden = false;
    registerForm.reset();
    document.getElementById("register-success").scrollIntoView({ behavior: "smooth", block: "center" });
  });

  /* ---------------- CONTACT FORM ---------------- */

  const contactForm = document.getElementById("contact-form");
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const entry = {
      name: document.getElementById("contactName").value,
      email: document.getElementById("contactEmail").value,
      message: document.getElementById("contactMessage").value,
      createdAt: new Date().toISOString()
    };
    pushToStorage("si_messages", entry);
    document.getElementById("contact-success").hidden = false;
    contactForm.reset();
  });

  /* ---------------- SEARCH INPUT ---------------- */

  document.getElementById("mentor-search").addEventListener("input", (e) => {
    searchTerm = e.target.value;
    renderExploreGrid();
  });

  /* ---------------- SCOREBOARD COUNT-UP ---------------- */

  function animateScoreboard() {
    const cells = document.querySelectorAll(".score-num");
    cells.forEach((cell, i) => {
      let target = Number(cell.dataset.count);
      if (i === 1) target = totalSessions(); // "Sessions Played" derived from mock data
      const duration = 1100;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        cell.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  /* ---------------- NAV / ROUTING ---------------- */

  const navToggle = document.getElementById("nav-toggle");
  const mainNav = document.getElementById("main-nav");
  navToggle.addEventListener("click", () => {
    const open = mainNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  function bindNavLinks(scope) {
    (scope || document).querySelectorAll("[data-nav]").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function setActiveNav(route) {
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.toggle("active", link.dataset.route === route);
    });
  }

  function route() {
    const hash = (location.hash || "#home").replace("#", "");
    const [base, param] = hash.split("-");

    const pages = document.querySelectorAll(".page");
    pages.forEach((p) => p.classList.remove("active"));

    let activeRoute = base;
    let matched = document.getElementById(`page-${base}`);
    if (!matched) {
      matched = document.getElementById("page-home");
      activeRoute = "home";
    }
    matched.classList.add("active");

    if (base === "profile") {
      renderProfile(param);
    }
    if (base === "explore") {
      renderChips();
      renderExploreGrid();
    }

    setActiveNav(activeRoute === "profile" ? "explore" : activeRoute);
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  window.addEventListener("hashchange", route);

  /* ---------------- INIT ---------------- */

  document.addEventListener("DOMContentLoaded", () => {
    renderFeatured();
    bindNavLinks(document);
    route();
    animateScoreboard();
  });
})();
