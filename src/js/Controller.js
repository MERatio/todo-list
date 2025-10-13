import PubSub from 'pubsub-js';
import Project from './Project.js';
import Todo from './Todo.js';
import * as dom from './dom/index.js';

PubSub.subscribe('project:create', (msg, data) => {
  const project = new Project(data.title);
  const projects = Project.all();
  const todos = Todo.findByFilter({ projectId: project.id });
  dom.resetForm(data.form);
  dom.renderProjects(projects);
  dom.switchProject(project);
  dom.renderTodos(todos);
});

PubSub.subscribe('todo:create', (msg, data) => {
  const { form, projectId, title, description, dueDate, priority } = data;
  new Todo(projectId, title, description, dueDate, priority);
  const todos = Todo.findByFilter({ projectId });
  dom.renderTodos(todos);
  dom.resetForm(form);
});

function init() {
  const projects = Project.all();
  dom.renderProjects(projects);
  if (projects.length > 0) {
    dom.switchProject(projects[0]);
  }
  dom.attachEventListeners();
}

export { init };
