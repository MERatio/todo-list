import PubSub from 'pubsub-js';
import Project from './Project.js';
import * as dom from './dom.js';

PubSub.subscribe('project:create', (msg, data) => {
  const project = new Project(data.title);
  dom.resetForm(data.form);
  dom.renderProject(project);
  dom.switchProject(project);
});

function init() {
  dom.renderProjects(Project.all());
  dom.attachEventListeners();
}

export { init };
