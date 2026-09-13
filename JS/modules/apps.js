(function () {
  function init() {
    window.VessieOS = window.VessieOS || {};
    window.VessieOS.apps = window.VessieOS.apps || {
      list: ['VessieOS', 'Terminal', 'Arquivos', 'Game Hub', 'Bloco de notas']
    };
  }

  window.VessieOS = window.VessieOS || {};
  window.VessieOS.modules = window.VessieOS.modules || {};
  window.VessieOS.modules.apps = { init };
})();
