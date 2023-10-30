function find(key, filter) {
	const arrayString = localStorage.getItem(key);
	let array;
	if (arrayString === null) {
		array = [];
	} else {
		array = JSON.parse(arrayString);
	}
	array = array.filter((el) => {
		for (const filterKey of Object.keys(filter)) {
			if (el[filterKey] !== filter[filterKey]) {
				return false;
			}
		}
		return true;
	});
	return array;
}

function add(key, value) {
	let array = find(key, {});
	array = [...array, value];
	localStorage.setItem(key, JSON.stringify(array));
}

function deleteById(key, id) {
	let array = find(key, {});
	array = array.filter((el) => el.id !== id);
	localStorage.setItem(key, JSON.stringify(array));
}

export { find, add, deleteById };
