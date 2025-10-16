import PubSub from 'pubsub-js';
import Project from './Project.js';
import Todo from './Todo.js';
import * as dom from './dom/index.js';

PubSub.subscribe('project:switch', (msg, data) => {
  let project = data.project;

  if (project === null) {
    const projects = Project.all();
    if (projects.length < 1) {
      dom.switchProject(null);
      dom.renderTodos([]);
      return;
    } else {
      project = projects[0];
    }
  }

  const todos = Todo.findByFilter({ projectId: project.id });
  dom.switchProject(project);
  dom.renderTodos(todos);
});

PubSub.subscribe('project:create', (msg, data) => {
  const project = new Project(data.title);
  const projects = Project.all();
  dom.resetForm(data.form);
  dom.renderProjects(projects);
  PubSub.publish('project:switch', { project });
});

PubSub.subscribe('project:edit', (msg, data) => {
  const updatedProject = Project.findByIdAndUpdate(data.projectId, {
    title: data.title,
  });
  const projects = Project.all();
  dom.resetForm(data.form);
  dom.renderProjects(projects);
  PubSub.publish('project:switch', { project: updatedProject });
});

PubSub.subscribe('project:delete', (msg, data) => {
  Project.deleteMany({ id: data.projectId });
  Todo.deleteMany({ projectId: data.projectId });
  const projects = Project.all();
  dom.renderProjects(projects);
  PubSub.publish('project:switch', { project: null });
});

PubSub.subscribe('todo:create', (msg, data) => {
  const { form, projectId, title, description, dueDate, priority } = data;
  new Todo(projectId, title, description, dueDate, priority);
  const todos = Todo.findByFilter({ projectId });
  dom.renderTodos(todos);
  dom.resetForm(form);
});

PubSub.subscribe('todo:delete', (msg, data) => {
  Todo.deleteMany({ id: data.todo.id });
  const todos = Todo.findByFilter({ projectId: data.todo.projectId });
  dom.renderTodos(todos);
});

function init() {
  const projects = Project.all();
  dom.renderProjects(projects);
  if (projects.length > 0) {
    PubSub.publish('project:switch', { project: projects[0] });
  }
  dom.attachEventListeners();
}

export { init };
