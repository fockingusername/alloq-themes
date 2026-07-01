<script setup lang="ts">
import { computed } from 'vue'

type Status = 'ok' | 'warning' | 'exceeded'

interface BandwidthRangeProps {
	target: number
	lowerBound: number
	upperBound: number
	current: number
	size?: 'card' | 'row'
	unit?: string
	precision?: number
	windowMin?: number
	windowMax?: number
	label?: string
}

const props = withDefaults(defineProps<BandwidthRangeProps>(), {
	size: 'card',
	unit: '',
	precision: 2,
	windowMin: undefined,
	windowMax: undefined,
	label: undefined,
})

// Boundary values (current === lowerBound / upperBound) count as "ok", not
// "exceeded" — breach only triggers strictly past the wall.
function getStatus(current: number, lowerBound: number, upperBound: number): Status {
	if (current < lowerBound || current > upperBound) return 'exceeded'
	const half = (upperBound - lowerBound) / 2
	const warn = half * 0.3
	if (current <= lowerBound + warn || current >= upperBound - warn) return 'warning'
	return 'ok'
}

const status = computed<Status>(() => getStatus(props.current, props.lowerBound, props.upperBound))

const half = computed(() => (props.upperBound - props.lowerBound) / 2)
const warn = computed(() => half.value * 0.3)

const effectiveWindowMin = computed(
	() => props.windowMin ?? props.lowerBound - (props.upperBound - props.lowerBound) * 0.3
)
const effectiveWindowMax = computed(
	() => props.windowMax ?? props.upperBound + (props.upperBound - props.lowerBound) * 0.3
)

function toPct(value: number): number {
	const span = effectiveWindowMax.value - effectiveWindowMin.value
	if (span === 0) return 0
	return ((value - effectiveWindowMin.value) / span) * 100
}

function clampPct(pct: number): number {
	return Math.min(100, Math.max(0, pct))
}

const lowerPct = computed(() => clampPct(toPct(props.lowerBound)))
const upperPct = computed(() => clampPct(toPct(props.upperBound)))
const targetPct = computed(() => clampPct(toPct(props.target)))

const warningLeftEndPct = computed(() => clampPct(toPct(props.lowerBound + warn.value)))
const warningRightStartPct = computed(() => clampPct(toPct(props.upperBound - warn.value)))

const currentPctRaw = computed(() => toPct(props.current))
const isOverflowLeft = computed(() => currentPctRaw.value < 0)
const isOverflowRight = computed(() => currentPctRaw.value > 100)
const dotPct = computed(() => clampPct(currentPctRaw.value))

// Breach fill (exceeded): from the crossed wall to the (clamped) current
// position — shows how far over/under. Card size only.
const breachFill = computed(() => {
	if (status.value !== 'exceeded') return null
	if (props.current < props.lowerBound) {
		return { start: dotPct.value, end: lowerPct.value }
	}
	return { start: upperPct.value, end: dotPct.value }
})

// Warning fill: same pattern as the breach fill, but inside the band — from
// the nearer wall to the current position, showing how close it is to
// breaching. Card size only.
const warningFill = computed(() => {
	if (status.value !== 'warning') return null
	const nearUpper = props.upperBound - props.current <= props.current - props.lowerBound
	if (nearUpper) {
		return { start: dotPct.value, end: upperPct.value }
	}
	return { start: lowerPct.value, end: dotPct.value }
})

function formatNum(n: number): string {
	return n.toFixed(props.precision)
}

const currentLabel = computed(() => `${formatNum(props.current)}${props.unit}`)

// Simple glyphs (Remix Icon) shown inside the status dot: check / exclamation
// / cross. The dot's fill color already conveys status; the glyph reinforces it.
const STATUS_ICON_PATH: Record<Status, string> = {
	ok: 'M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z',
	warning: 'M11 7H13V13H11V7ZM11 15H13V17H11V15Z',
	exceeded:
		'M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z',
}
const statusIconPath = computed(() => STATUS_ICON_PATH[status.value])

const CHEVRON_LEFT_PATH =
	'M4.83582 12L11.0429 18.2071L12.4571 16.7929L7.66424 12L12.4571 7.20712L11.0429 5.79291L4.83582 12ZM10.4857 12L16.6928 18.2071L18.107 16.7929L13.3141 12L18.107 7.20712L16.6928 5.79291L10.4857 12Z'
const CHEVRON_RIGHT_PATH =
	'M19.1642 12L12.9571 5.79291L11.5429 7.20712L16.3358 12L11.5429 16.7929L12.9571 18.2071L19.1642 12ZM13.5143 12L7.30722 5.79291L5.89301 7.20712L10.6859 12L5.89301 16.7929L7.30722 18.2071L13.5143 12Z'
</script>

<template>
	<div class="bandwidth-range" :class="`bandwidth-range--${size}`" :data-status="status">
		<span v-if="size === 'row' && label" class="bandwidth-range__label">{{ label }}</span>

		<div v-if="size === 'card'" class="bandwidth-range__value-row">
			<span class="bandwidth-range__current-label">Current</span>
			<span class="bandwidth-range__current">{{ currentLabel }}</span>
		</div>

		<div class="bandwidth-range__track-wrap">
			<div
				v-if="size === 'card' && isOverflowLeft"
				class="bandwidth-range__overflow bandwidth-range__overflow--left"
				aria-hidden="true"
			>
				<svg viewBox="0 0 24 24"><path :d="CHEVRON_LEFT_PATH" /></svg>
			</div>

			<div class="bandwidth-range__track">
				<div
					class="bandwidth-range__safe-zone"
					:style="{ left: `${lowerPct}%`, width: `${upperPct - lowerPct}%` }"
				/>
				<div
					class="bandwidth-range__shoulder"
					:style="{ left: `${lowerPct}%`, width: `${warningLeftEndPct - lowerPct}%` }"
				/>
				<div
					class="bandwidth-range__shoulder"
					:style="{ left: `${warningRightStartPct}%`, width: `${upperPct - warningRightStartPct}%` }"
				/>

				<div
					v-if="size === 'card' && warningFill"
					class="bandwidth-range__warning-fill"
					:style="{ left: `${warningFill.start}%`, width: `${warningFill.end - warningFill.start}%` }"
				/>
				<div
					v-if="size === 'card' && breachFill"
					class="bandwidth-range__breach-fill"
					:style="{ left: `${breachFill.start}%`, width: `${breachFill.end - breachFill.start}%` }"
				/>

				<div class="bandwidth-range__tick bandwidth-range__tick--lower" :style="{ left: `${lowerPct}%` }" />
				<div class="bandwidth-range__tick bandwidth-range__tick--upper" :style="{ left: `${upperPct}%` }" />
				<div class="bandwidth-range__tick bandwidth-range__tick--target" :style="{ left: `${targetPct}%` }" />

				<div class="bandwidth-range__dot" :style="{ left: `${dotPct}%` }">
					<svg viewBox="0 0 24 24" aria-hidden="true"><path :d="statusIconPath" /></svg>
				</div>
			</div>

			<div
				v-if="size === 'card' && isOverflowRight"
				class="bandwidth-range__overflow bandwidth-range__overflow--right"
				aria-hidden="true"
			>
				<svg viewBox="0 0 24 24"><path :d="CHEVRON_RIGHT_PATH" /></svg>
			</div>

			<span v-if="size === 'row'" class="bandwidth-range__value">{{ currentLabel }}</span>
		</div>

		<!-- Card: always visible, tick-aligned. Row: same content, hidden until
		     hover/focus (DEC-049) — a table cell has no room to show this at rest. -->
		<div class="bandwidth-range__scale" :class="{ 'bandwidth-range__scale--popover': size === 'row' }">
			<span class="bandwidth-range__scale-value" :style="{ left: `${lowerPct}%` }">{{ formatNum(lowerBound) }}{{ unit }}</span>
			<span class="bandwidth-range__scale-value" :style="{ left: `${targetPct}%` }">{{ formatNum(target) }}{{ unit }}</span>
			<span class="bandwidth-range__scale-value" :style="{ left: `${upperPct}%` }">{{ formatNum(upperBound) }}{{ unit }}</span>
		</div>
	</div>
</template>

<style scoped>
/* Colors reference --palette-* directly rather than the shared --color-status-*
   tokens (DEC-040) — those are tuned as vivid accents for small icons/badges.
   bandwidth.css already sets this precedent in this repo (see its
   `--bw-range: var(--palette-red-2)` comment) for the same reason.
   The status colors drive the dot fill (green/yellow/red — DEC-048) and the
   dynamic warning/breach fills. The static zone tints (--bwr-safe-wash,
   --bwr-warning-wash) stay on slate (light) / teal (dark) per DEC-041/042,
   independent of the vivid status colors. */
.bandwidth-range {
	--bwr-ok: light-dark(var(--palette-green-5), var(--palette-green-4));
	--bwr-warning: light-dark(var(--palette-yellow-3), var(--palette-yellow-2));
	--bwr-danger: light-dark(var(--palette-red-3), var(--palette-red-2));
	--bwr-safe-wash: light-dark(var(--palette-slate-3), var(--palette-teal-6));
	--bwr-warning-wash: light-dark(var(--palette-slate-4), var(--palette-teal-5));
	--bwr-tick: var(--color-border-default);
	--bwr-track-bg: var(--color-surface-base);
	--bwr-status-color: var(--bwr-ok);
	/* Glyph color inside the dot — dark on the bright green/yellow, white on
	   the saturated red. */
	--bwr-icon-color: var(--color-text-on-accent);

	display: flex;
	flex-direction: column;
	width: 100%;
	gap: var(--length-s, 0.5rem);
}

.bandwidth-range[data-status='warning'] {
	--bwr-status-color: var(--bwr-warning);
}
.bandwidth-range[data-status='exceeded'] {
	--bwr-status-color: var(--bwr-danger);
	--bwr-icon-color: var(--palette-white);
}

/* ---- row (compact) ---- */
.bandwidth-range--row {
	position: relative;
	flex-direction: row;
	align-items: center;
	gap: var(--length-m, 0.75rem);
}

.bandwidth-range--row .bandwidth-range__track-wrap {
	display: flex;
	flex: 1;
	align-items: center;
	gap: var(--length-s, 0.5rem);
}

.bandwidth-range--row .bandwidth-range__track {
	height: 0.65rem;
}

.bandwidth-range__label {
	color: var(--color-text-muted);
	font-size: var(--font-size-xs);
	white-space: nowrap;
}

.bandwidth-range__value {
	color: var(--color-link);
	font-family: var(--font-family-mono);
	font-variant-numeric: tabular-nums;
	font-size: var(--font-size-s);
	font-weight: var(--font-weight-medium, 500);
	white-space: nowrap;
}

/* ---- card (full detail) ---- */
.bandwidth-range--card .bandwidth-range__track {
	height: 0.75rem; /* ~12px */
}

.bandwidth-range__value-row {
	display: flex;
	align-items: baseline;
	justify-content: space-between;
	gap: var(--length-m, 0.75rem);
}

.bandwidth-range__current-label {
	color: var(--color-text-muted);
	font-size: var(--font-size-xs);
	font-weight: var(--font-weight-medium, 500);
	text-transform: uppercase;
	letter-spacing: 0.02em;
}

.bandwidth-range__current {
	color: var(--color-link);
	font-family: var(--font-family-mono);
	font-variant-numeric: tabular-nums;
	font-size: var(--font-size-s);
	font-weight: var(--font-weight-medium, 500);
	line-height: 1.1;
}

.bandwidth-range__track-wrap {
	position: relative;
	display: flex;
	align-items: center;
	gap: var(--length-xs, 0.25rem);
}

.bandwidth-range__track {
	position: relative;
	flex: 1;
	padding: 0.1875rem;
	border: var(--border-s, 1px) solid var(--color-border-default);
	border-radius: var(--radius-full, 999px);
	background-color: var(--bwr-track-bg);
	overflow: visible;
}

.bandwidth-range__safe-zone {
	position: absolute;
	top: 0;
	bottom: 0;
	background-color: color-mix(in oklch, var(--bwr-safe-wash) 40%, transparent);
	border-radius: inherit;
}

.bandwidth-range__shoulder {
	position: absolute;
	top: 0;
	bottom: 0;
	background-color: color-mix(in oklch, var(--bwr-warning-wash) 50%, transparent);
}

.bandwidth-range__warning-fill {
	position: absolute;
	top: 0;
	bottom: 0;
	background-color: var(--bwr-warning);
	opacity: 0.85;
}

.bandwidth-range__breach-fill {
	position: absolute;
	top: 0;
	bottom: 0;
	background-color: var(--bwr-danger);
	opacity: 0.85;
}

.bandwidth-range__tick {
	position: absolute;
	top: 50%;
	width: var(--border-m, 2px);
	background-color: var(--bwr-tick);
	transform: translate(-50%, -50%);
}
.bandwidth-range__tick--lower,
.bandwidth-range__tick--upper {
	height: 100%;
}
.bandwidth-range__tick--target {
	height: 220%;
	width: var(--border-s, 1px);
	background-color: light-dark(var(--color-text-primary), var(--palette-white));
}

.bandwidth-range__dot {
	position: absolute;
	top: 50%;
	z-index: 1;

	display: flex;
	align-items: center;
	justify-content: center;

	width: 0.875rem; /* ~14px */
	height: 0.875rem;
	border: var(--border-s, 1px) solid var(--color-surface-raised);
	border-radius: 50%;
	background-color: var(--bwr-status-color);
	transform: translate(-50%, -50%);
	transition: left 0.15s ease;
}
.bandwidth-range__dot svg {
	width: 80%;
	height: 80%;
	fill: var(--bwr-icon-color);
}

.bandwidth-range__overflow {
	display: flex;
	flex-shrink: 0;
	color: var(--bwr-danger);
}
.bandwidth-range__overflow svg {
	width: 1rem;
	height: 1rem;
	fill: currentColor;
}

/* Scale values below the track — the lower / target / upper numbers, aligned
   under their tick marks. No text captions (DEC-048). */
.bandwidth-range__scale {
	position: relative;
	height: 1rem;
	font-size: var(--font-size-xs);
}
.bandwidth-range__scale-value {
	position: absolute;
	transform: translateX(-50%);
	color: var(--color-text-muted);
	font-family: var(--font-family-mono);
	font-variant-numeric: tabular-nums;
	white-space: nowrap;
}

/* Row size (table context, DEC-049): the scale is a popover, hidden until
   the row is hovered/focused — a table cell has no room to show this at
   rest. Taken out of flow (absolute) so it doesn't widen the row. */
.bandwidth-range__scale--popover {
	position: absolute;
	z-index: 10;
	top: 100%;
	left: 0;
	right: 0;

	margin-top: var(--length-xs, 0.25rem);
	padding: var(--length-s, 0.5rem) var(--length-m, 0.75rem);
	border: var(--border-s, 1px) solid var(--color-border-subtle);
	border-radius: var(--radius-m, 0.5rem);

	background-color: var(--color-surface-overlay);
	box-shadow: var(--shadow-m);

	opacity: 0;
	pointer-events: none;
	transition: opacity 0.15s ease;
}

.bandwidth-range--row:hover .bandwidth-range__scale--popover,
.bandwidth-range--row:focus-within .bandwidth-range__scale--popover {
	opacity: 1;
	pointer-events: auto;
}
</style>
