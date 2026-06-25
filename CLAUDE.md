# CLAUDE.md

> Operating manual for Claude Code on the **Alloq** project.
> Scope: **theme optimization only** — no new features, no new components.

---

## Project

- **Product:** Alloq
- **Design System:** Pieq ([Figma](https://www.figma.com/design/cBixzV5FoykkmQQqKu7w7t/Pieq-%7C-Design-System))
- **Stack:** Vue 3 · TypeScript · CSS
- **Fonts:** Inter (UI) · Roboto Mono (tables & financial data)
- **Themes:** Dark + Light (equal first-class citizens)

Token naming rules live in `docs/NAMING_CONVENTION.md` (the authority for any token name). Theme choices and rationale live in `docs/DECISIONS.md`. The tokens themselves are the source of truth: `assets/css/tokens/` (palette · semantic · scale).

---

## Scope of work

Claude Code's job here is to **optimize the theme system** — build and refine the semantic token layer, map it correctly per theme, fix inconsistencies, improve contrast/hierarchy, align components with the Pieq spec.

**In scope:**
- Building and maintaining the semantic token layer
- Mapping semantic tokens to primitives per theme (dark + light)
- Replacing hardcoded values and primitive token references in components with semantic tokens
- Aligning existing components to the design system (colors, spacing, typography, radii)
- Fixing focus states, hover states, status color usage
- Improving contrast and accessibility — verified in both themes
- Consolidating duplicate or near-duplicate tokens

**Out of scope (do not do without asking):**
- Building new components or pages
- Adding new dependencies
- Changing component APIs or props
- Restructuring files or folders

If a request drifts out of scope, stop and flag it.

---

## Token architecture (DEC-004, DEC-022)

Two layers, split by concern across three files in `assets/css/tokens/` (all in `@layer settings :root`). Components reference only the semantic layer, never primitives.

```
assets/css/tokens/
  palette.css    Layer 1 — raw --palette-* values (the only file with raw colors); never used in components
  semantic.css   Layer 2 — role-based --color-* via light-dark() (+ syntax/data/rbm domain tokens); used everywhere
  scale.css      non-color design tokens — --length-*, --gutter-*, --radius-*, --font-*, --shadow-*, --border-*, sizes
```

Load order (the `@layer` declaration lives at the top of `palette.css`): `fonts → tokens/palette → tokens/semantic → tokens/scale → base → …`.

**Theme selection:** `<body data-theme="light|dark">` sets `color-scheme` (in `base.css`); every `--color-*` token resolves per scheme via `light-dark(<light>, <dark>)`. There are no per-theme files — switching `data-theme` flips every token at once.

**Semantic token naming — describe role, not value** (full list in `tokens/semantic.css`; naming rules in `NAMING_CONVENTION.md`):

| Category | Roles |
|---|---|
| Surface | `base` · `page` · `raised` · `overlay` · `elevated` · `sunken` · `subtle` · `muted` · `interactive` · `field` · `table-header` |
| Text | `primary` · `secondary` · `muted` |
| Border | `subtle` · `default` · `strong` · `focus` |
| Accent | `primary` (blue) · `secondary` (amber — the Yellow Route) |
| Interactive | `hover` · `active` · `disabled` · `selected` |
| Fill | `base` · `low` · `medium` · `high` (alpha overlays) |
| Status | `{info\|positive\|negative\|warning\|neutral}` × `{bg\|fg\|accent}` |
| Link | _(single token)_ |
| Data viz | `--color-data-1` … `--color-data-7` |
| Domain | `--color-syntax-*` · `--color-rbm-level-*` |

---

## Non-negotiables

1. **Semantic tokens only in components.** Never reference `--color-primary-###` or other primitives in component styles. Only semantic tokens.
2. **Token names describe role, not value.** `--color-surface-raised` is honest in both themes. `--color-primary-300` is not. Follow `docs/NAMING_CONVENTION.md` for every token name.
3. **Primitives are stable.** Don't change primitive values without a decision entry — they're the palette foundation.
4. **Roboto Mono** for all numeric/tabular cells, right-aligned, `tabular-nums`.
5. **Inter** for everything else.
6. **Yellow Route preserved.** `--color-accent-secondary` (amber) keeps its visual weight in both themes. (`--color-accent-primary` is the blue accent.)
7. **Status color ≠ only signal.** Always paired with icon or text label.
8. **Focus states** use `--color-border-focus` (= `--color-accent-primary`, blue). Don't remove or weaken them.
9. **Contrast:** 4.5:1 body text, 3:1 large text and UI — verify every change in both themes.

---

## Files Claude maintains

| File | Purpose |
|---|---|
| `CLAUDE.md` | This file. Scope + rules + index. |
| `assets/css/tokens/` | The tokens themselves — `palette.css` · `semantic.css` · `scale.css`. Source of truth for values. |
| `docs/NAMING_CONVENTION.md` | Token naming rules (Primer-based). The authority for naming any token. |
| `docs/PROMPTS.md` | Log of every prompt given to Claude Code. |
| `docs/DECISIONS.md` | Decision log for theme choices, with rationale. |

**Every session:** append to `docs/PROMPTS.md`. When a theme choice is made that future work should respect, also append to `docs/DECISIONS.md`.

---

## How to log a prompt

Append to `docs/PROMPTS.md`. Newest at the bottom.

```markdown
### [YYYY-MM-DD] — <short title>

**Prompt:**
<verbatim or near-verbatim user prompt>

**Tokens / files touched:**
- assets/css/tokens.css
- components/PieqXyz.vue

**Outcome:**
<one or two sentences: what changed, before → after if relevant>

**Related decision:** DEC-### (if any)
```

Rules:
- One entry per prompt, even small ones.
- Note before → after values when adjusting tokens (e.g. `--color-primary-300: #03363D → #043A42`).
- Log what was actually asked, not a tidied version.

---

## How to log a decision

Append to `docs/DECISIONS.md`. Each decision gets a stable ID (`DEC-001`, `DEC-002`, …).

```markdown
## DEC-### — <title>

- **Date:** YYYY-MM-DD
- **Status:** Proposed | Accepted | Superseded by DEC-### | Reverted
- **Related prompt:** PROMPTS.md entry date

### Context
<what theme problem, what constraint>

### Options considered
1. <option A> — pros / cons
2. <option B> — pros / cons

### Decision
<what we chose, with the exact token values if applicable>

### Consequences
<what this affects across the app, what to watch for>
```

Log a decision when:
- Changing a token value that ripples through multiple components
- Picking one contrast/hierarchy approach over another
- Deliberately diverging from the Pieq Figma spec
- Consolidating or deprecating a token

Decisions are append-only. Don't edit accepted decisions — supersede them with a new entry and update the old status.

---

## What to do at the start of a task

1. Read this file.
2. Skim `docs/DECISIONS.md` for prior theme choices in the area being touched.
3. Check `assets/css/tokens/` (palette / semantic / scale) for the relevant tokens.
4. Adding or renaming a token? Check `docs/NAMING_CONVENTION.md` first.
5. Make the change.
6. Append to `docs/PROMPTS.md`. Append to `docs/DECISIONS.md` if applicable.

## What to do when unsure

- Request out of scope (new component, new feature) → ask before proceeding.
- Token value change would affect many components → propose a decision entry first.
- Conflict with an existing decision → flag it, propose a superseding decision.

---

*Keep this file short. Token values live in `assets/css/tokens/`; naming rules in `docs/NAMING_CONVENTION.md`; rationale in `docs/DECISIONS.md`.*
