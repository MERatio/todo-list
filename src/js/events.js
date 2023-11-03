import EventEmitter from 'eventemitter3';
import { renderProject, switchProject } from './dom';
import * as Project from './Project';
import * as Todo from './Todo';

const EE = new EventEmitter();

function addEvents() {
	EE.on('project-created', (project) => {
		renderProject(project);
	});

	EE.on('project-switch', (projectId) => {
		const project = Project.find({ id: projectId })[0];
		const todos = Todo.find({ projectId });
		switchProject(project, todos);
	});
}

export { EE, addEvents };
