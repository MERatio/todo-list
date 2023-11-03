import * as Project from './Project';
import * as Todo from './Todo';
import { EE } from './events';

function addDummyInitialElements() {
	// Projects
	const defaultProject = Project.create('Default');
	const workoutProject = Project.create('Workout');

	const tommorow = new Date();
	tommorow.setDate(tommorow.getDate() + 1);

	// Todos
	Todo.create(
		defaultProject.id,
		'Make bed',
		'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
		tommorow,
		1,
	);

	Todo.create(
		defaultProject.id,
		'Eat',
		'Lorem ipsum, dolor sit, amet consectetur adipisicing elit.',
		tommorow,
		2,
	);

	Todo.create(
		workoutProject.id,
		'Squat',
		'Lorem ipsum, dolor sit.',
		tommorow,
		3,
	);

	Todo.create(
		workoutProject.id,
		'Pull-up',
		'Lorem ipsum dolor sit amet consectetur adipisicing, elit.',
		tommorow,
		4,
	);

	EE.emit('project-switch', defaultProject.id);
}

export default addDummyInitialElements;
