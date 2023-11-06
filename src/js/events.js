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

	EE.on('will-update-project', (projectId, updatedProjectInfo) => {
		Project.findByIdAndUpdate(projectId, updatedProjectInfo);
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

	EE.on('will-create-todo', (todoInfo) => {
		Todo.create(todoInfo);
	});

	EE.on('todo-created', (todo) => {
		dom.renderTodo(todo);
	});

	EE.on('will-complete/uncomplete-todo', (todoId) => {
		const todo = Todo.find({ id: todoId })[0];
		const updatedTodoInfo = { ...todo, complete: !todo.complete };
		Todo.findByIdAndUpdate(todoId, updatedTodoInfo);
	});

	EE.on('will-populate-todo-form', (todoId) => {
		const todo = Todo.find({ id: todoId })[0];
		dom.populateTodoForm(todo);
	});

	EE.on('will-update-todo', (todoId, updatedTodoInfo) => {
		Todo.findByIdAndUpdate(todoId, updatedTodoInfo);
	});

	EE.on('updated-todo', (updatedTodo) => {
		dom.updateTodo(updatedTodo);
	});

	EE.on('will-delete-todo', (todoId) => {
		Todo.deleteById(todoId);
	});

	EE.on('deleted-todo', (todoId) => {
		dom.removeTodo(todoId);
	});
}

export { EE, addEvents };
