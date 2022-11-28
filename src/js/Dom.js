const Dom = (function () {
  const _menuBtn = document.querySelector('.js-menu-btn');
  const _menuBtnIcon = _menuBtn.querySelector('.js-menu-btn-icon');
  const _projectsNav = document.querySelector('.js-projects-nav');

  function _handleMenuClick() {
    const menuBtnIconName = _projectsNav.classList.contains('hidden')
      ? 'close-outline'
      : 'menu-outline';
    _menuBtnIcon.setAttribute('name', menuBtnIconName);

    _projectsNav.classList.toggle('hidden');
    _projectsNav.classList.toggle('block');
  }

  function attachEvents() {
    _menuBtn.addEventListener('click', _handleMenuClick);
  }

  return { attachEvents };
})();

export default Dom;
