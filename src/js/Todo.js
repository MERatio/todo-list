import * as helpers from './helpers.js';

class Todo {
  constructor(projectId, title, description, dueDate, priority) {
    this.id = crypto.randomUUID();
    this.projectId = projectId;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    Todo.#todos.push(this);
  }

  static #todos = [];

  static findByFilter(filter) {
    return helpers.findByFilter(this.#todos, filter);
  }
}

export default Todo;
