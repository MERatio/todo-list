import { faker } from '@faker-js/faker';
import Project from './Project';
import Todo from './Todo';

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function addProjects() {
  const projects = JSON.parse(localStorage.getItem('projects'));
  if (projects) {
    for (const project of projects) {
      Project.create(project);
    }
  } else {
    for (let i = 0; i < 3; i++) {
      Project.create({ title: faker.lorem.words() });
    }
  }
}

function addTodos(projects) {
  const todos = JSON.parse(localStorage.getItem('todos'));
  if (todos) {
    for (const todo of todos) {
      Todo.create(todo);
    }
  } else {
    for (let i = 0; i < 10; i++) {
      Todo.create({
        title: faker.lorem.words(),
        description: faker.lorem.sentence(),
        dueDate: faker.date.soon(),
        priority: getRandomItem([1, 2, 3, 4]),
        projectId: getRandomItem(projects).id,
      });
    }
  }
}

function populate() {
  addProjects();
  addTodos(Project.projects);
}

export default populate;
