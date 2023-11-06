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

function findByIdAndUpdate(projectId, updatedProjectInfo) {
	const updatedProject = storage.findByIdAndUpdate(
		'projects',
		projectId,
		updatedProjectInfo,
	);
	EE.emit('updated-project', updatedProject);
	return updatedProject;
}

function deleteById(projectId) {
	storage.deleteById('projects', projectId);
	storage.deleteMany('todos', { projectId });
	EE.emit('deleted-project', projectId);
}

export { find, create, findByIdAndUpdate, deleteById };
