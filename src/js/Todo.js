import * as helpers from './helpers.js';

const STORAGE_KEY = 'todos';

class Todo {
  constructor(
    projectId,
    title,
    description,
    dueDate,
    priority,
    id = crypto.randomUUID()
  ) {
    this.projectId = projectId;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.id = id;
  }

  static all() {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const todos = raw.map(
      ({ projectId, title, description, dueDate, priority, id }) =>
        new Todo(projectId, title, description, dueDate, priority, id)
    );
    return todos;
  }

  static findByFilter(filter) {
    const todos = Todo.all();
    return helpers.filterBy(todos, filter);
  }

  static findById(todoId) {
    const todos = Todo.all();
    return todos.find((todo) => todo.id === todoId);
  }

  static findByIdAndUpdate(todoId, updatedProps) {
    const todos = Todo.all();
    const updatedTodos = helpers.updateObjectInArray(
      todos,
      todoId,
      updatedProps
    );
    const updatedTodo = updatedTodos.find((todo) => todo.id === todoId);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTodos));

    return updatedTodo;
  }

  static deleteMany(filter) {
    const todos = Todo.all();
    const updatedTodos = helpers.filterOutBy(todos, filter);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTodos));
  }

  save() {
    const todos = Todo.all();
    todos.push(this);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    return this;
  }
}

export default Todo;
