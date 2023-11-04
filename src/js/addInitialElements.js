import { EE } from './events';
import * as Project from './Project';

function addInitialElements() {
	const projects = Project.find({});
	for (const project of projects) {
		EE.emit('project-created', project);
	}
	if (projects[0]) {
		EE.emit('will-switch-project', projects[0].id);
	}
}

export default addInitialElements;
