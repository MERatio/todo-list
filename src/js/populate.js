import { faker } from '@faker-js/faker';
import Project from './Project';

function addProjects() {
  const projects = JSON.parse(localStorage.getItem('projects'));
  if (projects) {
    for (const project of projects) {
      Project.create(project);
    }
  } else {
    for (let i = 0; i < 3; i++) {
      const title = faker.lorem.words();
      Project.create({ title });
    }
  }
}

function populate() {
  addProjects();
}

export default populate;
