import { EventEmitter } from 'events';
import Project from './Project';
import Todo from './Todo';
import * as Dom from './Dom';

const eventEmitter = new EventEmitter();

eventEmitter.on('project-data-create', (project) => {
  localStorage.setItem('projects', JSON.stringify(Project.projects));
  Project.activeProject = project;
  Dom.addProject(project);
});

eventEmitter.on('project-render', (project) => {
  const projectId = project.dataset.projectId;
  Dom.setActiveProject(projectId);
});

eventEmitter.on('todo-data-create', (todo) => {
  Todo.todos = [...Todo.todos, todo];
  localStorage.setItem('todos', JSON.stringify(Todo.todos));
  if (todo.projectId === Project.activeProject.id) {
    Dom.addTodo(todo);
  }
});

eventEmitter.on('todo-data-delete', (todoId) => {
  localStorage.setItem('todos', JSON.stringify(Todo.todos));
  Dom.deleteTodo(todoId);
});

export default eventEmitter;
