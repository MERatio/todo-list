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

export { handleShowFormModalBtnClick, handleCloseDialogBtnClick };
