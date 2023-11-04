import EventEmitter from 'eventemitter3';
import { renderProject, updateProject, switchProject } from './dom';
import * as Project from './Project';
import * as Todo from './Todo';

const EE = new EventEmitter();

function addEvents() {
	EE.on('new-project', (title) => {
		const project = Project.create(title);
		switchProject(project, []);
	});

	EE.on('project-created', (project) => {
		renderProject(project);
	});

	EE.on('edit-project', (projectId, newTitle) => {
		Project.findByIdAndUpdate(projectId, { title: newTitle });
	});

	EE.on('updated-project', (updatedProject) => {
		updateProject(updatedProject);
	});

	EE.on('project-switch', (projectId) => {
		const project = Project.find({ id: projectId })[0];
		const todos = Todo.find({ projectId });
		switchProject(project, todos);
	});
}

export { EE, addEvents };
