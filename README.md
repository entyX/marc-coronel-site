# Marc Coronel — personal site

A single-page site with no build step. Open `index.html` through any static server.

```
index.html              markup and all copy
assets/css/main.css     styling
assets/js/main.js       motion and behaviour
assets/img/photos/      real photography (WebP), see "Photo sources"
```

Preview locally:

```bash
python -m http.server 8000     # then open http://localhost:8000
```

Deploy by uploading the folder to any static host (Netlify, Vercel, Cloudflare Pages, S3).

**External requests:** Google Fonts (Archivo, Instrument Serif, JetBrains Mono) and
jsDelivr (GSAP 3.13 with ScrollTrigger and SplitText, plus Lenis 1.3). If a CDN is blocked,
the page falls back to a complete, static, readable document.

---

## Page flow

| # | Section | What it does |
|---|---|---|
| — | Loader | "MARC" on four shutters that echo the four panels of his LinkedIn banner. The four roles play one at a time; each is fully out before the next comes in. Click, Escape or Enter skips it. It's shorter on repeat visits in the same session. |
| 00 | Hero | Four moments, no captions. The panels are monochrome and the cursor paints colour back in. Press-and-hold floods the colour and expands the panel under the pointer. The fourth panel ("The Courage to Ask") is a full-bleed portrait that doesn't parallax. |
| 01 | Who he is | A manifesto whose words light up as you scroll, with photo "pills" inline, then a portrait and key facts. |
| 02 | Four ways to read him | Fighter, Speaker, Patient Advocate, Strategist. Hovering a line shows a photo that follows the cursor (fixed to the viewport, re-checked on scroll so it can't get stuck). Each row is a link: Fighter → rounds, Speaker → talks, Advocate → receipts, Strategist → services. |
| — | The pause | CDC statistic "1 in 7", then a quote. |
| 03 | Eight rounds | Vertical scroll drives a horizontal track. Each round moves from event to what it built. The background tone shifts round by round (darker through dialysis, dawn at the transplant). Chapter buttons and arrow keys jump between rounds. **Story mode:** rest on a round for ~4s (a ring fills on the photo) and it opens full-screen; any scroll, key or click closes it. Each round opens once per visit. |
| — | The hinge | A small frame scales up to full screen (scale, not clip, so it stays centred and sharp): "The transplant wasn't the ending. It was the proof." Then the post-transplant hallway photo beside the UCLA Health quote. |
| 04 | The receipts | Six counters, none of which repeat a number used earlier in the story, then a recognition list beside a sticky Transplant Games photo. |
| 05 | In the room | A pinned gallery where nine event photos (none used elsewhere) fly toward you as you scroll. |
| 06 | In his words | A verbatim quote carousel, a press marquee and linked headlines. |
| 07 | Writing | A draggable shelf of his ten latest LinkedIn articles as typographic cards (no cover photos, so no image repeats). |
| 08 | The platform | The Kidney Fighter Podcast, the Nephluence Project, the Kidney Fighter Method and @kidney_fighter. This is where the site leads into his products. |
| 09 | Work with Marc | Speak, Consult, Advocate, plus signature talks. |
| 10 | Contact | Booking form, direct links, and the closing line "The fight became a platform. Now let's move the room." |

**Persistent UI:**
- "Marc Coronel" top left.
- One filled red "Book Marc" button top right.
- A "Skip story" link.
- An Index menu covering the full screen, with a photo preview of the hovered section.
- A jump curtain: links to far-off sections drop four shutters, move instantly behind them, settle every scrubbed animation, then lift. Short hops still smooth-scroll.
- A progress rail with section ticks.
- Sound, off by default. It's a generated ambient chord pad with no audio files, and it only starts on click.
- A custom cursor on desktop only; touch devices keep the native cursor. A cursor label only appears where the element really does that thing.

Below 900px wide, the horizontal track and the fly-through gallery become ordinary vertical layouts. With `prefers-reduced-motion`, everything is static.

---

## Replace before launch

Search the repo for `REPLACE`.

| What | Where |
|---|---|
| **Booking email** | `index.html`, `.contact__direct`. It's currently `hello@marccoronel.com`. The form's mailto fallback reads it from this link. |
| **Form endpoint** | `<form id="bookForm" action="#">`. While `action` is `#`, the form opens the visitor's mail client pre-filled. Point it at Formspree, Basin or a CRM to post directly. |
| **Testimonials** | None are shipped, because none were available that could be verified. Quotes on the page are Marc's own words from published interviews. Add organizer or client quotes as extra `.quote` figures once they're approved. |

---

## Photo sources

Every photo is of Marc and comes from his own public channels or press coverage of him. Confirm usage rights with Marc and the photographers before launch.

| Files | Source |
|---|---|
| `hero-roundtable`, `ch-pills`, `ch-couch`, `ch-luggage`, `g-laptop`, `g-panel`, `g-senate-group`, `g-nephcure-team`, `g-asn`, `g-altadena`, `g-ucla-podium`, `g-filam`, `g-capitol-aerial` | Marc's LinkedIn (article covers and posts) |
| Four-panel hero layout, `hero-banner` | Marc's LinkedIn banner. LinkedIn only serves it at 800×199, so the hero rebuilds it from higher-resolution originals of the same moments. |
| `hero-tedx`, `ch-tedx-room`, `g-sacramento` | Voyage LA interview (Apr 2026) |
| `hero-fighter`, `r-boxing`, `r-tedx-walk`, `r-hill-day`, `g-capitol-meeting`, `ch-dialysis`, `h-hospital-walk`, `l-tedx-stage`, `hon-transplant-games`, `portrait-warm` | Marc's earlier site draft (marccolnel.lovable.app), carried over from the previous version of this repo |
| `hero-summit`, `g-summit-2`, `ch-athlete`, `g-studio`, `g-hill-meeting`, `g-hill-group` | Bold Journey interview (Apr 2025) |
| `portrait-studio`, `portrait-black` | TEDxLogan Circle speaker graphics |
| `g-tedx-wide` | TEDx talk video thumbnail (YouTube) |
| `ch-transplant` | FOX 11 Los Angeles |
| `ch-capitol` | American Kidney Fund |
| `g-ucla-core` | UCLA Health |

`*-mono` files are pre-graded monochrome copies used under the hero's cursor reveal. Grading them ahead of time means no CSS filters run while you scroll.

---

## Fact sourcing

| Claim | Source |
|---|---|
| FSGS diagnosis in 2011 at 26, found during a physical for insurance | Marc's LinkedIn articles; UCLA Health; American Kidney Fund |
| Health and wellness trainer on Hollywood film sets | Bold Journey |
| Amateur boxer, three-hour sessions, Pacquiao and Mayweather tapes | UCLA Health |
| 10–15 medications a day | UCLA Health |
| 18 months of dialysis, 67 books | American Kidney Fund |
| Three laps around the hospital within 10 hours of surgery; home in three days | American Kidney Fund |
| Donor's approval took about a year | FOX 11 |
| FSGS rates 4–5× higher in African Americans, stated in SCR 87 | SCR 87 text (LegiScan) |
| 33 people offered a kidney | Bold Journey (in Marc's own words). FOX 11 reported 32. |
| Waitlisted in CA, AZ, MD and NY | American Kidney Fund |
| Transplant Dec 10, 2019 at UCLA; donor Shawna Robinson | FOX 11; UCLA Health |
| SCR 87 (2025, adopted 34–0) and HR 113 (2026) | California Legislature (SCR 87 roll call confirmed via LegiScan); Marc's LinkedIn honors |
| Led the City of LA FSGS Awareness Day proclamation | Marc's LinkedIn honors; Voyage LA |
| Guinness World Record, 966 donors and recipients, Denver 2026 | Marc's LinkedIn honors; CBS Colorado and Denver7 confirm the 966 figure |
| TEDx talk title "How I found an organ donor through digital storytelling" | The talk's YouTube upload |
| YouTube channel `@TheKidneyFighter` | YouTube (the old `@KidneyFighterShow` handle returns 404) |
| NephCure Impact Award; Red Cross Communication Achievement Award; World Kidney Day recognition | Marc's LinkedIn honors |
| CJASN co-authorship; TEDxLogan Circle talk | Marc's LinkedIn publications |
| "1 in 7 US adults…, as many as 9 in 10 don't know" | CDC, *Chronic Kidney Disease in the United States* |
| All quotes | Bold Journey, Voyage LA, UCLA Health and Marc's LinkedIn posts. All are verbatim. |

### Confirm with Marc

1. **The Fall, round 3.** It's written around a collapse at home followed by the ER. That comes from earlier coverage; check the wording.
2. **The Kidney Fighter Method.** The name comes from the kidneyfighter-method concept site. The description comes from Bold Journey (workshops, writing, coaching). Confirm the product name and what's on offer.
3. **The Nephluence Project.** The description comes from the concept site. Add podcast platform links once they're live.
4. **Metrics.** If Marc tracks talks given, people reached, or patients matched with donors, those numbers are stronger than the current set. The 966 caption says he was in the count; confirm he was present for the record attempt.
5. **Signature talks.** Talks 03 and 04 ("From Patient to Policy", "The Patient in the Room") are framed from his advocacy and consulting work. Confirm the titles he actually uses.

---

## Engineering notes

- **Smooth scroll:** Lenis drives smooth scrolling and syncs with ScrollTrigger. Lenis re-measures on every ScrollTrigger refresh, because the pins add scroll distance after load.
- **Font loading:** all SplitText work waits for web fonts, with a 1.5s cap, so lines are measured correctly.
- **Transitions:** CSS transitions never touch a property GSAP animates. Card hovers use the independent `translate` property.
- **Loader failsafe:** a CSS animation removes the loader after 7s even if the script never loads.
- **Testing hooks:** `?noloader` skips the title card. `?at=<section-id>` or `?at=<pixels>` jumps to a position after load. These are handy for screenshots.
