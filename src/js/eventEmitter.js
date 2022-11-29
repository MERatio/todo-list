import { EventEmitter } from 'events';
import Project from './Project';
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

export default eventEmitter;
