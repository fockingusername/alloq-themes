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

### [2026-06-22] — Surface token audit (shared values across roles)

**Prompt:**
The table and the surface behind it should have the same background color. → use the raised color for that instead surface page → Situation: the surface colors have sometimes the same colors. Does it make sense that for example in light theme palette light-0 is in base and in raised?

**Tokens / files touched:**
- assets/css/tokens.css (`--color-surface-raised` dark reverted dark-4 → dark-3; Surfaces comment block expanded)
- docs/DECISIONS.md (DEC-016 added)
- docs/NAMING_CONVENTION.md (§4 surface row annotated with tier order)

**Outcome:**
Audited all 10 surface roles' resolved values in both themes. Finding: no token is a true duplicate — every apparent collision happens in only one theme and the roles diverge in the other (e.g. base/raised both white in light but split dark-5/dark-3 in dark), and colliding roles are never adjacent in the UI. So the shared values are intentional same-tier roles, not redundancy. Only genuine fault was a stray uncommitted nudge of `raised` dark (dark-3 → dark-4) shrinking its lift above `page`; reverted to dark-3. Documented the elevation ladder + the "same-tier shared value is intentional, the rule is raised>page" principle inline in tokens.css, in DEC-016, and in NAMING_CONVENTION §4. Net token-value change vs last commit: none.

**Related decision:** DEC-016

### [2026-06-22] — Extract inline main.css block to shared CSS files

**Prompt:**
check a - also make sure the styling from the html is moved to a component or generic styling file

**Tokens / files touched:**
- `assets/css/base.css` (new) — `@layer generic`: box-sizing reset, html/body/list/fieldset resets, color-scheme, accent-color
- `assets/css/elements.css` (new) — `@layer elements`: bare-element styles (a, abbr, blockquote, body, code, dl/dt/dd, h1–h6, hr, img, legend, p, small, textarea, scrollbar)
- `assets/css/utilities.css` (new) — `@layer utilities`: single-purpose helpers (.font-*, .content-*, .stack, .cell-fixed, .text-*, .visually-hidden)
- All 6 HTML files — inline `<style data-vite-dev-id="…main.css">` block (≈408 lines) removed; three `<link>` tags for base/elements/utilities added after tokens.css

**Outcome:**
The 408-line inline `main.css` style block that appeared in every HTML file has been extracted into three purpose-built CSS files (`base.css`, `elements.css`, `utilities.css`), matching the `@layer settings, generic, elements, utilities` order declared in `tokens.css`. `a` uses `--color-link` (semantic) — no change needed there. Net: ~2,448 lines removed from HTML, ~275 lines added across the three new files.

### [2026-06-22] — Move base table styles to table.css

**Prompt:**
check the html's, move all the table styling to table.css

**Tokens / files touched:**
- `assets/css/components/table.css` — base `table`, `thead`, `tbody`, `td/th`, `tfoot` styles added above the `.multilayered-table` block
- All 6 HTML files — identical 72-line `@layer elements { table { … } }` block removed from each

**Outcome:**
Extracted the shared base table styles (sticky thead, border-spacing, padding, `--sticky-cell-border` token, tfoot) from the inline `@layer elements` block in every HTML file and consolidated them into `table.css`. The `<link>` to table.css was already present in all files, so no head changes needed. Net: 432 lines removed from HTML, 72 lines added to table.css.

### [2026-06-22] — Table links inherit cell color

**Prompt:**
now make sure the table links are not in blue color anymore

**Tokens / files touched:**
- `assets/css/components/table.css` — added `a { color: inherit; }` inside `td, th` block

**Outcome:**
Links inside any table cell now inherit the cell's text color (`--color-text-primary`) instead of resolving to `--color-link` (blue). Applied at the base `td/th` level so it covers all tables, not just `.multilayered-table`.

### [2026-06-22] — Remove MLT depth fill ramp; add indent guides + bold parents

**Prompt:**
lets do the plain rules and the other recommandations

**Tokens / files touched:**
- `assets/css/components/table.css` — removed `:root { --color-table-start; --table-min-steps }` block and `background-color: oklch(...)` from `.multilayered-table tr`; added `td:first-child::before` indent guide lines; added `tr:has(.row-name__button) td:first-child { font-weight: bold }` for parent rows
- `docs/DECISIONS.md` — DEC-017 added

**Outcome:**
Replaced the per-depth oklch fill ramp with plain vertical indent guide lines in the sticky label column (`--color-border-subtle`, one line per ancestor, aligned to icon positions) and bold font weight on parent/group row labels. Both themes now show flat rows — maximum text contrast at all depths. Depth is encoded by indentation + guide count + bold. Numeric columns are completely untouched.

**Related decision:** DEC-017

### [2026-06-25] — Add experimental button variants for comparison

**Prompt:**
im still not happy with the look of the default button. I want you to add a few buttons to the screen so i can easily compare them. In dark mode make the background a transparent white color (keep same in light mode). Also make another one in lila, use the data color as a reference, different tints in light/dark. Also one with #D3FFB5 in different tints. Also one with just a blue line, no background, blue text.

**Tokens / files touched:**
- `assets/css/components/button.css` — added `.button--ghost`, `.button--lila`, `.button--lime`, `.button--line` under a new EXPERIMENTAL VARIANTS section
- `test - Mandates - Alloq.html` — added a button showcase `<section>` at the top of `.main__body`

**Outcome:**
Four comparison variants added so the default look can be evaluated against alternatives. Ghost = translucent white in dark / translucent neutral in light. Lila = data-2/data-3 purple, pale-lilac fill + deep purple text in light, translucent purple + periwinkle text in dark. Lime = #D3FFB5 solid pastel + deep green text in light, translucent lime + lime text in dark. Line = blue outline, no fill, blue text. Lime uses a raw hex (`--lime`) as no semantic/primitive token exists yet — flagged as experimental.

### [2026-06-25] — Adopt blue line as the default button; remove experimentals

**Prompt:**
Lets go for the blue line, make that the default. Delete all other variants. Make sure the naming conventions are set correctly.

**Tokens / files touched:**
- `assets/css/components/button.css` — base `.button` reworked to blue outline (transparent fill, `--color-accent-primary` border + text, no shadow; hover/active tint via `--btn-bg`); brighten + shadow hover/active and rest shadow moved onto `.button--primary` (also given `--btn-border: transparent`); deleted experimental `.button--ghost/--lila/--lime/--line` and the `--lime` raw-hex local var
- `test - Mandates - Alloq.html` — removed the temporary button showcase `<section>`
- `docs/DECISIONS.md` — DEC-018 added

**Outcome:**
The plain `.button` is now a blue outline app-wide. "Other variants" interpreted as the experimental comparison ones only — design-system variants (`--primary`, `--secondary`, `--text`, `--icon-only`, `--pill`, `--block`) were preserved since they are used across every page. Naming: removed the only convention violation (the `--lime` raw hex); remaining `--btn-*` locals reference Layer 2 tokens (plus the already-flagged `--palette-dark-4`/`--palette-black` on primary/shadows).

**Related decision:** DEC-018

### [2026-06-25] — Restore subtle card border in light mode

**Prompt:**
There are some inconsistency with the widget styling based on light and dark. Bring back the border in light modus to align. Make sure its a subtle border tho.

**Tokens / files touched:**
- `assets/css/components/card.css` — replaced the per-theme overrides (light `border-color: transparent`, dark `--color-border-subtle`) with a single `body[data-theme] .card { border-color: var(--color-border-subtle) }`

**Outcome:**
Cards (dashboard widgets) now show the same subtle border (`--color-border-subtle`) in both themes; light mode previously had `transparent` (elevation only) which read inconsistently against dark. Kept the `body[data-theme]` selector for specificity (0,2,1) so it beats Card.vue's scoped `.card[data-v-…]` (0,2,0) that loads later.

### [2026-06-25] — Accordion body uses a surface token instead of fill overlay

**Prompt:**
i dont like the color of the accordion within the dashboard widget. Can we use a palette color from the dark mode / light mode for that?

**Tokens / files touched:**
- `assets/css/components/disclosure.css` — `.disclosure[inverted='true']` `--bg-body-color`: `--color-fill-low` → `--color-surface-sunken`

**Outcome:**
The inverted disclosure (accordion) body inside cards previously used `--color-fill-low` (a 10%-alpha overlay) which looked muddy over the raised card surface. Swapped to the palette-backed `--color-surface-sunken` (light `#f2f2f2`, dark `#0a0a0a`) so it reads as a clean recessed panel per theme. Nested disclosures keep `--color-surface-raised` (pops back up against the sunken parent).

### [2026-06-25] — Primary button hover: brand-color tint

**Prompt:**
the hover state of the primary button should have a tint of the brand color.

**Tokens / files touched:**
- `assets/css/components/button.css` — `.button--primary:hover` background-color: `oklch(from var(--btn-bg) calc(l + 0.04) c h)` → `oklch(from var(--color-accent-secondary) calc(l + 0.08) calc(c * 0.9) h)`

**Outcome:**
The previous +0.04 lightness bump barely registered. Hover now produces a clearer lighter tint of the brand amber (`--color-accent-secondary`): L raised 0.08, chroma softened to 90% so it reads as a tint rather than just brighter. Active/pressed state unchanged.

### [2026-06-25] — Fainter subtle border in dark mode

**Prompt:**
can we make the subtle border in dark mode even more subtle

**Tokens / files touched:**
- `assets/css/tokens.css` — `--color-border-subtle` dark value: `var(--palette-dark-2)` → `oklch(from var(--palette-dark-2) calc(l - 0.025) calc(c * 0.7) h)`
- `docs/DECISIONS.md` — DEC-019 added

**Outcome:**
Dark-mode subtle border darkened (L 0.306 → 0.281) and desaturated (C 0.051 → 0.036) so it sits closer to the surfaces it borders. Stays just above the card surface (dark-3, L 0.265) so it remains visible on cards while reading fainter on page/nav. Light mode unchanged. Ripples through card/tab/nav/header/disclosure borders.

**Related decision:** DEC-019

### [2026-06-25] — Convert dark/light scheme toggle to an actual switch

**Prompt:**
i dont like the dark / light mode toggle, can we make that an actual toggle

**Tokens / files touched:**
- All 6 HTML files — replaced the `.scheme-toggle` icon `<button>` (moon icon + "Dark mode" label) with a `.form-toggle` switch (`<label>` wrapping `.form-toggle__control` + checkbox `.js-toggle` + `.form-toggle__value` text). Kept `header__actions-button scheme-toggle` classes for the header-menu row layout. Updated each inline `js-toggle` script from a `click` handler reading `data-theme` to a `change` handler driven by `checkbox.checked` (checked = dark, matching all pages' default), still updating the label text.

**Outcome:**
The theme switcher now uses the existing `.form-toggle` switch component (reused, not new) instead of a button. Checked = dark, knob slides + turns `--color-accent-primary`; unchecking switches to light. No CSS changes — `.form-toggle` already existed in input.css. The dead `.scheme-toggle … .button__icon` scoped rule in each HTML is now unused but left in place (harmless).

### [2026-06-25] — Animated sun/moon theme toggle

**Prompt:**
make it more like a cool animation, with a sun and moon.

**Tokens / files touched:**
- `assets/css/components/theme-toggle.css` (new) — `.theme-toggle` animated sun⇄moon switch
- All 6 HTML files — `.form-toggle` scheme switch markup replaced with `.theme-toggle` (track/stars/thumb + label); added `<link>` to theme-toggle.css; script selectors updated (`.form-toggle__value`→`.theme-toggle__label`, `closest('.form-toggle')`→`closest('.theme-toggle')`)
- `docs/DECISIONS.md` — DEC-021 added

**Outcome:**
Replaced the plain switch with a CSS-only animated day/night toggle: yellow sun + ray burst on a blue sky (unchecked/light) morphs to a pale moon with craters + crescent shading and fading stars on a navy sky (checked/dark); thumb slides with a slight overshoot. Verified rendering in both states via headless-Chrome screenshot. Illustration uses raw `--tt-*` colors (documented exception, DEC-021). Reduced-motion disables transitions.

**Related decision:** DEC-021

### [2026-06-25] — Theme toggle: clean Remix Icon sun/moon

**Prompt:**
its looks a bit cheap, use icons from remix.com sun and moon, keep it simple and clean

**Tokens / files touched:**
- `assets/css/components/theme-toggle.css` — rewritten: removed the CSS-drawn day/night scene + raw `--tt-*` colors; now a clean token-driven switch (track `--color-surface-sunken`/`--color-border-subtle`, thumb `--color-surface-raised`/`--shadow-s`) whose thumb carries a Remix Icon glyph that crossfades/rotates
- All 6 HTML files — toggle markup updated: track now holds the thumb with inline `sun-line` + `moon-line` Remix Icon SVGs (MIT)
- `docs/DECISIONS.md` — DEC-021 revised (raw-color exception dropped)

**Outcome:**
Replaced the gimmicky CSS sun/moon scene with real Remix Icon sun/moon glyphs in a minimal switch. Sun on the white thumb in light, moon on the dark thumb in dark; thumb slides and icons crossfade. Now fully theme-token-driven (adapts per theme, no decorative raw colors). Verified both states via headless-Chrome screenshot.

**Related decision:** DEC-021

### [2026-06-25] — Review MD files for FE handoff

**Prompt:**
alright i think we're almost done with the theming. How can we make sure we can deliver this to FE. Can you check all the MD files and see if it makes sense?

**Tokens / files touched:**
- `CLAUDE.md` — removed all dead `docs/DESIGN_SYSTEM.md` references (file never existed); rewrote the token-architecture section to the real single-file `tokens.css` + `light-dark()` model with an accurate token table; fixed non-negotiable #6 (amber = `--color-accent-secondary`, not `--color-accent-primary`); `feedback` → `status` wording; updated files table + start-of-task checklist + footer
- `docs/DECISIONS.md` — DEC-004 status annotated (file structure superseded); added DEC-022 (single-file light-dark() architecture) and backfilled DEC-015 (darker blue accent text, previously "pending")

**Outcome:**
Reconciled the docs with the shipped code for handoff. Found + fixed: missing DESIGN_SYSTEM.md (referenced 4×), wrong token-architecture description (folder/per-theme files vs single file + light-dark), a factual error (accent-primary called amber), stale token table (feedback namespace, non-existent tokens, 4-of-11 surfaces), and a missing decision (DEC-015). NAMING_CONVENTION.md and PROMPTS.md were accurate. Decision IDs now run 001–022 (020 intentionally absent — reverted).

**Related decision:** DEC-022; DEC-015

### [2026-06-25] — Component token audit; migrate tab indicator to semantic amber

**Prompt:**
yes check it all. Also if we can do it simpler by moving parts around. For example keeping only the raw values in the token.css then suggest it

**Tokens / files touched:**
- `assets/css/components/tab.css` — active-tab indicator `border-color`: `--palette-brand-secondary` → `--color-accent-secondary` (Yellow Route semantic token)

**Outcome:**
Audited all component/base/elements/utilities CSS for primitive + raw-hex usage. Only one undocumented violation found (tab indicator) and migrated; in light mode the indicator shifts from raw #ff9100 to the lightened amber. Remaining `--palette-*` uses are accepted exceptions: black-based shadows, bandwidth signal colors (commented as intentional for data-viz vividness), bandwidth marker contrast fills, and tag `#fff` mask fills. Two items deferred to a decision: tag bg (`light-dark(light-1, dark-4)` has no matching semantic surface token) and button on-amber text (`--palette-dark-4`, candidate for a `--color-text-on-accent` token). File-restructure proposal delivered separately.

### [2026-06-25] — Split tokens.css into tokens/ (palette · semantic · scale) + cleanup tokens

**Prompt:**
(continuation) yes do the 3-file split, and add both cleanup tokens

**Tokens / files touched:**
- `assets/css/tokens/palette.css` (new) — Layer 1 raw `--palette-*` + the `@layer` order declaration
- `assets/css/tokens/semantic.css` (new) — Layer 2 `--color-*` (light-dark) + syntax/data/rbm; added `--color-text-on-accent` and `--color-surface-chip`
- `assets/css/tokens/scale.css` (new) — non-color design tokens
- `assets/css/tokens.css` — deleted
- All 6 HTML files — single `tokens.css` `<link>` replaced with the three `tokens/*` links (palette → semantic → scale)
- `assets/css/components/button.css` — `--palette-dark-4` → `--color-text-on-accent`; flagged-primitive comment trimmed
- `assets/css/components/tag.css` — `light-dark(--palette-light-1, --palette-dark-4)` → `--color-surface-chip`
- `CLAUDE.md` — token-architecture section + file refs updated to the 3-file layout
- `docs/DECISIONS.md` — DEC-022 revised to the 3-file split

**Outcome:**
Raw values now live alone in `tokens/palette.css`; semantic mapping and scales are isolated. Two new semantic tokens removed the last avoidable component primitive refs (button on-accent text, tag chip bg). No visual change from the split (new tokens replicate prior values); verified the `@layer` cascade still resolves by rendering the test page in dark mode. Components are now free of `--palette-*` except documented exceptions (black shadows, bandwidth data-viz signal colors + marker fills, tag mask fills).

**Related decision:** DEC-022

### [2026-06-25] — Move raw hex out of semantic.css into the palette

**Prompt:**
i dont expect in the semantic to be raw hex values. Shouldnt that be a token?

**Tokens / files touched:**
- `assets/css/tokens/palette.css` — added neutral grey ramp (`--palette-grey-0…4`), muted teals (`--palette-teal-0…2`), dark-theme status bg/fg, light-theme status accents, and domain palettes (`--palette-data-*`, `--palette-syntax-*`, `--palette-rbm-*`)
- `assets/css/tokens/semantic.css` — every value rewritten to `var(--palette-*)`; zero raw hex remaining
- `docs/DECISIONS.md` — DEC-023 added

**Outcome:**
`semantic.css` is now a pure mapping layer (all `var(--palette-*)`); raw colors live only in `palette.css`. Value-preserving migration of ~40 inline hex — verified the test page renders pixel-identically in dark mode. Confirmed every referenced palette token is defined and no hex remains.

**Related decision:** DEC-023

### [2026-06-26] — Palette only an actual palette (hue ramps); extend brand

**Prompt:**
Ok we decided we want palette only to have an actual palette. So Blue 0 - Blue 6 for example. That means palette RBM and syntax and data are not compliant. In the semantics then we map the color to color-rbm-1 for example. Can you generate the pallets that we need. Also extend brand color for example in a yellow palette. (Follow-ups: name brand ramp `amber`; convert status too; use unified ramps with renumbering.)

**Tokens / files touched:**
- `assets/css/tokens/palette.css` — fully reorganized by hue family (`blue-0…10`, `green-0…9`, `red-0…5`, `yellow-0…5`, `amber-0…5`, `teal-0…5`, `grey-0…9`, `indigo`, `purple`, `brown`); removed all role/domain-named primitives (`--palette-status-*`, `--palette-syntax-*`, `--palette-data-*`, `--palette-rbm-*`, `--palette-brand-secondary`). `light-*`/`dark-*`/`black`/`white` unchanged.
- `assets/css/tokens/semantic.css` — every `--color-*` (accent, text, fill, surface, border, status, syntax, data, rbm) repointed to the new hue swatches; no token names changed.
- `assets/css/components/bandwidth.css` — `--bw-range` palette refs updated (`status-positive/negative/warning` → `green-4`/`red-2`/`yellow-2`).
- `docs/DECISIONS.md` — DEC-024 added.

**Outcome:**
Palette now contains only raw hue ramps (`0` = lightest); all role/series mapping lives in semantic. Brand amber extended from a single `#ff9100` swatch into a full `amber-0…5` ramp (anchor at `amber-3`). Value-preserving migration — verified every semantic token resolves to its original hex and that every referenced palette token is defined.

**Related decision:** DEC-024

### [2026-06-26] — Retire light/dark palette ramps (theme-function names)

**Prompt:**
what about the pallete light and dark, thats also more of a function mapped for the theme rather than palette colors. Should we split that up in dark teal or extend teal and just use the grey pallette when styling components? (Chose: hue-honest split — extend teal, pure-neutral grey, new slate for cool greys.)

**Tokens / files touched:**
- `assets/css/tokens/palette.css` — removed `--palette-light-*` and `--palette-dark-*`; extended `teal` to `0…11` (absorbs dark teals); `grey-0…8` is now pure-neutral (former light greys + pure darks + `#0a0a0a`); added `slate-0…7` for cool blue-greys.
- `assets/css/tokens/semantic.css` — repointed light surfaces → grey/white, dark surfaces → teal, cool greys → slate. No semantic names changed.
- `docs/DECISIONS.md` — DEC-025 added.

**Outcome:**
Palette is now 100% hue-named (no light/dark/status/syntax/data/rbm). Value-preserving — verified no `light-*`/`dark-*` refs remain and every referenced palette token is defined.

**Related decision:** DEC-025

### [2026-06-29] — Uniform component theming contract (--component-* knobs)

**Prompt:**
ok so if we look at the tag.css … shouldnt the variables be more generic. For example border-radius: var(--tag-border-radius) … (after discussion of performance + workflow) … i think by keeping it simple, and approaching everything the same, you win in the communication and workflow … yes lets do it

**Tokens / files touched:**
- `assets/css/components/tag.css` — refactored to the knob convention: theming-contract block at top (`--tag-bg`, `--tag-bg-hover`, `--tag-fg`, `--tag-border`, `--tag-radius`, `--tag-padding`, `--tag-gap`, `--tag-font-size`, `--tag-font-family`, `--tag-accent`); body and the `.button.tag.tag--removable` override block now consume the knobs; comet gradient tracks `--tag-accent`.
- `docs/NAMING_CONVENTION.md` — §7 rewritten from "single themable knob" to "uniform theming contract" with what-gets-a-knob / what-doesn't rules and the performance rationale.
- `docs/DECISIONS.md` — DEC-026 added.

**Outcome:**
Established the uniform `--component-*` theming-contract pattern; `tag.css` converted as the reference (value-preserving — knobs default to the same tokens used before). Duplication in tag.css collapsed to shared knobs so the override block can't drift.

**Related decision:** DEC-026

### [2026-06-29] — Apply DEC-026 theming contract to all remaining components

**Prompt:**
yes do the other components now

**Tokens / files touched:**
- `assets/css/components/button.css` — extended partial knobs: added `--btn-padding`, `--btn-gap`, `--btn-font-size`, `--btn-font-weight`; `.button--icon-only` now overrides `--btn-padding`/`--btn-gap` instead of `padding`/`gap` inline; updated comment to DEC-026 style.
- `assets/css/components/notification.css` — extended partial knobs: added `--notification-radius`, `--notification-padding`, `--notification-gap`, `--notification-border-width`.
- `assets/css/components/disclosure.css` — extended partial knobs: added `--disclosure-body-radius`, `--disclosure-icon-color`; `.disclosure__icon` now consumes `--disclosure-icon-color`.
- `assets/css/components/tab.css` — new knob blocks on `.tabs` (`--tabs-bg`, `--tabs-border-color`) and `.tab` (`--tab-indicator`, `--tab-fg`, `--tab-fg-active`, `--tab-active-bg`, `--tab-active-border`, `--tab-padding-inline`).
- `assets/css/components/table.css` — extended `--sticky-cell-border`; added `--table-cell-border`, `--table-header-bg`, `--table-header-color`, `--table-row-bg`, `--table-tfoot-bg`, `--table-tfoot-color`.
- `assets/css/components/data-table.css` — new knob blocks on `.data-table` (`--dt-bg`, `--dt-radius`, `--dt-padding`) and `.data-table__toolbar` (`--dt-toolbar-bg`, `--dt-toolbar-border`).
- `assets/css/components/theme-toggle.css` — new knobs on `.theme-toggle` (`--tt-track-bg`, `--tt-track-shadow`, `--tt-thumb-bg`, `--tt-thumb-shadow`, `--tt-icon-color`, `--tt-label-color`, `--tt-label-font-size`); child selectors consume them.
- `assets/css/components/input.css` — new knob blocks on `.form-label` (`--label-*`), `.form-input__control` (`--input-*`, state pseudo-classes now override knobs), `.form-input__text` (`--input-text-*`), `.form-select__control` (`--select-*`), `.form-checkbox` (`--checkbox-color`), `.form-radio` (`--radio-color`), `.form-toggle__control` (`--toggle-track-bg`, `--toggle-track-bg-checked`, `--toggle-track-bg-disabled`, `--toggle-thumb-bg`, `--toggle-thumb-bg-checked`, `--toggle-thumb-bg-disabled`), `.form-toggle__value` (`--toggle-value-*`).
- `assets/css/components/bandwidth.css` — formalized knob block: added `--bw-bar-fill`, `--bw-boundary-opacity`, `--bw-target-fill`, `--bw-marker-fill`, `--bw-marker-stroke`, `--bw-marker-w`; moved `--bw-marker-w` from `.bandwidth-visualization__marker` to the contract block.
- Skipped: `card.css` (specificity override, no base component rule), `nav.css` (sub-element rule only), `layout.css` (structural shell).

**Outcome:**
DEC-026 knob convention now applied uniformly across all 10 rethemable component files. Every component's theming surface is readable from one predictable block at the top of its base rule. All changes are value-preserving — knobs default to the same tokens previously used inline.

**Related decision:** DEC-026
