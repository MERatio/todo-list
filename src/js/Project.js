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
}

export default Project;
