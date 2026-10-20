# NZ Heat Pump Services: website

A fast, hand-built static website for a heat pump and electrical business working across the Waikato. Built by AMBS Solutions.

Preview locally from this folder: `python3 -m http.server`, then open http://localhost:8000. Deploys to Vercel from `main` (repo root is the site root).

## Pages
| Page | What's on it |
|---|---|
| `index.html` | Frost-to-warm hero with service rail, ticker, services showcase (six animated scenes), sizing for a Waikato winter with the "Too small / Sized right" room demo, how an install goes (sticky stacked cards), Healthy Homes heating for landlords, in-the-field photos, Waikato River map (towns link to the form), reviews (hidden until supplied), FAQ teaser, quote band |
| `heat-pumps.html` | Types of heat pump (spec table), replacing an old unit, servicing and repairs, signs it needs a look |
| `electrical.html` | Six electrical services (slow-fold cards), the CoC and ESC paperwork |
| `faq.html` | Eight questions with `FAQPage` data |
| `contact.html` | Enquiry form and contact details |
| `privacy.html` | Privacy Act 2020 statement |
| `404.html` | Not-found page |

## Files
- `assets/business.js`: the one place for phone, email, address, hours, licence line, reviews and the form endpoint. Empty values stay hidden on the site.
- `assets/site.css`, `assets/site.js`: shared styles and behaviour (menu, quick bar, folds, form, sizing demo, reveals).
- `assets/fonts/`: self-hosted Archivo and IBM Plex Sans.
- `assets/img/`: WebP photos in `-800` and `-1600` sizes (illustrative stock photos from Unsplash) and `mark.svg` (placeholder favicon).
- `vercel.json`: main-only deploys, clean URLs, security headers, `noindex` until launch.

## Checks run (20 October 2026, version 2)
- axe-core WCAG 2.2 AA on every page, light and dark, phone and laptop: 0 violations.
- No text overlap or horizontal scroll at 390×844, 1280×720, 1366×768, 1440×900 and 1536×864. No console errors or broken links.
- Lighthouse, home page, local server with compression, middle of 3 runs: phone Performance 99 (FCP 0.8 s, LCP 1.8 s, TBT 0 ms, CLS 0), laptop 100 (LCP 0.5 s, CLS 0). Accessibility 100, Best Practices 100. SEO 63 only because the preview is `noindex` on purpose; it goes to 100 at launch.

## Things to finish before launch
1. Everything in `CONTENT-NEEDED.md`, starting with the business name, logo, phone and email.
2. Wire the form: set `formEndpoint` and `web3formsKey` in `assets/business.js`, then send a real test enquiry.
3. Domain, then add `canonical` and `og:url` to every page, make `og:image` an absolute URL, and add `sitemap.xml`.
4. Remove `noindex`: the meta tag on every page, the `X-Robots-Tag` header in `vercel.json`, and change `robots.txt` to allow crawling with the sitemap line.
5. Add the phone, address and URL to the JSON-LD on `index.html`.
6. GA4 if wanted (load it 1.5 s after page load), and mention it on the privacy page.
7. Real favicon and share image from the logo.
8. Permission for any reviews and job photos used.
9. Run the speed check again on the live site.
