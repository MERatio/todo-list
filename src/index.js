import { startOfTomorrow, addHours, format } from 'date-fns';
import './style.css';
import * as Project from './js/Project';
import * as Todo from './js/Todo';

localStorage.clear();

// Projects
const defaultProject = Project.create('Default');
const workoutProject = Project.create('Workout');
// const foundDefaultProject = Project.find({ id: defaultProject.id })[0];

// console.log({ foundDefaultProject });
// console.log({ projects: Project.find({}) });
// Project.deleteById(defaultProject.id);
// console.log({ projects: Project.find({}) });

// Todos
Todo.create(
	defaultProject.id,
	'Fix bed',
	'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
	addHours(startOfTomorrow(), 8),
	4,
);
Todo.create(
	defaultProject.id,
	'Eat',
	'Lorem ipsum, dolor sit, amet consectetur adipisicing elit.',
	addHours(startOfTomorrow(), 8),
	1,
);

Todo.create(
	workoutProject.id,
	'Squat',
	'Lorem ipsum, dolor sit.',
	addHours(startOfTomorrow(), 16),
	2,
);

const defaultProjectTodos = Todo.find({ projectId: defaultProject.id });
const firstDefaultProjectTodo = defaultProjectTodos[0];
const secondDefaultProjectTodo = defaultProjectTodos[1];
console.log({ defaultProjectTodos });
const updatedFirstDefaultProjectTodo = Todo.findByIdAndUpdate(
	firstDefaultProjectTodo.id,
	{ title: 'Wake up', priority: 1 },
);
console.log({
	defaultProjectTodos: Todo.find({ projectId: defaultProject.id }),
});
Todo.deleteById(secondDefaultProjectTodo.id);
console.log({
	defaultProjectTodos: Todo.find({ projectId: defaultProject.id }),
});

const workoutProjectTodos = Todo.find({ projectId: workoutProject.id });
console.log({ workoutProjectTodos });

Project.deleteById(defaultProject.id);
console.log({ projects: Project.find({}) });
console.log({
	defaultProjectTodos: Todo.find({ projectId: defaultProject.id }),
});
