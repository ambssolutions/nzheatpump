# NZ Heat Pump Services website: notes for Claude

Built by AMBS Solutions. Follow the **ambs-website-design** skill. These are the house rules that matter most for this owner.

## Working style
- Work locally and show screenshots or a short video first. Publish to the live site only when the owner says "push live".
- Never lose a working feature when changing things (form leads, booking, phone links). Start from the latest live version.
- Deploy only `main`.

## Design rules the owner always checks
- Everything fits the screen: 390×844 phones and 1280×720 / 1366×768 / 1440×900 / 1536×864 laptops. No overlapping text, and the hero fits the first screen.
- Centre-align section headings, intros, the hero, the footer and menus. Keep tick lists, FAQs, timelines and forms left-aligned.
- One type scale across all pages, with calm, readable fonts.
- Real logo (vector), and all accent colours taken from the logo. No glow, haloes, highlighter bands or white outer shadows.
- Native motion only: CSS sticky stacking cards (opaque, heading pinned, each card's number and title showing), slow smooth opens (~1.4s), no scroll-jacking or JS pinning, no count-ups, tilt or zoom. Respect reduced motion.
- Declutter: one headline and one main action in the hero; few cards, chips and arrows.
- Doesn't look AI-generated: plain NZ English, no em dashes, no exclamation marks, no hype words, no "X. One Y." headings, no eyebrow on every section.
- Real, sharp, uncropped photos (WebP with srcset). Smooth on phones: no live backdrop-blur.
- Header stays visible while scrolling. On phones, a small Call / Book bar that hides while the hero shows.
- Dark mode (if offered) built properly, including menus and overlays. It never switches by time of day.
- Forms really send. Contact details live in one place. Never invent facts: hide what the client hasn't supplied (`CONTENT-NEEDED.md`).
- Footer credit: "Proudly designed by AMBS Solutions".

## This site
- **Client:** NZ Heat Pump Services, heat pumps and electrical work across the Waikato. Working name until the client confirms it.
- **Design idea:** "the live wire". Warm limestone paper, deep river-green ink, copper accent. Square corners and hairlines, no pills or shadows. A copper wire feeds each home-page section and ends in a terminal; current (a small spark) runs along it. Must stay clearly different from Delta Air (another AMBS heat pump client). Ideas taken from Delta Air, redrawn in this site's own style: the rough sizing guide (copper meter inside the winter section, not a separate calculator app), the "what a standard install includes / can add to the price" scope, brand chips, and the photo tip on the contact form. Not taken: prices and specials, warranty years, stat tiles, the giveaway bar. Those need the client's real facts.
- **Signature motion:** hero "frost to warm" intro (frost layer thaws, warm light rises, headline warms from frost blue to white word by word) with a numbered service rail; a ticker of services and towns; the services showcase (story bars, autoplay with pause, six animated SVG scenes on a dark panel, benchmarked against MiKia's showcase); wire sparks; the "Too small / Sized right" room demo; sticky install stages with line vignettes; the Healthy Homes thermometer; curtain-wipe photo reveals; the Waikato River map with a spark running down the river (each town links to the form with the town filled in). Only transform, opacity, clip-path and colour. The hero headline is never hidden (it is the LCP text). Scenes only animate on the shown slide and while on screen.
- **Dark mode:** `html[data-theme=dark]` overrides tokens only, set before first paint from `nzhp-theme` or the visitor's system setting. Never by time of day. Toggle in the header (in the menu on phones). Check every change in both themes.
- **Stack:** static HTML, one stylesheet `assets/site.css`, one script `assets/site.js`, no build step. Preview with `python3 -m http.server`.
- **Content lives in:** business facts (phone, email, address, hours, licence line, reviews, form endpoint) in `assets/business.js`, the one source. Empty values stay hidden via `data-need`. Page copy is in each HTML file.
- **Shared parts:** the header, footer and quick bar are repeated in every page. Change all seven pages together. The 404 page uses root paths (`/assets/…`).
- **Fonts:** self-hosted in `assets/fonts/` (Archivo 700 with width 75–90, IBM Plex Sans 400–600), both preloaded.
- **Form endpoint:** none yet. Set `formEndpoint` (and `web3formsKey`) in `assets/business.js`.
- **Languages:** English (NZ).
- **Home page:** `/` is the concept gallery for now (`/concepts` redirects to it). The Live Wire homepage is `designs/04-live-wire/index.html`, and the inner pages link home to it. When the client picks a concept, that concept becomes `/`.
- **Indexing:** the preview is `noindex` (meta tag, `X-Robots-Tag`, robots.txt) until launch.
- **Things to finish before launch:** see README.md.
