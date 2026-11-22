# Marc Coronel's site

A single-page site for Marc Coronel, written in his voice. The story runs like a fight card, in rounds. It's plain HTML, CSS and JS with no build step.

```
index.html              markup and all copy
assets/css/main.css     styling
assets/js/main.js       motion and behaviour
assets/img/photos/      photography (WebP, one JPEG), see "Photo sources"
assets/img/logos/       partner and press logos
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

Navy and gold. There's no cream left anywhere. The dark sections sit on `--night #081425`. The sections that used to be paper now sit on a lighter navy (`#0F2240`), and a block near the end of `main.css` ("NAVY + GOLD") swaps the paper and ink tokens inside them, so the older rules still read correctly. Gold is `--gold #E0B23A`, and green (`--green-l`) shows up in small labels.

Headlines are Archivo, condensed and heavy. Italic emphasis is Instrument Serif. Labels and dates are JetBrains Mono. The small sizes are tokens too (`--fs-label` up to `--fs-body`), which is how the accessibility panel enlarges them all in one go.

On desktop the cursor is a boxing glove. Click and it throws a jab. Touch devices keep their normal cursor, and anyone who finds the glove annoying can turn it off in the accessibility panel.

---

## Page flow

| # | Section | What it does |
|---|---|---|
|  | Loader | "MARC" over four navy shutters, with "TEDx Speaker / Healthcare Consultant / Patient Advocacy Strategist / The Kidney Fighter" playing one at a time. Click, Escape or Enter skips it, and repeat visits in the same session get a shorter version. |
| 00 | Hero | Marc "The Kidney Fighter" Coronel. Four photos: Marc smiling at a mic, the TEDx stage, the NephCure summit and a studio portrait. They're monochrome until the cursor paints colour back in, and press-and-hold floods the colour and widens the panel under the pointer. The kicker reads "TEDx Speaker / Healthcare Consultant / Patient Advocacy Strategist", in that order. |
| 01 | Who I am | A manifesto whose words light up as you scroll, with three photo "pills" in the text. Then a portrait, a short intro, four key facts and "My ethos". The old "As featured by" strip is gone because the logo carousel already covers it. |
| 02 | From the road | A pinned gallery. Nine photos fly toward you as you scroll: legislators, congressional meetings, TEDx, California Life Sciences, the Rare Disease Caucus and a clinical team. Marc is in every one. There are no patient-event photos here, on purpose. |
|  | Four ways to read me | Fighter, Speaker, Patient Advocate, Strategist. Hovering a line shows a photo that follows the cursor, and the row fills gold. |
|  | The pause | The CDC "1 in 7" statistic, then a quote. |
| 03 | Twelve rounds | Vertical scroll drives a horizontal track of twelve rounds: Athlete, Diagnosis, Fall, Chair, Search, Gift, Comeback, Voice, Boardroom, Law, Research, Record. Round 8 (The Voice) has a "Watch the talk" button that plays the TEDxLogan Circle talk in a lightbox. Round 12 is the Team SoCal photo, shown whole over a blurred copy because the original is small. Story mode: rest on a round for about 2 seconds (a ring fills on the photo) and it opens full screen. Any scroll, key or click closes it, and the photo zooms back into its card. |
|  | The hinge | A small frame scales up to fill the screen: "The transplant wasn't the ending. It was the proof." Below it, a Capitol photo beside the UCLA Health quote. |
| 04 | The receipts | A close-up of Marc with his gold medal next to 966, then four counters in a row (34–0, 10 hrs, 3, 2). There's no race statistic. Then "Recognition & record", which now goes back to 2013 with entries from 2019, 2022 and 2023. Beside it is a sticky photo, and below it "Who I've worked with", with logos. No pharma company is named anywhere on the site. |
| 05 | In my words | A quote carousel (11 seconds a quote) with a photo of Marc that changes with each quote. Below it, a slow carousel of logos (no names) and linked headlines. |
| 06 | Writing | A draggable shelf of his ten latest LinkedIn articles as typographic cards. |
| 07 | What I've built | The Kidney Fighter Show, the Kidney Fighter Method, @kidney_fighter, and the Nephluence Project as one project among them. Marc is the brand. Nephluence isn't the umbrella anymore. |
| 08 | Work with me | Speak, Consult, Advocate, plus four signature talks. The first talk links to the video. |
| 09 | Contact | A portrait at the top, then the booking form, direct links, and the closing line. |

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
| Brand logos | Real logos now, in `assets/img/logos/`, each on a white tile. They came from Wikimedia Commons or the organization's own site. The TEDx mark is a redrawn wordmark. Using press and partner logos like this is common, but get each organization's OK before launch. Renal Support Network has no logo file, so it was dropped from the lists. |
| Testimonials | None are on the page, because none could be verified. Every quote is Marc's own words from published interviews. Add organizer or client quotes as extra `.quote` figures once they're approved. |

---

## Confirm with Marc

1. Battle soundtrack. The sound button still plays a calm generated pad. If he wants something harder (drums, a fight-night build), it's a change to `sound()` in `main.js`.
2. 2024. I couldn't find a sourced 2024 milestone, so the record jumps from 2023 to 2025. Add one if he has it.
3. "Launched The Kidney Fighter Show, 2019." Apple Podcasts lists the show as active since 2019. Confirm the year.
4. "Speaker, World Kidney Day educational webinar, Mar 2022." UCLA's July 2022 article says "recently in March", so the year is inferred.
5. American Red Cross is listed as a "community health partner". Confirm the wording (the old honoree line is gone).
6. Round 1 photo (`ch-athlete`). It's a podcast-set photo, and the person the round frames may not be Marc.
7. Several new photos are small (240–640px wide), so some look soft when they're shown big. Higher-resolution originals from Marc would fix it: the Team SoCal photo (`r12-team`), the boardroom talk (`r9-boardroom`), the fighter photo (`r-fighter`), the clinical team and congressional meeting (`g-clinicians`, `g-congress-table`) and the Assembly floor (`l-assembly`).
8. Gold medal. Confirm the event and "Team SoCal".
9. Kidney Fighter Method and Nephluence. Confirm the product names and what's on offer.
10. Signature talks 03 and 04. Confirm the titles he actually uses.

---

## Photo sources

Every photo shows Marc and comes from his own channels or press coverage of him. Confirm usage rights with Marc and the photographers before launch. `*-mono` files are pre-graded monochrome copies for the hero's cursor reveal, made ahead of time so no CSS filters run while you scroll. `m-*` files are the Index menu previews, pre-cropped 4:5 on Marc.

| Files | Source |
|---|---|
| `hero-tedx`, `g-sacramento`, `g-rare-caucus`, `bio-gallery`, `m-opening`, `m-impact`, `h-capitol` (crop of `m-impact`) | Voyage LA interview (Apr 2026) |
| `hero-summit`, `g-summit-2`, `ch-athlete`, `g-studio`, `g-hill-meeting`, `g-hill-group`, `m-room`, `m-services`, `m-platform` | Bold Journey interview (Apr 2025) |
| `ch-pills`, `ch-couch`, `ch-luggage`, `g-senate-group`, `g-asn` | Marc's LinkedIn |
| `r-tedx-walk`, `r-hill-day`, `g-capitol-meeting`, `ch-dialysis`, `h-hospital-walk`, `l-tedx-stage`, `metric-medal` (close-up crop of his medal photo) | Marc's earlier site draft |
| `portrait-studio`, `portrait-black`, `m-intro`, `g-tedx-wide`, `hero-studio-mono` | TEDxLogan Circle |
| `ch-transplant`, `m-rounds`, `pill-fox` | FOX 11 Los Angeles |
| `hero-mic`, `hero-fireplace`, `r-fighter`, `r-strategist`, `r8-tedx`, `r9-boardroom`, `r12-team`, `g-life-sciences`, `g-office-meeting`, `g-clinicians`, `g-congress-table`, `l-assembly`, `q-conversation` | Photos Marc supplied in Nov 2026 |
| `q-capitol`, `q-tedx`, `q-portrait`, `pill-face` | Crops of `g-sacramento`, `hero-tedx` and `portrait-studio` |

Marc asked that no other brand compete with his name, and that no pharma company be shown, so photos with pharma backdrops (Genentech, Takeda) weren't used. The polo-shirt portraits and the laptop photo are gone because they read as an employee, not a consultant. The shirtless boxing photo and the Filipino American History Month photos are gone too.

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
| Led the City of LA FSGS Awareness Day proclamation | Marc's LinkedIn honors; Voyage LA |
| Guinness World Record, 966 donors and recipients, Denver 2026; gold medal | Marc's LinkedIn honors; CBS Colorado and Denver7 confirm the 966 figure |
| CJASN co-author, "A Patient's Perspective on Transportation and Dialysis Outcomes" (Aug 2025), indexed by the NIH National Library of Medicine | Marc's LinkedIn publications; PubMed |
| HuffPost, "A New Kind of Fight" (Dec 2013) | HuffPost |
| iHeartRadio, The Kidney Fighter Show | iHeartRadio podcast page |
| TEDx talk "How I found an organ donor through digital storytelling" | The talk's YouTube upload |
| YouTube channel `@TheKidneyFighter` | YouTube (the old `@KidneyFighterShow` handle returns 404) |
| NephCure Impact Award | Marc's LinkedIn honors |
| UCLA Health profile (Jul 13, 2022) and the March World Kidney Day webinar | UCLA Health news article |
| World Kidney Day patient story, "Always prepared for the unexpected" (Jun 20, 2023) | worldkidneyday.org |
| The Kidney Fighter Show active since 2019 | Apple Podcasts listing |
| "1 in 7 US adults…, as many as 9 in 10 don't know" | CDC, *Chronic Kidney Disease in the United States* |
| All quotes | Bold Journey, Voyage LA, UCLA Health and Marc's LinkedIn posts. All are verbatim. |

---

## Engineering notes

- Smooth scroll: Lenis drives smooth scrolling and syncs with ScrollTrigger. It re-measures on every ScrollTrigger refresh, because the pins add scroll distance after load.
- Font loading: all SplitText work waits for the web fonts (capped at 1.5s), so lines are measured correctly.
- Transitions: CSS transitions never touch a property GSAP animates. Card hovers use the independent `translate` property.
- Video: the TEDx talk loads from youtube-nocookie.com only when someone presses play, so the page doesn't load YouTube until it's needed. Any element with `data-video="<YouTube id>"` opens the lightbox.
- Small photos: a round image with `data-fit` (and `round__media--fit` on its figure) is shown whole over a blurred copy, in the card and in story mode.
- Story mode: the round card draws its photo 118% wide and slides it for parallax. Opening starts the big photo with that exact framing. Closing re-measures the card every frame, so the photo still lands if you keep scrolling, and it finishes on the card's own framing so you can't see the swap. Leaving the pinned section just closes it with no animation. The pin also holds for a short stretch (12% of the track) after R12 arrives. Without that hold you'd leave the section the moment the last round lands, and R12 would never open.
- Index menu: `.menu` keeps `visibility` for one second after closing (a delayed `visibility` transition), so the reverse animation can play.
- Loader: the shutters overlap by a pixel, so no hairline seams show between them. A CSS animation removes the loader after 7s even if the script never loads.
- Testing hooks: `?noloader` skips the title card. `?at=<section-id>` or `?at=<pixels>` jumps to a position after load. Useful for screenshots.
