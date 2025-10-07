class Project {
  constructor(title) {
    this.id = crypto.randomUUID();
    this.title = title;
    Project.#project.push(this);
  }

  static #project = [];

  static {
    new Project('Default');
  }

  static all() {
    return [...this.#project];
  }

  static findById(projectId) {
    return this.#project.find((project) => project.id === projectId);
  }
}

export default Project;
