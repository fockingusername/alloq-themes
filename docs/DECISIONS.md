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
