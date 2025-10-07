import PubSub from 'pubsub-js';

const projectList = document.querySelector('.jsProjectList');
const projectForm = document.querySelector('.jsProjectForm');

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

function handleProjectFormSubmit(e) {
  const form = e.currentTarget;
  const operation = form.dataset.operation;
  const title = form.querySelector('#project-title').value;

  switch (operation) {
    case 'create':
      PubSub.publish('project:create', { form, title });
      break;
  }
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

  projectForm.addEventListener('submit', handleProjectFormSubmit);
}

function addProject(project) {
  const projectLi = document.createElement('li');
  projectLi.classList.add('project-list-item');
  projectLi.dataset.projectId = project.id;

  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.classList.add('project-btn');
  button.textContent = project.title;

  projectLi.appendChild(button);
  projectList.appendChild(projectLi);
}

function resetForm(form) {
  form.reset();
}

export { attachEventListeners, addProject, resetForm };
