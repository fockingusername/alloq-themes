# Decision Log

> Theme-optimization decisions for Alloq.
> Append-only. Supersede rather than edit. See `CLAUDE.md` for the template.

---

## DEC-001 — Track prompts and theme decisions in separate Markdown files

- **Date:** 2026-06-16
- **Status:** Accepted
- **Related prompt:** PROMPTS.md entry 2026-06-16

### Context
Theme optimization is iterative — small token tweaks compound, and the reasoning behind a value (contrast, hierarchy, accessibility) is easily lost between sessions. We need a lightweight trail of what was asked and why values landed where they did.

### Options considered
1. **Inline code comments only** — keeps rationale close to the value, but scatters context and can't capture multi-token trade-offs.
2. **Single `CHANGELOG.md`** — mixes verbatim prompts with decisions, gets noisy.
3. **Separate `PROMPTS.md` + `DECISIONS.md`, indexed by `CLAUDE.md`** — prompts are append-only history; decisions are referenceable rationale with stable IDs.

### Decision
Option 3. `CLAUDE.md` holds scope and templates. `PROMPTS.md` logs every prompt with before → after values. `DECISIONS.md` logs decisions with `DEC-###` IDs referenced from prompts and (optionally) code comments.

### Consequences
- Every Claude Code session appends to `PROMPTS.md`.
- Token value changes that ripple through components get a decision entry.
- Small per-prompt overhead; pays off when revisiting a token six weeks later.

---

## DEC-002 — Use Roboto Mono as the monospace / tabular font

- **Date:** 2026-06-16
- **Status:** Accepted — fully implemented 2026-06-16
- **Related prompt:** PROMPTS.md entry 2026-06-16 "Correct monospace font to Roboto Mono" · "Replace JetBrains Mono font files with Roboto Mono"

### Context
The Pieq design system spec references JetBrains Mono as the tabular/financial data font. The actual project uses Roboto Mono. The docs and the `--font-family-mono` token need to reflect reality, not the spec default.

### Decision
Use Roboto Mono everywhere JetBrains Mono was specified. Token value: `--font-family-mono: roboto-mono, monospace`.

### Consequences
- Any component or style using `var(--font-family-mono)` will render Roboto Mono.
- If the Pieq Figma spec is updated to match, no code change is needed — only token value alignment.
- Do not reintroduce JetBrains Mono for any new numeric/tabular styling.

---

## DEC-003 — Light theme is in scope

- **Date:** 2026-06-16
- **Status:** Superseded by DEC-004
- **Related prompt:** PROMPTS.md entry 2026-06-16 "Add light theme to scope"

### Context
Initial setup assumed dark-only work. Confirmed light theme is part of the optimization scope.

### Decision
Light theme work is in scope. Both themes must be maintained in parallel.

### Consequences
Superseded by DEC-004, which defines the token architecture for supporting both themes properly.

---

## DEC-004 — Semantic token layer for dual-theme support

- **Date:** 2026-06-16
- **Status:** Accepted — *file structure superseded by DEC-022* (two-layer model kept; the separate `tokens/` folder + per-theme files were replaced by a single `tokens.css` using `light-dark()`)
- **Related prompt:** PROMPTS.md entry 2026-06-16 "Dual-theme token architecture"

### Context
The current `tokens.css` uses descriptive tokens (`--color-primary-300`, `--color-primary-400`) tied to specific palette values. These names carry no semantic meaning — `--color-primary-300` in dark is a dark teal surface, but in light it would need to be something entirely different. Swapping values per theme on the same name works, but breaks the mental model and makes the token name a lie in one of the two themes.

The goal is a system where both dark and light theme are first-class citizens and token names remain honest in both contexts.

### Options considered

1. **Single layer, override values per theme**
   Raw palette tokens (`--color-primary-300`) redefined inside `[data-theme="light"] {}`. Simple to implement, already partially in place. Problem: the name `primary-300` implies a specific shade, not a role — it becomes meaningless or misleading under the light theme.

2. **Semantic alias layer on top of palette tokens**
   Keep raw palette tokens as-is (source of truth for values). Add a second layer of semantic tokens whose names describe *role*, not value — `--color-surface-base`, `--color-surface-raised`, `--color-text-primary`, `--color-text-muted`, `--color-border-default`, etc. These aliases point to palette tokens and get remapped per theme. Components reference only semantic tokens, never palette tokens directly.
   Pros: token names stay honest in both themes; changing a theme is one remapping file; components never need to change.
   Cons: two layers to maintain; requires a migration pass on existing components.

3. **Separate token files per theme**
   `tokens.dark.css` and `tokens.light.css`, each defining the full set. Simple to reason about but duplicates every token — drift risk is high.

### Decision
**Option 2 — semantic alias layer.**

Structure:
```
tokens/
  primitives.css   ← raw palette values, never used directly in components
  semantic.css     ← role-based aliases, remapped per theme; components use these
  themes/
    dark.css       ← [data-theme="dark"] maps semantic → primitive
    light.css      ← [data-theme="light"] maps semantic → primitive
```

Semantic token naming convention — describe the role, not the value:

| Category | Tokens |
|---|---|
| **Surface** | `--color-surface-page`, `--color-surface-base`, `--color-surface-raised`, `--color-surface-overlay` |
| **Text** | `--color-text-primary`, `--color-text-secondary`, `--color-text-muted`, `--color-text-on-accent` |
| **Border** | `--color-border-default`, `--color-border-strong`, `--color-border-focus` |
| **Interactive** | `--color-interactive-default`, `--color-interactive-hover`, `--color-interactive-active` |
| **Accent** | `--color-accent-primary`, `--color-accent-primary-hover` (amber) |
| **Semantic UI** | `--color-feedback-positive`, `--color-feedback-negative`, `--color-feedback-warning`, `--color-feedback-info` |
| **Data viz** | `--color-data-1` … `--color-data-7` (already role-neutral, keep as-is) |

### Consequences
- All components must reference semantic tokens only — no primitive tokens (`--color-primary-###`) in component styles.
- Migration needed: audit existing component styles and replace primitive references with semantic equivalents.
- New token changes happen in two places: primitive value (if the palette changes) or theme mapping (if the role assignment changes) — never in components.
- The `primitives.css` file is append-only; the `semantic.css` + theme files are where theme work happens.
- Figma variables should mirror this two-layer structure for full design-to-code alignment.

---

## DEC-006 — Rename feedback token namespace to status

- **Date:** 2026-06-16
- **Status:** Accepted — supersedes naming convention from DEC-005
- **Related prompt:** PROMPTS.md entry 2026-06-16 "Rename feedback tokens to status"

### Context
DEC-005 introduced `--color-feedback-*` tokens, borrowing the "feedback" namespace from Primer's design system. On review, "feedback" describes UI responses to user actions (form validation, toast messages). In Alloq, these colors describe the **state of financial entities** — mandate compliance, position performance, transaction outcomes. That is closer in meaning to "status" than "feedback".

### Decision
Rename `--color-feedback-*` → `--color-status-*` across all token definitions and usages.

The vocabulary stays the same; only the namespace prefix changes:
`--color-status-{positive|negative|warning|info|neutral}` (foreground)
`--color-status-{sentiment}-emphasis` (solid background)
`--color-status-{sentiment}-muted` (subtle tint background)

### Consequences
- All 8 files updated (tokens.css, tag.css, 6 HTML files).
- Any future component using status colors references `--color-status-*`.
- "Feedback" is no longer used as a token namespace.

---

## DEC-008 — Extract notification component styles to shared CSS file

- **Date:** 2026-06-16
- **Status:** Accepted
- **Related prompt:** PROMPTS.md entry 2026-06-16 "Apply tag color changes to notification component"

### Context
The notification component used the same inline `--accent-color-muted` / `--accent-color-raised` + `light-dark()` pattern as the old tag component. Styles were duplicated across 6 HTML files. After introducing the `--color-status-*-bg` / `--color-status-*-fg` adaptive tokens (DEC-007), the notification component could be simplified using the same approach.

### Decision
Created `assets/css/components/notification.css`. Local variables renamed:
- `--accent-color` → `--notification-accent` (border-left vivid color)
- `--accent-color-muted` / `--accent-color-raised` + `light-dark()` → `--notification-bg` / `--notification-fg` referencing the adaptive tokens

Variants: `--error` (negative), `--warning`. Removed inline `<style>` blocks from all 6 HTML files. Added `<link>` to `notification.css` after `tag.css` in each `<head>`.

### Consequences
- Notification colors in both themes now benefit from the same token values as tags.
- Any future notification variant (positive, neutral) follows the same `-bg` / `-fg` pattern.
- `--color-status-*-bg` / `--color-status-*-fg` tokens are now shared across two components — the token layer is paying off.

---

## DEC-007 — Adaptive status badge tokens with per-theme bg and text values

- **Date:** 2026-06-16
- **Status:** Accepted
- **Related prompt:** PROMPTS.md entry 2026-06-16 "Fix tag variable naming and improve dark mode tag colors"

### Context
The tag component used `--tag-muted` and `--tag-emphasis` as local variables, then swapped them via `light-dark()` inside the component — `light-dark(var(--tag-muted), var(--tag-emphasis))` for background, and the inverse for text. This created a naming paradox: `--tag-muted` controlled the text color in dark mode and the background in light mode, so neither name was accurate in both themes.

Separately, the dark mode tag appearance was poor: backgrounds used the existing `emphasis` values which are almost opaque-black tints (e.g. info `#1f2d5c`), and text used the `muted` values which are near-white with no color identity (e.g. info `#f4f5f7`). Tags in dark mode looked like black pills with white text — no status hue visible.

### Options considered
1. **Keep the muted/emphasis pair; just adjust the raw values** — changes the primitives which are also used for light-mode text/bg; two concerns coupled.
2. **Add per-theme overrides in the component with separate `light-dark()` calls** — pushes theme logic into the component; more verbose; harder to reuse.
3. **Add new adaptive semantic tokens (`-bg` / `-on`) that embed `light-dark()` internally** — component stays simple (`background-color: var(--tag-bg)`); theme logic lives entirely in the token layer; tokens are reusable across future badge-like components.

### Decision
**Option 3.** New tokens added to Layer 2 of `tokens.css`. Final values after iterative contrast tuning:

| Token | Light value | Dark value |
|---|---|---|
| `--color-status-info-bg` | `#d4e4f7` | `#0a1428` |
| `--color-status-info-fg` | `var(--color-status-info-emphasis)` | `#daeeff` |
| `--color-status-positive-bg` | `#c8efd4` | `#03200e` |
| `--color-status-positive-fg` | `var(--color-status-positive-emphasis)` | `#bbf7d0` |
| `--color-status-negative-bg` | `#f5d0d0` | `#290710` |
| `--color-status-negative-fg` | `var(--color-status-negative-emphasis)` | `#ffd6de` |
| `--color-status-warning-bg` | `#fae8a0` | `#261500` |
| `--color-status-warning-fg` | `var(--color-status-warning-emphasis)` | `#fef3b4` |
| `--color-status-neutral-bg` | `#dde3ea` | `#0e151e` |
| `--color-status-neutral-fg` | `var(--color-status-neutral-emphasis)` | `#cce0ea` |

Local variables renamed from `--tag-muted`/`--tag-emphasis` + `light-dark()` to `--tag-bg`/`--tag-on` (later `--tag-fg`). No `light-dark()` in `tag.css` — the theme switch is inside the token.

**Light mode:** hardcoded tints (not `var(--color-status-*-muted)`) to get clearly saturated badge backgrounds rather than near-white. `muted` tokens remain unchanged for other use.

**Dark mode:** very dark near-black bgs (much darker than the page — contrast gap is large) paired with near-white hued text (>14:1 contrast verified for negative). The dark bgs are close to black but maintain a clear status hue.

### Consequences
- `--color-status-*-muted` and `--color-status-*-emphasis` are unchanged — other components using them directly are unaffected.
- `--tag-bg` / `--tag-fg` are always semantically accurate because the theme inversion is in the token, not the component.
- The `-bg` / `-fg` pattern is reused by `notification.css` (DEC-008) — the token layer now serves two components.

---

## DEC-005 — Align semantic token names with Primer Design System patterns

- **Date:** 2026-06-16
- **Status:** Accepted
- **Related prompt:** PROMPTS.md entry 2026-06-16 "Align token naming with Primer patterns"

### Context
A comparison against [Primer's primitive/semantic token system](https://primer.style/product/primitives/color/) revealed four naming inconsistencies in the current token set:

1. **Surface tokens lacked a consistent prefix** — `--surface-base`, `--surface-border` etc. sat outside the `--color-` namespace, violating the DEC-004 naming convention.
2. **`--surface-border` was semantically misnamed** — it lived under the `surface-*` namespace but expressed a border role, not a surface/fill role.
3. **Feedback tokens used value-descriptive suffixes** (`-strong`, `-subtle`) instead of role-descriptive ones — a reader couldn't tell from the name alone whether to use the token for a text color, a background fill, or a border.
4. **Text and accent base tokens lacked the `-primary` qualifier** — `--color-text` and `--color-accent` are ambiguous when a scale might be extended later.
5. **`--color-active` was an undifferentiated state token** — the interactive state model needs explicit hover/active/disabled vocabulary.
6. **Font token violated DEC-002** — `--font-family-mono` still referenced `jet-brains-mono` instead of `roboto-mono`.

### Options considered
1. **Keep current names, add parallel aliases** — no breakage, but doubles the token count and defers the cleanup indefinitely.
2. **Rename in-place across all files** — breaking change within the HTML files, but the HTML files are self-contained (no external consumers), so the blast radius is fully contained. Clean result.

### Decision
**Option 2 — rename in-place.**

Full rename map:

| Old name | New name | Reason |
|---|---|---|
| `--surface-base` | `--color-surface-base` | Consistent `--color-` prefix |
| `--surface-page` | `--color-surface-page` | Consistent `--color-` prefix |
| `--surface-raised` | `--color-surface-raised` | Consistent `--color-` prefix |
| `--surface-elevated` | `--color-surface-elevated` | Consistent `--color-` prefix |
| `--surface-overlay` | `--color-surface-overlay` | Consistent `--color-` prefix |
| `--surface-sunken` | `--color-surface-sunken` | Consistent `--color-` prefix |
| `--surface-subtle` | `--color-surface-subtle` | Consistent `--color-` prefix |
| `--surface-muted` | `--color-surface-muted` | Consistent `--color-` prefix |
| `--surface-border` | `--color-border-default` | Correct namespace (border, not surface) |
| `--color-text` | `--color-text-primary` | Explicit qualifier; matches DEC-004 plan |
| `--color-text-subtle` | `--color-text-secondary` | Role name (hierarchy) not value name (opacity) |
| `--color-accent` | `--color-accent-primary` | Explicit qualifier; matches DEC-004 plan |
| `--color-active` | `--color-interactive-active` | Correct namespace (interactive state) |
| `--color-info` | `--color-feedback-info` | Feedback namespace |
| `--color-info-strong` | `--color-feedback-info-emphasis` | Primer `emphasis`/`muted` vocabulary |
| `--color-info-subtle` | `--color-feedback-info-muted` | Primer `emphasis`/`muted` vocabulary |
| `--color-positive` | `--color-feedback-positive` | Feedback namespace |
| `--color-positive-strong` | `--color-feedback-positive-emphasis` | Primer `emphasis`/`muted` vocabulary |
| `--color-positive-subtle` | `--color-feedback-positive-muted` | Primer `emphasis`/`muted` vocabulary |
| `--color-negative` | `--color-feedback-negative` | Feedback namespace |
| `--color-negative-strong` | `--color-feedback-negative-emphasis` | Primer `emphasis`/`muted` vocabulary |
| `--color-negative-subtle` | `--color-feedback-negative-muted` | Primer `emphasis`/`muted` vocabulary |
| `--color-warning` | `--color-feedback-warning` | Feedback namespace |
| `--color-warning-strong` | `--color-feedback-warning-emphasis` | Primer `emphasis`/`muted` vocabulary |
| `--color-warning-subtle` | `--color-feedback-warning-muted` | Primer `emphasis`/`muted` vocabulary |
| `--color-neutral` | `--color-feedback-neutral` | Feedback namespace |
| `--color-neutral-strong` | `--color-feedback-neutral-emphasis` | Primer `emphasis`/`muted` vocabulary |
| `--color-neutral-subtle` | `--color-feedback-neutral-muted` | Primer `emphasis`/`muted` vocabulary |
| `--font-family-mono` value `jet-brains-mono` | `roboto-mono` | DEC-002 compliance |

One new semantic alias added (no new value):
- `--color-border-focus: var(--color-accent-primary)` — gives the focus border its own semantic token instead of referencing the accent token directly. `--focus-outline` updated to use `var(--color-border-focus)`.

**No new color values were introduced.** Every renamed token maps to the same underlying primitive it had before.

### Consequences
- All 6 HTML page files updated simultaneously (self-contained, no external CSS consumers at this stage).
- Future tokens in the `feedback-*` family should follow the `--color-feedback-{sentiment}-{emphasis|muted}` pattern.
- `--color-interactive-hover` and `--color-interactive-disabled` are the natural next additions to the interactive namespace; they were not added here because no new values were introduced in this pass.
- Components referencing the old names would break — acceptable since all consumers are in the same files.

---

## DEC-009 — Token naming cleanup: enforce Layer 1 / Layer 2 boundary

- **Date:** 2026-06-16
- **Status:** Accepted
- **Related prompt:** PROMPTS.md entry 2026-06-16 — "analyze the tokens. How is the naming convention, can something be improved?"

### Context
A naming audit identified six violations of the two-layer token architecture:

1. `--color-black`, `--color-white`, `--color-brand-secondary` — Layer 1 primitives using the `--color-` prefix instead of `--palette-`
2. `--color-status-{info/positive/negative/warning/neutral}` (base vivid values) — Layer 1 primitives using `--color-`; also used directly in components, bypassing the adaptive layer
3. `--color-link` — a `light-dark()` adaptive token sitting in the Layer 1 section
4. `--color-base-{full/low/medium/high}` — opaque fill tokens whose names describe the variable, not the role
5. `--icon-size` — missing scale suffix despite a sibling `--icon-size-s` already existing
6. `--color-interactive-active` — orphaned token with no `hover` or `default` siblings; name implies a momentary pressed state but is actually used for row selection

### Options considered
1. **Rename only, keep structure** — lowest risk; no semantic change
2. **Rename + move to correct section + upgrade component references** — fixes both naming and the Layer 1/2 boundary violation for status base tokens

### Decision
Option 2. Applied across all 6 HTML files, `tokens.css`, `input.css`, `notification.css`:

| Old name | New name | Notes |
|---|---|---|
| `--color-black` | `--palette-black` | Layer 1 primitive |
| `--color-white` | `--palette-white` | Layer 1 primitive |
| `--color-brand-secondary` | `--palette-brand-secondary` | Layer 1 primitive |
| `--color-status-info` _(and positive/negative/warning/neutral)_ | `--palette-status-*` | Layer 1 primitive (definition only) |
| `var(--color-status-*)` usages | `var(--color-status-*-icon)` | Upgrade to theme-adaptive icon token |
| `--color-base-full` | `--color-fill-base` | Role-named fill token |
| `--color-base-low` | `--color-fill-low` | Role-named fill token |
| `--color-base-medium` | `--color-fill-medium` | Role-named fill token |
| `--color-base-high` | `--color-fill-high` | Role-named fill token |
| `--color-interactive-active` | `--color-interactive-selected` | Describes selection state, not transient press |
| `--icon-size` | `--icon-size-m` | Scale suffix consistent with `--icon-size-s` |
| `--color-link` (position) | Moved to Layer 2 section | It uses `light-dark()` — it always belonged there |

`--color-link` value updated to reference palette tokens: `light-dark(var(--palette-blue-500), var(--palette-blue-400))`.

The `-emphasis` and `-muted` status variants (`--color-status-*-emphasis`, `--color-status-*-muted`) retain the `--color-` prefix intentionally — they are only referenced internally by the adaptive `-bg`/`-fg` tokens, never directly in components.

### Why `--palette-status-*` and `--color-status-*` coexist

After the rename there are two levels of status token — this is intentional, not a mistake:

**`--palette-status-*` — raw fixed values (Layer 1)**
These are brand-defined hex values that never change per theme:
```css
--palette-status-info: #294bff;
--palette-status-positive: #00e676;
```
They live alongside `--palette-blue-400`, `--palette-dark-3` etc. as a named source of truth. Their purpose is to be referenced when defining new adaptive tokens — so you write `var(--palette-status-info)` rather than hardcoding `#294bff` again in a future token definition.

**`--color-status-*` — semantic adaptive tokens (Layer 2)**
These are what components actually use. They carry role-specific suffixes and adapt per theme via `light-dark()`:
```css
--color-status-info-icon:  light-dark(#294bff, #84c8ff);  /* vivid; for icons, borders, text labels */
--color-status-info-bg:    light-dark(#f4f5f7, #0a1428);  /* subtle; for badge / tag backgrounds */
--color-status-info-fg:    light-dark(#111a35, #daeeff);  /* on top of info-bg */
```

Before this cleanup, `color: var(--color-status-info)` in components used `#294bff` in **both** light and dark mode — a fixed blue that can be low-contrast on dark surfaces. After the upgrade to `--color-status-info-icon`, the dark-mode value switches to `#84c8ff`, which has the necessary contrast on dark backgrounds.

The rule of thumb: **`--palette-status-*` is for building tokens; `--color-status-*-icon/bg/fg` is for styling components.**

### Consequences
- All 6 HTML files and all component CSS files updated atomically by the same pass.
- The `--color-status-*-icon` tokens are now the canonical way to apply vivid status color to any foreground element (icon, text, border-left). Components that previously used the raw primitive now get the theme-adaptive version.
- Future icon-scale sizes should follow `--icon-size-{s/m/l}`.
- `--color-interactive-hover` and `--color-interactive-default` are the natural next additions to the interactive namespace.

---

## DEC-010 — Complete Primer alignment: palette cleanup, accent rename, interactive state family

- **Date:** 2026-06-16
- **Status:** Accepted
- **Related prompt:** PROMPTS.md entry 2026-06-16 — Primer token-names audit follow-up

### Context
Following the Primer token-names audit (DEC-009), four remaining gaps were actioned in one pass:

1. `--color-status-*-emphasis/muted` were Layer 1 primitives still using `--color-` prefix — left behind when the base status tokens were moved to `--palette-*` in DEC-009.
2. `--color-status-*-icon` suffix was semantic (describes a UI role), not a CSS property name — inconsistent with the `-bg`/`-fg` pattern and Primer's property-first vocabulary.
3. The interactive state family had only `selected` — missing `hover`, `active`, `disabled`.
4. `--palette-blue-400/500` used a Material/Tailwind-style 100–900 scale while all other palette tokens used an ordinal 0–6 scale.

### Decision

**Item 1 — Finish Layer 1 cleanup:**
Renamed `--color-status-{info/positive/negative/warning/neutral}-{emphasis,muted}` → `--palette-status-*`. Only applied in `tokens.css` (these tokens are only referenced internally by the adaptive `-bg/-fg` tokens).

**Item 2 — Rename `-icon` → `-accent`:**
`-accent` is consistent with `--color-accent-primary`, describes a vivid foreground accent role without coupling to a specific element type (icon, text, border). Applied across `tokens.css`, `tag.css`, `notification.css`, `input.css`, and all 6 HTML files. `--color-status-info-accent` updated to reference palette tokens: `light-dark(var(--palette-blue-1), var(--palette-blue-0))`.

**Item 3 — Add interactive state tokens:**
```css
--color-interactive-hover:    var(--color-fill-low);     /* subtle bg; row hover, toggle unchecked */
--color-interactive-active:   var(--color-fill-medium);  /* pressed bg; active inputs */
--color-interactive-disabled: var(--color-surface-muted); /* disabled bg; inputs, toggles */
--color-interactive-selected: light-dark(#b0d6f5, #28626a); /* existing; selected rows */
```
`input.css` updated to use `--color-interactive-active` and `--color-interactive-disabled` in all form control states. Toggle unchecked background updated to `--color-interactive-hover`.

**Item 4 — Align blue palette scale:**
`--palette-blue-400` → `--palette-blue-0` (#84c8ff, lighter)
`--palette-blue-500` → `--palette-blue-1` (#294bff, vivid/darker)
Consistent with the 0=lightest ordinal scale used by `--palette-light-*` and `--palette-dark-*`. Updated all references in `tokens.css` (the only consumer of raw palette tokens).

### Consequences
- The interactive state family now covers `hover/active/disabled/selected` — the full Primer state vocabulary except `rest` (no token needed; default state has no background).
- `--color-fill-low/medium/high` remain available for decorative fills (SVG, chart, datepicker). The interactive tokens are semantic aliases pointing to the same computed values.
- `--color-interactive-hover` and `--color-interactive-active` will need dedicated values (not fill aliases) if the app needs to independently control interactive bg vs decorative fill tints.

---

## DEC-011 — Codify token naming rules in NAMING_CONVENTION.md

- **Date:** 2026-06-16
- **Status:** Accepted
- **Related prompt:** PROMPTS.md entry 2026-06-16 — naming convention document

### Context
By DEC-010 the project had accumulated seven naming decisions (DEC-004 through DEC-010) spread across `DECISIONS.md`, with no single authoritative reference a developer could consult before adding a token. There was no answer to "what suffix do I use?", "ordinal or T-shirt scale?", or "category-first or property-first?" without reading all prior decisions. Primer's published token-naming guidance had informed several of those decisions but was never formally incorporated.

### Options considered
1. **Inline rules into CLAUDE.md** — keeps one file, but CLAUDE.md is already an operating manual; naming rules would bloat it and mix "how to work" with "what to name".
2. **Create a dedicated NAMING_CONVENTION.md** — separates concerns; can be exhaustive without cluttering the operating manual; referenced from CLAUDE.md, not duplicated.

### Decision
Created `NAMING_CONVENTION.md` with eight sections:
1. **Two layers** — `--palette-*` vs `--color-*`, when each is valid, the smell test for misplaced tokens.
2. **Name structure** — Alloq's `--<layer>-<category>-<role>-<variant>` grammar, documented divergence from Primer's property-first order (category-first is deliberate; see DEC-009).
3. **Formatting rules** — dash-separated blocks, lowercase, no value words in names.
4. **Categories** — exhaustive table of all current `--color-*` categories with their roles.
5. **Variant vocabulary** — exactly Primer's approved words (`default/muted/emphasis`, `rest/hover/active/disabled/selected`, T-shirt scale `xs–xxl`, ordinal `0`-based ramps). No synonyms.
6. **Status token suffix system** — `-bg` / `-fg` / `-accent` meaning, with examples; notes the rename from `-icon` (DEC-010).
7. **Component-local variables** — short prefix, reference Layer 2 only, stay inside the component file.
8. **Pre-commit checklist** — seven yes/no questions; a "no" means rename before committing.

`CLAUDE.md` updated: `NAMING_CONVENTION.md` added to the maintained-files table, non-negotiable #2 links to it, start-of-task checklist gains step 4 ("Check `NAMING_CONVENTION.md` before naming any token").

### Consequences
- All future token additions check `NAMING_CONVENTION.md` first; the checklist is the gate.
- Accumulated naming rules from DEC-004/006/009/010 are now reachable in one place — `DECISIONS.md` remains the rationale trail, `NAMING_CONVENTION.md` is the usable reference.
- The document records Alloq's deliberate category-first divergence from Primer so it is not inadvertently "corrected" in a future pass.

---

## DEC-012 — Add --color-surface-interactive for default button background

- **Date:** 2026-06-16
- **Status:** Accepted
- **Related prompt:** PROMPTS.md entry 2026-06-16 — subtle grey default button

### Context
The default button used `--palette-dark-2` (#03363d, dark teal) as its background in both light and dark themes. In light mode this produces a dark-teal button on a near-white page — visually prominent but tonally disconnected from the grey neutral palette. The non-negotiable "semantic tokens only in components" was also violated: `--palette-dark-2` was used directly in `button.css`, flagged as a pending fix when the component was extracted.

### Options considered
1. **Reuse `--color-surface-elevated`** — light: `#dedede`, dark: `#0b474f`. Light value matches; dark value (`--palette-dark-0`) is lighter than the existing button color and conflates the "elevated surfaces" role (dropdowns, popovers) with interactive elements.
2. **Reuse `--color-surface-subtle`** — light: `#ebebeb` (#palette-light-3), dark: `#03363d`. Dark value is perfect; light value too close to the page background (#f7fafb) to provide adequate visual separation.
3. **New token `--color-surface-interactive`** — light: `--palette-light-5` (#dedede), dark: `--palette-dark-2` (#03363d). Precise match for both requirements: subtle grey in light, unchanged dark teal in dark. Correctly names the role (an interactive element's resting surface).

### Decision
Added `--color-surface-interactive: light-dark(var(--palette-light-5), var(--palette-dark-2))`.

- Light mode: `#dedede` — neutral grey, subtle against the page background, `contrast-color()` auto-selects black text.
- Dark mode: `#03363d` — existing dark teal preserved, `contrast-color()` auto-selects white text.

Updated `button.css` default: `--btn-bg: var(--color-surface-interactive)`. Removed `--palette-dark-2` from the flagged-primitives comment in button.css. Added `interactive` to the `surface` category in `NAMING_CONVENTION.md`.

### Consequences
- The surface token ladder now has a dedicated resting-state entry for interactive elements; use `--color-surface-interactive` anywhere a filled interactive control needs a neutral default background.
- `--color-surface-subtle` remains available for non-interactive subtle differentiation (e.g., table row bands); the two tokens serve different roles despite sharing the same dark-mode value.
- The default button appearance changes in light mode only: dark teal → neutral grey. Dark mode is visually unchanged.

---

## DEC-013 — Add --color-accent-secondary for adaptive amber brand color

- **Date:** 2026-06-16
- **Status:** Accepted
- **Related prompt:** PROMPTS.md entry 2026-06-16 — lighter primary button in light mode

### Context
`--palette-brand-secondary` (#ff9100, amber) was used directly in `button.css` for primary and secondary button variants — a primitive in a component, violating the non-negotiable. In light mode the vivid amber CTA felt heavy against the subtle grey UI; a lighter tint was requested. In dark mode the original vivid amber reads correctly on dark surfaces and should be preserved.

### Decision
Added `--color-accent-secondary: light-dark(oklch(from var(--palette-brand-secondary) calc(l + 0.06) c h), var(--palette-brand-secondary))`.

- Light mode: `+0.06` lightness in oklch — a perceptually uniform tint of amber, ~10% lighter than the raw brand color.
- Dark mode: `--palette-brand-secondary` (#ff9100) unchanged.

The `oklch` relative-color approach ties the light-mode tint directly to the source palette token, so any future change to `--palette-brand-secondary` is automatically reflected without a separate token update.

All four `--palette-brand-secondary` references in `button.css` replaced with `--color-accent-secondary` (primary bg, secondary border, secondary fg, secondary hover bg). Added `secondary` to the accent category in `NAMING_CONVENTION.md`.

### Consequences
- `--color-accent-secondary` is now the canonical token for any component that needs the amber brand color — use it instead of `--palette-brand-secondary` in all components.
- One primitive remains in button.css: `--palette-dark-4` (text on primary button). Needs a semantic token when a "very dark text on bright accent" role is needed elsewhere.

---

## DEC-014 — Extend blue palette to a 4-step ramp; use blue tint for interactive surface

- **Date:** 2026-06-18
- **Status:** Accepted
- **Related prompt:** PROMPTS.md entry 2026-06-18 — extend palette blue with tints for default button

### Context
The blue palette had two entries (`blue-0` = #84c8ff for dark-mode text, `blue-1` = #1c71e3 for light-mode link/text). No lighter surface tints existed. The default button bg used `--palette-light-5` (#dedede, grey) via `--color-surface-interactive`. With the button fg now set to link blue (#1c71e3), the grey bg is a semantic mismatch — blue text on a grey surface reads as a link element, not a button. A subtle blue bg reinforces the blue character of the default button and unifies the fg/bg language.

The naming convention (§5 — ordinal scale, 0 = lightest) required shifting the existing two entries up to make room at the lighter end.

### Options considered
1. **Add lighter values as higher numbers (blue-2, blue-3 = lighter)** — breaks the 0=lightest ordinal rule; creates confusion when reading the scale.
2. **Add a separate sub-palette group** — avoids renumbering but fragments the blue namespace.
3. **Shift existing entries up; add new light tints at 0 and 1** — preserves the convention; all references are in `tokens.css` only (3 semantic tokens), so the blast radius is minimal.

### Decision
**Option 3 — shift and extend.**

| Step | Value | Role |
|---|---|---|
| `blue-0` | `#f0f5fe` | Near-white surface tint (whisper blue) |
| `blue-1` | `#dce8f8` | Soft surface tint (interactive element bg in light mode) |
| `blue-2` | `#84c8ff` | Renamed from old `blue-0` — light blue for text on dark surfaces |
| `blue-3` | `#1c71e3` | Renamed from old `blue-1` — link/accent blue for text on light surfaces |

`--color-accent-primary`, `--color-link`, `--color-status-info-accent` updated from `blue-1/blue-0` → `blue-3/blue-2` (values unchanged).

`--color-surface-interactive` light-mode value changed from `var(--palette-light-5)` (#dedede) → `var(--palette-blue-1)` (#dce8f8).

Contrast of default button: `#1c71e3` on `#dce8f8` = 3.75:1. Buttons are UI components (3:1 threshold applies, per CLAUDE.md non-negotiable #9). Passes.

### Consequences
- The blue palette is now a proper ramp (lightest → darkest) with surface tints at steps 0–1 and text/accent blues at steps 2–3.
- Default button in light mode: subtle blue surface + blue text — cohesive and visually distinct from grey UI surfaces.
- Any future component needing a faint blue wash (info highlight, row tint, etc.) should use `--palette-blue-0` or `--palette-blue-1` via a new semantic token — not reference the palette directly.
- Dark mode default button is unchanged.

## DEC-016 — Surface token ladder: shared values across roles are intentional

- **Date:** 2026-06-22
- **Status:** Accepted
- **Related prompt:** PROMPTS.md 2026-06-22 — Surface token audit

### Context
While making a data-table blend into the page, `--color-surface-raised` was temporarily collapsed onto `--color-surface-page`, which made "raised" describe an elevation that no longer existed. A follow-up audit asked whether it makes sense that several surface roles (e.g. `base` and `raised`) resolve to the same palette step in a given theme.

Resolved values were tabulated for all ten surface roles in both themes. Finding: **no surface token is a true duplicate** — every apparent collision occurs in only one theme and the two roles diverge in the other (e.g. `base`/`page` share `dark-5` in dark but split `light-0`/`light-1` in light; `base`/`raised`/`overlay`/`field` all resolve to white in light but split across `dark-3/4/5/6` in dark). Roles that collide in one theme are never adjacent in the UI, so the shared value is invisible. The only genuine fault was a stray uncommitted change nudging `raised` dark from `dark-3` → `dark-4`, shrinking its lift above `page`.

### Options considered
1. **Force every role to a unique value in both themes** — would invent contrast where the design doesn't want it and break the established palette; high blast radius across 6 HTML files. Rejected.
2. **Collapse roles that ever share a value into a single token** — loses the per-theme divergence each token genuinely carries; a future theme could not re-split them. Rejected.
3. **Keep all roles; document that same-tier shared values are intentional; revert the stray `raised` change.** Minimal, honest, preserves flexibility. Chosen.

### Decision
**Option 3.** The surface tokens form an elevation ladder — canvas (`base`, `page`) → `raised` → `overlay` — plus off-ramp roles (`field`/`sunken` inset, `subtle`/`interactive` state tints, `muted` disabled, `elevated` chip fill). Two roles may resolve to the same palette step within one theme when they sit on the same tier and never touch in the UI. The invariant: **`raised` must sit above `page`** (lighter in dark, whiter in light). `--color-surface-raised` dark reverted to `--palette-dark-3` (`#022b31`), restoring a clear one-step lift above `page` (`dark-5`, `#021318`); this matches the value committed on 2026-06-18. Documented inline above the Surfaces block in `tokens.css` and in `NAMING_CONVENTION.md` §4.

### Consequences
- No token values change versus the last committed state — the audit confirmed the system is coherent and reverted only the stray edit.
- Future work should not read a single-theme value collision as a bug. The test for a real fault is whether a token's value contradicts its name (e.g. `raised` not above `page`), not whether two roles ever share a step.
- A flush, page-level surface (e.g. a data-table meant to blend into the page) should reference `--color-surface-page` or `transparent` — not be achieved by flattening `raised` onto `page`.

## DEC-017 — Multilayered table: replace depth fill ramp with indent guides + bold parents

- **Date:** 2026-06-22
- **Status:** Accepted
- **Related prompt:** PROMPTS.md 2026-06-22

### Context
The oklch lightness ramp (one background-color shade per depth level) worked acceptably in dark mode but was distracting in light mode: progressively darker gray bands spanning the full row width on a white canvas, competing visually with the numeric data and degrading text contrast at deeper levels. The fill ramp was also redundant — indentation and disclosure toggles already encode depth unambiguously.

### Options considered
1. **Split the ramp by theme** — keep ramp in dark, suppress or flatten it in light. Adds complexity; doesn't fix the root problem.
2. **Tint group-header rows only** — one uniform tint for expandable rows, leaves flat. Clean but loses the vertical hierarchy signal.
3. **Indent guide lines + bold parents (chosen)** — remove ramp entirely, draw plain vertical rules in the sticky first column at each ancestor's icon position; bold the label of parent rows only.

### Decision
Remove the `--color-table-start` / `--table-min-steps` / oklch-per-level ramp from table.css.

Add to `td:first-child::before` in `.multilayered-table`: a `repeating-linear-gradient` (1px line every 1rem, `--color-border-subtle`) clipped to `calc(--level * 1rem + 1.2rem)` width, offset `0.2rem` so lines align with the expand-icon column positions (1.2rem, 2.2rem, 3.2rem…). Guide count equals `--level` — root rows get no guide, each deeper level gains one.

Add `font-weight: var(--font-weight-bold)` to `td:first-child` for `tr:has(.row-name__button)` rows (parent/group rows).

### Consequences
- Rows are now flat in both themes — full text contrast at every depth level, no fill competing with numeric data.
- Depth readable from: indentation (Vue-managed offset) + guide lines in label column + bold label text + disclosure button.
- Guide lines live entirely in the sticky first column; numeric columns are untouched.
- The `--color-table-start` and `--table-min-steps` tokens are now unused and have been removed.
- Hover state (background-image overlay on cells) is unaffected.
- `.is-checked td` selected state is unaffected.

## DEC-018 — Default button is a blue outline (line) style

- **Date:** 2026-06-25
- **Status:** Accepted
- **Related prompt:** PROMPTS.md 2026-06-25

### Context
The previous default `.button` (accent-primary tint fill + accent text) was not landing. Several experimental variants were trialled side by side (ghost/translucent-white, lila, lime `#D3FFB5`, blue line). The blue line was chosen.

### Options considered
1. Keep tinted-fill default — reads as a soft filled button; competes visually with `--primary` (amber CTA).
2. Blue outline default — transparent fill, `--color-accent-primary` border + text, no shadow; clearly subordinate to the amber primary, reads as a standard secondary action. Hover/active lay a translucent accent tint.

### Decision
`.button` base = blue outline:
- `--btn-bg: transparent`, `--btn-fg: var(--color-accent-primary)`, `--btn-border: var(--color-accent-primary)`, `--btn-shadow: none`.
- Hover → `--btn-bg: color-mix(in oklch, var(--color-accent-primary) 12%, transparent)`; active → `20%`.

The base hover/active no longer brighten via `oklch(l + …)` (that mechanism cannot create a fill from a transparent base). The brighten + shadow behaviour that `.button--primary` relied on was moved onto `.button--primary` itself, which now also declares its own rest `--btn-shadow` and `--btn-border: transparent`. `--secondary`, `--text`, `--icon-only` were unaffected (they already set their own `--btn-bg` per state).

All experimental comparison variants (`--ghost`, `--lila`, `--lime`, `--line`) were deleted, along with the `--lime` raw-hex local var (the one naming-convention violation). Design-system variants (`--primary`, `--secondary`, `--text`, `--icon-only`, `--pill`, `--block`) were kept.

### Consequences
- Every plain `.button` across all pages now renders as a blue outline. Visual weight shifts: amber `--primary` is now the only filled emphasis button.
- Verify contrast in both themes: `--color-accent-primary` is `blue-4 (#1255b8)` on light and `blue-2 (#84c8ff)` on dark; border + text on page/raised surfaces clear 3:1 (UI/large) — body-size labels at `--font-size-s` bold are borderline on dark and should be re-checked if the accent value changes.
- The blue outline can visually resemble `.button--secondary` in dark mode (secondary border = accent-secondary/amber, so they stay distinct). Watch for places that used the old filled default as a pseudo-primary.

## DEC-019 — Make --color-border-subtle fainter in dark mode

- **Date:** 2026-06-25
- **Status:** Accepted
- **Related prompt:** PROMPTS.md 2026-06-25

### Context
The dark-mode `--color-border-subtle` (`--palette-dark-2`, #03363d) read too strongly against the dark surfaces it borders — noticeably lighter/teal than the card surface (`--palette-dark-3`, #022b31). Request: make it even more subtle.

### Options considered
1. Step to the next palette value (`--palette-dark-3`) — but that equals the card surface, so the border would vanish on cards.
2. Relative-color nudge from `--palette-dark-2` — darken + desaturate part-way toward the surface, keeping it present but fainter. Discrete palette has no step between dark-2 and dark-3.

### Decision
Dark value → `oklch(from var(--palette-dark-2) calc(l - 0.025) calc(c * 0.7) h)`.
Measured (oklch L / C): dark-2 0.306/0.051 → new 0.281/0.036; card surface dark-3 = 0.265, page dark-6 = 0.145. The border sits just above the card surface (still visible) and clearly above page/nav. Light value (`--palette-light-4`) unchanged.

### Consequences
- Affects everything on `--color-border-subtle` in dark mode: card edges, tab underline, sidebar right border, header bottom border, inverted disclosure border. All become fainter; none disappear (border L stays > card surface L).
- `--color-border-default` (heavier borders: inputs, etc.) is untouched.


## DEC-021 — Sun/moon theme toggle

- **Date:** 2026-06-25
- **Status:** Accepted
- **Related prompt:** PROMPTS.md 2026-06-25

### Context
The theme switcher was restyled from a button → generic `.form-toggle` → an animated sun/moon toggle. A first pass drew the whole day/night scene in CSS (sky gradients, ray-burst sun, crater moon, stars) using raw `--tt-*` illustration colors; it read as cheap. Follow-up: use real Remix Icon sun/moon glyphs, keep it simple and clean.

### Decision
`assets/css/components/theme-toggle.css` — a `.theme-toggle` switch where the sliding thumb carries a Remix Icon glyph (`sun-line` / `moon-line`, MIT) that crossfades + rotates between states. Unchecked = light (sun, left); checked = dark (moon, right). Fully token-driven: track `--color-surface-sunken` + `--color-border-subtle`, thumb `--color-surface-raised` + `--shadow-s`, icon `--color-text-primary`, focus `--focus-outline`. The earlier raw-color scene was dropped — no exception to non-negotiable #1 is needed.

### Consequences
- One bespoke control, but it now inherits the theme palette like everything else (track/thumb adapt per theme automatically).
- `prefers-reduced-motion: reduce` disables the thumb/icon transitions.
- Remix Icon path data is inlined in each HTML's toggle markup (no icon-font dependency added).

## DEC-015 — Darker blue accent text in light mode (contrast)

- **Date:** 2026-06-18
- **Status:** Accepted *(backfilled 2026-06-25 — referenced as "pending" in PROMPTS.md but never written)*
- **Related prompt:** PROMPTS.md 2026-06-18 "Extend blue palette to 6 steps; darker text on default button"

### Context
The light-mode accent/text blue (`--palette-blue-3`, #1c71e3) cleared 3:1 (UI) but was marginal as body-size text on light surfaces. The blue palette was extended (DEC-014 → 6 steps) to provide a deeper step.

### Decision
Light-mode `--color-accent-primary` (and its co-references `--color-link`, `--color-status-info-accent`): `--palette-blue-3` (#1c71e3) → `--palette-blue-4` (#1255b8). Dark mode unchanged (`--palette-blue-2`, #84c8ff).

### Consequences
- Contrast of accent text on light surfaces: ~4.4:1 → ~6.6:1 (page) / ~6.96:1 (raised).
- Carries into the blue-outline default button (DEC-018), links, and the info status accent.
- Verified again in DEC-018's contrast pass (both themes pass AA for body text).

## DEC-022 — Token architecture: 3-file split using light-dark()

- **Date:** 2026-06-25
- **Status:** Accepted — supersedes the file-structure portion of DEC-004
- **Related prompt:** PROMPTS.md 2026-06-25 "Review MD files for FE handoff" · "Component token audit + token split"

### Context
DEC-004 specified a `tokens/` folder with `primitives.css`, `semantic.css`, and per-theme `themes/dark.css` / `themes/light.css` remapping via `[data-theme]`. Reality had drifted to a single `tokens.css` with both layers + scales in one `:root`, using `light-dark()`. During the FE-handoff review we kept the `light-dark()` model but split the one file by concern so raw values live alone.

### Decision
`assets/css/tokens/` — three files, all in `@layer settings :root`:
- **`palette.css`** — Layer 1 raw `--palette-*` only (the single source of raw color). Holds the `@layer settings, generic, elements, utilities;` order declaration (loads first).
- **`semantic.css`** — Layer 2 role-based `--color-*` via `light-dark()`, plus syntax/data/rbm domain tokens.
- **`scale.css`** — non-color design tokens (`--length/gutter/radius/font/shadow/border/sizes`).

Load order: `fonts → tokens/palette → tokens/semantic → tokens/scale → base → …`. **Theming** is `<body data-theme="light|dark">` → `color-scheme` (in `base.css`) → every `--color-*` resolves via `light-dark()`. No per-theme files; one attribute flips all tokens. Two-layer rule from DEC-004 stands: components use Layer 2 only.

Added two semantic tokens to remove the last avoidable component primitive refs: `--color-text-on-accent` (= dark-4; used by `button.css`) and `--color-surface-chip` (= light-dark(light-1, dark-4); used by `tag.css`).

### Consequences
- "What raw colors exist?" → `palette.css`, one file. CLAUDE.md updated to match.
- FE integrates by importing the three token files (in order) + base/elements/utilities/components, and setting `data-theme` on `<body>`.
- Adding a theme would still require a mechanism beyond `light-dark()` (out of scope).

## DEC-023 — semantic.css is a pure mapping layer (raw hex → palette)

- **Date:** 2026-06-25
- **Status:** Accepted
- **Related prompt:** PROMPTS.md 2026-06-25 "No raw hex in semantic.css"

### Context
After the 3-file split (DEC-022), `semantic.css` still held ~40 raw hex values inherited from the original `tokens.css` — violating the two-layer rule (NAMING_CONVENTION §1: a `--color-*` holding raw hex belongs in the palette). The mapping layer should contain only `var(--palette-*)`.

### Decision
Moved every raw color value into `palette.css` as a primitive; `semantic.css` now references only `var(--palette-*)` (wrapped in `light-dark()` / `oklch()` where adaptive). Value-preserving — no resolved color changed (verified by re-render).

New palette primitives added:
- **Neutral grey ramp** `--palette-grey-0…4` (true greys for theme-neutral text/UI; #dde3ea → #1a1a1a, 0 = lightest).
- **Muted teal** `--palette-teal-0…2` (dark-mode text + selected state).
- **Dark-theme status** `--palette-status-{info|positive|negative|warning}-{bg|fg}-dark` (the light counterparts already existed as `-muted`/`-emphasis`).
- **Light-theme status accents** `--palette-status-{positive|negative|warning}-accent-light` (dark accent reuses the vivid base swatch).
- **Domain palettes** `--palette-data-1…7`, `--palette-syntax-*` (by hue), `--palette-rbm-2…6` — independent leaf series; `--color-data/syntax/rbm` now alias them.

### Consequences
- `palette.css` is the single source of every raw color; `semantic.css` has zero hex.
- Domain series are kept independent even where values coincide (e.g. rbm-5 == data-1 by value) to avoid surprising cross-domain coupling.
- A few palette primitives are defined-but-unused (ramp completeness) — acceptable.

## DEC-024 — Palette is hue-only; status/syntax/data/rbm move to semantic

- **Date:** 2026-06-26
- **Status:** Accepted
- **Related prompt:** PROMPTS.md 2026-06-26 "Palette only an actual palette"

### Context
`palette.css` still held role- and domain-named primitives — `--palette-status-*` (organized by status role), `--palette-syntax-*` (by code-token type), `--palette-data-*` and `--palette-rbm-*` (by series index), and a single `--palette-brand-secondary`. A palette should contain only raw hue swatches; "what role is this" belongs in the semantic layer. These names answered "what is this for," not "what color is this," violating NAMING_CONVENTION §1.

### Options considered
1. **Additive hue ramps** — leave existing ramps numbered, add new hue ramps for the non-compliant values. Lower risk, but produces duplicate hue families (a `blue` and an `azure`).
2. **Unified hue ramps (chosen)** — one ramp per hue, ordered by lightness, renumbering existing ramps so every blue lives in `blue-*`, every green in `green-*`, etc. Cleanest "true palette"; more references to rewire.

### Decision
Reorganized `palette.css` strictly by hue family, `0 = lightest`. Every previous raw value is preserved — only names changed:
- **blue-0…10** absorbs surface blues + azure (`#2196f3`) + info status blues (`#294bff`, `#111a35`, `#0a1428`, `#daeeff`).
- **green-0…9** absorbs positive-status greens, syntax green/emerald, rbm mint, data sage.
- **red-0…5** = negative-status family. **yellow-0…5** = warning family.
- **amber-0…5** = brand secondary (the Yellow Route); `amber-3 = #ff9100` is the brand anchor, `0–2`/`4–5` are generated tints/shades to complete the ramp.
- **teal-0…5** absorbs existing teals + syntax-cyan + data aquas.
- **grey-0…9** absorbs cool near-white tints (`#f4f5f7`, `#f0f4f7`, `#edeff3`), syntax-slate, neutral-status, and the existing true greys.
- **indigo-0…1**, **purple-0…1**, **brown-0…1** for the remaining chart hues.
- `light-*`, `dark-*`, `black`, `white` unchanged (already compliant neutral ramps/anchors).

`semantic.css` now maps every role — including `--color-status-*`, `--color-syntax-*`, `--color-data-*`, `--color-rbm-level-*`, and `--color-accent-secondary` — onto these hue swatches. No semantic token name changed and no resolved color changed (value-preserving; verified token-by-token).

### Consequences
- The palette finally answers only "what color," never "what for." Cross-domain value coincidences (e.g. `rbm-5` and `data-1` both `#c7d1a9`) now collapse to one swatch (`green-2`) by design.
- `bandwidth.css` referenced `--palette-status-{positive,negative,warning}` directly (a documented intentional palette reference for vivid signals); repointed to `--palette-green-4` / `red-2` / `yellow-2` (same values).
- Faintly-tinted status backgrounds (e.g. info-muted `#f4f5f7`) now resolve via the `grey` ramp — accurate, since those swatches are near-neutral.
- A few palette swatches are defined-but-unused (the generated amber tints, some hue steps) — acceptable for ramp completeness.
- Supersedes the domain/status palette structure introduced in DEC-023 (DEC-023's value-migration intent stands; only the naming/organization changes).

## DEC-025 — Retire light/dark palette ramps; split neutrals into grey + slate + teal

- **Date:** 2026-06-26
- **Status:** Accepted
- **Related prompt:** PROMPTS.md 2026-06-26 "light/dark are theme-function, not hue"

### Context
After DEC-024 made the palette hue-only, `--palette-light-*` and `--palette-dark-*` remained — but those names describe a *theme* (which background ramp), not a hue, the same smell DEC-024 removed from status/syntax/data. Inspection showed: `dark-0…5` are dark teals (one hue family with the existing `teal` ramp), `dark-6` is neutral near-black, and `light-1…6` are neutral light greys (`light-0` is white). The existing `grey` ramp (from DEC-024) was cool/blue-tinted, so naïvely merging the neutral `light-*` greys into it would mix two temperatures and create near-duplicate near-whites.

### Options considered
1. **Leave as-is** — keep `light-*`/`dark-*` as documented theme-function exceptions. Least churn, but inconsistent with DEC-024.
2. **Simple merge** — `dark-*` → `teal`; `light-*` → `grey`. One long neutral ramp mixing cool + neutral greys with redundant swatches.
3. **Hue-honest split (chosen)** — separate the neutrals by temperature so each ramp is one true hue.

### Decision
Value-preserving rename/reorg (no resolved color changed):
- **`teal-6…11`** absorbs the former `dark-0…5` (dark teals).
- **`grey-0…8`** is now the **pure neutral** ramp: former `light-1…6` (`#f7fafb`→`#d6d6d6`) plus the pure darks `#272727`, `#1a1a1a`, and former `dark-6` `#0a0a0a`. `light-0` `#ffffff` folds into the `white` anchor.
- **`slate-0…7`** (new) holds the **cool/blue-tinted** greys: the cool near-whites `#f4f5f7`/`#f0f4f7`/`#edeff3`/`#dde3ea`, blue-greys `#8a9fa8`/`#7a8892`/`#5a6a72`, and cool near-black `#1a212a` (all previously misfiled in `grey` by DEC-024).
- `--palette-light-*` and `--palette-dark-*` are deleted.

`semantic.css` repointed accordingly: light-theme surfaces → `grey`/`white`, dark-theme surfaces → `teal`, cool text/greys → `slate`. No semantic token name changed.

### Consequences
- The palette now contains **only** hue families (blue, green, red, yellow, amber, teal, indigo, purple, brown, slate, grey) + black/white anchors. No role/domain/theme names remain at Layer 1.
- `grey` vs `slate` now carry a real, honest distinction (neutral vs cool) instead of "light vs dark theme."
- Surface elevation in both themes is unchanged visually — only the underlying token names moved.
- NAMING_CONVENTION §4 surface roles are unaffected (they live in the semantic layer).

## DEC-026 — Uniform component theming contract via --component-* knobs

- **Date:** 2026-06-29
- **Status:** Accepted
- **Related prompt:** PROMPTS.md 2026-06-29 "make component variables generic / consistent"

### Context
Components mixed global token references inline (`border-radius: var(--radius-full)`) with the existing single-knob pattern (`--tag-accent`). Retheming or even reading "what is tweakable here" meant scanning the whole rule. `tag.css` also duplicated its surface/border/radius/font values three times (base rule, hover, and the `.button.tag.tag--removable` specificity-override block), so copies could drift.

### Options considered
1. **Knob only what varies** — local var for values that change across variants (status quo); reference global tokens directly for everything else. Most traceable per-line, but the "theming surface" is implicit and scattered; duplication stays.
2. **Wrap every declaration** — including structural CSS (`--tag-display`). Maximally uniform but adds indirection nobody overrides and obscures layout.
3. **Uniform theming contract (chosen)** — every *token-driven visual* property becomes a `--<component>-*` knob at the top of the base rule, defaulting to a global token; structural/effect CSS stays inline.

### Decision
Each component opens its base rule with a block of `--<component>-*` knobs covering every token-driven visual property (color, bg, border, radius, padding, gap, typography), each defaulting to the global semantic/scale token. The body consumes only those knobs; variants/states/consumers retheme by overriding a knob. Structural CSS (`display`, `position`, `white-space`), effect machinery (mask, animation), and literal keywords (`font-weight: normal`) stay inline — no knob.

`tag.css` is the reference implementation: knobs `--tag-bg/-bg-hover/-fg/-border/-radius/-padding/-gap/-font-size/-font-family/-accent`; the duplicated `.button.tag.tag--removable` block now re-reads the same knobs (no drift); the `.tag--negative` comet gradient tracks `--tag-accent` instead of repeating `--color-status-negative-accent` five times.

### Consequences
- Each component's knob block is its documented theming contract — read once at the top, override to retheme, never edit the body.
- Performance impact is negligible: component-scoped custom properties don't measurably affect style recalc (the expensive pattern is many frequently-mutated `:root` vars, not static scoped knobs).
- Global scale/semantic tokens remain the single source of truth — knobs default to them, so a token change still propagates and the mapping is visible in one place.
- Other components should be migrated to this shape over time (NAMING_CONVENTION §7). Value-preserving for `tag.css` — every knob defaults to the exact token it previously used inline.

## DEC-027 — Centralize component knob defaults in tokens/component.css

- **Date:** 2026-06-29
- **Status:** Accepted
- **Related prompt:** PROMPTS.md 2026-06-29

### Context
After DEC-026 established the uniform `--<component>-*` knob convention, each component CSS file had a knob-defaults block at the top. The defaults were scattered across 10 files. Wanted a single readable place for all component defaults, moving toward a token pipeline (Style Dictionary / Tokens Studio) without introducing a build step yet.

### Options considered
1. **`tokens/component.css` on `:root`** — extract all knob defaults to one CSS file in the tokens layer; component files keep only body rules and variant/state overrides. No new tooling.
2. **JSON + generator** — JSON source of truth, small Node script writes `component.css`. Makes defaults lintable and Figma-syncable, but adds a build step.
3. **Keep per-component blocks** — status quo, no change.

### Decision
Option 1. Created `assets/css/tokens/component.css` with all `--<component>-*` defaults declared on `:root` in `@layer settings`. Load order: after `tokens/scale.css`, before `base.css`. Each component CSS file now carries only a one-line pointer comment (`Knob defaults → tokens/component.css`) and its body/variant/state rules.

### Consequences
- One file to open to see every component's theming surface and its default value.
- Component CSS files are now purely structural — body rules, variant overrides, state overrides. No token values.
- The pointer comment in each component file (`DEC-026, DEC-027`) is the breadcrumb to the central file.
- Easy to migrate to Option 2 later: `component.css` becomes a generated artifact; nothing else changes.
- `tokens/component.css` must be added to any new HTML entry point after `tokens/scale.css`.

## DEC-028 — Replace --color-surface-chip and --color-surface-table-header with --color-surface-dimmed

- **Date:** 2026-06-30
- **Status:** Accepted
- **Related prompt:** PROMPTS.md entry 2026-06-30

### Context
`--color-surface-chip` and `--color-surface-table-header` name components, not roles — a violation of the token naming principle (DEC-004). Both resolved to the same value (`grey-0` / `teal-10`) and carried a comment acknowledging they might diverge but hadn't.

### Options considered
1. **Keep both, rename to roles** — e.g. `surface-badge` + `surface-header`. Still component-specific.
2. **Alias to existing `surface-page`** — same value in light, but page could diverge independently.
3. **Single role token `surface-dimmed`** — describes the visual role (slightly dimmed vs. raised), component-agnostic.

### Decision
Introduce `--color-surface-dimmed: light-dark(var(--palette-grey-0), var(--palette-teal-10))` and remove both component tokens. Component knobs in `component.css` (`--tag-bg`, `--table-header-bg`, `--dt-toolbar-bg`) now reference `--color-surface-dimmed`.

### Consequences
Any component CSS that referenced `--color-surface-chip` or `--color-surface-table-header` directly must switch to `--color-surface-dimmed`. The component.css knobs already updated. If chips and table headers need to diverge in future, split into two role-named tokens at that point.

## DEC-029 — Merge --color-data-N and --color-rbm-level-N into --color-series-N with light-dark()

- **Date:** 2026-06-30
- **Status:** Accepted
- **Related prompt:** PROMPTS.md entry 2026-06-30

### Context
Two separate categorical color series (`data` and `rbm-level`) served the same visual function with partially overlapping values and no light-dark() adaptation. Dark mode was getting the same muted light-theme palette.

### Options considered
1. Keep separate, add light-dark() to each — double maintenance.
2. Alias RBM levels onto data tokens — still two series names.
3. Single `--color-series-N` series; RBM levels alias onto it — one maintained palette.

### Decision
`--color-series-1..7` with `light-dark()`. Light: muted palette. Dark: vivid steps of the same hue.

| Slot | Light | Dark |
|---|---|---|
| 1 | slate-4 `#8a9fa8` | teal-0 `#8cc4c1` |
| 2 | blue-4 `#2196f3` | blue-3 `#84c8ff` |
| 3 | green-3 `#7ce4b1` | green-4 `#00e676` |
| 4 | purple-0 `#c096c7` | purple-1 `#d500f9` |
| 5 | brown-0 `#c7a98d` | amber-3 `#ff9100` |
| 6 | teal-3 `#5d7f84` | teal-1 `#8dbdc7` |
| 7 | indigo-1 `#7079aa` | indigo-0 `#afb9de` |

RBM levels: `--color-rbm-level-N: var(--color-series-N)` for N=1..6.

`--color-data-N` removed; components use `--color-series-N` directly.

### Consequences
- Series-1 (slate-4) and series-5 (brown-0) in light theme are estimated at ~2.7:1 and ~2.5:1 contrast on white — acceptable as fill/shape colors, NOT for standalone text labels on white.
- syntax-function (slate-5) in light is ~3.35:1 — acceptable for code highlighting (non-text), marginal for AA text.
- If RBM levels need to diverge from series in future, break the alias and assign independent values.
- NAMING_CONVENTION.md updated: category `data` → `series`.

## DEC-030 — Expand series to 13; fix dark vividness for series 1/2/6/7; remove amber

- **Date:** 2026-06-30
- **Status:** Accepted
- **Related prompt:** PROMPTS.md entry 2026-06-30

### Context
Series 1, 2, 6, 7 dark values were low-chroma (desaturated aquas and pale blues) that appeared washed out on dark teal backgrounds. Series 5 used amber-3 (`#ff9100`) which is reserved for CTA (accent-secondary). Only 7 series existed; 13 needed.

### Decision
Five new palette hue families added (cyan, orange, lime, pink; indigo-2 step). Dark values for series 1/2/5/6/7 updated to high-chroma vivid colors. Six new series (8-13) covering red, yellow, lime, pink, brown, olive-green.

| Series | Light | Dark |
|---|---|---|
| 1 | slate-4 | **cyan-0** `#00e5ff` |
| 2 | **blue-3** | **blue-4** `#2196f3` |
| 3 | green-3 | green-4 (unchanged) |
| 4 | purple-0 | purple-1 (unchanged) |
| 5 | **orange-1** `#8c4a2a` | **orange-0** `#ff6d00` |
| 6 | teal-3 | **cyan-1** `#00acc1` |
| 7 | indigo-1 | **indigo-2** `#6c63ff` |
| 8 | red-3 | red-2 |
| 9 | yellow-3 | yellow-2 |
| 10 | lime-1 | lime-0 |
| 11 | pink-1 | pink-0 |
| 12 | brown-1 | brown-0 |
| 13 | green-2 | green-3 |

### Consequences
- Series 2 light changed from blue-4 → blue-3 (`#84c8ff`); contrast on white ~2.4:1 — shapes only, not for text labels.
- Series 3 and 13 both use green family in dark (green-4 vs green-3); verify they're sufficiently distinct.
- Amber (`--palette-amber-3`) now strictly reserved for `--color-accent-secondary` (CTA).

## DEC-031 — Redesign series palette from Pieq Data Colors reference

- **Date:** 2026-06-30
- **Status:** Accepted
- **Related prompt:** PROMPTS.md entry 2026-06-30

### Context
Series 1–13 used a mix of green, red, lime, and chartreuse. User provided the Pieq Data Colors reference palette and asked to use it as inspiration, avoiding green and red.

### Decision
Light values follow the reference palette exactly where possible (7 exact matches). New palette families added: steel (teal-blue midpoint), lavender, ochre; purple-2 step added. No green/red/amber in any series slot.

| Series | Light (ref) | Dark (vivid) | Hue |
|---|---|---|---|
| 1 | indigo-0 `#afb9de` | indigo-2 `#6c63ff` | Periwinkle |
| 2 | indigo-1 `#7079aa` | blue-4 `#2196f3` | Slate-blue |
| 3 | teal-0 `#8cc4c1` | cyan-0 `#00e5ff` | Soft aqua |
| 4 | teal-3 `#5d7f84` | cyan-1 `#00acc1` | Dark teal |
| 5 | steel-1 `#4b8da3` | steel-0 `#29b6f6` | Teal-blue |
| 6 | purple-2 `#9d56a9` | purple-1 `#d500f9` | Violet |
| 7 | lavender-0 `#d4aeda` | purple-0 `#c096c7` | Lavender |
| 8 | brown-0 `#c7a98d` | orange-0 `#ff6d00` | Warm sand |
| 9 | brown-1 `#665850` | brown-0 `#c7a98d` | Taupe |
| 10 | ochre-1 `#a58f52` | yellow-2 `#f8c100` | Golden ochre |
| 11 | ochre-0 `#e1d2a7` | yellow-1 `#fef3b4` | Pale sand |
| 12 | slate-4 `#8a9fa8` | teal-0 `#8cc4c1` | Cool grey |
| 13 | pink-1 `#a05478` | pink-0 `#ff4081` | Dusty rose |

### Consequences
- lime-0/1 removed from palette (no longer consumed)
- Series 11 dark (yellow-1 `#fef3b4`) is very light — works on dark bg due to high contrast but may look pale next to vivid neighbors; adjust if needed
- Series 9 dark = brown-0, same as series 8 light — different themes so no conflict, but note for future if light/dark are ever shown side by side

## DEC-032 — Reorder series to interleave cool and warm hues

- **Date:** 2026-06-30
- **Status:** Accepted
- **Related prompt:** PROMPTS.md entry 2026-06-30

### Context
Series 1–5 were all blue/teal, clustering similar hues at the start. When used sequentially in charts, the first five data points would be nearly indistinguishable.

### Decision
Reorder only (no value changes). Pattern: cool → warm → cool → warm…

| Pos | Hue | Family |
|---|---|---|
| 1 | Periwinkle | cool |
| 2 | Warm sand | warm |
| 3 | Soft aqua | cool |
| 4 | Golden ochre | warm |
| 5 | Slate-blue | cool |
| 6 | Dusty rose | warm |
| 7 | Teal-blue | cool |
| 8 | Dark taupe | warm |
| 9 | Dark teal | cool |
| 10 | Lavender | cool-warm |
| 11 | Pale sand | warm |
| 12 | Medium violet | cool |
| 13 | Cool grey | cool |

### Consequences
Existing component references to --color-series-N by number will get a different color after this change. Since no components reference series tokens yet, risk is zero now.

## DEC-033 — Un-alias --color-link; brighten light-theme value; fix hover to reinforce not erase

- **Date:** 2026-07-01
- **Status:** Superseded by DEC-034
- **Related prompt:** PROMPTS.md entry 2026-07-01

### Context
Table cell links were rendering as plain white/dark body text instead of blue, because `table.css`'s base `td, th { a { color: inherit } }` rule overrode the link color. After restoring it, a review of link readability found the light-theme value (`--palette-blue-7`, aliased from `--color-accent-primary`) was WCAG-compliant (~7:1 on white) but perceptually too close in lightness to body text to clearly register as a link in dense tabular data. Separately, the global `a:hover` rule set `color: inherit`, which erased the link color on hover instead of reinforcing it.

### Options considered
1. Keep `--color-link` aliased to `--color-accent-primary`, only fix the table override — leaves the readability complaint unaddressed and couples link color to focus rings/buttons.
2. Un-alias `--color-link` with an independent, more saturated light-theme value; fix hover to underline instead of erasing color.

### Decision
`--color-link: light-dark(var(--palette-blue-4), var(--palette-blue-3))` — light theme moves from blue-7 (`#1255b8`) to blue-4 (`#2196f3`, already an established vivid blue in the palette); dark theme unchanged. `--color-link` is no longer a duplicate of `--color-accent-primary`.

`elements.css`: `a:hover { color: inherit }` → `a:hover { text-decoration: underline }`. Applies globally (not table-scoped) since erasing color on hover was backwards UX everywhere, not just in tables.

`table.css`: added `.multilayered-table td a:not(.router-link-exact-active) { color: var(--color-link); }` to override the base cell-link inheritance. Current-page links (`.router-link-exact-active`) remain `--color-text-primary`, unchanged.

### Consequences
- `--color-accent-primary` (focus rings, active button borders, info-status accent) is unaffected by future link-color tuning, and vice versa.
- Any other component that previously relied on `a:hover` losing its color will now show an underline on hover instead — reviewed nav.css/tab.css, no conflicting hover rules found.
- `code a` already has its own scoped override (`color: inherit; text-decoration: underline`) and is unaffected.

## DEC-034 — Correct --color-link light value: blue-4 failed contrast; replace with new blue-6 step

- **Date:** 2026-07-01
- **Status:** Superseded by DEC-035
- **Related prompt:** PROMPTS.md entry 2026-07-01
- **Supersedes:** DEC-033 (light-theme value only; the un-aliasing and hover fix from DEC-033 stand)

### Context
DEC-033's light-theme value (`--palette-blue-4`, `#2196f3`) was verified after the fact to give only **3.1:1 contrast on white** — a fail against the project's non-negotiable 4.5:1 body-text minimum (CLAUDE.md §9). Increasing vividness by picking a lighter, more saturated blue directly traded away contrast, since lightness (not saturation) is what contrast ratio is sensitive to. Separately, a Figma-sourced contrast check surfaced that the Pieq spec's own link color (`#64A6F2`) fails even harder (2.53:1) — a pre-existing design-system issue, out of scope here since it's not implemented in our tokens.

User supplied a specific target: `#1E5C8D`.

### Options considered
1. Revert to blue-7 (`#1255b8`, 6.96:1) — safe, zero new palette entries, but keeps the "muted" look flagged earlier.
2. Add the user-supplied `#1E5C8D` as a new palette step — verified 7.06:1 on white, fits the existing gap in the blue ramp between blue-4 and blue-7.

### Decision
Added `--palette-blue-6: #1e5c8d` to `palette.css` (fills the existing 4→7 gap in the ordinal ramp). `--color-link` light value updated: `light-dark(var(--palette-blue-6), var(--palette-blue-3))`. Dark theme unchanged.

### Consequences
- `--color-link` now resolves to a verified-compliant, user-approved value in both themes.
- Lesson for future token changes: verify contrast against the target surface *before* committing a "more vivid" substitution — saturation and lightness are independent, and only lightness drives WCAG contrast math.
- The Figma spec's own `#64A6F2` link color remains uncorrected in Figma; if that needs addressing, it requires a separate decision explicitly diverging from or updating the Pieq spec.

## DEC-035 — Final --color-link light value: #1255B8 (blue-7); links semi-bold; remove unused blue-6

- **Date:** 2026-07-01
- **Status:** Accepted
- **Related prompt:** PROMPTS.md entry 2026-07-01
- **Supersedes:** DEC-034 (light-theme value only)

### Context
User gave a final explicit target: `#1255B8`, which is exactly the existing `--palette-blue-7` (the original pre-DEC-033 value) — no new palette entry needed. `--palette-blue-6` (added in DEC-034, `#1e5c8d`) is now unused and removed. User also asked for links to render semi-bold, and for a plain (no-link) column to be added to the PME table for a direct visual comparison.

### Decision
`--color-link: light-dark(var(--palette-blue-7), var(--palette-blue-3))`. `--palette-blue-6` removed from palette.css (orphaned, single-use, never shipped).

`table.css`: `.multilayered-table td a:not(.router-link-exact-active)` gets `font-weight: var(--font-weight-bold)` (600) in addition to the link color, so links read as visually distinct from the plain-weight numeric text around them.

`PME - Monitoring - Asset allocation - Alloq.html`: added a trailing "Reference (no link)" column — plain `0.0 EUR` text, no `<a>` wrapper — across all 38 data rows, purely as a side-by-side comparison aid. Not a real data column.

### Consequences
- Net effect after DEC-033/034/035: `--color-link` ends up back at its original value (blue-7) but is now a properly independent token (no longer aliased to `--color-accent-primary`), and links are bolder and underline-on-hover — genuine improvements survive even though the color itself round-tripped.
- The comparison column is a temporary visual aid; remove it from the HTML once the styling is confirmed, since it doesn't reflect real portfolio data.

## DEC-036 — Row type icons are tenant-configurable, not fixed per level

- **Date:** 2026-07-01
- **Status:** Accepted
- **Related prompt:** PROMPTS.md entry 2026-07-01

### Context
The multilayered table's row type icons (briefcase for portfolio/total, pie chart for return/matching, folder for allocation group) were implemented as a fixed level→icon mapping in the static HTML trial. The user clarified this mapping is not universal: which icon appears at which level is set per tenant, not hardcoded to a specific level number across all tenants.

### Decision
Treat the level→icon assignment as tenant configuration, not a fixed design-system rule. The three icon choices (briefcase-line/fill, pie-chart-2-line/fill, folder-chart-2-line/fill) and their muted color treatment remain the shared visual language, but which icon maps to which nesting level must come from tenant-level config in the real implementation, not be assumed constant.

### Consequences
- The current static HTML/CSS/JS trial (assets/js/multilayered-table.js, table.css `.row-type-icon--*` classes) hardcodes level 0/1/2 → portfolio/return/allocation for demo purposes only. This is not the production data-binding approach.
- When this moves from trial into the real app, the icon-per-level mapping needs to be sourced from tenant configuration (not hardcoded in component logic), while the icon set, line/fill swap behavior, and muted styling stay fixed per the design system.
- No token or CSS change needed now — this is a note for whoever wires the real data binding.

## DEC-037 — BandwidthRange rebuilt as a Vue SFC, not React, replacing bandwidth.css

- **Date:** 2026-07-01
- **Status:** Accepted
- **Related prompt:** PROMPTS.md entry 2026-07-01

### Context
User brought a detailed component spec from a separate Claude Chat session, written as a React/TypeScript component (`BandwidthRange.tsx`) with its own placeholder CSS variable names (`--text-success`, `--text-warning`, `--text-danger`, `--border`, etc.). Two problems: (1) every saved HTML snapshot in this repo shows clear Vue signatures (`data-v-*` scoped attributes, `<!--v-if-->`, Vue Router `router-link-active` classes) — the actual Alloq product is Vue, not React, so a React component wouldn't plug into the real codebase; (2) this repo (`alloq-themes`) has no component framework at all — it's a static token/CSS/vanilla-JS library, and the spec's color variables don't correspond to any token defined here.

### Options considered
1. Build exactly as specified (React/TSX) — fastest to match the pasted spec literally, but produces an artifact incompatible with the actual Vue-based product.
2. Build a framework-agnostic vanilla version (extending the current `bandwidth.css` SVG approach) — stays within this repo's existing pattern, but requires re-deriving from scratch and diverges further from the spec's component-based structure.
3. Build a Vue SFC (`BandwidthRange.vue`), translating the spec's colors onto this repo's existing `--color-*` tokens — matches the real product's framework; new to this repo but not to the target codebase.

### Decision
Vue SFC, `assets/vue/BandwidthRange.vue` (+ `assets/vue/BandwidthRangeDemo.vue` per the spec's demo/story deliverable). Colors mapped 1:1 from the spec's placeholder names onto existing tokens:

| Spec name | This repo's token |
|---|---|
| `--text-success` | `--color-status-positive-accent` |
| `--text-warning` | `--color-status-warning-accent` |
| `--text-danger` | `--color-status-negative-accent` |
| safe-zone wash | `--color-status-positive-bg` |
| warning-shoulder wash | `--color-status-warning-bg` |
| `--border` | `--color-border-default` |
| `--text-muted` | `--color-text-muted` |
| `--text-primary` | `--color-text-primary` |
| `--text-secondary` | `--color-text-secondary` |

Icons: Tabler (as specced) has no precedent in this repo — substituted Remix Icon equivalents (`checkbox-circle-line`/`alert-line`/`close-circle-line` for the status pill, `arrow-left/right-double-line` for card overflow chevrons), consistent with every other icon added this session.

Boundary confirmation (per spec's explicit ask): `current === lowerBound` or `=== upperBound` is never `'exceeded'`; the given `getStatus` precedence puts it in `'warning'` (it sits at the edge of the shoulder zone) since `warn > 0` whenever bounds differ. Implemented verbatim, not reinterpreted.

### Consequences
- This is the first Vue SFC ever added to this repo. `assets/vue/` is a new top-level asset category alongside `css/js/fonts/icons/images` — worth establishing as the convention if more framework components follow, or reconsidering if this repo should stay markup-agnostic.
- `bandwidth.css` (the current SVG-based visualization) is NOT deleted — this is a new component living alongside it. Swapping the real app's usage from the old visualization to `BandwidthRange.vue` is a decision for whoever integrates this into the live `productone/frontend` codebase, not something this repo can do itself.
- The `--font-family-mono`, `--radius-full`, `--font-weight-medium` etc. tokens referenced already exist in this repo's scale.css; no new tokens were introduced for this component.

## DEC-038 — Preview BandwidthRange live in PME table via Vue CDN + plain-JS port

- **Date:** 2026-07-01
- **Status:** Accepted
- **Related prompt:** PROMPTS.md entry 2026-07-01

### Context
User wanted to see the new `BandwidthRange` component (DEC-037) actually rendered in place of the old SVG visualization, inside the real PME table, rather than only in the isolated demo file. This repo's saved HTML pages have no build step and may be opened via `file://`, where runtime `.vue` SFC compilation (e.g. via a browser-side SFC loader) is unreliable — such loaders fetch the `.vue` file over XHR, which is blocked by CORS under `file://`.

### Decision
Added `assets/js/bandwidth-range.js` — a plain-JS port of `BandwidthRange.vue` using `Vue.defineComponent` with a template string, loaded via the Vue 3 global CDN build (`unpkg.com/vue@3/dist/vue.global.js`). This is a preview-only mechanism: it mounts one Vue app per `.bwr-mount` element (props read from `data-*` attributes) via a `DOMContentLoaded` listener. Styling lives in a new `assets/css/components/bandwidth-range.css`, a global (unscoped) mirror of the SFC's `<style scoped>` block.

In `PME - Monitoring - Asset allocation - Alloq.html`, replaced all 9 old `.bandwidth-visualization` SVG blocks (3 per row × 3 rows with bandwidth data: "Benchmark weight bandwidth", "Forecast weight bandwidth", "Benchmark bandwidth projection") with `.bwr-mount` divs. Real underlying data was extracted from each row's existing backtrace-linked cells rather than invented:

| Bandwidth column | current | target/lower/upper source |
|---|---|---|
| Benchmark weight bandwidth | `factualWeight` | `benchmarkWeightAllocation` / `benchmarkWeightLowerLimit` / `benchmarkWeightUpperLimit` |
| Forecast weight bandwidth | `factualWeight` | `forecastWeightAllocation` / `forecastWeightLowerLimit` / `forecastWeightUpperLimit` |
| Benchmark bandwidth projection | `newFactualWeight` | same benchmark triplet as above |

### Consequences
- `assets/js/bandwidth-range.js` and `assets/vue/BandwidthRange.vue` must be kept in sync manually — they are two representations of the same component (documented in both files' header comments). Any future prop/logic change to the component needs updating in both places, or this preview mechanism should be retired once the real app adopts the `.vue` SFC directly.
- This is the only page in the repo pulling in an external CDN script. It's scoped to this one file and commented as preview-only — not a precedent for general dependency use in this repo.
- Old `bandwidth.css` and its `.bandwidth`/`.bandwidth-visualization` classes are still defined (unused now in this specific file, but not deleted — other saved pages may still reference them).

## DEC-039 — BandwidthRange card visual refined per reference mockup; bandwidth table columns widened

- **Date:** 2026-07-01
- **Status:** Accepted
- **Related prompt:** PROMPTS.md entry 2026-07-01

### Context
User shared three reference screenshots (ok/warning/exceeded states) from the original Claude Chat exploration, showing a more refined card layout than the first pass: a header line (pulse icon + metric label + auto-computed "bandwidth ±X%"), the status pill moved to the top-right, current value and delta shown inline on one line instead of stacked, softer/more translucent safe-zone and warning-shoulder washes, and a hollow-ring dot (instead of solid fill) for the exceeded state so it doesn't visually merge into the solid red breach fill.

### Decision
Updated `card` size layout in `BandwidthRange.vue` (+ the `bandwidth-range.js` plain-JS port + `bandwidth-range.css`):
- New optional header row, shown when `label` is provided: pulse icon + `"{label} · bandwidth ±{half}{unit}"` (half-band width auto-computed, not a new prop) on the left, status pill on the right.
- If no `label` is given, the pill falls back to sitting inline next to the value/delta line, so status is never dropped entirely.
- Value + delta now render on one flex row (`align-items: baseline`) instead of stacked blocks.
- `deltaText` gained a third variant for `warning`: "approaching upper/lower limit" (previously only had "within limits" for both ok/warning, and "past X limit" for exceeded).
- Safe-zone/shoulder washes: `color-mix()` down to 55%/70% opacity for a softer look, matching the reference's muted sage/khaki tones.
- Status pill gained a `border-s` outline in the status color at 45% mix, matching the outlined-badge look in the reference (previously background-tint only, no border).
- Exceeded-state dot (card only): larger, `border-l` thick ring using `--color-surface-raised` as the fill instead of the status color, so it reads as a hollow marker sitting on top of the breach fill.
- Removed the old `.bandwidth-range__footer` block (pill + delta) — superseded by the new header/value-row layout.

Also, in `PME - Monitoring - Asset allocation - Alloq.html`: added a `bandwidth-col` class to the three affected `<th>` headers (Benchmark weight bandwidth, Forecast weight bandwidth, Benchmark bandwidth projection) and a matching `table.css` rule (`min-width: 18rem`, up from the table default `11.25rem`) so the row-size track has more room.

### Consequences
- The demo file's card examples were updated with a `label` ("Active risk") and realistic bounds (7.8/8.6/9.4) matching the reference screenshots, so the new header renders in the demo.
- `bandwidth-range.js`/`.vue`/`.css` remain three synced copies (per DEC-038) — this is now the second round of changes that had to be applied to all three; worth remembering if a fourth revision comes.
- The interactive "Move current" slider + "In band/Near/Over" quick-set buttons visible in the reference screenshots were NOT built — they read as the reference's own exploration/demo tooling, not part of the component spec's deliverables. Flagging in case that interactivity is actually wanted in `BandwidthRangeDemo.vue`.

## DEC-040 — BandwidthRange colors: reference palette steps directly, not --color-status-*

- **Date:** 2026-07-01
- **Status:** Accepted
- **Related prompt:** PROMPTS.md entry 2026-07-01

### Context
The shared `--color-status-positive-accent` (light: `green-5` `#00cc5b`) and `--color-status-negative-accent` (light: `red-3` `#ff2040`) are tuned as vivid accents for small marks — icons, borders, badges. Used for BandwidthRange's 30px current-value text, they read as neon/garish rather than the calmer forest-green/deep-maroon tone in the user's reference screenshots. This repo already has a precedent for this exact tradeoff: `bandwidth.css` bypasses shared status tokens and references `--palette-red-2` / `--palette-yellow-2` directly, with a comment explaining vivid signal colors need their own tuning separate from the shared semantic layer.

### Decision
`BandwidthRange`'s `--bwr-*` tokens now reference `--palette-*` directly instead of `--color-status-*`:

| Token | Old (status-accent) | New (direct palette) |
|---|---|---|
| `--bwr-ok` | `light-dark(green-5, green-4)` | `light-dark(green-6, green-4)` — light: muted forest `#6a9955` |
| `--bwr-warning` | `light-dark(yellow-3, yellow-2)` | unchanged — already reads well |
| `--bwr-danger` | `light-dark(red-3, red-2)` | `light-dark(red-4, red-2)` — light: deep maroon `#3b0911` |
| `--bwr-safe-wash` | `status-positive-bg` (green-0, near-white) | `green-2` `#c7d1a9` (visible sage tint) |
| `--bwr-warning-wash` | `status-warning-bg` (yellow-0/5) | `brown-0` `#c7a98d` (warm tan/khaki, matches reference) |

Dark-theme values kept vivid (unchanged or already vivid) since bright accents read fine against dark surfaces — this asymmetry (muted light / vivid dark) mirrors the same logic already applied to the `--color-series-*` ramp (DEC-029).

### Consequences
- These are component-scoped tokens (`--bwr-*`), not new shared semantic tokens — no change to `--color-status-*` or any other component that uses them.
- `--bwr-safe-wash` and `--bwr-warning-wash` are now flat (not `light-dark()`-wrapped) — same simplification `bandwidth.css` already uses for `--bw-range`. They're used via `color-mix()` at reduced opacity (DEC-039), so a single mid-tone value reads reasonably as a translucent tint in both themes.

## DEC-041 — BandwidthRange ok/warning: slate (light) / teal (dark) instead of green/yellow

- **Date:** 2026-07-01
- **Status:** Accepted
- **Related prompt:** PROMPTS.md entry 2026-07-01

### Context
User asked to replace the green (ok) and yellow (warning) colors with teal, specifying the ok color should read softer than the warning color, and that light theme should use slate rather than teal. This matches palette.css's own documented hue intent: teal is annotated as "dark-theme background ramp," while slate is "used for UI accents that need a hint of blue temperature" — explicitly the light-theme-appropriate cool accent family. Red (danger) was not mentioned and stays unchanged.

### Decision
| Token | Light (slate) | Dark (teal) |
|---|---|---|
| `--bwr-ok` (softer) | `slate-4` `#8a9fa8` | `teal-1` `#8dbdc7` |
| `--bwr-warning` (bolder) | `slate-6` `#5a6a72` | `teal-4` `#4a7a84` |
| `--bwr-safe-wash` | `slate-3` `#dde3ea` | `teal-1` |
| `--bwr-warning-wash` | `slate-5` `#7a8892` | `teal-3` `#5d7f84` |

Ok and its wash share the same "softer" step per family; warning and its wash share the "bolder" step — keeping the accent and its background tint visually paired.

### Consequences
- `--bwr-warning` no longer aliases `--color-status-warning-accent` (yellow) — fully decoupled from the shared status palette now, consistent with `--bwr-ok`/`--bwr-danger`.
- The component now uses four palette families total: slate + teal (ok/warning, theme-split) and red (danger, both themes) — no green, yellow, or brown left in this component.

## DEC-042 — Zone tints darker in dark theme; value color reverts to green; target dash theme-aware

- **Date:** 2026-07-01
- **Status:** Accepted
- **Related prompt:** PROMPTS.md entry 2026-07-01

### Context
Three issues surfaced after DEC-041's slate/teal switch: (1) the dark-theme zone tints (`teal-1`/`teal-3`) were too light relative to the actual dark surface, standing out as a bright patch instead of sitting close to the background; (2) the user wants the current-value readout specifically to read green (a clear status signal), independent from the zone tint hue; (3) the target tick was set to solid white in DEC-039, which is invisible against a light-theme track — it needs to be dark in light mode, white in dark mode. Also asked for the tick to be taller again.

### Decision
- `--bwr-ok` (current-value/dot color) reverted to green: `light-dark(green-6, green-4)` — same values as DEC-040, decoupled from the zone-tint token now that zone tints are slate/teal (DEC-041) and value color is green.
- `--bwr-warning` stays slate/teal (DEC-041, unchanged) — only the "ok" value color was called out.
- Dark-theme zone tints darkened: `--bwr-safe-wash` teal-1→teal-6, `--bwr-warning-wash` teal-3→teal-5 — both now sit close to the dark surface rather than glowing against it. Light-theme zone tints (slate-3/slate-5) unchanged.
- Target tick: `background-color: light-dark(var(--color-text-primary), var(--palette-white))` — dark in light theme, white in dark theme. Height increased 180%→220%.

### Consequences
- `--bwr-ok` and `--bwr-safe-wash` are now visually decoupled (green value text over a slate/teal-tinted zone) — this is intentional per the user's explicit ask, not an oversight.
- Warning's value color and warning-wash still share the slate/teal family (only ok was asked to diverge to green) — worth confirming this asymmetry is actually wanted, or if warning should eventually get the same value/wash split.

## DEC-043 — Current-value text is neutral; status icon (checkmark/warning/error) precedes it

- **Date:** 2026-07-01
- **Status:** Accepted
- **Related prompt:** PROMPTS.md entry 2026-07-01

### Context
User asked for the current-value text to use the plain default text color instead of status-coloring it, with a status icon (green checkmark / yellow warning / red error) placed before the text to carry the signal instead. This applies to both `card` and `row` sizes.

### Decision
`.bandwidth-range__current` and `.bandwidth-range__value` now use `var(--color-text-primary)` unconditionally. A new `.bandwidth-range__status-icon` element (reusing the existing `STATUS_ICON_PATH` set already built for the pill) is inserted immediately before the value text in both sizes, colored per `[data-status]`:
- ok → `--bwr-ok` (green)
- warning → `--color-status-warning-accent` (yellow) — deliberately NOT `--bwr-warning` (slate/teal, used for the track/zone tint per DEC-041/042). A small icon can carry the vivid yellow accent fine per DEC-040's reasoning (only large text looked garish); the track's slate/teal choice is a separate, deliberate design decision that stays untouched.
- exceeded → `--bwr-danger` (red)

Demo file (`BandwidthRangeDemo.vue`) row examples expanded from 6 to 7, each given an explicit `note` field ("ok" / "warning — ..." / "exceeded — ...") rendered in a new table column, so warning and exceeded states are unambiguous at a glance rather than requiring the viewer to mentally compute status from bounds.

### Consequences
- The component now has THREE distinct color concerns that can diverge per status: track/zone tint (`--bwr-ok`/`--bwr-warning`/`--bwr-danger`, slate/teal/red), status icon color (green/yellow/red), and value text color (always neutral). This is intentional layering, not an oversight — but worth keeping straight if further color requests come in, since "the color" could now mean any of the three.
- `--bwr-status-color` (used by the pill and previously by the value text) is now only consumed by the pill.

## DEC-044 — Row track taller, softer zone tints, value text as link-blue, green pops in light

- **Date:** 2026-07-01
- **Status:** Accepted
- **Related prompt:** PROMPTS.md entry 2026-07-01

### Context
Four refinements requested together: (1) the row-size track felt thin; (2) the safe-zone and warning-shoulder tints were too strong; (3) the current-value text (neutral since DEC-043) should read as a link — blue; (4) with the value text no longer green, `--bwr-ok`'s light-theme value (muted `green-6`, chosen in DEC-042 specifically to avoid looking neon at 30px text) could afford to be more vivid since it now only drives a small status-icon checkmark.

### Decision
- `.bandwidth-range--row .bandwidth-range__track` height: `0.5rem` → `0.65rem`.
- Safe-zone tint: `color-mix(... 55%, transparent)` → `40%`. Warning-shoulder tint: `70%` → `50%`.
- `.bandwidth-range__current` and `.bandwidth-range__value` color: `--color-text-primary` → `--color-link`.
- `--bwr-ok` light-theme value: `green-6` `#6a9955` → `green-5` `#00cc5b` (dark unchanged, `green-4`).

### Consequences
- The value text now visually reads as a link (blue, matching the rest of the app's link color) even though it isn't a clickable `<a>` — intentional per the request, worth flagging if this causes user confusion about clickability in the real app.
- `--bwr-ok`'s "pop more in light theme" only works because DEC-043 already decoupled the icon color from the value text color — if a future request moves value text back to status-coloring, this green may need re-muting to avoid the original neon-at-30px problem DEC-042 solved.

## DEC-045 — Remove standalone status icon; medium-weight value text; borderless pill; airier track

- **Date:** 2026-07-01
- **Status:** Accepted
- **Related prompt:** PROMPTS.md entry 2026-07-01

### Context
Four cleanups: (1) the standalone status-icon (checkmark/warning/error) added in DEC-043 before the value text was removed — the status pill already carries this signal, making the extra icon redundant; (2) the value text should be explicit medium weight; (3) the pill's outlined border (added in DEC-039) needed to go; (4) the safe-zone/shoulder fills touched the track's own border (added in DEC-039) with no inset, looking cramped.

### Decision
- Removed `.bandwidth-range__status-icon` element (both `card` value-row and `row` track-wrap) and its CSS block from `.vue`, `.js`, and `.css`. `STATUS_ICON_PATH`/`statusIconPath` remain — still used by the pill.
- `.bandwidth-range__value` and `.bandwidth-range__current` font-weight: literal `500` → `var(--font-weight-medium)` token reference (same value, now token-driven); `.value` gained an explicit weight it didn't have before.
- `.bandwidth-range__pill` border removed — background tint + status-colored text carry the signal alone now.
- `.bandwidth-range__track` gained `padding: 0.1875rem`. Since absolutely-positioned children (`safe-zone`, `shoulder`, ticks, dot) are offset relative to the padding box per the CSS spec, this insets all of them automatically without touching their individual `top`/`left`/`width` rules — they now sit with a small gap from the track's own border instead of touching it edge-to-edge.

### Consequences
- `--bwr-ok`'s "pop more in light theme" (DEC-044) now serves the pill exclusively, not a second checkmark icon — one less place this color needs to stay legible.
- Removing the icon simplifies the row-size visual back to: label → track (with inset zones) → blue medium-weight value, no icon clutter.

## DEC-046 — Add "Current" label, second compare marker, full-width track

- **Date:** 2026-07-01
- **Status:** Accepted
- **Related prompt:** PROMPTS.md entry 2026-07-01

### Context
User shared a reference screenshot showing: an uppercase "CURRENT" label paired with the value on one row, a second marker (hollow ring) alongside the current-value dot, and a full-width track. Clarified via questions: the second marker represents a genuinely new concept — a comparison value (e.g. forecast/projection) — requiring a new prop, not just a styling change. The existing absolute lower/target/upper tick-label row stays as-is (not switched to the reference's ±delta-from-target style).

### Decision
- New optional prop `compareValue?: number` (card size only). When provided, renders `.bandwidth-range__compare-dot` — a hollow ring in `--color-accent-primary` (blue), deliberately independent of `--bwr-status-color` so it can never be mistaken for a second status reading of the same value.
- `.bandwidth-range__value-row` restructured: `justify-content: space-between` with a new `.bandwidth-range__current-label` ("Current", uppercase, muted, small) on the left and a `.bandwidth-range__value-group` wrapper (current value + delta + inline pill) on the right.
- `.bandwidth-range` root gained `width: 100%` so the track reliably fills its container regardless of parent layout context (flex/grid siblings could otherwise shrink it to content width).
- Demo gained a 4th card example passing `compareValue`, to show the new marker without needing a real integration.

### Consequences
- This is the first prop addition to the component since its initial build (DEC-037) — `compareValue` needs to be threaded through if/when the real Vue app adopts this component, and through the PME table integration (DEC-038) if the "Benchmark bandwidth projection" column's dual-value nature (current vs. projected) should actually use this marker instead of being its own separate BandwidthRange instance.
- Row size does not support `compareValue` — the reference only showed this in a card layout; extending to row size wasn't requested and would need its own compact treatment.

## DEC-047 — Strip BandwidthRange card down to just "Current" + track

- **Date:** 2026-07-01
- **Status:** Accepted
- **Related prompt:** PROMPTS.md entry 2026-07-01

### Context
User asked to simplify the card size significantly: remove the `compareValue` second marker entirely (added in DEC-046), remove the label-driven header ("Active risk · bandwidth ±X%" + pulse icon), remove the status pill, remove the delta-vs-target text, and remove the lower/target/upper tick-value labels below the track.

### Decision
Card size is now just: "Current" label + current value (top), track with zones/ticks/dot (below) — no header, no pill, no delta, no tick-value labels. Removed entirely from `.vue`/`.js`/`.css`:
- `compareValue` prop, `comparePct` computed, `.bandwidth-range__compare-dot`
- `.bandwidth-range__header`, `.bandwidth-range__header-title`, `bandwidthLabel` computed, `PULSE_ICON_PATH`
- `.bandwidth-range__pill` (both header and inline variants), `STATUS_LABEL`/`statusLabel`, `STATUS_ICON_PATH`/`statusIconPath` (now fully unused — only the pill consumed them)
- `.bandwidth-range__delta`, `deltaText` computed
- `.bandwidth-range__tick-labels` and its lower/target/upper value+caption markup

Tick marks themselves (the physical lower/upper/target lines on the track) stay — only the text labels below were removed. `label` prop stays (still used by `row` size's own label), but card examples in both demo files no longer pass it since it has no card-size effect anymore.

### Consequences
- The component's status (`ok`/`warning`/`exceeded`) is now communicated ONLY through the dot's color and the breach fill — no text anywhere states the status in words. If a future accessibility pass wants status conveyed via text (not just color), this will need to be reintroduced in some form (e.g. an aria-label on the dot).
- Significantly less surface area to keep in sync across the three files — this reverses most of DEC-043 through DEC-046's additions.

## DEC-048 — Scale values below track; icon-in-dot (green/yellow/red); yellow warning fill; cell-sized value; PME cells → card

- **Date:** 2026-07-01
- **Status:** Accepted
- **Related prompt:** PROMPTS.md entry 2026-07-01

### Context
Batch of card refinements + a request to see them in the PME table. Every change is card-size-specific, so PME's bandwidth cells were switched from `row` to `card` to make them testable there (flagged to the user as a notable call).

### Decisions
1. **Scale values below the track** — re-added the lower / target / upper numeric values (positioned under their ticks), but with NO text captions (the "lower"/"target"/"upper" words removed in DEC-047 stay gone). New `.bandwidth-range__scale` / `__scale-value`.
2. **Icon-in-dot** — the status dot is enlarged to 0.875rem (~14px) and now contains a glyph (Remix check / exclamation / cross). Dot fill is the vivid status color: green (ok), **yellow** (warning), red (exceeded) — so `--bwr-warning` moved from slate/teal to `light-dark(yellow-3, yellow-2)` and `--bwr-danger` from the muted red-4 to vivid `red-3`. Glyph color via `--bwr-icon-color`: dark (`--color-text-on-accent`) on the bright green/yellow, white on the saturated red. The old exceeded "hollow ring" dot override is removed (the icon + border now distinguish the dot from the breach fill).
3. **Yellow warning fill** — mirrors the red breach fill but inside the band: a `--bwr-warning` (yellow) bar from the nearer wall to the current dot when status is `warning`. New `warningFill` computed + `.bandwidth-range__warning-fill`.
4. **Current value → table-cell size** — `.bandwidth-range__current` font-size 1.875rem → `var(--font-size-s)` (matches a standard cell). Weight/color unchanged (medium, link-blue).
5. **Demo note text removed** — the "warning — inside the upper shoulder" style captions deleted from both demo files.
6. **PME bandwidth cells → card** — all 9 `.bwr-mount` divs switched `data-size="row"` → `"card"`.

### Consequences
- Static zone tints (slate/teal) now coexist with vivid dynamic fills (yellow warning / red breach) layered on top — a lot going on in the warning/exceeded states; watch for visual busyness.
- The "Current" label now repeats in every PME bandwidth cell (9×). Slightly redundant against the column header — flag for the user; easy to hide in a table context if unwanted.
- PME table rows are now taller (each bandwidth cell is a ~3-line card). Acceptable for a prototype/test page.
- `--bwr-warning` no longer feeds only the dot — it now also feeds the warning fill; both are yellow, consistent.

## DEC-049 — Row size gets a hover popover for lower/target/upper; PME reverts to row

- **Date:** 2026-07-01
- **Status:** Accepted
- **Related prompt:** PROMPTS.md entry 2026-07-01

### Context
Card size (DEC-048) was confirmed as the right widget variant, but too large for table cells. The existing `row` size already matched most of what's wanted for tables — value after the track, no "Current" label — it just never showed the lower/target/upper scale values at all. Ask: bring them back, hidden until hover, in a popover.

### Decision
The `.bandwidth-range__scale` block (lower/target/upper values, no captions — DEC-048) now renders for BOTH sizes. For `row`, it gets a `.bandwidth-range__scale--popover` modifier: `position: absolute`, hidden (`opacity: 0; pointer-events: none`), revealed via `:hover`/`:focus-within` on `.bandwidth-range--row`. Pure CSS, no JS state.

PME's 9 `.bwr-mount` divs switched back `data-size="card"` → `"row"` (card was only switched in for DEC-048's testing round).

### Consequences
- **Known limitation:** the popover is positioned relative to the row component itself, not portaled to `document.body`. Inside `.data-table__main`, which has `overflow: auto` (data-table.css), the popover can get clipped if the row is near the container's edge — a real tooltip library (e.g. the app's existing Tippy.js integration, visible in other saved pages' `<style>` blocks) solves this via portaling + dynamic positioning. This trial ships the simple CSS version; flagged for follow-up if clipping turns out to be a problem in practice.
- Card's warning/breach fills and icon-in-dot stay gated to `size === 'card'` — row's dot has no icon and the track has no dynamic fills, keeping the compact table variant visually quiet apart from color.

## DEC-050 — Integrate BandwidthRange into the Dashboard's Rebalance widget

- **Date:** 2026-07-01
- **Status:** Accepted
- **Related prompt:** PROMPTS.md entry 2026-07-01

### Context
User asked for the component to also appear in the Dashboard's existing "Rebalance" widget, which already used the old `bandwidth.css` SVG visualization inline in nested disclosure headers (per-fund, per-cluster breakdowns). A first pass found only 5 instances via `class="bandwidth-visualization"`, but that search missed widgets carrying a status modifier (`bandwidth-visualization--error`, `--warning`) since the exact-string match didn't account for the extra class text before the closing quote — the real count is 12.

### Decision
Replaced all 12 old SVG widgets with `.bwr-mount` (`row` size, matching the compact inline context of a disclosure header) in `Dashboard - Alloq.html`. Since no real target/lower/upper/current data is embedded in this static capture (unlike PME's backtrace-linked cells), values were chosen to reproduce each original widget's status modifier:

| # | Context | Bounds (lower/upper/target) | Current | Status |
|---|---|---|---|---|
| 0,5 | Matching | 35/45/40 | 40.5, 39 | ok |
| 1,6 | Return | 55/65/60 | 59.5, 61 | ok |
| 2 | Cluster Onroerend goed | 10/14/12 | 15.5 | exceeded (past upper) |
| 9 | Cluster Onroerend goed | 10/14/12 | 12.2 | ok |
| 3 | Cluster Hoogrentend | 20/30/25 | 17.5 | exceeded (past lower) |
| 10 | Cluster Hoogrentend | 20/30/25 | 32 | exceeded (past upper) |
| 4 | Cluster Aandelen | 55/61/58 | 63 | exceeded (past upper) |
| 11 | Cluster Aandelen | 55/61/58 | 60.3 | warning (upper shoulder) |
| 7 | Matching | 35/45/40 | 47 | exceeded (past upper) |
| 8 | Return | 55/65/60 | 52 | exceeded (past lower) |

Added the Vue CDN script + `bandwidth-range.css`/`.js` links to the page head, same pattern as the PME table integration (DEC-038).

### Consequences
- This is now the SECOND page (after PME) pulling in the Vue CDN — still scoped/commented as preview-only, not a general dependency.
- The values are fabricated to match each widget's pre-existing status, not real portfolio data — same caveat as DEC-038's PME integration.
