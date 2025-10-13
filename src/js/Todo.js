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

  static findById(todoId) {
    return this.#todos.find((todo) => todo.id === todoId);
  }

  static deleteById(todoId) {
    this.#todos = this.#todos.filter((todo) => todo.id !== todoId);
  }
}

export default Todo;
