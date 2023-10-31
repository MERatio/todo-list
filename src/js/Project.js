import { v4 as uuidv4 } from 'uuid';
import * as storage from './storage';

function find(filter) {
	const projects = storage.find('projects', filter);
	return projects;
}

function create(name) {
	const project = { id: uuidv4(), name };
	storage.add('projects', project);
	return project;
}

function deleteById(id) {
	storage.deleteById('projects', id);
	storage.deleteMany('todos', { projectId: id });
}

export { find, create, deleteById };
