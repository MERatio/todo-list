import { v4 as uuidv4 } from 'uuid';
import { EE } from './events';
import * as storage from './storage';

function find(filter) {
	const projects = storage.find('projects', filter);
	return projects;
}

function create(title) {
	const project = { id: uuidv4(), title };
	storage.add('projects', project);
	EE.emit('project-created', project);
	return project;
}

function findByIdAndUpdate(id, updatedProps) {
	const updatedProject = storage.findByIdAndUpdate(
		'projects',
		id,
		updatedProps,
	);
	EE.emit('updated-project', updatedProject);
	return updatedProject;
}

function deleteById(id) {
	storage.deleteById('projects', id);
	storage.deleteMany('todos', { projectId: id });
}

export { find, create, findByIdAndUpdate, deleteById };
