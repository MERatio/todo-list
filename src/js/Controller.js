import PubSub from 'pubsub-js';
import Project from './Project.js';
import * as dom from './dom.js';

PubSub.subscribe('project:create', (msg, data) => {
  const project = new Project(data.title);
  const projects = Project.all();
  dom.resetForm(data.form);
  dom.renderProjects(projects);
  dom.switchProject(project);
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
