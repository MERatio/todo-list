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
}

export default Project;
