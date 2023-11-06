import { v4 as uuidv4 } from 'uuid';
import { EE } from './events';
import * as storage from './storage';

function find(filter) {
	const projects = storage.find('projects', filter);
	return projects;
}

function create(projectInfo) {
	const project = { id: uuidv4(), ...projectInfo };
	storage.add('projects', project);
	EE.emit('project-created', project);
	return project;
}

function findByIdAndUpdate(id, updatedProjectInfo) {
	const updatedProject = storage.findByIdAndUpdate(
		'projects',
		id,
		updatedProjectInfo,
	);
	EE.emit('updated-project', updatedProject);
	return updatedProject;
}

function deleteById(id) {
	storage.deleteById('projects', id);
	storage.deleteMany('todos', { projectId: id });
	EE.emit('deleted-project', id);
}

export { find, create, findByIdAndUpdate, deleteById };
