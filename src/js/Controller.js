import PubSub from 'pubsub-js';
import Project from './Project.js';
import * as dom from './dom.js';

PubSub.subscribe('project:create', (msg, data) => {
  const project = new Project(data.title);
  dom.addProject(project);
  dom.resetForm(data.form);
  dom.switchProject(project);
});
