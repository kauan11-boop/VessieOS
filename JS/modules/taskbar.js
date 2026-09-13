(function () {
  function init() {
    const clock = document.getElementById('tb-time');
    const date = document.getElementById('tb-date');
    if (!clock || !date) return;

    const update = () => {
      const now = new Date();
      clock.textContent = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      date.textContent = now.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });
    };

    update();
    setInterval(update, 30000);
  }

  window.VessieOS = window.VessieOS || {};
  window.VessieOS.modules = window.VessieOS.modules || {};
  window.VessieOS.modules.taskbar = { init };
})();
