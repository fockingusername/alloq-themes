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
- **Status:** Accepted
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
