import { nanoid } from 'nanoid';
import eventEmitter from './eventEmitter';

function Project(id = nanoid(), title) {
  return { id, title };
}

Project.projects = [];
Project.activeProject = null;

Project.create = ({ id, title }) => {
  const project = Project(id, title);
  Project.projects = [...Project.projects, project];
  eventEmitter.emit('project-data-create', project);
};

Project.delete = (projectId) => {
  Project.projects = Project.projects.filter(
    (project) => project.id !== projectId
  );
  eventEmitter.emit('project-data-delete', projectId);
};

export default Project;
