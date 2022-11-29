import { nanoid } from 'nanoid';
import eventEmitter from './eventEmitter';

function Project(title) {
  const id = nanoid();

  return { id, title };
}

Project.activeProject = null;

Project.create = ({ title }) => {
  const project = Project(title);
  eventEmitter.emit('project-create', project);
};

export default Project;
