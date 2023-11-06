import { v4 as uuidv4 } from 'uuid';
import * as storage from './storage';
import { EE } from './events';

function find(filter) {
	let todos = storage.find('todos', filter);
	// dueDate is string after getting it from localStorage, and using JSON.parse.
	todos = todos.map((todo) => ({ ...todo, dueDate: new Date(todo.dueDate) }));
	return todos;
}

function create(todoInfo) {
	const todo = {
		id: uuidv4(),
		...todoInfo,
	};
	storage.add('todos', todo);
	EE.emit('todo-created', todo);
	return todo;
}

function findByIdAndUpdate(id, updatedTodoInfo) {
	const updatedTodo = storage.findByIdAndUpdate('todos', id, updatedTodoInfo);
	EE.emit('updated-todo', updatedTodo);
	return updatedTodo;
}

function deleteById(id) {
	storage.deleteById('todos', id);
	EE.emit('deleted-todo', id);
}

export { find, create, findByIdAndUpdate, deleteById };
