import EventEmitter from 'eventemitter3';
import {
	renderProject,
	updateProject,
	deleteProject,
	clearTodosTitle,
	clearTodoList,
	switchProject,
} from './dom';
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

	EE.on('will-delete-project', (projectId) => {
		Project.deleteById(projectId);
	});

	EE.on('deleted-project', (projectId) => {
		deleteProject(projectId);
	});

	EE.on('deleted-active-project-li', () => {
		const projects = Project.find({});
		const firstProject = projects[0];
		if (firstProject) {
			const firstProjectTodos = Todo.find({ projectId: firstProject.id });
			switchProject(firstProject, firstProjectTodos);
		} else {
			clearTodosTitle();
			clearTodoList();
		}
	});

	EE.on('project-switch', (projectId) => {
		const project = Project.find({ id: projectId })[0];
		const todos = Todo.find({ projectId });
		switchProject(project, todos);
	});
}

export { EE, addEvents };
