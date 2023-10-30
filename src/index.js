import './style.css';
import * as Project from './js/Project';

localStorage.clear();

const defaultProject = Project.create('Default');
const workoutProject = Project.create('Workout');
const foundDefaultProject = Project.find({ id: defaultProject.id })[0];

console.log({ foundDefaultProject });
console.log({ all: Project.find({}) });
Project.deleteById(defaultProject.id);
console.log({ all: Project.find({}) });
