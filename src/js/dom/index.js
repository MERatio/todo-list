import {
  handleShowFormModalBtnClick,
  handleCloseDialogBtnClick,
} from './shared.js';
import {
  renderProjects,
  populateProjectForm,
  switchProject,
  attachProjectsEventListeners,
} from './project.js';
import { renderTodos, attachTodosEventListeners } from './todo.js';

function resetForm(form) {
  form.reset();
}

function attachEventListeners() {
  const showModalBtns = document.querySelectorAll('.jsShowModalBtn');
  const closeDialogBtns = document.querySelectorAll('.jsCloseDialogBtn');

  for (const showModalBtn of showModalBtns) {
    showModalBtn.addEventListener('click', handleShowFormModalBtnClick);
  }

  for (const closeDialogBtn of closeDialogBtns) {
    closeDialogBtn.addEventListener('click', handleCloseDialogBtnClick);
  }

  attachProjectsEventListeners();
  attachTodosEventListeners();
}

export {
  resetForm,
  renderProjects,
  populateProjectForm,
  switchProject,
  renderTodos,
  attachEventListeners,
};
