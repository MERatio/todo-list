import { EventEmitter } from 'events';
import Project from './Project';
import Todo from './Todo';
import Dom from './Dom';

const eventEmitter = new EventEmitter();

eventEmitter.on('project-create', (project) => {
  Project.projects = [...Project.projects, project];
  localStorage.setItem('projects', JSON.stringify(Project.projects));
  Project.activeProject = project;
  Dom.addProject(project);
});

eventEmitter.on('project-render', (project) => {
  const projectId = project.dataset.id;
  Dom.setNewActiveProject(projectId);
});

eventEmitter.on('todo-create', (todo) => {
  Todo.todos = [...Todo.todos, todo];
  localStorage.setItem('todos', JSON.stringify(Todo.todos));
  if (todo.projectId === Project.activeProject.id) {
    Dom.addTodo(todo);
  }
});

export default eventEmitter;
