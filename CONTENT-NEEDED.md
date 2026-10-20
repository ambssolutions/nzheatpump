# What we still need from the client

The site is built and works today. Send these and they go in without a redesign. Anything in `assets/business.js` shows up on every page as soon as it's filled in.

## Must have before launch
| Need | Goes in |
|---|---|
| Exact business name and spelling (site uses "NZ Heat Pump Services") | Header, footer, titles and JSON-LD on every page; `assets/business.js` `name` |
| Logo as a vector file (SVG, AI or PDF) and its exact colours | Header and footer wordmark, `assets/img/mark.svg` favicon, colour tokens at the top of `assets/site.css` |
| Phone number | `assets/business.js` `phone` and `phoneTel` (turns on the Call links, the phone quick bar and the footer) |
| Email for enquiries | `assets/business.js` `email` |
| Form delivery (we set up Web3Forms or Formspree to that email) | `assets/business.js` `formEndpoint`, `web3formsKey` |
| Confirm the list of services, and anything to add or remove | `index.html` (two trades), `heat-pumps.html`, `electrical.html` |
| Confirm the towns you cover, or where you don't go | `index.html` map section, `faq.html` first answer |
| Domain name | README launch steps |

## Nice to have
| Need | Goes in |
|---|---|
| Check the rough sizing guide's settings suit how you size (watts per square metre for each insulation level, plus 20% for high ceilings and 10% for frosty inland spots) | `assets/site.js` section 6b, `index.html` sizing guide |

### More
| Need | Goes in |
|---|---|
| Photos of your own jobs, vans and team (we'll swap out the stock photos) | `assets/img/` |
| Business address or base town, if you want it shown | `assets/business.js` `address` |
| Hours | `assets/business.js` `hours` |
| Licence or registration line you want shown (e.g. registered electrical business details) | `assets/business.js` `ewrb` |
| Up to two customer reviews, with each customer's permission | `assets/business.js` `reviews` |
| Heat pump brands you install, if you want them named | `assets/business.js` `brands` (turns on the brand chips on the heat pumps page) |
| Whether site visits and quotes are free | `index.html`, `faq.html` |
| Warranty you give on your own workmanship | `faq.html`, `index.html` install stage 04 |
| A short story about who you are, for an About section | New section or page |
