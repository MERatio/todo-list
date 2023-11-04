import { v4 as uuidv4 } from 'uuid';
import * as storage from './storage';
import { EE } from './events';

function find(filter) {
	let todos = storage.find('todos', filter);
	// dueDate is string after getting it from localStorage, and using JSON.parse.
	todos = todos.map((todo) => ({ ...todo, dueDate: new Date(todo.dueDate) }));
	return todos;
}

function create(projectId, title, description, dueDate, priority) {
	const todo = {
		id: uuidv4(),
		projectId,
		title,
		description,
		dueDate,
		priority,
	};
	storage.add('todos', todo);
	EE.emit('todo-created', todo);
	return todo;
}

function findByIdAndUpdate(id, updatedProps) {
	const updatedTodo = storage.findByIdAndUpdate('todos', id, updatedProps);
	return updatedTodo;
}

function deleteById(id) {
	storage.deleteById('todos', id);
}

export { find, create, findByIdAndUpdate, deleteById };
