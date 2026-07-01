/* Plain-JS port of assets/vue/BandwidthRange.vue for static-file preview
   (this repo has no build step, and the .vue SFC can't be loaded directly
   from file:// or without a compiler). Keep this in sync with the .vue
   source — the .vue file is the canonical version for the real app. */
window.BandwidthRange = Vue.defineComponent({
	props: {
		target: { type: Number, required: true },
		lowerBound: { type: Number, required: true },
		upperBound: { type: Number, required: true },
		current: { type: Number, required: true },
		size: { type: String, default: 'card' },
		unit: { type: String, default: '' },
		precision: { type: Number, default: 2 },
		windowMin: { type: Number, default: undefined },
		windowMax: { type: Number, default: undefined },
		label: { type: String, default: undefined },
	},
	setup(props) {
		const { computed } = Vue;

		function getStatus(current, lowerBound, upperBound) {
			if (current < lowerBound || current > upperBound) return 'exceeded';
			const half = (upperBound - lowerBound) / 2;
			const warn = half * 0.3;
			if (current <= lowerBound + warn || current >= upperBound - warn) return 'warning';
			return 'ok';
		}

		const status = computed(() => getStatus(props.current, props.lowerBound, props.upperBound));
		const half = computed(() => (props.upperBound - props.lowerBound) / 2);
		const warn = computed(() => half.value * 0.3);

		const effectiveWindowMin = computed(
			() => props.windowMin ?? props.lowerBound - (props.upperBound - props.lowerBound) * 0.3
		);
		const effectiveWindowMax = computed(
			() => props.windowMax ?? props.upperBound + (props.upperBound - props.lowerBound) * 0.3
		);

		function toPct(value) {
			const span = effectiveWindowMax.value - effectiveWindowMin.value;
			if (span === 0) return 0;
			return ((value - effectiveWindowMin.value) / span) * 100;
		}
		function clampPct(pct) {
			return Math.min(100, Math.max(0, pct));
		}

		const lowerPct = computed(() => clampPct(toPct(props.lowerBound)));
		const upperPct = computed(() => clampPct(toPct(props.upperBound)));
		const targetPct = computed(() => clampPct(toPct(props.target)));
		const warningLeftEndPct = computed(() => clampPct(toPct(props.lowerBound + warn.value)));
		const warningRightStartPct = computed(() => clampPct(toPct(props.upperBound - warn.value)));

		const currentPctRaw = computed(() => toPct(props.current));
		const isOverflowLeft = computed(() => currentPctRaw.value < 0);
		const isOverflowRight = computed(() => currentPctRaw.value > 100);
		const dotPct = computed(() => clampPct(currentPctRaw.value));

		const breachFill = computed(() => {
			if (status.value !== 'exceeded') return null;
			if (props.current < props.lowerBound) {
				return { start: dotPct.value, end: lowerPct.value };
			}
			return { start: upperPct.value, end: dotPct.value };
		});

		const warningFill = computed(() => {
			if (status.value !== 'warning') return null;
			const nearUpper = props.upperBound - props.current <= props.current - props.lowerBound;
			if (nearUpper) {
				return { start: dotPct.value, end: upperPct.value };
			}
			return { start: lowerPct.value, end: dotPct.value };
		});

		function formatNum(n) {
			return n.toFixed(props.precision);
		}
		const currentLabel = computed(() => `${formatNum(props.current)}${props.unit}`);

		const STATUS_ICON_PATH = {
			ok: 'M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z',
			warning: 'M11 7H13V13H11V7ZM11 15H13V17H11V15Z',
			exceeded:
				'M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z',
		};
		const statusIconPath = computed(() => STATUS_ICON_PATH[status.value]);

		const CHEVRON_LEFT_PATH =
			'M4.83582 12L11.0429 18.2071L12.4571 16.7929L7.66424 12L12.4571 7.20712L11.0429 5.79291L4.83582 12ZM10.4857 12L16.6928 18.2071L18.107 16.7929L13.3141 12L18.107 7.20712L16.6928 5.79291L10.4857 12Z';
		const CHEVRON_RIGHT_PATH =
			'M19.1642 12L12.9571 5.79291L11.5429 7.20712L16.3358 12L11.5429 16.7929L12.9571 18.2071L19.1642 12ZM13.5143 12L7.30722 5.79291L5.89301 7.20712L10.6859 12L5.89301 16.7929L7.30722 18.2071L13.5143 12Z';

		return {
			status,
			lowerPct,
			upperPct,
			targetPct,
			warningLeftEndPct,
			warningRightStartPct,
			dotPct,
			isOverflowLeft,
			isOverflowRight,
			breachFill,
			warningFill,
			currentLabel,
			statusIconPath,
			CHEVRON_LEFT_PATH,
			CHEVRON_RIGHT_PATH,
			formatNum,
		};
	},
	template: `
		<div class="bandwidth-range" :class="\`bandwidth-range--\${size}\`" :data-status="status">
			<span v-if="size === 'row' && label" class="bandwidth-range__label">{{ label }}</span>

			<div v-if="size === 'card'" class="bandwidth-range__value-row">
				<span class="bandwidth-range__current-label">Current</span>
				<span class="bandwidth-range__current">{{ currentLabel }}</span>
			</div>

			<div class="bandwidth-range__track-wrap">
				<div v-if="size === 'card' && isOverflowLeft" class="bandwidth-range__overflow bandwidth-range__overflow--left" aria-hidden="true">
					<svg viewBox="0 0 24 24"><path :d="CHEVRON_LEFT_PATH" /></svg>
				</div>

				<div class="bandwidth-range__track">
					<div class="bandwidth-range__safe-zone" :style="{ left: lowerPct + '%', width: (upperPct - lowerPct) + '%' }" />
					<div class="bandwidth-range__shoulder" :style="{ left: lowerPct + '%', width: (warningLeftEndPct - lowerPct) + '%' }" />
					<div class="bandwidth-range__shoulder" :style="{ left: warningRightStartPct + '%', width: (upperPct - warningRightStartPct) + '%' }" />
					<div v-if="size === 'card' && warningFill" class="bandwidth-range__warning-fill" :style="{ left: warningFill.start + '%', width: (warningFill.end - warningFill.start) + '%' }" />
					<div v-if="size === 'card' && breachFill" class="bandwidth-range__breach-fill" :style="{ left: breachFill.start + '%', width: (breachFill.end - breachFill.start) + '%' }" />
					<div class="bandwidth-range__tick bandwidth-range__tick--lower" :style="{ left: lowerPct + '%' }" />
					<div class="bandwidth-range__tick bandwidth-range__tick--upper" :style="{ left: upperPct + '%' }" />
					<div class="bandwidth-range__tick bandwidth-range__tick--target" :style="{ left: targetPct + '%' }" />
					<div class="bandwidth-range__dot" :style="{ left: dotPct + '%' }">
						<svg viewBox="0 0 24 24" aria-hidden="true"><path :d="statusIconPath" /></svg>
					</div>
				</div>

				<div v-if="size === 'card' && isOverflowRight" class="bandwidth-range__overflow bandwidth-range__overflow--right" aria-hidden="true">
					<svg viewBox="0 0 24 24"><path :d="CHEVRON_RIGHT_PATH" /></svg>
				</div>

				<span v-if="size === 'row'" class="bandwidth-range__value">{{ currentLabel }}</span>
			</div>

			<div class="bandwidth-range__scale" :class="{ 'bandwidth-range__scale--popover': size === 'row' }">
				<span class="bandwidth-range__scale-value" :style="{ left: lowerPct + '%' }">{{ formatNum(lowerBound) }}{{ unit }}</span>
				<span class="bandwidth-range__scale-value" :style="{ left: targetPct + '%' }">{{ formatNum(target) }}{{ unit }}</span>
				<span class="bandwidth-range__scale-value" :style="{ left: upperPct + '%' }">{{ formatNum(upperBound) }}{{ unit }}</span>
			</div>
		</div>
	`,
});

document.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('.bwr-mount').forEach((el) => {
		Vue.createApp(window.BandwidthRange, {
			current: parseFloat(el.dataset.current),
			target: parseFloat(el.dataset.target),
			lowerBound: parseFloat(el.dataset.lower),
			upperBound: parseFloat(el.dataset.upper),
			unit: el.dataset.unit || '%',
			size: el.dataset.size || 'row',
			label: el.dataset.label || undefined,
			precision: el.dataset.precision ? parseFloat(el.dataset.precision) : 2,
		}).mount(el);
	});
});
