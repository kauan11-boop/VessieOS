(function () {
  function init() {
    const panel = document.getElementById('np');
    const button = document.getElementById('tb-notif');
    if (!panel || !button) return;

    // JS/core/main.js liga #tb-notif com `.onclick = ...` (classList.toggle),
    // mas só faz isso depois do login — ou seja, no momento em que este
    // init() roda (boot, antes do login) não dá pra detectar isso ainda.
    // Por isso o flag é checado dentro do próprio clique, não na hora de
    // registrar o listener: quando o login acontecer, main.js marca
    // dataset.vosNotifBound e este handler passa a não fazer nada,
    // evitando os dois mecanismos brigarem (style.display vs classList).
    button.addEventListener('click', () => {
      if (button.dataset.vosNotifBound) return;
      const isVisible = panel.style.display !== 'none';
      panel.style.display = isVisible ? 'none' : 'block';
    });
  }

  window.VessieOS = window.VessieOS || {};
  window.VessieOS.modules = window.VessieOS.modules || {};
  window.VessieOS.modules.notifications = { init };
})();
