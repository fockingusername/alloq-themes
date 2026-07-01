document.querySelectorAll('.mlt-toggle__input').forEach((input) => {
	const table = input.closest('.data-table')?.querySelector('.multilayered-table');
	if (!table) return;

	input.addEventListener('change', () => {
		table.classList.toggle('multilayered-table--depth-tint', input.checked);
	});
});

function getLevel(row) {
	return parseInt(row.style.getPropertyValue('--level').trim() || '0', 10);
}

document.querySelectorAll('.multilayered-table').forEach((table) => {
	table.querySelectorAll('.row-name__button').forEach((button) => {
		const row = button.closest('tr');

		button.addEventListener('mouseenter', () => {
			const level = getLevel(row);
			let sibling = row.nextElementSibling;
			while (sibling) {
				const siblingLevel = getLevel(sibling);
				if (siblingLevel <= level) break;
				sibling.classList.add('is-child-hovered');
				sibling = sibling.nextElementSibling;
			}
		});

		button.addEventListener('mouseleave', () => {
			table.querySelectorAll('.is-child-hovered').forEach((r) => r.classList.remove('is-child-hovered'));
		});

		// Expand/collapse: hides/shows descendant rows and swaps this row's
		// type icon between its fill (expanded) and line (collapsed) variant.
		button.setAttribute('aria-expanded', 'true');

		button.addEventListener('click', () => {
			const level = getLevel(row);
			const collapsed = row.classList.toggle('is-collapsed');
			button.setAttribute('aria-expanded', String(!collapsed));

			let sibling = row.nextElementSibling;
			let skipBelowLevel = null;
			while (sibling) {
				const siblingLevel = getLevel(sibling);
				if (siblingLevel <= level) break;
				if (collapsed) {
					sibling.style.display = 'none';
				} else if (skipBelowLevel !== null && siblingLevel > skipBelowLevel) {
					// stays hidden — nested under a still-collapsed descendant
				} else {
					skipBelowLevel = null;
					sibling.style.display = '';
					if (sibling.classList.contains('is-collapsed')) {
						skipBelowLevel = siblingLevel;
					}
				}
				sibling = sibling.nextElementSibling;
			}

			const icon = row.querySelector('.row-type-icon');
			const path = icon?.querySelector('path');
			const newPath = collapsed ? icon?.dataset.pathLine : icon?.dataset.pathFill;
			if (path && newPath) path.setAttribute('d', newPath);
		});
	});
});
