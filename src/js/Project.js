class Project {
  constructor(title) {
    this.id = crypto.randomUUID();
    this.title = title;
    Project.#project.push(this);
  }

  static #project = [];
}

export default Project;
