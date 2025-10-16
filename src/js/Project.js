import * as helpers from './helpers.js';

class Project {
  constructor(title) {
    this.id = crypto.randomUUID();
    this.title = title;
    Project.#projects.push(this);
  }

  static #projects = [];

  static {
    new Project('Default');
  }

  static all() {
    return [...this.#projects];
  }

  static findById(projectId) {
    return this.#projects.find((project) => project.id === projectId);
  }

  static findByIdAndUpdate(projectId, updatedProps) {
    this.#projects = helpers.updateObjectInArray(
      this.#projects,
      projectId,
      updatedProps
    );

    const updatedProject = this.findById(projectId);
    return updatedProject;
  }

  static deleteMany(filter) {
    this.#projects = helpers.filterOutBy(this.#projects, filter);
  }
}

export default Project;
