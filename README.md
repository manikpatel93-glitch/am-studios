# amStudios website

A modern one-page site for amStudios — plain HTML, CSS and JavaScript. No build step, no paid tools, no monthly fees.

| File | What it is |
|---|---|
| `index.html` | All the page content (text, sections, pricing, FAQ) |
| `styles.css` | The look. Brand colours are at the top (`--mint`, `--pink`, `--violet`) |
| `main.js` | Clip playback, filters, menu, and the contact form. **Edit `CONFIG` at the top** |
| `media/` | 16 short muted clips + posters cut from the amStudio v2 demo, and `showreel.mp4` (about 10 MB in total) |
| `serve.mjs` | Local preview only: `node serve.mjs` → http://localhost:5173 |

## Before you publish (5 minutes)

1. **Contact form** — go to https://web3forms.com, enter the email where you want briefs to arrive, and paste the free access key into `main.js` → `CONFIG.web3formsKey`. Free plan: 250 messages a month. Also set `CONFIG.contactEmail` (shown if sending fails).
2. **Prices** — the Starter ($149) and Pro ($449) prices in `index.html` are placeholders. Change them to your real prices.
3. **Turnaround** — the FAQ says "3–7 days" for a 60 s explainer and "reply within 24 hours". Adjust if needed.

## Publish it for free

### Option A — Cloudflare Pages (recommended: unlimited bandwidth, commercial use OK)
1. Make a free account at https://dash.cloudflare.com.
2. **Workers & Pages → Create → Pages → Upload assets.**
3. Name the project `amstudios`, then drag this whole `amstudios-website` folder in.
4. You get a live address like `https://amstudios.pages.dev`. To update, upload the folder again.

### Option B — Netlify Drop (fastest)
Open https://app.netlify.com/drop and drag the folder in. Free plan has a monthly bandwidth limit, so videos count against it.

### Option C — GitHub Pages
Free, but GitHub's terms are aimed at non-commercial sites. Fine for testing, less ideal for a business.

### Your own domain (the only real cost)
A `.com` costs roughly $10–12 a year. Cloudflare Registrar sells domains at cost, and connects to Cloudflare Pages in a couple of clicks (Pages project → Custom domains).

## Later, if the site grows
- **Astro** (https://astro.build, free, open source) — move to it when you want a blog, case-study pages, or many pages sharing one layout. This page drops straight into an Astro project as `src/pages/index.astro`.
- **Decap CMS** or **Pages CMS** — free, open-source editors so you can change text without touching code.
- **Cloudflare Web Analytics** — free, privacy-friendly visitor stats, no cookie banner needed.

## Swapping clips
Put a new short muted MP4 (5 s, ~960 px wide) and a JPG poster in `media/`, then copy one `<figure class="shot">` block in `index.html` and change the file names, title and `data-cat` (explainer / doc / character / looks).
