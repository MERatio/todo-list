import { nanoid } from 'nanoid';
import eventEmitter from './eventEmitter';

function Project(id = nanoid(), title) {
  return { id, title };
}

Project.projects = [];
Project.activeProject = null;

Project.create = ({ id, title }) => {
  const project = Project(id, title);
  eventEmitter.emit('project-create', project);
};

export default Project;
