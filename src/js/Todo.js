import { nanoid } from 'nanoid';
import eventEmitter from './eventEmitter';

function Todo(id = nanoid(), title, description, dueDate, priority, projectId) {
  return {
    id,
    title,
    description,
    dueDate: new Date(dueDate),
    priority,
    projectId,
  };
}

Todo.todos = [];

Todo.create = ({ id, title, description, dueDate, priority, projectId }) => {
  const todo = Todo(id, title, description, dueDate, priority, projectId);
  eventEmitter.emit('todo-create', todo);
};

Todo.findByProjectId = (projectId) => {
  const result = Todo.todos.filter((todo) => todo.projectId === projectId);
  return result;
};

export default Todo;
