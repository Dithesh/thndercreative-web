# Thunder Creatives — website v2 (ingamana-style)

Single page, plain HTML/CSS/JS, no build step. Only external dependency: **Lenis** (smooth scroll) from jsDelivr
— the site still works without it.

## Run it
Open `index.html` directly, or serve the folder:

```bash
python -m http.server 5500   # → http://localhost:5500
```

## How it behaves
| Part | Behaviour |
|---|---|
| Header | Fixed, `mix-blend-mode: difference` so it stays readable over images |
| Wordmark (top + bottom) | “THUNDER ⚡ CREATIVES©” passes through a lens — a short magnified middle with slim letters on both sides; speeds up while scrolling |
| Project rows | A fixed stage acts like a camera zooming into the stack of rows: every scroll step multiplies the zoom, top rows rush up faster than the scroll, lower rows follow evenly, and the about section follows once the last row has arrived |
| Images | Grid tiles load light thumbnails from `assets/thumb/` (regenerate if you replace an image in `assets/img/`) |
| Tile hover | Image zooms slightly; video projects play a muted preview |
| Click a tile | Dark popup: images/videos stack down the left and rise in one by one as you scroll; project details stay pinned on the right |
| Close | Click anywhere outside the images/details, press **Esc**, or “Close ✕” |
| Visited | After closing, that project gets a grey wash + thin cross + eye icon (remembered in the browser). Hover reveals it again |

## Editing content
* **Projects:** `js/data.js` — name, year, category, role, deliverables, description, cover image and the
  popup media blocks (`full(...)`, `panel(bg, ...)`, `vid(...)`). Order in the file = order in the rows.
* **Images:** `assets/img/` · **Videos:** `assets/video/` (compressed web copies of the originals in the parent folder)
* **Studio text (about / services / clients / contact):** `index.html`
* **Zoom feel:** in `measure()` in `js/app.js` — `acrossTop` / `acrossBottom` (tiles across for the row at the top / bottom of the screen), `pitch` (scroll distance per row: smaller = faster), `ROWS` (number of rows)
* **Wordmark look:** `LENS_MAX` (centre magnification), `LENS_WIDTH` (size of the magnified zone), `SIDE` / `SIDE_TAPER` (how slim the side letters start / how fast they thin out) in `js/app.js`

## Before going live — replace placeholders
* Phone `+91 00000 00000`, Instagram / LinkedIn / Behance links (`index.html`). Contact email is `info@thundercreatives.com`
* Project years, roles and deliverables in `js/data.js` are best guesses — confirm with the team
* Add real website-design projects (screenshots) — none were in the source folders
* Clear the visited state while testing: `localStorage.removeItem('tc-seen-projects')` in the browser console
