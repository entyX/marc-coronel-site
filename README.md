# Marc Coronel's site

A single-page site for Marc Coronel, written in his voice. The story runs like a fight card, in rounds. It's plain HTML, CSS and JS with no build step.

```
index.html              markup and all copy
assets/css/main.css     styling
assets/js/main.js       motion and behaviour
assets/img/photos/      photography (WebP, one JPEG), see "Photo sources"
```

Preview locally:

```bash
python3 -m http.server 8000     # then open http://localhost:8000
```

To deploy, upload the folder to any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages). `.nojekyll` is already there for GitHub Pages.

It loads Google Fonts (Archivo, Instrument Serif, JetBrains Mono) and jsDelivr (GSAP 3.13 with ScrollTrigger and SplitText, plus Lenis 1.3). If either CDN is blocked, you get a static page that still reads fine top to bottom.

`marc-coronel-site-main.zip` is an old snapshot from an early commit. Nothing uses it, and it can go.

---

## Look and feel

Navy and warm paper, with gold for the fight and green for what came out of it (`--night #081425`, `--paper #F4F1EA`, `--gold #E0B23A`, `--green-d #1F6B4E`). On paper, gold text uses the darker `--gold-d #85600A` so it passes contrast. All colours are tokens at the top of `main.css`.

Headlines are Archivo, condensed and heavy. Italic emphasis is Instrument Serif. Labels and dates are JetBrains Mono. The small sizes are tokens too (`--fs-label` up to `--fs-body`), which is how the accessibility panel enlarges them all in one go.

On desktop the cursor is a boxing glove. Click and it throws a jab. Touch devices keep their normal cursor, and anyone who finds the glove annoying can turn it off in the accessibility panel.

---

## Page flow

| # | Section | What it does |
|---|---|---|
|  | Loader | "MARC" over four navy shutters, with "A Fighter / A Speaker / A Strategist / A Patient Advocate" playing one at a time. Click, Escape or Enter skips it, and repeat visits in the same session get a shorter version. |
| 00 | Hero | Four photos: the roundtable, the TEDx stage, the NephCure summit and a smiling portrait. They're monochrome until the cursor paints colour back in, and press-and-hold floods the colour and widens the panel under the pointer. The kicker reads "TEDx Speaker / Health Equity Strategist / Healthcare Consultant". |
| 01 | Who I am | An "As featured by" strip (HuffPost, FOX 11, UCLA Health, American Kidney Fund, iHeartRadio, American Red Cross, TEDx, CJASN). Then a manifesto whose words light up as you scroll, with three photo "pills" in the text, a portrait, the publications paragraph, four key facts and "My ethos". |
| 02 | From the road | A pinned gallery. Nine event photos fly toward you as you scroll, and Marc is in every one. It sits near the start on purpose, so visitors see him in rooms with lawmakers and clinicians early. |
|  | Four ways to read me | Fighter, Speaker, Patient Advocate, Strategist. Hovering a line shows a photo that follows the cursor. Each line links deeper: Fighter → rounds, Speaker → talks, Advocate → receipts, Strategist → services. |
|  | The pause | The CDC "1 in 7" statistic, then a quote. |
| 03 | Twelve rounds | Vertical scroll drives a horizontal track of twelve rounds: Athlete, Diagnosis, Fall, Chair, Search, Gift, Comeback, Voice, Boardroom (Bayer, Texas), Law, Stage, Record. The background tone shifts from round to round, and the chapter buttons and arrow keys jump between rounds. Story mode: rest on a round for about 2 seconds (a ring fills on the photo) and it opens full screen. Any scroll, key or click closes it, and the photo zooms back into its card, the opening played in reverse. Each round opens once per visit. |
|  | The hinge | A small frame scales up to fill the screen: "The transplant wasn't the ending. It was the proof." Below it, a portrait beside the UCLA Health quote. |
| 04 | The receipts | Six counters that climb from zero when they come into view. 966 (Transplant Games, with the medal photo) is a tall tile with 34–0 and 10 hrs beside it, and 3 / 5× / 2 run along the bottom. Then "Recognition & record" (gold medal at the top) beside a sticky Capitol photo, and "Who I've worked with". The UCLA lead-ambassador role only appears in that list, marked "former". |
| 05 | In my words | A verbatim quote carousel with a photo of Marc beside it. Each quote has its own photo (`q-*`, cropped 4:5 on him), and the next one wipes up as the quote changes. Below that, a scrolling marquee of press and partners (each with a brand badge) and linked headlines. |
| 06 | Writing | A draggable shelf of his ten latest LinkedIn articles as typographic cards. |
| 07 | The Nephluence Project | Everything sits under Nephluence, and the brand is still Kidney Fighter. Cards: The Kidney Fighter Show (YouTube, iHeartRadio), The Kidney Fighter Method, @kidney_fighter, and "Get in touch, new generation". |
| 08 | Work with me | Speak, Consult, Advocate, plus four signature talks. |
| 09 | Contact | A portrait at the top, then the booking form (it now includes a "Next gen" option), direct links, and the closing line "The fight became a platform. Now let's move the room." |

Always on screen:

- Header: "Marc Coronel" on the left. On the right: "Skip story" (jumps to Work with me), Access, Sound, Index, and the gold "Book Marc" button.
- Skip link: "Skip to services" stays hidden until someone tabs to it with the keyboard, then shows as a gold pill.
- Index: a full-screen menu with a photo preview of the hovered section. Every section has its own preview. Opening grows a circle out of the button, and closing plays it backwards.
- Jump curtain: links to far-off sections drop four shutters, move instantly behind them, settle every scroll-driven animation, then lift. Short hops still smooth-scroll.
- Progress rail: a vertical progress line on the right with section ticks and the current section's name.
- Sound: off by default. It's a generated ambient chord pad with no audio files, and it only starts on click.

Below 900px wide, the horizontal track and the fly-through gallery become ordinary vertical layouts, and story mode is off. With `prefers-reduced-motion`, everything is static.

---

## Accessibility

The Access button in the header opens a panel. Choices are saved on the visitor's device and applied before the page paints, so nothing flickers on reload.

- Text size: Default, Large, Largest
- High contrast
- Underline links
- Pause moving text (marquees and the closing line)
- Standard cursor (turns off the glove)
- Reduce motion (reloads the page, because the pinned scenes are built once at start-up)

Also: a keyboard skip link, visible focus rings, `aria-*` on the menu, panel and form, and alt text on every content photo.

---

## Replace before launch

Search the repo for `REPLACE`.

| What | Where |
|---|---|
| Booking email | `index.html`, `.contact__direct`. It's currently `hello@marccoronel.com`. The form's mailto fallback reads it from this link. |
| Form endpoint | `<form id="bookForm" action="#">`. While `action` is `#`, the form opens the visitor's mail client pre-filled. Point it at Formspree, Basin or a CRM to post directly. |
| Brand logos | The "featured by" strip and the marquee use coloured badges with initials (`.pm__mark`), not official logos. Once each organization clears its logo, drop the file into its `.pm__mark`. |
| Testimonials | None are on the page, because none could be verified. Every quote is Marc's own words from published interviews. Add organizer or client quotes as extra `.quote` figures once they're approved. |

---

## Confirm with Marc

1. Round 1 photo (`ch-athlete`). It's a podcast-set photo from Bold Journey, and the person the round frames may not be Marc. Swap in a training or boxing photo if so.
2. 966 photo. The stat asked for a photo of the donors and recipients together. The only one available is Marc alone with his medal.
3. Bayer, Texas (Round 9). Confirm the wording and that Bayer is fine being named.
4. Gold medal. Confirm the event and "Team SoCal".
5. The Fall (Round 3). It's written around a collapse at home followed by the ER. That comes from earlier coverage, so check the wording.
6. UCLA wording. "CORE Kidney Program, former lead patient ambassador" appears only under "Who I've worked with".
7. Kidney Fighter Method and Nephluence. Confirm the product names, what's on offer, and podcast links (Apple and Spotify are listed but not linked).
8. Signature talks. Talks 03 and 04 ("From Patient to Policy", "The Patient in the Room") are framed from his advocacy and consulting work. Confirm the titles he actually uses.
9. Portrait session source. `hero-portrait`, `h-portrait`, `headshot` and `m-contact` all come from one portrait session. Confirm the photographer credit.

---

## Photo sources

Every photo shows Marc and comes from his own channels or press coverage of him. Confirm usage rights with Marc and the photographers before launch. `*-mono` files are pre-graded monochrome copies for the hero's cursor reveal, made ahead of time so no CSS filters run while you scroll. `m-*` files are the Index menu previews, pre-cropped 4:5 on Marc.

| Files | Source |
|---|---|
| `hero-tedx`, `ch-tedx-room`, `g-sacramento`, `g-rare-caucus` (California Rare Disease Caucus), `bio-gallery` (re-cropped to centre Marc), `m-opening`, `m-writing`, `m-impact` | Voyage LA interview (Apr 2026) |
| `hero-summit`, `g-summit-2`, `ch-athlete`, `g-studio`, `g-hill-meeting`, `g-hill-group`, `m-room`, `m-services`, `m-platform` | Bold Journey interview (Apr 2025) |
| `hero-roundtable`, `ch-pills`, `ch-couch`, `ch-luggage`, `g-laptop`, `g-panel`, `g-senate-group`, `g-nephcure-team`, `g-asn`, `g-filam`, `m-words` (crop of `g-filam`), `g-ucla-team` (cropped above a UCLA Health logo podium) | Marc's LinkedIn (article covers and posts) |
| `r-boxing`, `r-tedx-walk`, `r-hill-day` (cropped to remove a NephCure caption), `g-capitol-meeting`, `ch-dialysis`, `h-hospital-walk`, `l-tedx-stage`, `hon-transplant-games` | Marc's earlier site draft (marccolnel.lovable.app) |
| `portrait-studio`, `portrait-black`, `m-intro`, `g-tedx-wide` | TEDxLogan Circle (speaker graphics; video thumbnail) |
| `ch-transplant`, `m-rounds`, `pill-fox` | FOX 11 Los Angeles |
| `q-filam`, `q-capitol`, `q-roundtable`, `q-tedx`, `q-portrait` | Crops of `g-filam`, `g-sacramento`, `hero-roundtable`, `hero-tedx` and `portrait-studio` for the quote photos |
| `hon-capitol` (cropped on Marc) | American Kidney Fund |
| `hero-portrait`, `h-portrait`, `headshot`, `m-contact` | Portrait session (see "Confirm with Marc") |

Marc asked that no other brand compete with his name, so photos with logo podiums or event captions were cropped, and the ones a crop couldn't fix were swapped out. The photo with a clinician is gone for the same reason.

---

## Fact sourcing

| Claim | Source |
|---|---|
| FSGS diagnosis in 2011 at 26, found during a physical for insurance | Marc's LinkedIn articles; UCLA Health; American Kidney Fund |
| Health and wellness trainer on Hollywood film sets | Bold Journey |
| Amateur boxer, three-hour sessions, Pacquiao and Mayweather tapes | UCLA Health |
| 10–15 medications a day | UCLA Health |
| 18 months of dialysis, 67 books | American Kidney Fund |
| Waitlisted in CA, AZ, MD and NY | American Kidney Fund |
| 33 people offered a kidney | Bold Journey (Marc's own words). FOX 11 reported 32. |
| Sister asked two friends; Shawna Robinson, a medical coder at the same hospital, came forward; approval took about a year | FOX 11; UCLA Health |
| Transplant Dec 10, 2019 at UCLA | FOX 11; UCLA Health |
| Three laps around the hospital within 10 hours of surgery; home in three days | American Kidney Fund |
| SCR 87 (2025, adopted 34–0) and HR 113 (2026) | California Legislature (SCR 87 roll call confirmed via LegiScan); Marc's LinkedIn honors |
| FSGS rates up to 5× higher in Black Americans, stated in SCR 87 | SCR 87 text (LegiScan) |
| Led the City of LA FSGS Awareness Day proclamation | Marc's LinkedIn honors; Voyage LA |
| Guinness World Record, 966 donors and recipients, Denver 2026; gold medal | Marc's LinkedIn honors; CBS Colorado and Denver7 confirm the 966 figure |
| CJASN co-author, "A Patient's Perspective on Transportation and Dialysis Outcomes" (Aug 2025), indexed by the NIH National Library of Medicine | Marc's LinkedIn publications; PubMed |
| HuffPost, "A New Kind of Fight" (Dec 2013) | HuffPost |
| iHeartRadio, The Kidney Fighter Show | iHeartRadio podcast page |
| TEDx talk "How I found an organ donor through digital storytelling" | The talk's YouTube upload |
| YouTube channel `@TheKidneyFighter` | YouTube (the old `@KidneyFighterShow` handle returns 404) |
| NephCure Impact Award; Red Cross Communication Achievement Award; World Kidney Day recognition | Marc's LinkedIn honors |
| "1 in 7 US adults…, as many as 9 in 10 don't know" | CDC, *Chronic Kidney Disease in the United States* |
| All quotes | Bold Journey, Voyage LA, UCLA Health and Marc's LinkedIn posts. All are verbatim. |

---

## Engineering notes

- Smooth scroll: Lenis drives smooth scrolling and syncs with ScrollTrigger. It re-measures on every ScrollTrigger refresh, because the pins add scroll distance after load.
- Font loading: all SplitText work waits for the web fonts (capped at 1.5s), so lines are measured correctly.
- Transitions: CSS transitions never touch a property GSAP animates. Card hovers use the independent `translate` property.
- Story mode: the round card draws its photo 118% wide and slides it for parallax. Opening starts the big photo with that exact framing. Closing re-measures the card every frame, so the photo still lands if you keep scrolling, and it finishes on the card's own framing so you can't see the swap. Leaving the pinned section just closes it with no animation.
- Index menu: `.menu` keeps `visibility` for one second after closing (a delayed `visibility` transition), so the reverse animation can play.
- Loader: the shutters overlap by a pixel, so no hairline seams show between them. A CSS animation removes the loader after 7s even if the script never loads.
- Testing hooks: `?noloader` skips the title card. `?at=<section-id>` or `?at=<pixels>` jumps to a position after load. Useful for screenshots.
