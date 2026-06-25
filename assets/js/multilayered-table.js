document.querySelectorAll('.multilayered-table').forEach((table) => {
	table.querySelectorAll('.row-name__button').forEach((button) => {
		const row = button.closest('tr');

		button.addEventListener('mouseenter', () => {
			const level = parseInt(row.style.getPropertyValue('--level').trim() || '0', 10);
			let sibling = row.nextElementSibling;
			while (sibling) {
				const siblingLevel = parseInt(sibling.style.getPropertyValue('--level').trim() || '0', 10);
				if (siblingLevel <= level) break;
				sibling.classList.add('is-child-hovered');
				sibling = sibling.nextElementSibling;
			}
		});

		button.addEventListener('mouseleave', () => {
			table.querySelectorAll('.is-child-hovered').forEach((r) => r.classList.remove('is-child-hovered'));
		});
	});
});
