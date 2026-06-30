# Token Naming Convention

> The rules for naming design tokens in Alloq.
> Grounded in the [Primer design system token-naming guidance](https://primer.style/product/primitives/token-names/), adapted to Alloq's two-layer architecture (DEC-004).
> When in doubt, a token name should answer: **"what role does this play?"** — never "what color/value is this?"

---

## 1. The two layers

Every color token belongs to exactly one layer. The layer determines the prefix.

| Layer | Prefix | What it is | Theme-adaptive? | Used in components? |
|---|---|---|---|---|
| **Layer 1 — Palette** | `--palette-*` | Raw, fixed values. The brand's source-of-truth swatches. | No | **Never** |
| **Layer 2 — Semantic** | `--color-*` | Role-based aliases that map to palette values per theme. | Yes (`light-dark()`) | **Always** |

```css
/* Layer 1 — a raw value, fixed regardless of theme */
--palette-blue-1: #294bff;

/* Layer 2 — a role, resolved per theme */
--color-accent-primary: light-dark(var(--palette-blue-1), var(--palette-blue-0));
```

**Rule:** If a token uses `light-dark()` or describes a role, it is `--color-*` and lives in the Layer 2 section. If it is a fixed swatch, it is `--palette-*` and lives in the Layer 1 section. A `--color-*` token holding a raw hex with no role is a smell — it probably belongs in the palette.

---

## 2. Name structure

Primer's full grammar is `prefix-namespace-pattern-variant-property-variant-scale`. Alloq uses a simplified, **category-first** form:

```
--<layer>-<category>-<role>-<variant>
```

- `--color-surface-raised`
- `--color-text-muted`
- `--color-status-positive-accent`
- `--palette-dark-3`

### Category-first vs property-first

Primer leads with the **CSS property** (`bgColor-default`, `fgColor-muted`, `borderColor-emphasis`). Alloq leads with the **thing being styled** (`surface`, `text`, `border`). This is a deliberate divergence (see DEC-009) — both are internally consistent; Alloq's groups tokens by mental model ("I'm styling a surface") rather than by CSS property.

| Primer (property-first) | Alloq (category-first) |
|---|---|
| `bgColor-default` | `--color-surface-raised` |
| `fgColor-muted` | `--color-text-muted` |
| `borderColor-emphasis` | `--color-border-strong` |

**Pick one and stay consistent.** Do not introduce `--color-bgColor-*` style names.

---

## 3. Formatting rules

- **Blocks separated by dashes.** `--color-status-positive-accent`.
- **camelCase inside a multi-word block** (Primer rule). A multi-word *role* stays in one block: `--color-surfaceOverlay` would be wrong here — Alloq treats `surface` as the category and `overlay` as the role, so it is `--color-surface-overlay`. Reserve camelCase for genuinely compound single concepts.
- **No value words in names.** `--color-surface-raised` ✅. `--color-surface-lightgrey` ❌.
- **Lowercase throughout.**

---

## 4. Categories (Layer 2 roles)

| Category | Purpose | Roles in use |
|---|---|---|
| `surface` | Background fills by elevation tier (DEC-016): canvas (`base`, `page`) → `raised` → `overlay`; plus off-ramp roles | `base`, `page`, `raised`, `elevated`, `overlay`, `sunken`, `subtle`, `muted`, `interactive`, `field` |
| `text` | Foreground text | `primary`, `secondary`, `muted` |
| `border` | Border & divider colors | `subtle`, `default`, `strong`, `focus` |
| `accent` | Brand emphasis color | `primary`, `secondary` |
| `interactive` | Interaction-state backgrounds | `hover`, `active`, `disabled`, `selected` |
| `status` | State of financial entities (see DEC-006) | `{info\|positive\|negative\|warning\|neutral}` × `{bg\|fg\|accent}` |
| `fill` | Alpha overlays for decorative fills | `base`, `low`, `medium`, `high` |
| `link` | Hyperlink color | _(single token)_ |
| `series` | Categorical color series for data viz and domain tokens (DEC-029) | `1`–`7` |
| `syntax` | Code highlighting | by token type |

---

## 5. Variant vocabulary

Use these words — and only these — for the named modifiers Primer defines. Don't invent synonyms (`strong` vs `bold` vs `dark`).

### Color emphasis (Primer)
`default` · `muted` · `emphasis`

> Alloq extends this set pragmatically: `strong` (a heavier `border`), `subtle` (a lighter `surface`). Where a Primer word fits, prefer it.

### Interactive state (Primer)
`rest` · `hover` · `active` · `disabled` · `selected`

> `rest` needs no token — it is the default with no background.

### Size scale (T-shirt — Primer)
`xs` · `s` · `m` · `l` · `xl` · `xxl`

Used by `--length-*`, `--font-size-*`, `--radius-*`, `--gutter-*`, `--icon-size-*`, `--max-width-*`, `--border-*`.

**Always carry the suffix, even for the middle of the scale.** `--icon-size-m` ✅, not `--icon-size` (DEC-009). A token with a sibling at another size must declare its own step.

### Ordinal scale
Palette ramps are hue-named and use `0`-based ordinals where **`0` = lightest** (DEC-024, DEC-025):
`--palette-blue-0` … `--palette-blue-10`, `--palette-teal-0` … `--palette-teal-11`, `--palette-grey-0` … `--palette-grey-8`.
The palette holds only hue families (`blue`, `green`, `red`, `yellow`, `amber`, `teal`, `indigo`, `purple`, `brown`, `slate`, `grey`) plus `black`/`white` anchors — no role-, domain-, or theme-named ramps.
Semantic series tokens (`--color-data-1` … `-7`) are `1`-based and carry no lightness meaning; they map onto hue swatches.

> Do not mix scale systems within one ramp. The Material-style `100`–`900` scale is **not** used (DEC-010).

---

## 6. Status tokens — the property suffix

Status colors carry a third block describing **what surface of the element** they paint:

| Suffix | Role | Example use |
|---|---|---|
| `-bg` | Badge / tag background | `background-color` |
| `-fg` | Text/foreground **on top of** the matching `-bg` | `color` inside a filled badge |
| `-accent` | Vivid standalone accent — icons, borders, marks on a neutral surface | icon `color`, `border-left` |

```css
--color-status-positive-bg:     /* fill behind a "positive" badge */
--color-status-positive-fg:     /* text on that badge */
--color-status-positive-accent: /* a positive icon on a normal surface */
```

> `-accent` replaced the earlier `-icon` (DEC-010): the color is not icon-specific — it is used for borders and marks too. Name the role, not the element.

The raw status swatches and their `-emphasis`/`-muted` tints are **Layer 1** (`--palette-status-*`), referenced only internally by the adaptive `-bg`/`-fg` tokens — never by components.

---

## 7. Component-local variables — the theming contract (DEC-026)

Every component exposes its themable surface as a block of `--<component>-*` custom properties at the top of its base rule. These knobs **are** the component's theming contract: to retheme — per variant, per state, or per consumer — you override a knob; you never edit the body. This is applied **uniformly** across all components so the mental model is the same everywhere (read the top block, know everything that's tweakable).

```css
.tag {
  /* theming contract — every token-driven visual property, defaulting to a global token */
  --tag-bg:        var(--color-surface-chip);
  --tag-bg-hover:  var(--color-surface-elevated);
  --tag-fg:        var(--color-text-primary);
  --tag-border:    var(--border-s) solid var(--color-border-default);
  --tag-radius:    var(--radius-full);
  --tag-padding:   0 var(--length-m);
  --tag-accent:    var(--color-status-neutral-accent);

  /* body consumes only the knobs… */
  background-color: var(--tag-bg);
  border: var(--tag-border);
  border-radius: var(--tag-radius);

  /* …structural CSS stays inline */
  display: inline-flex;
  position: relative;
}

.tag--positive { --tag-accent: var(--color-status-positive-accent); }
.tag__icon     { color: var(--tag-accent); }
```

**What gets a knob:** every property whose value comes from a design token — color, background, border, radius, padding, gap, typography. The knob defaults to the global token (`--tag-radius: var(--radius-full)`), so the scale stays the single source of truth and the mapping is visible in one predictable place.

**What does NOT get a knob:** structural and effect CSS that isn't theming surface — `display`, `position`, `align-items`, `white-space`, mask/animation machinery, literal keywords (`font-weight: normal`). Wrapping these adds indirection nobody overrides.

**Why uniform** (not just a single knob): the cost is a few lines of static CSS per component — negligible at render time (scoped custom properties don't measurably affect style recalc; the expensive pattern is many frequently-mutated `:root` vars, not static component knobs). The payoff is a consistent theming contract: predictable to read, safe to override, and duplication (e.g. specificity-override blocks) collapses to re-reading the same knobs so copies never drift.

Rules:
- Prefix with a **short component abbreviation** (`--tag-*`, `--bw-*`, `--notification-*`), not the full BEM block.
- Knob defaults reference Layer 2 semantic tokens (or scale tokens) — never palette or raw values.
- Keep them inside the component CSS file; they are not global tokens.
- The body of the component references **only** its own knobs for themable properties.

---

## 8. Checklist before adding a token

1. Is it a fixed swatch or a role? → choose `--palette-*` or `--color-*`.
2. Does the name describe **role**, never value?
3. Right **category** for what it styles (`surface`/`text`/`border`/…)?
4. Variant word from the **approved vocabulary** (§5)?
5. If it has siblings at other sizes/steps, does it carry its **own scale suffix**?
6. For status: correct **`-bg`/`-fg`/`-accent`** suffix?
7. Will components reference only this (Layer 2), never a palette token?

If any answer is "no," rename before committing. A token-value change that ripples through components needs a `DECISIONS.md` entry.
