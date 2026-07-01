<script setup lang="ts">
import BandwidthRange from './BandwidthRange.vue'

// Card examples — one per status, same bounds/target so only `current` differs.
const cardBounds = { lowerBound: 7.8, upperBound: 9.4, target: 8.6 }
const cardExamples = [
	{ ...cardBounds, current: 8.55 },
	{ ...cardBounds, current: 9.28 },
	{ ...cardBounds, current: 9.78 },
]

// Row examples — mixed statuses, so the "quiet healthy / loud breach" contrast is visible.
const rowExamples = [
	{ label: 'Equities', lowerBound: 30, upperBound: 40, target: 35, current: 34.8 },
	{ label: 'Fixed income', lowerBound: 20, upperBound: 30, target: 25, current: 21.1 },
	{ label: 'Real estate', lowerBound: 5, upperBound: 15, target: 10, current: 17.9 },
	{ label: 'Cash', lowerBound: 0, upperBound: 5, target: 2.5, current: 2.4 },
	{ label: 'Commodities', lowerBound: 0, upperBound: 10, target: 5, current: 5.2 },
	{ label: 'Alternatives', lowerBound: 0, upperBound: 8, target: 4, current: -1.3 },
	{ label: 'Private equity', lowerBound: 10, upperBound: 20, target: 15, current: 18.7 },
]
</script>

<template>
	<div class="bandwidth-range-demo">
		<h2>Card size — one per status</h2>
		<div class="bandwidth-range-demo__cards">
			<div v-for="(example, i) in cardExamples" :key="i" class="bandwidth-range-demo__card">
				<BandwidthRange
					:target="example.target"
					:lower-bound="example.lowerBound"
					:upper-bound="example.upperBound"
					:current="example.current"
					unit="%"
					size="card"
				/>
			</div>
		</div>

		<h2>Row size — mixed statuses in a table</h2>
		<table class="bandwidth-range-demo__table">
			<tbody>
				<tr v-for="(example, i) in rowExamples" :key="i">
					<td>
						<BandwidthRange
							:label="example.label"
							:target="example.target"
							:lower-bound="example.lowerBound"
							:upper-bound="example.upperBound"
							:current="example.current"
							unit="%"
							size="row"
						/>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<style scoped>
.bandwidth-range-demo {
	display: flex;
	flex-direction: column;
	gap: var(--length-xxl, 1.5rem);
	padding: var(--length-xxl, 1.5rem);
}

.bandwidth-range-demo__cards {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
	gap: var(--length-xl, 1rem);
}

.bandwidth-range-demo__card {
	padding: var(--length-xl, 1rem);
	border: var(--border-s, 1px) solid var(--color-border-subtle);
	border-radius: var(--radius-l, 0.75rem);
	background-color: var(--color-surface-raised);
}

.bandwidth-range-demo__table {
	width: 100%;
	border-collapse: collapse;
}
.bandwidth-range-demo__table td {
	padding: var(--length-m, 0.75rem) 0;
	border-bottom: var(--border-s, 1px) solid var(--color-border-subtle);
}
</style>
