document.querySelectorAll('.table-settings').forEach((wrapper) => {
	const trigger = wrapper.querySelector('.table-settings__trigger');
	const menu = wrapper.querySelector('.table-settings-menu');
	if (!trigger || !menu) return;

	const close = () => {
		menu.hidden = true;
		trigger.setAttribute('aria-expanded', 'false');
	};

	const open = () => {
		menu.hidden = false;
		trigger.setAttribute('aria-expanded', 'true');
	};

	trigger.addEventListener('click', (event) => {
		event.stopPropagation();
		if (menu.hidden) open();
		else close();
	});

	document.addEventListener('click', (event) => {
		if (!menu.hidden && !wrapper.contains(event.target)) close();
	});

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && !menu.hidden) {
			close();
			trigger.focus();
		}
	});
});
