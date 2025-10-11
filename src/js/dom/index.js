import {
  renderProjects,
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

  function handleShowFormModalBtnClick(e) {
    const showModalBtn = e.currentTarget;
    const targetModalName = showModalBtn.dataset.targetModal;
    const modal = document.querySelector(`[data-modal="${targetModalName}"]`);
    const operation = showModalBtn.dataset.operation;
    const form = modal.querySelector('form');
    form.dataset.operation = operation;
    modal.showModal();
  }

  function handleCloseDialogBtnClick(e) {
    const dialog = e.target.closest('dialog');
    dialog.close();
  }

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
  switchProject,
  renderTodos,
  attachEventListeners,
};
