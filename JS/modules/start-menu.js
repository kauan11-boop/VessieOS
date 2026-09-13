(function () {
  function init() {
    const startMenu = document.getElementById('sm');
    const trigger = document.getElementById('tb-start');
    if (!startMenu || !trigger) return;

    trigger.addEventListener('click', () => {
      const isVisible = startMenu.style.display !== 'none';
      startMenu.style.display = isVisible ? 'none' : 'block';
    });
  }

  window.VessieOS = window.VessieOS || {};
  window.VessieOS.modules = window.VessieOS.modules || {};
  window.VessieOS.modules.startMenu = { init };
})();
