// amStudios — site behaviour. No libraries, no build step.

// ── Edit these two lines before you publish ─────────────────────────────
const CONFIG = {
  // Briefs are emailed here by FormSubmit (free, no sign-up): https://formsubmit.co
  // The first brief sends an "Activate" email to this address; click it once.
  // FormSubmit then shows a random alias — paste it here instead of the email to hide the address.
  formTo: "manikpatel93@gmail.com",
  // Shown to visitors only if sending fails.
  contactEmail: "manikpatel93@gmail.com",
};
// ────────────────────────────────────────────────────────────────────────

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
document.getElementById("year").textContent = new Date().getFullYear();

// Sticky nav border + mobile menu
const nav = document.querySelector(".nav");
const toggle = document.querySelector(".nav__toggle");
const menu = document.getElementById("mobile-menu");
const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });
toggle.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!open));
  menu.hidden = open;
});
menu.addEventListener("click", (e) => {
  if (e.target.closest("a")) { menu.hidden = true; toggle.setAttribute("aria-expanded", "false"); }
});

// Reveal on scroll
const revealIO = new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); revealIO.unobserve(en.target); } });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll(".reveal").forEach((el) => revealIO.observe(el));

// Clips: load only when near the screen, play while visible, pause when not.
// With reduced motion the poster image stays and clips play on hover/tap only.
const clips = document.querySelectorAll("video[data-src]");
const load = (v) => { if (!v.src) { v.src = v.dataset.src; } };
const play = (v) => { load(v); const p = v.play(); if (p) p.catch(() => {}); };
if (!reduceMotion) {
  const clipIO = new IntersectionObserver((entries) => {
    entries.forEach(({ target: v, isIntersecting }) => (isIntersecting ? play(v) : v.pause()));
  }, { rootMargin: "120px 0px", threshold: 0.25 });
  clips.forEach((v) => clipIO.observe(v));
} else {
  document.documentElement.classList.add("rm");
  document.querySelectorAll(".shot, .tile").forEach((fig) => {
    const v = fig.querySelector("video");
    v.addEventListener("play", () => fig.classList.add("is-playing"));
    v.addEventListener("pause", () => fig.classList.remove("is-playing"));
    fig.addEventListener("mouseenter", () => play(v));
    fig.addEventListener("mouseleave", () => v.pause());
    fig.addEventListener("click", () => (v.paused ? play(v) : v.pause()));
  });
}

// Style filters
const chips = document.querySelectorAll(".chip");
const shots = document.querySelectorAll(".shot");
chips.forEach((chip) => chip.addEventListener("click", () => {
  chips.forEach((c) => { c.classList.toggle("is-active", c === chip); c.setAttribute("aria-selected", String(c === chip)); });
  const f = chip.dataset.filter;
  shots.forEach((s) => { s.hidden = f !== "all" && s.dataset.cat !== f; });
}));

// Count-up stats
if (!reduceMotion) {
  const statIO = new IntersectionObserver((entries) => {
    entries.forEach(({ target: el, isIntersecting }) => {
      if (!isIntersecting) return;
      statIO.unobserve(el);
      const end = +el.dataset.count, suffix = el.dataset.suffix || "", t0 = performance.now();
      const tick = (t) => {
        const k = Math.min(1, (t - t0) / 1200);
        el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))) + (k === 1 ? suffix : "");
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  });
  document.querySelectorAll("[data-count]").forEach((el) => statIO.observe(el));
}

// Pricing buttons pre-select the package in the form
document.querySelectorAll("[data-plan]").forEach((a) => a.addEventListener("click", () => {
  document.getElementById("package").value = a.dataset.plan.replace("&amp;", "&");
}));

// Contact form → FormSubmit (free) emails the brief to CONFIG.formTo
const form = document.getElementById("contact-form");
const status = form.querySelector(".form__status");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let ok = true;
  form.querySelectorAll("[required]").forEach((f) => {
    const bad = !f.value.trim() || (f.type === "email" && !/^\S+@\S+\.\S+$/.test(f.value));
    f.classList.toggle("is-invalid", bad);
    if (bad) ok = false;
  });
  if (!ok) { status.className = "form__status err"; status.textContent = "Please fill in your name, a valid email and a few words about the project."; return; }

  const data = Object.fromEntries(new FormData(form));
  if (data.botcheck) return; // spam bot filled the hidden box

  delete data.botcheck;
  const btn = form.querySelector("button[type=submit]");
  btn.disabled = true; status.className = "form__status"; status.textContent = "Sending…";
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${CONFIG.formTo}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        ...data,
        _subject: `New video brief from ${data.name} (${data.type})`,
        _replyto: data.email,
        _template: "table",
        _captcha: "false",
      }),
    });
    const json = await res.json();
    if (String(json.success) !== "true") throw new Error(json.message);
    form.reset();
    status.className = "form__status ok";
    status.textContent = "Thanks! Your brief is in — we'll reply within one business day.";
  } catch {
    status.className = "form__status err";
    status.textContent = `Something went wrong. Please email us at ${CONFIG.contactEmail}.`;
  } finally { btn.disabled = false; }
});
