import { nanoid } from 'nanoid';
import eventEmitter from './eventEmitter';

function Todo(
  id = nanoid(),
  title,
  description,
  dueDate,
  priority,
  isComplete,
  projectId
) {
  return {
    id,
    title,
    description,
    dueDate: new Date(dueDate),
    priority,
    isComplete,
    projectId,
  };
}

Todo.todos = [];

Todo.create = ({
  id,
  title,
  description,
  dueDate,
  priority,
  isComplete,
  projectId,
}) => {
  const todo = Todo(
    id,
    title,
    description,
    dueDate,
    priority,
    isComplete,
    projectId
  );
  eventEmitter.emit('todo-data-create', todo);
};

Todo.findById = (todoId) => {
  const result = Todo.todos.find((todo) => todo.id === todoId);
  return result;
};

Todo.findByProjectId = (projectId) => {
  const result = Todo.todos.filter((todo) => todo.projectId === projectId);
  return result;
};

Todo.update = (todoId, data) => {
  Todo.todos = Todo.todos.map((todo) =>
    todo.id === todoId ? { ...todo, ...data } : todo
  );
  eventEmitter.emit('todo-data-update', todoId, data);
};

Todo.delete = (todoId) => {
  Todo.todos = Todo.todos.filter((todo) => todo.id !== todoId);
  eventEmitter.emit('todo-data-delete', todoId);
};

export default Todo;
