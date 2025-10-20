import * as helpers from './helpers.js';

const STORAGE_KEY = 'projects';

class Project {
  constructor(title, id = crypto.randomUUID()) {
    this.title = title;
    this.id = id;
  }

  static {
    if (!localStorage.getItem(STORAGE_KEY)) {
      new Project('Default').save();
    }
  }

  static all() {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const projects = raw.map(({ title, id }) => new Project(title, id));
    return projects;
  }

  static findById(projectId) {
    const projects = this.all();
    const project = projects.find((project) => project.id === projectId);
    return project;
  }

  static findByIdAndUpdate(projectId, updatedProps) {
    const projects = this.all();
    const updatedProjects = helpers.updateObjectInArray(
      projects,
      projectId,
      updatedProps
    );
    const updatedProject = updatedProjects.find(
      (project) => project.id === projectId
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects));

    return updatedProject;
  }

  static deleteMany(filter) {
    const projects = this.all();
    const updatedProjects = helpers.filterOutBy(projects, filter);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects));
  }

  save() {
    const projects = Project.all();
    projects.push(this);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return this;
  }
}

export default Project;
