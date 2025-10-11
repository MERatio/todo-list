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

  static all() {
    return [...this.#todos];
  }
}

export default Todo;
