# Prompts Log

> Chronological log of prompts given to Claude Code on the Alloq theme work.
> Newest entries at the bottom. See `CLAUDE.md` for template and rules.

### [2026-06-18] — Move MD files to docs/ folder

**Prompt:**
can we structure the MD files in a seperate folder and make sure you can still find them

**Tokens / files touched:**
- CLAUDE.md (all `docs/` path references updated)
- DECISIONS.md → docs/DECISIONS.md
- NAMING_CONVENTION.md → docs/NAMING_CONVENTION.md
- PROMPTS.md → docs/PROMPTS.md

**Outcome:**
Moved DECISIONS.md, NAMING_CONVENTION.md, and PROMPTS.md into a new `docs/` folder. Updated all references in CLAUDE.md to use `docs/` prefixed paths. CLAUDE.md stays in the root so Claude Code auto-loads it.

**Related decision:** n/a

---

### [2026-06-16] — Initialize Claude Code documentation

**Prompt:**
Create a readme file for Claude Code to track prompts and a separate decision log. Scope is theme optimization, not building new things.

**Tokens / files touched:**
- CLAUDE.md (new)
- PROMPTS.md (new)
- DECISIONS.md (new)

**Outcome:**
Created scoped operating manual for theme-optimization work, plus prompt and decision log starters.

**Related decision:** DEC-001

---

### [2026-06-16] — Correct monospace font to Roboto Mono

**Prompt:**
we use roboto mono instead of jetbrainz

**Tokens / files touched:**
- CLAUDE.md
- `tokens.css` — `--font-family-mono` value

**Outcome:**
Replaced all JetBrains Mono references with Roboto Mono across docs. Token value in `tokens.css` should be updated to `roboto-mono, monospace`.

**Related decision:** DEC-002

---

### [2026-06-16] — Add light theme to scope

**Prompt:**
In scope is also light theme.

**Tokens / files touched:**
- CLAUDE.md (scope + non-negotiables)

**Outcome:**
Moved light theme from out of scope to in scope. Removed the "dark-first, no light theme" non-negotiable.

**Related decision:** DEC-003

---

### [2026-06-16] — Dual-theme token architecture

**Prompt:**
the goal is to build a system that works good for light and dark theme. So we need to have good token names that work both ways or a system that helps to define it

**Tokens / files touched:**
- CLAUDE.md (token architecture section + non-negotiables)
- DECISIONS.md (DEC-003 superseded, DEC-004 added)
- `tokens/primitives.css` · `tokens/semantic.css` · `tokens/themes/dark.css` · `tokens/themes/light.css` (target file structure)

**Outcome:**
Adopted a two-layer token system: primitives (palette values, never used in components) + semantic aliases (role-based names, used everywhere). Theme files remap semantic → primitive per theme. Components now reference only semantic tokens.

**Related decision:** DEC-004

---

### [2026-06-16] — Align token naming with Primer patterns

**Prompt:**
Lets continue with the changes. I want it more aligned with default patterns. Write our decision in the decision log. Create a structure that we can apply. DO NOT invent new styling. Also, Replace Jet brainz for Robot Mono.

**Tokens / files touched:**
- DECISIONS.md (DEC-005 added)
- PROMPTS.md
- All 6 HTML page files — token renames in `:root` block and all usages throughout

**Outcome:**
Renamed 27 tokens across 6 HTML files to align with Primer's naming patterns: surface tokens gained `--color-` prefix; `--surface-border` moved to `--color-border-default`; feedback tokens adopted `emphasis`/`muted` vocabulary; text and accent base tokens gained explicit `-primary` qualifier; `--color-active` → `--color-interactive-active`. Added `--color-border-focus` semantic alias (no new value). Fixed `--font-family-mono` from `jet-brains-mono` to `roboto-mono` (DEC-002 compliance).

**Related decision:** DEC-005

---

### [2026-06-16] — Replace JetBrains Mono font files with Roboto Mono

**Prompt:**
Replace jetbrainz mono for Roboto mono, update the fontface

**Tokens / files touched:**
- `assets/fonts/` — removed 4 JetBrains Mono static woff2 files; added `RobotoMono-VariableFont_wght.woff2` and `RobotoMono-Italic-VariableFont_wght.woff2`
- `assets/css/fonts.css` — replaced 4 static `@font-face` rules with 2 variable-font rules (weight range `100 700`)

**Outcome:**
Downloaded Roboto Mono variable font (v31) from Google Fonts CDN (latin subset). Replaced 4 static JetBrainsMono woff2 files with 2 variable-font woff2 files. `@font-face` now declares `font-weight: 100 700` with `tech(variations)`. `font-family: roboto-mono` is unchanged — no component or token changes needed.

**Related decision:** DEC-002 (Roboto Mono as the monospace font, now fully applied)

---

### [2026-06-16] — Rename feedback tokens to status

**Prompt:**
ok lets go with status

**Tokens / files touched:**
- `assets/css/tokens.css` — all `--color-feedback-*` renamed to `--color-status-*`
- `assets/css/components/tag.css` — references updated
- All 6 HTML files — all `--color-feedback-*` references updated

**Outcome:**
`--color-feedback-` prefix replaced with `--color-status-` across all files. No values changed. "Status" better describes the role of these colors in a financial context (entity state) vs "feedback" (UI response to user action).

**Related decision:** DEC-006

---

### [2026-06-16] — Extract tag component styles to shared CSS file

**Prompt:**
I want to improve the colors of the tags in the light and dark theme. Lets start from monitoring html. I want the tag styling to be in a separate css file that we include in the html's or a generic style.css for example. Move the styling from the tags to this file, after that we're going to improve the tokens and styling

**Tokens / files touched:**
- `assets/css/components/tag.css` (new)
- All 6 HTML files — two inline tag `<style>` blocks removed, link to `tag.css` added

**Outcome:**
Created `assets/css/components/tag.css` with unscoped selectors (Vue `[data-v-25027605]` scoping removed). Renamed component-local vars from `--accent-color-muted`/`--accent-color-raised` to `--tag-bg`/`--tag-color` for clarity. Tag styles now live in one place. Next step: improve tag tokens and colors for light/dark.

---

### [2026-06-16] — Fix tag variable naming and improve dark mode tag colors

**Prompt:**
it seems like the tag-color changes the background and tag-bg changes the color of the text → (fix naming) → for the tag in dark theme i want the tag bg to be a tint darker in each status and the tag color for the text a few tints lighter

**Tokens / files touched:**
- `assets/css/tokens.css` — added `--color-status-*-bg` / `--color-status-*-on` tokens (Layer 2, adaptive via `light-dark()`)
- `assets/css/components/tag.css` — replaced `--tag-muted`/`--tag-emphasis` + `light-dark()` in component with `--tag-bg`/`--tag-on` referencing the new adaptive tokens

**Outcome:**
Two problems fixed in one pass. (1) Naming: `--tag-muted`/`--tag-emphasis` were confusing because `light-dark()` in the component swapped which value went where per theme. Renamed to `--tag-bg`/`--tag-on` — but the real fix is that `light-dark()` now lives inside the tokens, not the component, so the names are always accurate. (2) Dark mode colors: dark bg changed from near-black emphasis values to slightly deeper tinted darks (`#1f2d5c` → `#141d3e` for info etc.); dark text changed from near-white muted values to vivid status-hued colors (`#f4f5f7` → `#84c8ff` for info etc.). Light mode values unchanged.

**Related decision:** DEC-007

---

### [2026-06-16] — Extract font-face declarations to shared CSS file

**Prompt:**
Im still seeing font faces in the heading of the html files. Is that also good to put in the tokens or different css file? Looks alot like duplicate code → yes

**Tokens / files touched:**
- `assets/css/fonts.css` (new)
- All 6 HTML page files — `@layer generic { @font-face { ... } }` block removed, `<link rel="stylesheet" href="assets/css/fonts.css" />` added

**Outcome:**
Created `assets/css/fonts.css` with the 6 shared `@font-face` declarations (Inter variable + Roboto Mono/JetBrains files). Removed the duplicate inline font-face block from all 6 HTML files. Each HTML head now has two shared CSS links: `fonts.css` then `tokens.css`.


---

### [2026-06-16] — Token naming convention audit and cleanup

**Prompt:**
analyze the tokens. How is the naming convention, can something be improved? → yes improve, rename and put in the decision log

**Tokens / files touched:**
- `assets/css/tokens.css` — renamed 11 tokens, moved `--color-link` to Layer 2 section
- `assets/css/components/input.css` — 27 occurrences updated
- `assets/css/components/notification.css` — 3 occurrences updated (accent vars upgraded to `-icon` tokens)
- All 6 HTML files — ~69–70 occurrences each updated

**Outcome:**
Six naming violations fixed in one atomic pass. Primitives now consistently use `--palette-*`; Layer 2 fill tokens renamed from `--color-base-*` to `--color-fill-*`; `--icon-size` gained a scale suffix (`-m`); `--color-interactive-active` renamed to `--color-interactive-selected`; `--color-link` moved to the Layer 2 section and updated to reference palette tokens. Status base usages in components upgraded from the fixed primitive (`--palette-status-*`) to the theme-adaptive icon token (`--color-status-*-icon`).

**Related decision:** DEC-009

---

### [2026-06-16] — Input fields: white background in light mode

**Prompt:**
For the input fields in the light mode they look disabled. Just give them a white background.

**Tokens / files touched:**
- `assets/css/components/input.css` — `.form-input__control` and `.form-select__control`

**Outcome:**
Changed default background from `--color-surface-sunken` (`#eff5f7` in light) to `--color-surface-raised` (`#ffffff` in light, `#011b1e` in dark). Removed now-redundant `background-color: var(--palette-white)` overrides in focus states (default is already white). Also replaced residual `--palette-white/black` hardcodes in `option` elements with `--color-surface-raised` / `--color-text-primary`.

---

### [2026-06-16] — Primer alignment follow-up: four naming gaps

**Prompt:**
(After Primer token-names audit) 1. do it, 2. accent, 3. add them. 4. fix it

**Tokens / files touched:**
- `assets/css/tokens.css` — 10 emphasis/muted tokens moved to `--palette-*`; 5 icon tokens renamed to `--accent`; blue scale renamed `400/500 → 0/1`; 3 interactive state tokens added; `--color-status-info-accent` updated to reference palette
- `assets/css/components/input.css` — active/disabled states updated to interactive tokens; toggle unchecked bg updated
- `assets/css/components/tag.css`, `notification.css` — `*-icon` → `*-accent` rename
- All 6 HTML files — `*-icon` → `*-accent` rename

**Outcome:**
Layer 1 palette is now fully `--palette-*` (no `--color-` stragglers). Status accent tokens use the CSS-property-neutral `-accent` suffix. Interactive state family complete: `hover/active/disabled/selected`. Blue palette uses ordinal 0/1 scale matching the rest of Layer 1.

**Related decision:** DEC-010

---

### [2026-06-16] — Neutral selected state in light mode

**Prompt:**
im not a big fan of the blue ish grey on the light mode. Lets give it some more neutral look and feel in the light mode.

**Tokens / files touched:**
- `assets/css/tokens.css` — `--color-interactive-selected`

**Outcome:**
Light mode value changed from `#b0d6f5` (periwinkle blue, hue ~207°) → `var(--palette-light-6)` (`#cee2e7`, grey-teal, hue ~190°, saturation ~30%). Dark mode value `#28626a` unchanged.

---

### [2026-06-16] — Neutral surface-sunken color (less blue)

**Prompt:**
light-dark(#eff5f7, #010b0c) these are also bluish, make it more grey

**Tokens / files touched:**
- `assets/css/tokens.css` — `--palette-light-2`, `--palette-dark-6`

**Outcome:**
`--palette-light-2`: `#eff5f7` (hue 195°, sat 41%) → `#f2f2f2` (neutral grey, sat 0%)
`--palette-dark-6`: `#010b0c` (hue 186°, sat 85%) → `#0a0a0a` (neutral near-black, sat 0%)
Both only feed `--color-surface-sunken` — no other semantic tokens affected.

---

### [2026-06-16] — Neutralise light palette steps 3–6

**Prompt:**
palette 3–6 are still too blue. more grey

**Tokens / files touched:**
- `assets/css/tokens.css` — `--palette-light-3` through `--palette-light-6`

**Outcome:**
All four values desaturated to pure neutral greys, maintaining the same lightness stepping:
`--palette-light-3`: `#e7f1f3` → `#ebebeb`
`--palette-light-4`: `#deecef` → `#e5e5e5`
`--palette-light-5`: `#d6e7eb` → `#dedede`
`--palette-light-6`: `#cee2e7` → `#d6d6d6`
Downstream: border-default, surface-subtle, surface-elevated, surface-muted, and interactive-selected all now render neutral grey in light mode.

---

### [2026-06-16] — Extract bandwidth visualization to shared CSS component

**Prompt:**
i want to tweak the bandwidth visual, create a component in css, improve token naming where needed

**Tokens / files touched:**
- `assets/css/components/bandwidth.css` (new)
- All 6 HTML files — two inline style blocks removed, `<link>` to `bandwidth.css` added

**Outcome:**
Created `bandwidth.css` with `.bandwidth` (wrapper) and `.bandwidth-visualization` (SVG component). Visual tweaks:
- Introduced `--bw-range` component-local variable (like `--tag-accent` pattern) — status variants set only this, everything else inherits
- `__target` fill changed from `--color-fill-base` → `--bw-range`: target circle now matches range color, clarifying it is the goal within that range
- `__boundary` given `opacity: 0.35` — range reads as a zone rather than a solid block
- `__marker` fill: `--color-fill-base` → `--color-surface-raised` (more semantic); stroke: `--color-border-default` → `--color-text-primary`; stroke-width: `--border-s` → `--border-m` (more visible current-position indicator)
- `--bandwidth-visualization-width` renamed to `--bw-marker-w`

---

### [2026-06-16] — Create token naming convention doc

**Prompt:**
Make a naming convention.md and add it to the instructions. Make sure you're using the information from the github primer design system. Ive attached this earlier.

**Tokens / files touched:**
- `NAMING_CONVENTION.md` (new)
- `CLAUDE.md` — added to maintained-files table, non-negotiable #2, and start-of-task checklist

**Outcome:**
Created `NAMING_CONVENTION.md` documenting Alloq's token naming rules, grounded in Primer's token-naming guidance (https://primer.style/product/primitives/token-names/) and the project's accumulated decisions (DEC-004/006/009/010). Covers: the two-layer palette/semantic split, category-first vs Primer's property-first structure (a documented divergence), formatting rules, category & role vocabulary, Primer's approved variant words (default/muted/emphasis, rest/hover/active/disabled/selected, T-shirt sizes), the status `-bg`/`-fg`/`-accent` suffix system, component-local variable rules, and a pre-commit checklist. Referenced from CLAUDE.md as the authority for naming any token.

**Related decision:** DEC-011

---

### [2026-06-16] — Fix removable tag overridden by button styles

**Prompt:**
the button class seems to override the removable tag class, now the styling is not as expected

**Tokens / files touched:**
- `assets/css/components/tag.css`

**Outcome:**
Added `.button.tag.tag--removable` (specificity 0,3,0) override block to `tag.css`. Root cause: `tag.css` loads before the inline Button.vue `<style>` block; `.button[data-v-17ebb602]` (0,2,0) won at equal specificity due to later source order. Three-class selector beats the scoped button rule regardless of source order, restoring pill shape, `--color-surface-raised` background, `--color-border-default` border, `font-size: var(--font-size-xs)`, and normal font weight.

---

### [2026-06-16] — Create button.css component

**Prompt:**
lets create a new component in css for the button, check the token naming according to the naming conventions

**Tokens / files touched:**
- `assets/css/components/button.css` (new)
- All 6 HTML files — added `<link>` for button.css, removed inline Button.vue `<style>` block

**Outcome:**
Extracted Button.vue inline styles to `assets/css/components/button.css`. Naming convention fixes applied:
- `--btn-background-color` → `--btn-bg`
- `--btn-border-color` → `--btn-border`
- `--btn-box-shadow` → `--btn-shadow`
- `--btn-color` → `--btn-fg`
- `--btn-border-radius` absorbed into `--btn-radius`
- `--btn-border-size` removed; inlined as `var(--border-s)`
Removed Vue scoped attribute selectors (`[data-v-17ebb602]`) — not needed in a standalone CSS file. Flagged three primitive usages that have no current semantic equivalent: `--palette-dark-2` (default button background), `--palette-brand-secondary` (amber CTA), `--palette-dark-4` (text on primary button).

---

### [2026-06-16] — Subtle grey default button in light mode

**Prompt:**
I want a more subtle default button, based on grey palette, for the light theme

**Tokens / files touched:**
- `assets/css/tokens.css` — added `--color-surface-interactive`
- `assets/css/components/button.css` — `--btn-bg` updated, primitive comment reduced
- `NAMING_CONVENTION.md` — `interactive` added to surface category table

**Outcome:**
Added `--color-surface-interactive: light-dark(var(--palette-light-5), var(--palette-dark-2))`. Light mode: `#dedede` (neutral grey, subtle). Dark mode: `#03363d` (existing dark teal, unchanged). Default button `--btn-bg` updated from `--palette-dark-2` to the new semantic token. `--palette-dark-2` removed from the flagged-primitives comment.

**Related decision:** DEC-012

---

### [2026-06-16] — Lighter amber primary button in light mode

**Prompt:**
i want the button with brand color to be a tint more lighter on lightscreen

**Tokens / files touched:**
- `assets/css/tokens.css` — added `--color-accent-secondary`
- `assets/css/components/button.css` — all `--palette-brand-secondary` → `--color-accent-secondary`
- `NAMING_CONVENTION.md` — `secondary` added to accent category table

**Outcome:**
Added `--color-accent-secondary: light-dark(oklch(from var(--palette-brand-secondary) calc(l + 0.06) c h), var(--palette-brand-secondary))`. Light mode: perceptually lighter amber via oklch relative-color. Dark mode: original #ff9100. Replaced all four `--palette-brand-secondary` usages in button.css (primary bg, secondary border/fg, secondary hover bg).

**Related decision:** DEC-013

---

### [2026-06-16] — Pulsing glow animation on error tag

**Prompt:**
for the error tag i want a smooth, subte border animation. i want a radial border gradient in the error color to make it more stand out every 15s or so. Before creating, determine if you have an better alternative

**Tokens / files touched:**
- `assets/css/components/tag.css`

**Outcome:**
Recommended pulsing box-shadow glow over the requested radial gradient border (which would require a `::before` pseudo-element with `background-clip` layering — complex on a pill shape and hard to keep subtle). Added `@keyframes tag-negative-pulse`: ring expands from 0 to 6px and fades over the first 6% (~0.9s) of a 15s cycle, silent for the remaining ~14s. Uses `oklch(from var(--color-status-negative-accent) l c h / alpha)` for the transparent versions. Wrapped in `@media (prefers-reduced-motion: no-preference)` for accessibility.

Superseded by the next prompt — replaced with conic-gradient border comet.

---

### [2026-06-16] — Conic-gradient comet animation on error tag border

**Prompt:**
can we make the red color go move around the border path

**Tokens / files touched:**
- `assets/css/components/tag.css`

**Outcome:**
Replaced the ping animation with a conic-gradient comet that travels along the tag border. Technique: `::before` with `conic-gradient(from var(--tag-pulse-angle), ...)` masked to show only the 1px border ring via `mask-composite: exclude`. `@property --tag-pulse-angle` registers the angle as animatable so the browser can interpolate it inside the gradient. Comet shape: 60% invisible arc, soft fade-in, bright peak, quick fade-out. Keyframe: `0%→20%` rotates 0→360deg (3s), `20%→100%` holds at 360deg (12s idle). The 360→0 restart is seamless because both values land at the transparent section. Wrapped in `@media (prefers-reduced-motion: no-preference)`. Added `position: relative` to `.tag` base rule.

---

### [2026-06-16] — Create layout.css and extract LayoutApp.vue inline styles

**Prompt:**
make a general css file for layout. move the main body class towards that and integrate it in the html - also remove the border and decrease the padding to size - m

**Tokens / files touched:**
- `assets/css/components/layout.css` (new)
- All 6 HTML files (added `<link>` for layout.css, removed LayoutApp.vue inline `<style>` block)

**Outcome:**
Created `assets/css/components/layout.css` containing all layout classes extracted from the LayoutApp.vue inline style block (`.app`, `.app__header`, `.main`, `.main__header`, `.main__title`, `.main__header-content`, `.main__body`, `.app__sidebar`, `.action-bar`). Changes from the original: removed `border-bottom` from `.main__header` (the divider line between header and body), changed `.main__body` padding from `var(--length-xxl)` (1rem, length scale) to `var(--gutter-m)` (1rem, layout gutter scale — semantically correct for body-level spacing). Linked layout.css in all 6 HTML files after the last component CSS link. LayoutApp.vue inline `<style>` blocks removed from all 6 files.

---

### [2026-06-16] — Extract data-table.css and remove border

**Prompt:**
adjust the padding from the data table class to M and remove the border there

**Tokens / files touched:**
- `assets/css/components/data-table.css` (new)
- All 6 HTML files (added `<link>` for data-table.css, removed DataTable.vue inline `<style>` block)

**Outcome:**
Created `assets/css/components/data-table.css` from the DataTable.vue inline style block. Changes from original: removed `border: var(--border-s) solid var(--color-border-default)` from `.data-table`, changed `padding: var(--gutter-l)` → `padding: var(--gutter-m)`. Scoped Vue attributes (`[data-v-55f1f6ea]`) stripped — styles now apply by class selector only. DataTable.vue inline blocks removed from all 6 HTML files.

### [2026-06-18] — Fix resize handle position

**Prompt:**
the resize-handle is not next to the side pane but half way the page. fix that

**Tokens / files touched:**
- assets/css/components/layout.css

**Outcome:**
Added CSS Grid placement rule for `.resize-handle` inside `.app--sidebar` and `.app--resized`. An absolutely-positioned grid child with `grid-column` set uses that column's edges as its containing block, so `left: 0` now anchors the handle to the start of column 3 (the sidebar boundary) via `!important` override of the JS-calculated inline `left` value.

### [2026-06-18] — Default button: link blue text in light, white in dark

**Prompt:**
for the default button in light theme i want a link blue font instead of black. Keep it white in the dark mode

**Tokens / files touched:**
- assets/css/components/button.css (`--btn-fg` on base `.button`)

**Outcome:**
Changed default `--btn-fg` from `contrast-color(var(--btn-bg))` (auto black/white) to `light-dark(var(--color-accent-primary), var(--color-text-primary))`. Light mode: `--palette-blue-1` (#1c71e3). Dark mode: `--color-text-primary` (#ffffff). Variants (primary, secondary, text/icon-only, disabled) all override `--btn-fg` explicitly so they are unaffected.

### [2026-06-18] — Extend palette blue with surface tints for default button

**Prompt:**
lets extend the pallete blue with some new tints, i need a subtle tint for the default button in light mode instead of the grey palette

**Tokens / files touched:**
- assets/css/tokens.css (`--palette-blue-*`, `--color-accent-primary`, `--color-link`, `--color-status-info-accent`, `--color-surface-interactive`)

**Outcome:**
Extended blue palette from 2 to 4 steps. Existing blue-0/blue-1 shifted to blue-2/blue-3 (values unchanged). New blue-0 (#f0f5fe, whisper tint) and blue-1 (#dce8f8, soft tint) added. `--color-surface-interactive` light value changed from `--palette-light-5` (#dedede) → `--palette-blue-1` (#dce8f8). Contrast: 3.75:1 (passes 3:1 UI threshold).

**Related decision:** DEC-014

### [2026-06-18] — Fix broken --color-border-default token

**Prompt:**
i cant see my borders anywhere

**Tokens / files touched:**
- assets/css/tokens.css (`--color-border-default`)

**Outcome:**
Typo: `var(--palette-dark-)` was missing the step number, making the entire `light-dark()` value invalid → borders invisible in both themes. Fixed to `var(--palette-dark-0)` (#0b474f — lightest dark palette step, analogous to `--palette-light-6` on the light side).

### [2026-06-18] — Lighten default button bg for better contrast

**Prompt:**
contrast of the button is to low, can we use a lighter tint for the background

**Tokens / files touched:**
- assets/css/tokens.css (`--color-surface-interactive`)

**Outcome:**
`--color-surface-interactive` light value: `--palette-blue-1` (#dce8f8) → `--palette-blue-0` (#f0f5fe). Contrast of #1c71e3 on new bg: 4.25:1 (was 3.75:1). Dark mode unchanged.

### [2026-06-18] — Extend blue palette to 6 steps; darker text on default button

**Prompt:**
use a darker blue for the text on the default button light mode, extend the pallete to 6 colors.

**Tokens / files touched:**
- assets/css/tokens.css (`--palette-blue-4/5` added; `--color-accent-primary`, `--color-link`, `--color-status-info-accent` light value blue-3 → blue-4)
- assets/css/components/button.css (comment updated)

**Outcome:**
Added `--palette-blue-4: #1255b8` and `--palette-blue-5: #0d3d8c`. Shifted `--color-accent-primary` (and co-references `--color-link`, `--color-status-info-accent`) from blue-3 (#1c71e3) → blue-4 (#1255b8) in light mode. Contrast improvements: button bg → 4.25:1 → 6.36:1; page bg → 4.43:1 → 6.64:1. Dark mode values unchanged.

**Related decision:** DEC-014 (palette extension); DEC-015 pending

### [2026-06-18] — Darker placeholder color in inputs

**Prompt:**
Placeholder values in input need a darker color for contrast

**Tokens / files touched:**
- assets/css/components/input.css (`::placeholder` default and `:focus` states)

**Outcome:**
Default `::placeholder`: `--color-text-secondary` (#8a9fa8, 2.76:1 on white) → `--color-text-muted` (#5a6a72, 5.62:1). Removed `:focus ::placeholder` override that applied `opacity: 0.6` on top of the failing color (~2.5:1 at focus). Focus state is still visually indicated by the `--color-accent-primary` border. Dark mode: 7.79:1 (was 3.98:1).

### [2026-06-18] — Tab active indicator: 2px → 1px border

**Prompt:**
make the border 1px of the tabs in below the top bar

**Tokens / files touched:**
- assets/css/components/tab.css

**Outcome:**
`border-bottom` changed from `--border-m` (2px) to `--border-s` (1px). `margin-bottom` compensation updated from `calc(-1 * var(--border-m))` to `calc(-1 * var(--border-s))` to keep the tab flush with the header line.

### [2026-06-18] — Tabs wrapper border-s, active tab indicator border-m

**Prompt:**
the active tab can be border m, but the tabs wrapper should be border s

**Tokens / files touched:**
- assets/css/components/tab.css

**Outcome:**
Reverted active tab indicator back to `--border-m` (2px). Added `.tabs { border-bottom-width: var(--border-s) }` override to reduce the wrapper's bottom border from 2px to 1px (overriding the scoped Tabs.vue value). The active tab's 2px indicator now visually sits on a 1px baseline.

### [2026-06-18] — Subtler borders for nav, tabs, and structural layout

**Prompt:**
i want the border colors to be a bit more subtle for the nav, tabs, et.c

**Tokens / files touched:**
- assets/css/tokens.css (`--color-border-subtle` added)
- assets/css/components/layout.css (nav right border, header bottom border → subtle)
- assets/css/components/tab.css (.tabs wrapper border-bottom-color → subtle)
- docs/NAMING_CONVENTION.md (border category updated)

**Outcome:**
Added `--color-border-subtle: light-dark(--palette-light-4, --palette-dark-1)`. Light: #e5e5e5 (was #d6d6d6). Dark: #073e46 (was #0b474f). Applied to `.app__header` right border, `.main__header` bottom border, and `.tabs` bottom border. `--color-border-default` unchanged for component borders (inputs, cards).

### [2026-06-18] — Tab indicator: border-s default, border-m active only

**Prompt:**
make the class tab border-s. ONLY active should have border M

**Tokens / files touched:**
- assets/css/components/tab.css

**Outcome:**
Added `border-bottom-width: var(--border-m)` to `.tab.is-active`. Base `.tab` keeps `border-s`. The existing `margin-bottom: calc(-1 * var(--border-m))` on the base rule already offsets for the active tab's 2px indicator.

### [2026-06-18] — Clean up tab border-bottom redundancy

**Prompt:**
could you please check the css here, there are 3 border bottoms defined

**Tokens / files touched:**
- assets/css/components/tab.css

**Outcome:**
Introduced `--tab-indicator` component variable (default `--border-s`, active `--border-m`). Single `border-bottom` declaration on `.tab` driven by that variable. `.tabs` wrapper collapsed from two longhands to one shorthand. `.is-active` now only sets `--tab-indicator` and `border-color` — no separate `border-bottom-width`. `margin-bottom` kept fixed at `calc(-1 * var(--border-m))` to avoid layout shift when toggling active state.

### [2026-06-18] — Remove border-m from active tab; all indicators border-s

**Prompt:**
the border of the tabs is to thick again.

**Outcome:**
Removed `--tab-indicator: var(--border-m)` override from `.tab.is-active`. All tab indicators now use `--border-s` (1px) consistently. The active state is indicated by color only (`--palette-brand-secondary`).

### [2026-06-18] — Active tab: border-m indicator

**Prompt:**
BUT FOR THE ACTIVE MAKE IT THICKER

**Outcome:**
Added `border-bottom-width: var(--border-m)` to `.tab.is-active`. Fixed invalid `border-size::` (wrong property, double colon) that the linter had introduced.

### [2026-06-18] — Extract Tabs/TabPanels inline styles to tab.css

**Prompt:**
check if the tabs css is still in the html's, and link them towards the css file

**Tokens / files touched:**
- assets/css/components/tab.css (`.tabs`, `.tabs--pill`, `.tab-panels` added)
- All 6 HTML files (Tabs.vue and TabPanels.vue scoped `<style>` blocks removed)

**Outcome:**
Found scoped `.tabs[data-v-71c72351]` and `.tab-panels[data-v-aa7eda8c]` blocks in all 6 files. Merged them (unscoped) into tab.css — `display`, `flex-wrap`, `background-color` from Tabs.vue; `.tabs--pill` variant; `.tab-panels` grid. Removed the inline blocks from all 6 HTML files. The external `<link>` to tab.css was already present in all files.

### [2026-06-18] — Lighten surface-raised in dark mode

**Prompt:**
the raised surface tint in dark mode should be a bit higher

**Tokens / files touched:**
- assets/css/tokens.css (`--color-surface-raised`)

**Outcome:**
Dark value: `--palette-dark-4` (#011b1e) → `--palette-dark-3` (#022b31). One step lighter on the dark palette ramp. Light mode unchanged.

### [2026-06-18] — Input background: dark-6 in dark mode

**Prompt:**
the inputs in dark mode need a dark background, pattern 6

**Tokens / files touched:**
- assets/css/tokens.css (`--color-surface-field` added)
- assets/css/components/input.css (all `--color-surface-raised` → `--color-surface-field`)
- docs/NAMING_CONVENTION.md (`field` added to surface roles)

**Outcome:**
Added `--color-surface-field: light-dark(--palette-light-0, --palette-dark-6)`. Light: #ffffff (same as raised). Dark: #0a0a0a (near-black). Used for all input backgrounds (text inputs, selects, option elements). `--color-surface-raised` (dark-3) remains for cards/panels.
