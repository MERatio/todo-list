function handleShowModalBtnClick(e) {
  const showModalBtn = e.currentTarget;
  const targetModalName = showModalBtn.dataset.targetModal;
  const modal = document.querySelector(`[data-modal="${targetModalName}"]`);
  modal.showModal();
}

function handleCloseDialogBtnClick(e) {
  const dialog = e.target.closest('dialog');
  dialog.close();
}

export { handleShowModalBtnClick, handleCloseDialogBtnClick };
