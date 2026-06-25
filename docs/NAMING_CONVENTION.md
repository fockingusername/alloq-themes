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
| `data` | Chart/visualization series | `1`–`7` |
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
Palette ramps and series use `0`-based ordinals where **`0` = lightest**:
`--palette-light-0` … `--palette-light-6`, `--palette-dark-0` … `--palette-dark-6`, `--palette-blue-0`/`-1`.
Series tokens (`--color-data-1` … `-7`) are `1`-based and carry no lightness meaning.

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

## 7. Component-local variables

A component may define its own `--<component>-*` custom properties to create a single themable knob. Variants then set only that knob; everything else inherits from the base rule.

```css
.tag            { --tag-accent: var(--color-status-neutral-accent); }
.tag--positive  { --tag-accent: var(--color-status-positive-accent); }
.tag__icon      { color: var(--tag-accent); }
```

Rules:
- Prefix with a **short component abbreviation** (`--tag-*`, `--bw-*`, `--notification-*`), not the full BEM block.
- These reference Layer 2 tokens — never palette or raw values.
- Keep them inside the component CSS file; they are not global tokens.

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
