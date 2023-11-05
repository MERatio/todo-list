import EventEmitter from 'eventemitter3';
import * as dom from './dom';
import * as Project from './Project';
import * as Todo from './Todo';

const EE = new EventEmitter();

function addEvents() {
	EE.on('will-create-project', (title) => {
		const project = Project.create(title);
	});

	EE.on('project-created', (project) => {
		dom.renderProject(project);
		dom.switchProject(project, []);
		dom.determineAddTodoDisplay();
	});

	EE.on('will-populate-project-form', (projectId) => {
		const project = Project.find({ id: projectId })[0];
		dom.populateProjectForm(project);
	});

	EE.on('will-update-project', (projectId, newTitle) => {
		Project.findByIdAndUpdate(projectId, { title: newTitle });
	});

	EE.on('updated-project', (updatedProject) => {
		dom.updateProject(updatedProject);
	});

	EE.on('will-delete-project', (projectId) => {
		Project.deleteById(projectId);
	});

	EE.on('deleted-project', (projectId) => {
		dom.removeProject(projectId);
		dom.determineAddTodoDisplay();
	});

	EE.on('deleted-active-project-li', () => {
		const projects = Project.find({});
		const firstProject = projects[0];
		if (firstProject) {
			const firstProjectTodos = Todo.find({ projectId: firstProject.id });
			dom.switchProject(firstProject, firstProjectTodos);
		} else {
			dom.setTodosTitle('');
			dom.clearTodoList();
		}
	});

	EE.on('will-switch-project', (projectId) => {
		const project = Project.find({ id: projectId })[0];
		const todos = Todo.find({ projectId });
		dom.switchProject(project, todos);
	});

	EE.on(
		'will-create-todo',
		(projectId, title, description, dueDate, priority) => {
			Todo.create(projectId, title, description, dueDate, priority);
		},
	);

	EE.on('todo-created', (todo) => {
		dom.renderTodo(todo);
	});
}

export { EE, addEvents };
