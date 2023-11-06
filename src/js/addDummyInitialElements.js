import * as Project from './Project';
import * as Todo from './Todo';
import { EE } from './events';

function addDummyInitialElements() {
	// Projects
	const defaultProject = Project.create({ title: 'Default' });
	const workoutProject = Project.create({ title: 'Workout' });

	const tommorow = new Date();
	tommorow.setDate(tommorow.getDate() + 1);

	// Todos
	Todo.create({
		projectId: defaultProject.id,
		title: 'Make bed',
		description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
		dueDate: tommorow,
		priority: 1,
		complete: true,
	});

	Todo.create({
		projectId: defaultProject.id,
		title: 'Eat',
		description: 'Lorem ipsum, dolor sit, amet consectetur adipisicing elit.',
		dueDate: tommorow,
		priority: 2,
		complete: false,
	});

	Todo.create({
		projectId: workoutProject.id,
		title: 'Squat',
		description: 'Lorem ipsum, dolor sit.',
		dueDate: tommorow,
		priority: 3,
		complete: false,
	});

	Todo.create({
		projectId: workoutProject.id,
		title: 'Pull-up',
		description: 'Lorem ipsum dolor sit amet consectetur adipisicing, elit.',
		dueDate: tommorow,
		priority: 4,
		complete: true,
	});

	EE.emit('will-switch-project', defaultProject.id);
}

export default addDummyInitialElements;
