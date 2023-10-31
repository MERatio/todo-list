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

function findByIdAndUpdate(key, id, updatedProps) {
	let array = find(key, {});
	const value = array.find((el) => el.id === id);
	const updatedValue = Object.assign(value, updatedProps);
	array = array.map((el) => (el.id === id ? updatedValue : el));
	localStorage.setItem(key, JSON.stringify(array));
	return updatedValue;
}

function deleteById(key, id) {
	let array = find(key, {});
	array = array.filter((el) => el.id !== id);
	localStorage.setItem(key, JSON.stringify(array));
}

function deleteMany(key, conditions) {
	let array = find(key, {});
	array = array.filter((el) => {
		for (const conditionKey in Object.keys(conditions)) {
			return !(el[conditionKey] === conditions[conditionKey]);
		}
	});
	localStorage.setItem(key, JSON.stringify(array));
}

export { find, add, findByIdAndUpdate, deleteById, deleteMany };
