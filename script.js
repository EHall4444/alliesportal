const title = document.getElementById('title');
let clickCount = 0;
let clickTimer = null;

title.addEventListener('click', () => {
  clickCount += 1;

  clearTimeout(clickTimer);
  clickTimer = setTimeout(() => {
    clickCount = 0;
  }, 2000);

  if (clickCount >= 5) {
    clickCount = 0;
    clearTimeout(clickTimer);
    rainGoats();
  }
});

function rainGoats() {
  const goatCount = 40;

  for (let i = 0; i < goatCount; i++) {
    const goat = document.createElement('span');
    goat.className = 'goat';
    goat.textContent = '🐐';
    goat.style.left = `${Math.random() * 100}vw`;
    goat.style.fontSize = `${1 + Math.random() * 2}rem`;

    const duration = 2 + Math.random() * 2;
    const delay = Math.random() * 1.5;
    goat.style.animationDuration = `${duration}s`;
    goat.style.animationDelay = `${delay}s`;

    goat.addEventListener('animationend', () => goat.remove());
    document.body.appendChild(goat);
  }
}

/* ---------- Countdown ---------- */

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// Next occurrence of a fixed month/day, rolling forward a year if it's already passed.
function nextAnnualDate(month, day, now) {
  const today = startOfDay(now);
  let candidate = new Date(now.getFullYear(), month - 1, day);
  if (candidate < today) {
    candidate = new Date(now.getFullYear() + 1, month - 1, day);
  }
  return candidate;
}

// Nth occurrence of a weekday in a given month (0=Sun...6=Sat), 1-indexed n.
function nthWeekdayOfMonth(year, monthIndex, weekday, n) {
  const first = new Date(year, monthIndex, 1);
  const offset = (weekday - first.getDay() + 7) % 7;
  const day = 1 + offset + (n - 1) * 7;
  return new Date(year, monthIndex, day);
}

function nextNthWeekday(monthIndex, weekday, n, now) {
  const today = startOfDay(now);
  let candidate = nthWeekdayOfMonth(now.getFullYear(), monthIndex, weekday, n);
  if (candidate < today) {
    candidate = nthWeekdayOfMonth(now.getFullYear() + 1, monthIndex, weekday, n);
  }
  return candidate;
}

// Anonymous Gregorian algorithm (Meeus/Jones/Butcher).
function computeEaster(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function nextEaster(now) {
  const today = startOfDay(now);
  let candidate = computeEaster(now.getFullYear());
  if (candidate < today) {
    candidate = computeEaster(now.getFullYear() + 1);
  }
  return candidate;
}

// Eid al-Fitr follows the lunar Islamic calendar, so it shifts ~11 days earlier
// each Gregorian year. These are widely-cited estimates and can be off by a day
// depending on moon sighting.
const EID_AL_FITR_DATES = [
  new Date(2025, 2, 30),
  new Date(2026, 2, 20),
  new Date(2027, 2, 9),
  new Date(2028, 1, 26),
  new Date(2029, 1, 14),
  new Date(2030, 1, 4),
  new Date(2031, 0, 24),
  new Date(2032, 0, 14),
];

function nextEidAlFitr(now) {
  const today = startOfDay(now);
  const upcoming = EID_AL_FITR_DATES.find((d) => d >= today);
  if (upcoming) return upcoming;

  // Fallback beyond the known list: keep stepping back ~11 days per year.
  let candidate = EID_AL_FITR_DATES[EID_AL_FITR_DATES.length - 1];
  while (candidate < today) {
    candidate = new Date(candidate.getFullYear() + 1, candidate.getMonth(), candidate.getDate() - 11);
  }
  return candidate;
}

const ALASTAIR_BIRTH_YEAR = 2020;

const COUNTDOWN_EVENTS = [
  {
    name: "First Day of School",
    icon: "🎒",
    getNextDate: (now) => nextAnnualDate(9, 2, now),
  },
  {
    name: "Halloween",
    icon: "🎃",
    getNextDate: (now) => nextAnnualDate(10, 31, now),
  },
  {
    name: "Thanksgiving",
    icon: "🦃",
    getNextDate: (now) => nextNthWeekday(10, 4, 4, now),
  },
  {
    name: "Christmas",
    icon: "🎄",
    getNextDate: (now) => nextAnnualDate(12, 25, now),
  },
  {
    name: "Eid al-Fitr",
    icon: "🌙",
    getNextDate: (now) => nextEidAlFitr(now),
  },
  {
    name: "New Year's Day",
    icon: "🎉",
    getNextDate: (now) => nextAnnualDate(1, 1, now),
  },
  {
    name: "Easter",
    icon: "🐣",
    getNextDate: (now) => nextEaster(now),
  },
  {
    name: "Alastair's Birthday",
    icon: "🎂",
    getNextDate: (now) => nextAnnualDate(5, 19, now),
    getDetail: (date) => `Turns ${date.getFullYear() - ALASTAIR_BIRTH_YEAR}!`,
  },
  {
    name: "Last Day of School",
    icon: "🏖️",
    getNextDate: (now) => nextAnnualDate(6, 19, now),
  },
  {
    name: "Mother's Day",
    icon: "💐",
    getNextDate: (now) => nextNthWeekday(4, 0, 2, now),
  },
  {
    name: "Father's Day",
    icon: "🎣",
    getNextDate: (now) => nextNthWeekday(5, 0, 3, now),
  },
  {
    name: "4th of July",
    icon: "🎆",
    getNextDate: (now) => nextAnnualDate(7, 4, now),
  },
];

function getSortedUpcoming(now) {
  return COUNTDOWN_EVENTS
    .map((event) => ({ ...event, date: event.getNextDate(now) }))
    .sort((a, b) => a.date - b.date);
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function renderCountdown() {
  const now = new Date();
  const upcoming = getSortedUpcoming(now);
  const [next, ...rest] = upcoming;

  const msLeft = Math.max(0, next.date - now);
  const days = Math.floor(msLeft / 86400000);
  const hours = Math.floor((msLeft % 86400000) / 3600000);
  const mins = Math.floor((msLeft % 3600000) / 60000);
  const secs = Math.floor((msLeft % 60000) / 1000);

  document.getElementById("next-icon").textContent = next.icon;
  document.getElementById("next-name").textContent = next.name;
  document.getElementById("next-days").textContent = pad2(days);
  document.getElementById("next-hours").textContent = pad2(hours);
  document.getElementById("next-mins").textContent = pad2(mins);
  document.getElementById("next-secs").textContent = pad2(secs);
  document.getElementById("next-detail").textContent = next.getDetail
    ? next.getDetail(next.date)
    : "";

  const list = document.getElementById("upcoming-list");
  list.innerHTML = "";
  rest.slice(0, 3).forEach((event) => {
    const daysUntil = Math.ceil((startOfDay(event.date) - startOfDay(now)) / 86400000);
    const li = document.createElement("li");
    li.className = "countdown-item pixel-panel";
    li.innerHTML = `
      <span class="countdown-item-icon">${event.icon}</span>
      <span class="countdown-item-name">${event.name}</span>
      <span class="countdown-item-days">${daysUntil} day${daysUntil === 1 ? "" : "s"}</span>
    `;
    list.appendChild(li);
  });
}

renderCountdown();
setInterval(renderCountdown, 1000);
